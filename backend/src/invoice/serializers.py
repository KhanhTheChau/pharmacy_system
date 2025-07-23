from rest_framework import serializers
from datetime import date
from django.db.models import Sum, F, DecimalField, ExpressionWrapper
from .models import HoaDonModel, ChiTietHoaDonModel
from medicine.serializers import ThuocSerializer, ThuocModel
from users.serializers import KhachHangSerializer, KhachHangModel

class ChiTietHoaDonSerializer(serializers.ModelSerializer):
    MaChiTietHD = serializers.CharField(read_only=True)
    MaHoaDon = serializers.PrimaryKeyRelatedField(
        queryset=HoaDonModel.objects.all(),
        write_only=True,
    )
    MaThuoc = serializers.PrimaryKeyRelatedField(
        queryset=ThuocModel.objects.all()
    )
    SoLuongBan = serializers.IntegerField(min_value=1)
    GiaBan = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)

    # Thêm thông tin chi tiết thuốc (nested)
    Thuoc = ThuocSerializer(source='MaThuoc', read_only=True)

    class Meta:
        model = ChiTietHoaDonModel
        fields = ['MaChiTietHD', 'MaHoaDon', 'MaThuoc', 'Thuoc', 'SoLuongBan', 'GiaBan']

    def validate(self, data):
        thuoc = data['MaThuoc']
        so_luong_ban = data['SoLuongBan']

        if thuoc.SoLuongTonKho < so_luong_ban:
            raise serializers.ValidationError(
                f"Số lượng tồn kho không đủ. Hiện còn {thuoc.so_luong} viên."
            )

        return data

    def create(self, validated_data):
        thuoc = validated_data['MaThuoc']
        so_luong_ban = validated_data['SoLuongBan']

        # Trừ tồn kho sau khi tạo chi tiết
        thuoc.SoLuongTonKho -= so_luong_ban
        thuoc.save()

        return super().create(validated_data)

class HoaDonSerializer(serializers.ModelSerializer):
    MaHoaDon = serializers.CharField(read_only=True)
    MaKH = serializers.PrimaryKeyRelatedField(
        queryset=KhachHangModel.objects.all()
    )
    NgayLap = serializers.DateTimeField()
    TongTien = serializers.SerializerMethodField()


    # Nested danh sách chi tiết hóa đơn
    ChiTiet = ChiTietHoaDonSerializer(source='chitiethoadon', many=True, read_only=True)
    KhachHang = KhachHangSerializer(source='MaKH', read_only=True)
    
    class Meta:
        model = HoaDonModel
        fields = ['MaHoaDon', 'MaKH', 'NgayLap', 'TongTien', 'KhachHang', 'ChiTiet']

    def validate_NgayLap(self, value):
        if value.date() > date.today():
            raise serializers.ValidationError("Ngày lập không được lớn hơn hôm nay.")
        return value

    def get_TongTien(self, obj):
        result = ChiTietHoaDonModel.objects.filter(MaHoaDon=obj).aggregate(
            TongTien=Sum(
                ExpressionWrapper(
                    F('GiaBan') * F('SoLuongBan'),
                    output_field=DecimalField(max_digits=12, decimal_places=2)
                )
            )
        )

        tong_tien = result['TongTien'] or 0
        # print(f"Tổng tiền hóa đơn {obj.MaHoaDon}: {tong_tien}")
        # Lưu xuống DB nếu khác với giá trị hiện tại
        if obj.TongTien != tong_tien:
            obj.TongTien = tong_tien
            obj.save(update_fields=["TongTien"])  # chỉ update 1 trường cho nhanh

        return tong_tien

    