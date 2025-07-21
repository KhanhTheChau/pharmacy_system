from django.urls import path
from .views import PhatHienBatThuongView, KiemTraToanBoView

urlpatterns = [
    path('canh-bao/<uuid:pk>/', PhatHienBatThuongView.as_view(), name='phat_hien_bat_thuong'),
    path('canh-bao/all/', KiemTraToanBoView.as_view(), name='kiem_tra_toan_bo'),
]
