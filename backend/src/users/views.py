from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import KhachHangModel
from .serializers import KhachHangSerializer
from rest_framework.permissions import IsAuthenticated

def hello(request):
    return HttpResponse("Hello World", content_type="text/plain")

class KhachHangList(APIView):
    permission_classes = [IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        return KhachHangSerializer(*args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        kh_list = KhachHangModel.objects.all()
        serializer = self.get_serializer(kh_list, many=True)
        return Response({
            "success": True,
            "message": "Lấy danh sách khách hàng thành công",
            "data": serializer.data,
        }, status=status.HTTP_200_OK)
        
    def post(self, request):
        serializer = KhachHangSerializer(data=request.data.get("data", {}))
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Tạo khách hàng thành công!",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class KhachHangDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        return KhachHangSerializer(*args, **kwargs) 

    def get_object(self, maKH):
        try:
            return KhachHangModel.objects.get(MaKhachHang=maKH)
        except KhachHangModel.DoesNotExist:
            return None

    def get(self, request, maKH, *args, **kwargs):
        kh = self.get_object(maKH)
        if kh is None:
            return Response({
                "success": False,
                "message": "Không tìm thấy khách hàng"
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(kh)
        return Response({
            "success": True,
            "message": "Lấy thông tin khách hàng thành công",
            "data": serializer.data,
        }, status=status.HTTP_200_OK)

    def put(self, request, maKH, *args, **kwargs):
        kh = self.get_object(maKH)
        if kh is None:
            return Response({
                "success": False,
                "message": "Không tìm thấy khách hàng"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(kh, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Cập nhật khách hàng thành công!",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, maKH, *args, **kwargs):
        kh = self.get_object(maKH)
        if kh is None:
            return Response({
                "success": False,
                "message": "Không tìm thấy khách hàng"
            }, status=status.HTTP_404_NOT_FOUND)

        kh.delete()
        return Response({
            "success": True,
            "message": "Xóa khách hàng thành công"
        }, status=status.HTTP_200_OK)
