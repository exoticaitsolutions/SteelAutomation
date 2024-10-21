from datetime import date
from django.forms import model_to_dict
from rest_framework.authtoken.models import Token
from rest_framework import serializers
from django.contrib.auth import authenticate
from Invoice_app.models import User, Entity, Client
from django.contrib.auth.backends import ModelBackend
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Contract, InvoiceMethod, Payment, Project, Role_CHOICES, User, Schedule


class SignUpSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=Role_CHOICES, required=False)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'confirm_password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        

        validate_password(attrs['password'])

        role = attrs.get('role', 'STAFF')
        if role == 'ADMIN':
            raise serializers.ValidationError({"role": "You are not allowed to create an admin user."})

        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')

        validated_data['role'] = validated_data.get('role', 'STAFF')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],
        )

        return user


class ChangePasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        user = User.objects.filter(email=attrs['email']).first()
        if user is None:
            raise serializers.ValidationError("User with this email does not exist.")
        if not user.check_password(attrs['old_password']):
            raise serializers.ValidationError("Incorrect old password.")
        return attrs


class ForgetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    new_password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        user = User.objects.filter(email=attrs['email']).first()
        if user is None:
            raise serializers.ValidationError("User with this email does not exist.")

        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("New password and confirm password do not match.")

        return attrs


class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            return None

        if user.check_password(password):
            return user
        return None


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = EmailBackend().authenticate(request=None, username=email, password=password)
        if user is None:
            raise serializers.ValidationError('Invalid email or password')

        token, created = Token.objects.get_or_create(user=user)

        attrs['user'] = user
        attrs['token'] = token.key
        return attrs


class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entity
        fields = '__all__'


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        representation['entity'] = model_to_dict(instance.entity, fields=[field.name for field in instance.entity._meta.fields])
        
        return representation


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        representation['entity'] = model_to_dict(instance.entity, fields=[field.name for field in instance.entity._meta.fields])
        
        representation['client'] = model_to_dict(instance.client, fields=[field.name for field in instance.client._meta.fields])
        
        return representation


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        representation['project'] = model_to_dict(instance.project, fields=[field.name for field in instance.project._meta.fields])
                
        return representation
    

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        
        fields = '__all__'

    def validate_payment_due_date(self, value):
        if value < date.today():
            raise serializers.ValidationError("Payment due date cannot be in the past.")
        return value
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        representation['contract'] = model_to_dict(instance.contract, fields=[field.name for field in instance.contract._meta.fields])
                
        return representation
    

from rest_framework import serializers
from .models import Payment, InvoiceMethod

# class PaymentSerializer(serializers.ModelSerializer):
#     payment_sent_date = serializers.DateField(format='%d/%m/%Y', input_formats=['%d/%m/%Y', '%Y-%m-%d'])
#     payment_notice_back_date = serializers.DateField(format='%d/%m/%Y', input_formats=['%d/%m/%Y', '%Y-%m-%d'], required=False)

#     class Meta:
#         model = Payment
#         fields = ['entity', 'project', 'client', 'payment_category', 'payment_sent_date', 'payment_notice_back_date']

    
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
        
#         representation['entity'] = model_to_dict(instance.entity, fields=[field.name for field in instance.entity._meta.fields])
#         representation['project'] = model_to_dict(instance.project, fields=[field.name for field in instance.project._meta.fields])
#         representation['client'] = model_to_dict(instance.client, fields=[field.name for field in instance.client._meta.fields])
                
#         return representation
    

# class InvoiceMethodSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = InvoiceMethod
#         # fields = 
#         fields = '__all__'
    
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
        
#         representation['payment'] = model_to_dict(instance.payment, fields=[field.name for field in instance.payment._meta.fields])
                
#         return representation

class InvoiceMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceMethod
        fields = ['id', 'category', 'zone', 'account_total', 'progress', 'interim', 'comment']

class PaymentSerializer(serializers.ModelSerializer):
    # Nesting the InvoiceMethod serializer here
    invoice_methods = InvoiceMethodSerializer(many=True)

    class Meta:
        model = Payment
        fields = ['id', 'entity', 'project', 'client', 'payment_category', 'payment_sent_date', 'payment_notice_back_date', 'invoice_methods']

    def create(self, validated_data):
        invoice_methods_data = validated_data.pop('invoice_methods')
        payment = Payment.objects.create(**validated_data)

        # Create multiple InvoiceMethod entries
        for invoice_data in invoice_methods_data:
            InvoiceMethod.objects.create(payment=payment, **invoice_data)

        return payment

    def update(self, instance, validated_data):
        invoice_methods_data = validated_data.pop('invoice_methods')
        instance.entity = validated_data.get('entity', instance.entity)
        instance.project = validated_data.get('project', instance.project)
        instance.client = validated_data.get('client', instance.client)
        instance.payment_category = validated_data.get('payment_category', instance.payment_category)
        instance.payment_sent_date = validated_data.get('payment_sent_date', instance.payment_sent_date)
        instance.payment_notice_back_date = validated_data.get('payment_notice_back_date', instance.payment_notice_back_date)
        instance.save()

        # Handle updating invoice methods
        for invoice_data in invoice_methods_data:
            invoice_id = invoice_data.get('id')
            if invoice_id:
                # Update existing InvoiceMethod
                invoice = InvoiceMethod.objects.get(id=invoice_id, payment=instance)
                invoice.category = invoice_data.get('category', invoice.category)
                invoice.zone = invoice_data.get('zone', invoice.zone)
                invoice.account_total = invoice_data.get('account_total', invoice.account_total)
                invoice.progress = invoice_data.get('progress', invoice.progress)
                invoice.interim = invoice_data.get('interim', invoice.interim)
                invoice.comment = invoice_data.get('comment', invoice.comment)
                invoice.save()
            else:
                # Create a new InvoiceMethod
                InvoiceMethod.objects.create(payment=instance, **invoice_data)

        return instance