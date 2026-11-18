from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from blogs.models import Blog
from courses.models import Course
from interviews.models import Question
from labs.models import Lab
from videos.models import Video
from .models import Enquiry
from .serializers import EnquirySerializer


class StatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            'courses': Course.objects.count(),
            'videos': Video.objects.count(),
            'labs': Lab.objects.count(),
            'interview_questions': Question.objects.count(),
            'blogs': Blog.objects.count(),
            'students': get_user_model().objects.filter(is_staff=False).count(),
            'enquiries': Enquiry.objects.count(),
            'unread_enquiries': Enquiry.objects.filter(is_read=False).count(),
        })


class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer

    def get_permissions(self):
        # Visitors may submit an enquiry; only staff can read/manage them.
        return [AllowAny()] if self.action == 'create' else [IsAdminUser()]

    def perform_create(self, serializer):
        serializer.save(is_read=False)
