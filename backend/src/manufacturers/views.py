from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import HangSXModel
from .serializers import HangSXSerializer
from rest_framework.permissions import IsAuthenticated

class HangSXList(APIView):
    permission_classes = [IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        return HangSXSerializer(*args, **kwargs)

    def get(self, request, *args, **kwargs):
        hang_sx_list = HangSXModel.objects.all()
        serializer = self.get_serializer(hang_sx_list, many=True)
        return Response({
            "success": True,
            "message": "Lấy danh sách hãng sản xuất thành công",
            "data": serializer.data,
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = HangSXSerializer(data=request.data.get("data", {}))
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Tạo hãng sản xuất thành công!",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class HangSXDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        return HangSXSerializer(*args, **kwargs)

    def get_object(self, maHangSX):
        try:
            return HangSXModel.objects.get(MaHangSX=maHangSX)
        except HangSXModel.DoesNotExist:
            return None

    def get(self, request, maHangSX, *args, **kwargs):
        hang_sx = self.get_object(maHangSX)
        if hang_sx is None:
            return Response({
                "success": False,
                "message": "Không tìm thấy hãng sản xuất"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(hang_sx)
        return Response({
            "success": True,
            "message": "Lấy thông tin hãng sản xuất thành công",
            "data": serializer.data,
        }, status=status.HTTP_200_OK)

    def put(self, request, maHangSX, *args, **kwargs):
        hang_sx = self.get_object(maHangSX)
        if hang_sx is None:
            return Response({
                "success": False,
                "message": "Không tìm thấy hãng sản xuất"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(hang_sx, data=request.data.get("data", {}))
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Cập nhật hãng sản xuất thành công!",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, maHangSX, *args, **kwargs):
        hang_sx = self.get_object(maHangSX)
        if hang_sx is None:
            return Response({
                "success": False,
                "message": "Không tìm thấy hãng sản xuất"
            }, status=status.HTTP_404_NOT_FOUND)

        hang_sx.delete()
        return Response({
            "success": True,
            "message": "Xóa hãng sản xuất thành công"
        }, status=status.HTTP_200_OK)
