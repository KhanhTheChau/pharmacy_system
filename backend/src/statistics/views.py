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