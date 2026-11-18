from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = authenticate(username=request.data.get('username'),
                            password=request.data.get('password'))
        if user is None:
            return Response({'detail': 'Invalid username or password.'}, status=status.HTTP_400_BAD_REQUEST)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.get_username(), 'is_staff': user.is_staff})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'username': request.user.get_username(), 'is_staff': request.user.is_staff})


class RegisterView(APIView):
    """Students create their own account. Video access is granted later by an admin."""
    permission_classes = [AllowAny]

    def post(self, request):
        User = get_user_model()
        username = str(request.data.get('username') or '').strip()
        password = str(request.data.get('password') or '')
        email = str(request.data.get('email') or '').strip()
        if not username or not password:
            return Response({'detail': 'Username and password are required.'}, status=400)
        if User.objects.filter(username__iexact=username).exists():
            return Response({'detail': 'That username is already taken.'}, status=400)
        user = User(username=username, email=email)
        try:
            validate_password(password, user)
        except ValidationError as e:
            return Response({'detail': ' '.join(e.messages)}, status=400)
        user.set_password(password)
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'username': user.get_username(), 'is_staff': False}, status=201)
