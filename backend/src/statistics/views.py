from django.http import JsonResponse
from django.db.models.functions import ExtractYear, ExtractMonth, ExtractDay, ExtractWeekDay
from django.db.models import Sum, Count, F, FloatField
from invoice.models import HoaDonModel
from invoice.models import ChiTietHoaDonModel
from medicine.models import ThuocModel
from medicine_types.models import LoaiThuocModel
from suppliers.models import NhaCungCapModel
from users.models import KhachHangModel
from manufacturers.models import HangSXModel
import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now
from datetime import timedelta

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def entity_count(request):
    data = {
        "drugs": ThuocModel.objects.count(),
        "manufacturers": HangSXModel.objects.count(),
        "categories": LoaiThuocModel.objects.count(),
        "suppliers": NhaCungCapModel.objects.count(),
        "customers": KhachHangModel.objects.count(),
        "invoices": HoaDonModel.objects.count(),
        "invoiceDetails": ChiTietHoaDonModel.objects.count(),
    }

    return JsonResponse({
        "message": "Thống kê số lượng entity",
        "data": data,
        "success": True
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def available_years(request):
    years = (
        HoaDonModel.objects
        .annotate(year=ExtractYear('NgayLap'))
        .values_list('year', flat=True)
        .distinct()
        .order_by('year')
    )
    return JsonResponse({
        "message": "Danh sách năm có dữ liệu",
        "data": list(years),
        "success": True
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def yearly_statistics(request):
    year = request.GET.get('year')
    if not year:
        return JsonResponse({
            "message": "Missing 'year' parameter",
            "data": [],
            "success": False
        }, status=400)

    # Group theo tháng trong năm
    queryset = (
        ChiTietHoaDonModel.objects
        .filter(MaHoaDon__NgayLap__year=year)
        .annotate(month=ExtractMonth('MaHoaDon__NgayLap'))
        .values('month')
        .annotate(
            total=Sum(F('SoLuongBan') * F('GiaBan'), output_field=FloatField()),
            invoices=Count('MaHoaDon', distinct=True)
        )
    )

    # Map kết quả theo tháng
    monthly_map = {item['month']: item for item in queryset}

    data = []
    for month in range(1, 13):
        label = f"{month:02d}/{year}"
        item = monthly_map.get(month)
        total = float(item['total']) if item and item['total'] is not None else 0.0
        invoices = item['invoices'] if item else 0

        data.append({
            "label": label,
            "total": total,
            "invoices": invoices
        })

    return JsonResponse({
        "message": f"Monthly statistics for {year}",
        "data": data,
        "success": True
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def monthly_statistics(request):
    year = request.GET.get('nam') or request.GET.get('year')
    month = request.GET.get('thang') or request.GET.get('month')

    if not year or not month:
        return JsonResponse({
            "message": "Missing 'nam' or 'thang' parameter",
            "data": [],
            "success": False
        }, status=400)

    queryset = (
        ChiTietHoaDonModel.objects
        .filter(MaHoaDon__NgayLap__year=year, MaHoaDon__NgayLap__month=month)
        .annotate(day=ExtractDay('MaHoaDon__NgayLap'))
        .values('day')
        .annotate(
            total=Sum(F('SoLuongBan') * F('GiaBan'), output_field=FloatField()),
            invoices=Count('MaHoaDon', distinct=True)
        )
    )

    # Map dữ liệu theo ngày
    daily_map = {item['day']: item for item in queryset}

    # Tạo đủ ngày trong tháng
    import calendar
    num_days = calendar.monthrange(int(year), int(month))[1]

    data = []
    for day in range(1, num_days + 1):
        label = str(day)
        item = daily_map.get(day)
        total = float(item['total']) if item and item['total'] is not None else 0.0
        invoices = item['invoices'] if item else 0

        data.append({
            "label": label,
            "total": total,
            "invoices": invoices
        })

    return JsonResponse({
        "message": f"Daily statistics for {month}/{year}",
        "data": data,
        "success": True
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def weekly_statistics(request):
    batdau = request.GET.get('start')
    if not batdau:
        return JsonResponse({
            "message": "Missing 'start' parameter (format: YYYY-MM-DD)",
            "data": [],
            "success": False
        }, status=400)

    try:
        start_date = datetime.datetime.strptime(batdau, "%Y-%m-%d").date()
    except ValueError:
        return JsonResponse({
            "message": "Invalid date format. Use YYYY-MM-DD.",
            "data": [],
            "success": False
        }, status=400)

    end_date = start_date + datetime.timedelta(days=6)

    queryset = (
        ChiTietHoaDonModel.objects
        .filter(MaHoaDon__NgayLap__range=(start_date, end_date))
        .annotate(weekday=ExtractWeekDay('MaHoaDon__NgayLap'))
        .values('weekday')
        .annotate(
            total=Sum(F('SoLuongBan') * F('GiaBan'), output_field=FloatField()),
            invoices=Count('MaHoaDon', distinct=True)
        )
    )

    # Django weekday: 1=Sunday, 2=Monday, ..., 7=Saturday
    weekday_map = {
        2: "Thứ 2",
        3: "Thứ 3",
        4: "Thứ 4",
        5: "Thứ 5",
        6: "Thứ 6",
        7: "Thứ 7",
        1: "Chủ nhật"
    }

    data_map = {item["weekday"]: item for item in queryset}

    data = []
    for i in range(7):
        current_date = start_date + datetime.timedelta(days=i)
        iso_weekday = current_date.isoweekday()  # 1=Monday, ..., 7=Sunday
        django_weekday = 1 if iso_weekday == 7 else iso_weekday + 1

        item = data_map.get(django_weekday)

        total = float(item["total"]) if item and item["total"] is not None else 0.0
        invoices = item["invoices"] if item else 0

        label = f"{weekday_map[django_weekday]} ({current_date.strftime('%d/%m/%Y')})"

        data.append({
            "label": label,
            "date": current_date.isoformat(),
            "total": total,
            "invoices": invoices
        })

    return JsonResponse({
        "message": f"Weekly statistics from {start_date} to {end_date}",
        "data": data,
        "success": True
    })


def top_selling_drugs(request):
    month = request.GET.get('month')
    year = request.GET.get('year')

    queryset = ChiTietHoaDonModel.objects.all()

    if year:
        queryset = queryset.filter(MaHoaDon__NgayLap__year=year)
    if month:
        queryset = queryset.filter(MaHoaDon__NgayLap__month=month)

    result = (
        queryset
        .values("MaThuoc__TenThuoc")
        .annotate(
            soLuong=Sum("SoLuongBan"),
            tongTien=Sum(F("SoLuongBan") * F("GiaBan"), output_field=FloatField())
        )
        .order_by("-soLuong")
    )

    data = [
        {
            "tenThuoc": item["MaThuoc__TenThuoc"],
            "soLuong": item["soLuong"],
            "tongTien": round(item["tongTien"], 2) if item["tongTien"] else 0.0,
        }
        for item in result
    ]

    return JsonResponse({
        "message": "Danh sách thuốc bán ra",
        "data": data,
        "success": True
    })

def soon_expiring_drugs(request):
    mode = request.GET.get("mode", "month")  # mặc định là tháng
    days = 30  # default

    if mode == "week":
        days = 7
    elif mode == "custom":
        try:
            days = int(request.GET.get("days", 30))
        except (TypeError, ValueError):
            days = 30

    today = now().date()
    threshold = today + timedelta(days=days)

    drugs = ThuocModel.objects.filter(HanSuDung__range=(today, threshold))

    data = [
        {
            "tenThuoc": d.TenThuoc,
            "hanSuDung": d.HanSuDung,
            "soLuongTon": d.SoLuongTonKho
        }
        for d in drugs
    ]

    return JsonResponse({
        "success": True,
        "message": f"Thuốc sắp hết hạn trong {days} ngày",
        "data": data,
    })

def drug_status_statistics(request):
    today = now().date()
    in_seven_days = today + timedelta(days=7)
    in_thirty_days = today + timedelta(days=30)

    all_drugs = ThuocModel.objects.all()

    status = {
        "inStock": [],
        "outOfStock": [],
        "expired": [],
        "expiring7": [],
        "expiring30": [],
    }

    for drug in all_drugs:
        if drug.SoLuongTonKho <= 0:
            status["outOfStock"].append(drug)
        elif drug.HanSuDung < today:
            status["expired"].append(drug)
        else:
            if today <= drug.HanSuDung <= in_seven_days:
                status["expiring7"].append(drug)
            if today <= drug.HanSuDung <= in_thirty_days:
                status["expiring30"].append(drug)
            status["inStock"].append(drug)


    def serialize(drugs):
        return [
            {
                "tenThuoc": d.TenThuoc,
                "soLuongTon": d.SoLuongTonKho,
                "hanSuDung": d.HanSuDung,
            }
            for d in drugs
        ]

    return JsonResponse({
        "success": True,
        "message": "Thống kê tình trạng thuốc",
        "data": {
            "inStock": serialize(status["inStock"]),
            "outOfStock": serialize(status["outOfStock"]),
            "expired": serialize(status["expired"]),
            "expiring7": serialize(status["expiring7"]),
            "expiring30": serialize(status["expiring30"]),
        }
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def invoices_by_date(request):
    date_str = request.GET.get("date")

    if date_str:
        try:
            selected_date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return JsonResponse({
                "success": False,
                "message": "Sai định dạng ngày. Dùng YYYY-MM-DD.",
                "data": []
            }, status=400)
    else:
        selected_date = now().date()

    hoa_dons = HoaDonModel.objects.filter(NgayLap__date=selected_date).select_related("MaKH")
    hoa_don_ids = [hd.MaHoaDon for hd in hoa_dons]

    # Lấy toàn bộ chi tiết hóa đơn liên quan
    chi_tiets = ChiTietHoaDonModel.objects.filter(MaHoaDon__in=hoa_don_ids).select_related("MaThuoc")

    chi_tiet_map = {}
    tong_so_thuoc = 0
    tong_tien = 0
    khach_hang_ids = set()

    for ct in chi_tiets:
        ma_hd = ct.MaHoaDon.MaHoaDon
        if ma_hd not in chi_tiet_map:
            chi_tiet_map[ma_hd] = []

        tong_so_thuoc += ct.SoLuongBan
        thanh_tien = float(ct.SoLuongBan * ct.GiaBan)
        tong_tien += thanh_tien

        chi_tiet_map[ma_hd].append({
            "MaChiTietHD": ct.MaChiTietHD,
            "MaThuoc": ct.MaThuoc.MaThuoc,
            "SoLuongBan": ct.SoLuongBan,
            "GiaBan": float(ct.GiaBan),
            "Thuoc": {
                "MaThuoc": ct.MaThuoc.MaThuoc,
                "TenThuoc": ct.MaThuoc.TenThuoc,
                "SoLuongTonKho": ct.MaThuoc.SoLuongTonKho,
                "HanSuDung": ct.MaThuoc.HanSuDung,
                # Thêm các trường khác nếu cần
            }
        })

    result = []
    for hd in hoa_dons:
        if hd.MaKH:
            khach_hang_ids.add(hd.MaKH.MaKhachHang)

        result.append({
            "MaHoaDon": hd.MaHoaDon,
            "MaKH": hd.MaKH.MaKhachHang if hd.MaKH else None,
            "NgayLap": hd.NgayLap,
            "TongTien": float(hd.TongTien),
            "KhachHang": {
                "MaKhachHang": hd.MaKH.MaKhachHang,
                "TenKhachHang": hd.MaKH.TenKhachHang,
                "SoDienThoai": hd.MaKH.SoDienThoai,
                "DiaChi": hd.MaKH.DiaChi
            } if hd.MaKH else None,
            "ChiTiet": chi_tiet_map.get(hd.MaHoaDon, [])
        })

    return JsonResponse({
        "success": True,
        "message": f"Danh sách hóa đơn ngày {selected_date.strftime('%d/%m/%Y')}",
        "data": {
            "chiTiet": result,
            "soHoaDon": len(result),
            "soKhachHang": len(khach_hang_ids),
            "soThuocBanRa": tong_so_thuoc,
            "tongTienThu": round(tong_tien, 2)
        }
    })
