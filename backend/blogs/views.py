from rest_framework import viewsets
from accounts.permissions import IsStaffOrReadOnly
from .models import Blog
from .serializers import BlogSerializer


class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.select_related('technology')
    serializer_class = BlogSerializer
    permission_classes = [IsStaffOrReadOnly]
