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


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"

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


# class InvoiceMethodSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = InvoiceMethod   
#         fields = "__all__"


# class PaymentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Payment   
#         fields = "__all__"

# class PaymentBoQDetailedSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PaymentBoQDetailed   
#         fields = "__all__"


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


class PaymentSerializer(serializers.ModelSerializer):
    Payment_BoQDetailed = PaymentBoQDetailedSerializer(many=True, source='boq_detailed')

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
            'Payment_BoQDetailed',
        ]

    def create(self, validated_data):
        # Extract nested PaymentBoQDetailed data
        payment_boq_detailed_data = validated_data.pop('boq_detailed', [])

        # Create the Payment instance
        payment = Payment.objects.create(**validated_data)

        # Create nested PaymentBoQDetailed instances
        for boq_data in payment_boq_detailed_data:
            boq_data.pop('payment', None)
            # Create each PaymentBoQDetailed instance linked to the created payment
            PaymentBoQDetailed.objects.create(payment=payment, **boq_data)

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
        representation['Payment_BoQDetailed'] = PaymentBoQDetailedSerializer(
            instance.boq_detailed.all(), many=True
        ).data

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


# class PaymentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Payment
#         fields = [
#             "id",
#             "entity",
#             "project",
#             "client",
#             "payment_category",
#             "payment_sent_date",
#             "payment_notice_back_date",
#         ]
#     print("=-------------------PaymentSerializer")

#     def create(self, validated_data):
#         print("-------------------create----------")
#         # Ensure 'invoice_methods' is a list of dictionaries
#         invoice_methods_data = self.context["request"].data.get("Payment_BoQDetailed", [])
#         print("invoice_methods_data -------------------------", invoice_methods_data)
#         if not isinstance(invoice_methods_data, list):
#             print("invoice_methods_data -------------------------")
#             invoice_methods_data = []
#         print("invoice_methods_data: ", invoice_methods_data)
#         payment = Payment.objects.create(**validated_data)
#         print("payment -------------------------")

#         # Create multiple InvoiceMethod entries
#         for invoice_data in invoice_methods_data:
#             print("---------"*8)
#             print("invoice_data : ", invoice_data)
#             print("---------"*8)
#             PaymentBoQDetailedSerializer.objects.create(payment=payment, **invoice_data)

#         return payment

#     def update(self, instance, validated_data):
#         # Ensure 'invoice_methods' is a list of dictionaries
#         invoice_methods_data = self.context["request"].data.get("Payment_BoQDetailed", [])
#         if not isinstance(invoice_methods_data, list):
#             invoice_methods_data = [] 

#         # Update Payment fields
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()

#         # Update InvoiceMethods
#         existing_invoice_ids = [
#             item["id"] for item in invoice_methods_data if "id" in item
#         ]
#         PaymentBoQDetailed.objects.filter(payment=instance).exclude(
#             id__in=existing_invoice_ids
#         ).delete()

#         for invoice_data in invoice_methods_data:
#             invoice_id = invoice_data.get("id")
#             if invoice_id:
#                 invoice = PaymentBoQDetailed.objects.get(id=invoice_id, payment=instance)
#                 for attr, value in invoice_data.items():
#                     setattr(invoice, attr, value)
#                 invoice.save()
#             else:
#                 PaymentBoQDetailed.objects.create(payment=instance, **invoice_data)

#         return instance

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)

#         representation["entity"] = model_to_dict(
#             instance.entity,
#             fields=[field.name for field in instance.entity._meta.fields],
#         )
#         representation["project"] = model_to_dict(
#             instance.project,
#             fields=[field.name for field in instance.project._meta.fields],
#         )
#         representation["client"] = model_to_dict(
#             instance.client,
#             fields=[field.name for field in instance.client._meta.fields],
#         )

#         # Manually add invoice_methods using InvoiceMethodSerializer
#         invoice_methods = PaymentBoQDetailed.objects.filter(payment=instance)
#         representation["Payment_BoQDetailed"] = PaymentBoQDetailedSerializer(
#             invoice_methods, many=True
#         ).data

#         return representation