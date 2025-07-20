from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import register

urlpatterns = [
    path('register/', register),                     # POST /api/v1/account/register/
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),    # POST /api/v1/account/login/
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),         # POST /api/v1/account/refresh/
]
