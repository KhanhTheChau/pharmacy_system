from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if User.objects.filter(username=username).exists():
        return Response({
            "success": False,
            "message": "Tên tài khoản đã tồn tại",
            "data": None
        }, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, email=email)

    return Response({
        "success": True,
        "message": "Đăng ký thành công",
        "data": None
    }, status=status.HTTP_201_CREATED)
