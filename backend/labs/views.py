from rest_framework import viewsets
from accounts.permissions import IsStaffOrReadOnly
from .models import Lab
from .serializers import LabSerializer


class LabViewSet(viewsets.ModelViewSet):
    queryset = Lab.objects.select_related('technology')
    serializer_class = LabSerializer
    permission_classes = [IsStaffOrReadOnly]
