from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import ThuocModel
from .serializers import ThuocSerializer

class ThuocList(APIView):
    permission_classes = [IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        return ThuocSerializer(*args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        thuoc_list = ThuocModel.objects.all()
        serializer = self.get_serializer(thuoc_list, many=True)
        return Response({
            "success": True,
            "message": "Lấy danh sách thuốc thành công",
            "data": serializer.data,
        }, status=status.HTTP_200_OK)
        
    def post(self, request):
        serializer = ThuocSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Tạo thuốc thành công!",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ThuocDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        return ThuocSerializer(*args, **kwargs) 

    def get_object(self, maThuoc):
        try:
            return ThuocModel.objects.get(MaThuoc=maThuoc)
        except ThuocModel.DoesNotExist:
            return None

    def get(self, request, maThuoc, *args, **kwargs):
        thuoc = self.get_object(maThuoc)
        if thuoc is None:
            return Response({
                "success": False,
                "message": "Không tìm thấy thuốc"
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(thuoc)
        return Response({
            "success": True,
            "message": "Lấy thông tin thuốc thành công",
            "data": serializer.data,
        }, status=status.HTTP_200_OK)

    def put(self, request, maThuoc, *args, **kwargs):
        thuoc = self.get_object(maThuoc)
        if thuoc is None:
            return Response({
                "success": False,
                "message": "Không tìm thấy thuốc"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(thuoc, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Cập nhật thuốc thành công!",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, maThuoc, *args, **kwargs):
        thuoc = self.get_object(maThuoc)
        if thuoc is None:
            return Response({
                "success": False,
                "message": "Không tìm thấy thuốc"
            }, status=status.HTTP_404_NOT_FOUND)

        thuoc.delete()
        return Response({
            "success": True,
            "message": "Xóa thuốc thành công"
        }, status=status.HTTP_200_OK)
