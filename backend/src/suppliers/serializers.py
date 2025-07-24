from rest_framework import serializers
from .models import NhaCungCapModel
import re

PHONE_REGEX = "^\+?[\d\s\-()]{7,10}$"

class NhaCungCapSerializer(serializers.ModelSerializer):
    MaNCC = serializers.CharField(read_only=True)
    TenNCC = serializers.CharField(required=True)
    SoDienThoai = serializers.CharField(required=True)

    class Meta:
        model = NhaCungCapModel
        fields = ['MaNCC', 'TenNCC', 'SoDienThoai']
        
    def validate_TenNCC(self, value):
        if not value.strip():
            raise serializers.ValidationError("Tên nhà cung cấp không được để trống.")
        return value
    
    def validate_SoDienThoai(self, value):
        if not re.match(PHONE_REGEX, value):
            raise serializers.ValidationError("Số điện thoại không hợp lệ.")
        return value