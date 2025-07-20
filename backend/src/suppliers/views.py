from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import NhaCungCapModel
from .serializers import NhaCungCapSerializer
from rest_framework.permissions import IsAuthenticated

class NhaCungCapList(APIView):
    permission_classes = [IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        return NhaCungCapSerializer(*args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        ncc_list = NhaCungCapModel.objects.all()
        serializer = self.get_serializer(ncc_list, many=True)
        return Response({
            "success": True,
            "message": "Lấy danh sách nhà cung cấp thành công",
            "data": serializer.data,
        }, status=status.HTTP_200_OK)
        
    def post(self, request):
        serializer = NhaCungCapSerializer(data=request.data.get("data", {}))
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Tạo nhà cung cấp thành công!",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class NhaCungCapDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        return NhaCungCapSerializer(*args, **kwargs) 

    def get_object(self, maNCC):
        try:
            return NhaCungCapModel.objects.get(MaNCC=maNCC)
        except NhaCungCapModel.DoesNotExist:
            return None

    def get(self, request, maNCC, *args, **kwargs):
        ncc = self.get_object(maNCC)
        if ncc is None:
            return Response({
                "success": False,
                "message": "Không tìm thấy nhà cung cấp"
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(ncc)
        return Response({
            "success": True,
            "message": "Lấy thông tin nhà cung cấp thành công",
            "data": serializer.data,
        }, status=status.HTTP_200_OK)

    def put(self, request, maNCC, *args, **kwargs):
        ncc = self.get_object(maNCC)
        if ncc is None:
            return Response({
                "success": False,
                "message": "Không tìm thấy nhà cung cấp"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(ncc, data=request.data.get("data", {}))
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Cập nhật nhà cung cấp thành công!",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, maNCC, *args, **kwargs):
        ncc = self.get_object(maNCC)
        if ncc is None:
            return Response({
                "success": False,
                "message": "Không tìm thấy nhà cung cấp"
            }, status=status.HTTP_404_NOT_FOUND)

        ncc.delete()
        return Response({
            "success": True,
            "message": "Xóa nhà cung cấp thành công"
        }, status=status.HTTP_200_OK)
