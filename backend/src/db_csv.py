import os
import django
import csv
import sys
import random
from datetime import datetime
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.src.app.settings")  
django.setup()

from users.serializers import KhachHangSerializer, KhachHangModel
from manufacturers.serializers import HangSXSerializer, HangSXModel
from medicine_types.serializers import LoaiThuocSerializer, LoaiThuocModel
from suppliers.serializers import NhaCungCapSerializer, NhaCungCapModel
from medicine.serializers import ThuocSerializer, ThuocModel
from invoice.serializers import HoaDonSerializer, ChiTietHoaDonSerializer, HoaDonModel, ChiTietHoaDonModel
from medicine.serializers import ThuocModel, ThuocSerializer

def load_loai_thuoc():
    with open(os.path.join("./data", 'loai_thuoc.csv'), 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            s = LoaiThuocSerializer(data=row)
            if s.is_valid():
                s.save()
            else:
                print("Loại thuốc:", s.errors)

def load_hang_sx():
    with open(os.path.join("./data", 'hang_sx.csv'), 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            s = HangSXSerializer(data=row)
            if s.is_valid():
                s.save()
            else:
                print("Hãng SX:", s.errors)

def load_nha_cung_cap():
    with open(os.path.join("./data", 'nha_cung_cap.csv'), 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            s = NhaCungCapSerializer(data=row)
            if s.is_valid():
                s.save()
            else:
                print("NCC:", s.errors)

def load_thuoc():
    with open(os.path.join("./data", 'thuoc.csv'), 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                loai = LoaiThuocModel.objects.get(TenLoai=row['MaLoai'])
                hangsx = HangSXModel.objects.get(TenHangSX=row['MaHangSX'])
                ncc = NhaCungCapModel.objects.get(TenNCC=row['MaNCC'])

                row['MaLoai'] = str(loai.MaLoai)
                row['MaHangSX'] = str(hangsx.MaHangSX)
                row['MaNCC'] = str(ncc.MaNCC)
                
                han_su_dung = row.get("HanSuDung", "").strip()
                if han_su_dung:
                    # Nếu có giờ: "2026-12-01 00:00:00"
                    if " " in han_su_dung:
                        row["HanSuDung"] = datetime.strptime(han_su_dung, "%Y-%m-%d %H:%M:%S").date().isoformat()
                    else:
                        # Nếu chỉ có ngày: "2026-12-01"
                        row["HanSuDung"] = datetime.strptime(han_su_dung, "%Y-%m-%d").date().isoformat()
                
                s = ThuocSerializer(data=row)
                if s.is_valid():
                    s.save()
                else:
                    print("Thuoc:", s.errors)
            except Exception as e:
                print("Lỗi khi xử lý dòng:", row)
                print("Chi tiết:", str(e))
                
def load_khach_hang():
    with open(os.path.join("./data", 'khach_hang.csv'), 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            s = KhachHangSerializer(data=row)
            if s.is_valid():
                s.save()
            else:
                print("Khách hàng:", s.errors)

def load_hoa_don():
    with open(os.path.join("./data", 'hoa_don.csv'), 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                khach = KhachHangModel.objects.get(TenKhachHang=row['MaKH'])  
                row['MaKH'] = khach.MaKhachHang
                
                han_su_dung = row.get("NgayLap", "").strip()
                if han_su_dung:
                    if " " in han_su_dung:
                        row["NgayLap"] = datetime.strptime(han_su_dung, "%Y-%m-%d %H:%M:%S").date().isoformat()
                    else:
                        row["NgayLap"] = datetime.strptime(han_su_dung, "%Y-%m-%d").date().isoformat()
                        
                s = HoaDonSerializer(data=row)
                if s.is_valid():
                    s.save()
                else:
                    print("Hóa đơn lỗi:", s.errors)
            except Exception as e:
                print("Hóa đơn: ", e)

def load_chi_tiet_hd():
    with open(os.path.join("./data", 'chi_tiet_hoa_don.csv'), 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        hd_list = list(HoaDonModel.objects.all())
        thuoc_list = list(ThuocModel.objects.all())

        if not hd_list or not thuoc_list:
            print("Danh sách Hóa đơn hoặc Thuốc rỗng!")
            return
        a=1
        for row in reader:
            try:
                # print(f"Mã thuốc: {row['MaThuoc']}")
                if row['MaThuoc']:
                    thuoc = ThuocModel.objects.get(TenThuoc=row['MaThuoc'])  
                    row['MaThuoc'] = thuoc.MaThuoc
                else:
                    row['MaThuoc'] = random.choice(thuoc_list).MaThuoc
                # print(f"Đang xử lý chi tiết hóa đơn {a} với thuốc {row['MaThuoc']}")
                
                data = {
                    'MaHoaDon': random.choice(hd_list).MaHoaDon,
                    'MaThuoc': row['MaThuoc'],
                    'SoLuongBan': row['SoLuongBan'],
                    'GiaBan': row['GiaBan']
                }
                s = ChiTietHoaDonSerializer(data=data)
                if s.is_valid():
                    s.save()
                else:
                    print("Lỗi chi tiết hóa đơn:", s.errors)
            except Exception as e:
                print("Chi tiết hóa đơn - lỗi exception:", e)
                
            a= a + 1
                
                                   
if __name__ == '__main__':
    print("Đang xóa dữ liệu cũ...")
    ThuocModel.objects.all().delete()
    KhachHangModel.objects.all().delete()
    HangSXModel.objects.all().delete()
    LoaiThuocModel.objects.all().delete()
    NhaCungCapModel.objects.all().delete()
    HoaDonModel.objects.all().delete()
    ChiTietHoaDonModel.objects.all().delete()

    print("Đang thêm dữ liệu mới...")
    load_loai_thuoc()
    load_hang_sx()
    load_nha_cung_cap()
    load_thuoc()
    load_khach_hang()
    load_hoa_don()
    load_chi_tiet_hd()
    
    print("Đã thêm dữ liệu từ các file CSV.")
