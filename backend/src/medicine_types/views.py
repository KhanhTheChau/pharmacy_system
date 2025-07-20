from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import LoaiThuocModel
from .serializers import LoaiThuocSerializer
from rest_framework.permissions import IsAuthenticated

class LoaiThuocList(APIView):
    permission_classes = [IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        return LoaiThuocSerializer(*args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        lt_list = LoaiThuocModel.objects.all()
        serializer = self.get_serializer(lt_list, many=True)
        return Response({
            "success": True,
            "message": "Lấy danh sách loại thuốc thành công",
            "data": serializer.data,
        }, status=status.HTTP_200_OK)
        
    def post(self, request):
        serializer = LoaiThuocSerializer(data=request.data.get("data", {}))
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Tạo loại thuốc thành công!",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LoaiThuocDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        return LoaiThuocSerializer(*args, **kwargs) 

    def get_object(self, maLT):
        try:
            return LoaiThuocModel.objects.get(MaLoai=maLT)
        except LoaiThuocModel.DoesNotExist:
            return None

    def get(self, request, maLT, *args, **kwargs):
        lt = self.get_object(maLT)
        if lt is None:
            return Response({
                "success": False,
                "message": "Không tìm thấy loại thuốc"
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(lt)
        return Response({
            "success": True,
            "message": "Lấy thông tin loại thuốc thành công",
            "data": serializer.data,
        }, status=status.HTTP_200_OK)

    def put(self, request, maLT, *args, **kwargs):
        lt = self.get_object(maLT)
        if lt is None:
            return Response({
                "success": False,
                "message": "Không tìm thấy loại thuốc"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(lt, data=request.data.get("data", {}))
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Cập nhật loại thuốc thành công!",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, maLT, *args, **kwargs):
        lt = self.get_object(maLT)
        if lt is None:
            return Response({
                "success": False,
                "message": "Không tìm thấy loại thuốc"
            }, status=status.HTTP_404_NOT_FOUND)

        lt.delete()
        return Response({
            "success": True,
            "message": "Xóa loại thuốc thành công"
        }, status=status.HTTP_200_OK)
