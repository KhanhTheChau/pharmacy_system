from datetime import timedelta, datetime
from django.utils import timezone
from django.db.models import Sum, Count
from invoice.models import ChiTietHoaDonModel, HoaDonModel

# 1. Mua số lượng lớn bất thường
def khach_hang_mua_qua_nhieu(ma_khach_hang):
    recent_orders = ChiTietHoaDonModel.objects.filter(
        MaHoaDon__MaKH=ma_khach_hang,
        MaHoaDon__NgayLap__gte=timezone.now() - timedelta(days=30)
    ).values('MaThuoc').annotate(tong_sl=Sum('SoLuongBan'))

    for item in recent_orders:
        if item['tong_sl'] > 100:  # Ngưỡng tuỳ chọn
            return f"Khách hàng mua {item['tong_sl']} thuốc (ID: {item['MaThuoc']}) trong 30 ngày qua"

    return None

# 2. Mua cùng loại thuốc quá thường xuyên
def mua_lap_lai(ma_khach_hang):
    recent = ChiTietHoaDonModel.objects.filter(
        MaHoaDon__MaKH=ma_khach_hang,
        MaHoaDon__NgayLap__gte=timezone.now() - timedelta(days=7)
    ).values('MaThuoc').annotate(so_lan=Count('id'))

    for item in recent:
        if item['so_lan'] > 3:
            return f"Khách mua thuốc (ID: {item['MaThuoc']}) {item['so_lan']} lần trong 7 ngày"

    return None

# 3. Giá bán lệch nhiều
def gia_ban_lech(cthd):
    don_gia = cthd.MaThuoc.DonGia
    if abs(cthd.GiaBan - don_gia) > don_gia * 0.2:
        return f"Giá bán lệch nhiều: {cthd.GiaBan} vs {don_gia}"
    return None

# 4. Bán ngoài giờ hành chính
def ban_ngoai_gio(hoadon):
    gio = hoadon.NgayLap.time()
    if gio < datetime.strptime("08:00", "%H:%M").time() or gio > datetime.strptime("18:00", "%H:%M").time():
        return f"Bán lúc {gio}, ngoài giờ hành chính"
    return None
