from django.db.models import ProtectedError
from rest_framework import viewsets
from rest_framework.response import Response

from accounts.permissions import IsStaffOrReadOnly
from .models import Technology
from .serializers import TechnologySerializer


class TechnologyViewSet(viewsets.ModelViewSet):
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer
    permission_classes = [IsStaffOrReadOnly]

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response({'detail': 'This technology still has labs, interview questions or blogs. Move or delete them first.'}, status=400)
