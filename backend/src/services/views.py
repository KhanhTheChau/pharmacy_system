from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from invoice.models import ChiTietHoaDonModel
from services import phat_hien

class PhatHienBatThuongView(APIView):

    def get(self, request, pk):
        try:
            cthd = ChiTietHoaDonModel.objects.select_related('MaHoaDon', 'MaThuoc').get(pk=pk)
        except ChiTietHoaDonModel.DoesNotExist:
            return Response({
                "success": False,
                "message": "Chi tiết hóa đơn không tồn tại"
            }, status=status.HTTP_404_NOT_FOUND)

        hoadon = cthd.MaHoaDon
        khach = hoadon.MaKH

        canh_bao = []

        # Kiểm tra từng tiêu chí
        cb1 = phat_hien.khach_hang_mua_qua_nhieu(khach)
        cb2 = phat_hien.mua_lap_lai(khach)
        cb3 = phat_hien.gia_ban_lech(cthd)
        cb4 = phat_hien.ban_ngoai_gio(hoadon)

        for cb in [cb1, cb2, cb3, cb4]:
            if cb:
                canh_bao.append(cb)

        return Response({
            "success": True,
            "message": "Kiểm tra hoàn tất",
            "canh_bao": canh_bao or ["Không phát hiện bất thường"]
        })
