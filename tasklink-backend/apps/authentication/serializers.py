from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """User serializer for basic user info"""

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'full_name', 'avatar',
            'bio', 'phone', 'timezone', 'is_online', 'last_seen',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at',
                            'updated_at', 'is_online', 'last_seen']


class UserRegistrationSerializer(serializers.Serializer):
    """Serializer for user registration"""
    username = serializers.CharField(required=True, max_length=150)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    full_name = serializers.CharField(
        required=False, allow_blank=True, max_length=255)

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        full_name = validated_data.pop('full_name', '')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=full_name
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer to include user info"""
    email = serializers.CharField(required=False, allow_blank=True)
    username = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        # Allow login with either email or username
        # User model has USERNAME_FIELD = 'email', so we need to map email -> username for TokenObtainPairSerializer
        if attrs.get('email') and not attrs.get('username'):
            # If email provided but no username, use email as the identifier
            attrs['username'] = attrs.pop('email')

        data = super().validate(attrs)

        # Add custom user data
        data['user'] = UserSerializer(self.user).data

        return data


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError(
                {"new_password": "Password fields didn't match."})
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""

    class Meta:
        model = User
        fields = ['full_name', 'bio', 'phone', 'timezone', 'avatar']
