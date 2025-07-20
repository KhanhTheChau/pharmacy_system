from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import F, Sum, DecimalField, ExpressionWrapper
from .models import HoaDonModel, ChiTietHoaDonModel
from .serializers import HoaDonSerializer, ChiTietHoaDonSerializer
from rest_framework.permissions import IsAuthenticated

class HoaDonListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def get_serializer(self, *args, **kwargs):
        return HoaDonSerializer(*args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        hoadon = HoaDonModel.objects.all().order_by('-NgayLap')
        serializer = self.get_serializer(hoadon, many=True)
        return Response({
            "success": True,
            "message": "Lấy danh sách hóa đơn thành công",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = HoaDonSerializer(data=request.data.get("data", {}))
        if serializer.is_valid():
            serializer.save(TongTien=0)
            return Response({
                "success": True,
                "message": "Tạo hóa đơn thành công",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Tạo hóa đơn thất bại",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class HoaDonDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get_serializer(self, *args, **kwargs):
        return HoaDonSerializer(*args, **kwargs)
    
    def get_object(self, pk, *args, **kwargs):
        return get_object_or_404(HoaDonModel, pk=pk)

    def get(self, request, pk):
        hoadon = self.get_object(pk)
        serializer = HoaDonSerializer(hoadon)
        return Response({
            "success": True,
            "message": "Lấy chi tiết hóa đơn thành công",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request, pk):
        hoadon = self.get_object(pk)
        serializer = HoaDonSerializer(hoadon, data=request.data.get("data", {}))
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Cập nhật hóa đơn thành công",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": "Cập nhật hóa đơn thất bại",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        hoadon = self.get_object(pk)
        hoadon.delete()
        return Response({
            "success": True,
            "message": "Xóa hóa đơn thành công",
            "data": None
        }, status=status.HTTP_204_NO_CONTENT)

class ChiTietHoaDonListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def get_serializer(self, *args, **kwargs):
        return ChiTietHoaDonSerializer(*args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        chitiet = ChiTietHoaDonModel.objects.all()
        serializer = self.get_serializer(chitiet, many=True)
        return Response({
            "success": True,
            "message": "Lấy danh sách chi tiết hóa đơn thành công",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data.get("data", {}))
        if serializer.is_valid():
            instance = serializer.save()

            # Tự động tính tổng tiền hóa đơn
            hoa_don = instance.MaHoaDon
            tong = ChiTietHoaDonModel.objects.filter(MaHoaDon=hoa_don).aggregate(
                tong=Sum(ExpressionWrapper(F('GiaBan') * F('SoLuongBan'),
                                           output_field=DecimalField(max_digits=12, decimal_places=2)))
            )['tong'] or 0
            hoa_don.TongTien = tong
            hoa_don.save()

            return Response({
                "success": True,
                "message": "Tạo chi tiết hóa đơn thành công",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Tạo chi tiết hóa đơn thất bại",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ChiTietHoaDonDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get_serializer(self, *args, **kwargs):
        return ChiTietHoaDonSerializer(*args, **kwargs)
    
    def get_object(self, pk):
        return get_object_or_404(ChiTietHoaDonModel, pk=pk)

    def get(self, request, pk):
        instance = self.get_object(pk)
        serializer = ChiTietHoaDonSerializer(instance)
        return Response({
            "success": True,
            "message": "Lấy chi tiết thành công",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request, pk):
        instance = self.get_object(pk)
        serializer = ChiTietHoaDonSerializer(instance, data=request.data.get("data", {}))
        if serializer.is_valid():
            updated_instance = serializer.save()

            # Cập nhật tổng tiền hóa đơn
            hoa_don = updated_instance.MaHoaDon
            tong = ChiTietHoaDonModel.objects.filter(MaHoaDon=hoa_don).aggregate(
                tong=Sum(ExpressionWrapper(F('GiaBan') * F('SoLuongBan'),
                                           output_field=DecimalField(max_digits=12, decimal_places=2)))
            )['tong'] or 0
            hoa_don.TongTien = tong
            hoa_don.save()

            return Response({
                "success": True,
                "message": "Cập nhật chi tiết hóa đơn thành công",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "Cập nhật thất bại",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        instance = self.get_object(pk)
        hoa_don = instance.MaHoaDon
        instance.delete()

        # Cập nhật lại tổng tiền
        tong = ChiTietHoaDonModel.objects.filter(MaHoaDon=hoa_don).aggregate(
            tong=Sum(ExpressionWrapper(F('GiaBan') * F('SoLuongBan'),
                                       output_field=DecimalField(max_digits=12, decimal_places=2)))
        )['tong'] or 0
        hoa_don.TongTien = tong
        hoa_don.save()

        return Response({
            "success": True,
            "message": "Xoá chi tiết hóa đơn thành công",
            "data": None
        }, status=status.HTTP_204_NO_CONTENT)
