import uuid
from django.db import models
from django.utils import timezone
from users.models import KhachHangModel
from medicine.models import ThuocModel

class HoaDonModel(models.Model):
    MaHoaDon = models.UUIDField(
        default=uuid.uuid4, primary_key=True, editable=False, unique=True
    )
    MaKH = models.ForeignKey(
        KhachHangModel,
        on_delete=models.CASCADE,
        related_name='hoadon',
        verbose_name='Khách hàng'
    )
    NgayLap = models.DateTimeField(
        default=timezone.now,
        verbose_name='Ngày lập hóa đơn'
    )
    TongTien = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name='Tổng tiền'
    )

    def __str__(self):
        return f"Hóa đơn {self.MaHoaDon} - KH: {self.MaKH}"


class ChiTietHoaDonModel(models.Model):
    MaChiTietHD = models.UUIDField(
        default=uuid.uuid4, primary_key=True, editable=False, unique=True
    )
    MaHoaDon = models.ForeignKey(
        HoaDonModel,
        on_delete=models.CASCADE,
        related_name='chitiethoadon',
        verbose_name='Hóa đơn'
    )
    MaThuoc = models.ForeignKey(
        ThuocModel,
        on_delete=models.CASCADE,
        verbose_name='Thuốc'
    )
    SoLuongBan = models.PositiveIntegerField(
        default=1,
        verbose_name='Số lượng bán'
    )
    GiaBan = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        verbose_name='Giá bán'
    )

    def __str__(self):
        return f"CTHD {self.MaChiTietHD} - {self.MaThuoc.TenThuoc} x {self.SoLuongBan}"
