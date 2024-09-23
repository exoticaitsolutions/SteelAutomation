from rest_framework.authtoken.models import Token
from rest_framework import serializers
from django.contrib.auth import authenticate
from Invoice_app.models import User, Entity
from django.contrib.auth.backends import ModelBackend

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