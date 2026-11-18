from rest_framework import viewsets
from accounts.permissions import IsStaffOrReadOnly
from .models import Question
from .serializers import QuestionSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.select_related('technology')
    serializer_class = QuestionSerializer
    permission_classes = [IsStaffOrReadOnly]
