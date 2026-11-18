from rest_framework import viewsets
from accounts.permissions import IsStaffOrReadOnly
from .models import HeroSlide
from .serializers import HeroSlideSerializer


class HeroSlideViewSet(viewsets.ModelViewSet):
    serializer_class = HeroSlideSerializer
    permission_classes = [IsStaffOrReadOnly]

    def get_queryset(self):
        qs = HeroSlide.objects.all()
        u = self.request.user
        return qs if (u.is_authenticated and u.is_staff) else qs.filter(is_active=True)
