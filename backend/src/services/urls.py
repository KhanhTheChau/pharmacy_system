from django.urls import path
from .views import PhatHienBatThuongView

urlpatterns = [
    path('canh-bao/<uuid:pk>/', PhatHienBatThuongView.as_view(), name='phat_hien_bat_thuong'),
]
