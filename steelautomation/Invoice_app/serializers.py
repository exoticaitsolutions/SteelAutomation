from rest_framework.authtoken.models import Token
from rest_framework import serializers
from django.contrib.auth import authenticate
from Invoice_app.models import User, Entity, Client
from django.contrib.auth.backends import ModelBackend
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Contract, Project, Role_CHOICES, User


class SignUpSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=Role_CHOICES, required=False)  # Role is now optional

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'confirm_password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        # Ensure passwords match
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        # Validate password strength (using Django's password validation system)
        validate_password(attrs['password'])

        # Restrict "ADMIN" role during signup
        role = attrs.get('role', 'STAFF')  # Default to 'STAFF' if no role is provided
        if role == 'ADMIN':
            raise serializers.ValidationError({"role": "You are not allowed to create an admin user."})

        return attrs

    def create(self, validated_data):
        # Remove confirm_password from validated_data as it's not needed for user creation
        validated_data.pop('confirm_password')

        # Set the role to 'STAFF' if not provided
        validated_data['role'] = validated_data.get('role', 'STAFF')

        # Create the user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],
        )

        return user


# Custom authentication backend to use email instead of username
class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Check if the email exists in the User model
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            return None

        # Check if the password matches
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

        # Use the custom EmailBackend to authenticate using email
        user = EmailBackend().authenticate(request=None, username=email, password=password)
        if user is None:
            raise serializers.ValidationError('Invalid email or password')

        # Generate or retrieve a token for the authenticated user
        token, created = Token.objects.get_or_create(user=user)

        # Add the user and token to the validated data
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


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'
