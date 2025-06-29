import os
import django
import csv
import sys
import random
from datetime import datetime
from decimal import Decimal
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
                # Tra cứu UUID dựa trên tên
                loai = LoaiThuocModel.objects.get(TenLoai=row['MaLoai'])
                hangsx = HangSXModel.objects.get(TenHangSX=row['MaHangSX'])
                ncc = NhaCungCapModel.objects.get(TenNCC=row['MaNCC'])

                # Gán UUID vào row
                row['MaLoai'] = str(loai.MaLoai)
                row['MaHangSX'] = str(hangsx.MaHangSX)
                row['MaNCC'] = str(ncc.MaNCC)

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

        for row in reader:
            try:
                data = {
                    'MaHoaDon': random.choice(hd_list).MaHoaDon,
                    'MaThuoc': random.choice(thuoc_list).MaThuoc,
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
