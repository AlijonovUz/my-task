import re

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Todo, User


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'
        read_only_fields = ('id', 'user')


class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(min_length=8, max_length=128, write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(min_length=8, max_length=128, write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
        extra_kwargs = {
            'email': {
                'required': True,
                'allow_null': False,
                'allow_blank': False
            }
        }

    def validate_username(self, value):
        if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]{2,29}$', value):
            raise serializers.ValidationError("Username must be 3–30 characters, start with a letter or underscore, "
                                              "and use only letters, numbers, or underscores.")

        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")

        return value

    def validate_email(self, value):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', value):
            raise serializers.ValidationError("Invalid email entered.")

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")

        return value

    def validate(self, attrs):
        password1 = attrs.get("password1")
        password2 = attrs.get("password2")

        if password1 != password2:
            raise serializers.ValidationError({
                'password': "Passwords do not match."
            })

        try:
            validate_password(attrs['password1'], user=None)
        except DjangoValidationError as e:
            raise serializers.ValidationError({'password': e.messages})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password1')

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        return user


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]{2,29}$', username):
            raise serializers.ValidationError({
                'username': "Username must start with a letter or underscore, "
                            "and be 3–30 characters long, using only letters, numbers, or underscores."
            })

        try:
            user = User.objects.get(username__iexact=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'username': "This username is not registered."
            })

        if not user.check_password(password):
            raise serializers.ValidationError({
                'password': "Password is incorrect."
            })

        if not user.is_active:
            raise serializers.ValidationError({
                'username': "This user is not verified yet."
            })

        data = super().validate({
            'username': user.username,
            'password': password
        })

        return {
            'success': True,
            'token': data.get('access'),
        }
