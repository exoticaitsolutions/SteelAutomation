from datetime import date
import os
from django.forms import model_to_dict
from rest_framework.authtoken.models import Token
from rest_framework import serializers
from django.contrib.auth import authenticate
from Invoice_app.models import User, Entity, Client
from django.contrib.auth.backends import ModelBackend
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from steelautomation import settings
from .models import *


class SignUpSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=Role_CHOICES, required=False)

    class Meta:
        model = User
        fields = ["email", "username", "password", "confirm_password", "role"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        validate_password(attrs["password"])

        role = attrs.get("role", "STAFF")
        if role == "ADMIN":
            raise serializers.ValidationError(
                {"role": "You are not allowed to create an admin user."}
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        validated_data["role"] = validated_data.get("role", "STAFF")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data["role"],
        )

        return user


class ChangePasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        user = User.objects.filter(email=attrs["email"]).first()
        if user is None:
            raise serializers.ValidationError("User with this email does not exist.")
        if not user.check_password(attrs["old_password"]):
            raise serializers.ValidationError("Incorrect old password.")
        return attrs


class ForgetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    new_password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        user = User.objects.filter(email=attrs["email"]).first()
        if user is None:
            raise serializers.ValidationError("User with this email does not exist.")

        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                "New password and confirm password do not match."
            )

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
        fields = "__all__"


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = EmailBackend().authenticate(
            request=None, username=email, password=password
        )
        if user is None:
            raise serializers.ValidationError("Invalid email or password")

        token, created = Token.objects.get_or_create(user=user)

        attrs["user"] = user
        attrs["token"] = token.key
        return attrs


class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entity
        fields = "__all__"


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation["entity"] = model_to_dict(
            instance.entity,
            fields=[field.name for field in instance.entity._meta.fields],
        )

        return representation
    
class ItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategory
        fields = ['id', 'name']

class ItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemType
        fields = ['id', 'name']

class ItemZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemZone
        fields = ['id', 'name']

class ItemUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemUnit
        fields = ['id', 'name']

class PaymentBoQDetailedSerializer(serializers.ModelSerializer):
    # Adding custom fields for the names of related models
    unit_name = serializers.CharField(source='unit.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    type_name = serializers.CharField(source='type.name', read_only=True)
    zone_name = serializers.CharField(source='zone.name', read_only=True)

    class Meta:
        model = PaymentBoQDetailed
        fields = [
            'id', 'acw', 'pcs', 'qty', 'item', 'rate', 'total',
            'unit', 'unit_name', 'category', 'category_name', 'type', 'type_name', 'zone', 'zone_name'
        ]


class ProjectSerializer(serializers.ModelSerializer):
    Payment_BoQDetailed = PaymentBoQDetailedSerializer(many=True, source='boq_detailed')
    class Meta:
        model = Project
        fields = [
            'id',
            'entity',
            'project_name',
            'description', 
            'client', 
            'Payment_BoQDetailed',
        ]

    def create(self, validated_data):
     
        payment_boq_detailed_data = validated_data.pop('boq_detailed', [])

      
        project = Project.objects.create(**validated_data)

        print("----------------"*13, project)
        for boq_data in payment_boq_detailed_data:
            boq_data.pop('Project', None)

            PaymentBoQDetailed.objects.create(project=project, **boq_data)

        return project

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation["entity"] = model_to_dict(
            instance.entity,
            fields=[field.name for field in instance.entity._meta.fields],
        )

        representation["client"] = model_to_dict(
            instance.client,
            fields=[field.name for field in instance.client._meta.fields],
        )

        # Access the related objects using the correct related_name
        # representation['Payment_BoQDetailed'] = PaymentBoQDetailedSerializer(
        #     instance.boq_detailed.all(), many=True
        # ).data

        return representation


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation["project"] = model_to_dict(
            instance.project,
            fields=[field.name for field in instance.project._meta.fields],
        )

        return representation


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = "__all__"

    def validate_payment_due_date(self, value):
        if value < date.today():
            raise serializers.ValidationError("Payment due date cannot be in the past.")
        return value

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation["contract"] = model_to_dict(
            instance.contract,
            fields=[field.name for field in instance.contract._meta.fields],
        )

        return representation



class ItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategory
        fields = ['id', 'name']

class ItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemType
        fields = ['id', 'name']

class ItemZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemZone
        fields = ['id', 'name']

class ItemUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemUnit
        fields = ['id', 'name']




class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = [
            'id',
            'entity',
            'project',
            'client',
            'payment_category',
            'payment_sent_date',
            'payment_notice_back_date',
            'progress',  
            'nett_payment_due',
   
        ]

    def create(self, validated_data):
        # Extract nested PaymentBoQDetailed data

        # Create the Payment instance
        payment = Payment.objects.create(**validated_data)
        return payment


    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Populate related fields
        representation['entity'] = {
            'id': instance.entity.id,
            'entity_name': instance.entity.entity_name
        }

        representation['project'] = {
            'id': instance.project.id,
            'entity': instance.project.entity.id,
            'client': instance.project.client.id,
            'project_name': instance.project.project_name,
            'description': instance.project.description,
        }

        representation['client'] = {
            'id': instance.client.id,
            'entity': instance.client.entity.id,
            'client_name': instance.client.client_name,
            'email': instance.client.email,
            'address': instance.client.address,
        }

        # Access the related objects using the correct related_name

        return representation
    

class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def create(self, validated_data):
        uploaded_file = validated_data['file']
        print("-----------------"*8)
        print("uploaded_file v: ", uploaded_file)
        print("-----------------"*8)
        
        # Perform any processing or saving with `uploaded_file` if needed
        
        # Return metadata instead of the file itself
        return {'file_name': uploaded_file.name, 'file_size': uploaded_file.size}


