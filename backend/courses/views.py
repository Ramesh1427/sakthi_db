from django.core.exceptions import ValidationError
from django.core.validators import URLValidator
from django.db import transaction
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsStaffOrReadOnly
from enrollments.models import Enrollment
from .models import Course, Module, Topic
from .serializers import CourseSerializer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.prefetch_related('modules__topics')
    serializer_class = CourseSerializer
    permission_classes = [IsStaffOrReadOnly]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        user = self.request.user
        authed = user.is_authenticated
        ctx['is_staff'] = bool(authed and user.is_staff)
        ctx['access_ids'] = set(Enrollment.objects.filter(user=user).values_list('course_id', flat=True)) if authed else set()
        return ctx

    @action(detail=True, methods=['put'], url_path='curriculum')
    def curriculum(self, request, pk=None):
        """Replace the whole syllabus: {"modules": [{"title", "topics": [{"title", "video_url", "is_free_preview"}]}]}"""
        course = self.get_object()
        mods = request.data.get('modules')
        if not isinstance(mods, list):
            return Response({'detail': 'modules must be a list.'}, status=400)
        check_url = URLValidator(schemes=['http', 'https'])
        clean = []
        for mi, m in enumerate(mods, 1):
            title = str(m.get('title', '')).strip() if isinstance(m, dict) else ''
            if not title:
                return Response({'detail': f'Module {mi} needs a title.'}, status=400)
            topics = []
            for t in m.get('topics') or []:
                ttl = str(t.get('title', '')).strip() if isinstance(t, dict) else ''
                if not ttl:
                    return Response({'detail': f'Every topic in "{title}" needs a title.'}, status=400)
                url = str(t.get('video_url') or '').strip()
                if url:
                    try:
                        check_url(url)
                    except ValidationError:
                        return Response({'detail': f'The video link for "{ttl}" is not a valid URL.'}, status=400)
                topics.append((ttl, url, bool(t.get('is_free_preview'))))
            clean.append((title, topics))
        with transaction.atomic():
            course.modules.all().delete()
            for mo, (title, topics) in enumerate(clean):
                module = Module.objects.create(course=course, title=title, order=mo)
                Topic.objects.bulk_create([
                    Topic(module=module, title=t, video_url=u, is_free_preview=f, order=to)
                    for to, (t, u, f) in enumerate(topics)])
        fresh = self.get_queryset().get(pk=course.pk)
        return Response(CourseSerializer(fresh, context=self.get_serializer_context()).data)
