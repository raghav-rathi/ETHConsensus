from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login

from rest_framework import serializers
from api.models import NFT, Ownership
from rest_framework import serializers


class NFTSerializer(serializers.ModelSerializer):
    class Meta:
        model = NFT
        fields = '__all__'


class OwnershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ownership
        fields = '__all__'

# class UserLoginSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField(max_length=128, write_only=True)
#     access = serializers.CharField(read_only=True)
#     refresh = serializers.CharField(read_only=True)
#     role = serializers.CharField(read_only=True)
#
#     def create(self, validated_date):
#         pass
#
#     def update(self, instance, validated_data):
#         pass
#
#     def validate(self, data):
#         email = data['email']
#         password = data['password']
#         user = authenticate(email=email, password=password)
#
#         if user is None:
#             raise serializers.ValidationError("Invalid login credentials")
#
#         try:
#             refresh = RefreshToken.for_user(user)
#             refresh_token = str(refresh)
#             access_token = str(refresh.access_token)
#
#             update_last_login(None, user)
#
#             validation = {
#                 'access': access_token,
#                 'refresh': refresh_token,
#                 'email': user.email,
#                 'role': user.role,
#             }
#
#             return validation
#         except settings.AUTH_USER_MODEL.DoesNotExist:
#             raise serializers.ValidationError("Invalid login credentials")
#
#