from collections import defaultdict

from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from courses.models import Course
from .models import Enrollment

User = get_user_model()


class StudentViewSet(viewsets.ViewSet):
    """Admin-only: list students, grant/revoke course access, delete a student."""
    permission_classes = [IsAdminUser]

    def list(self, request):
        granted = defaultdict(list)
        for user_id, course_id in Enrollment.objects.values_list('user_id', 'course_id'):
            granted[user_id].append(course_id)
        students = User.objects.filter(is_staff=False).order_by('-date_joined')
        return Response([{
            'id': u.id, 'username': u.get_username(), 'email': u.email,
            'joined': u.date_joined, 'course_ids': sorted(granted[u.id]),
        } for u in students])

    def destroy(self, request, pk=None):
        get_object_or_404(User, pk=pk, is_staff=False).delete()
        return Response(status=204)

    @action(detail=True, methods=['put'])
    def access(self, request, pk=None):
        """Body: {"course_ids": [1, 2]} sets exactly which courses this student can watch."""
        user = get_object_or_404(User, pk=pk, is_staff=False)
        ids = request.data.get('course_ids')
        if not isinstance(ids, list) or not all(isinstance(i, int) for i in ids):
            return Response({'detail': 'course_ids must be a list of numbers.'}, status=400)
        valid = set(Course.objects.filter(pk__in=ids).values_list('pk', flat=True))
        with transaction.atomic():
            Enrollment.objects.filter(user=user).exclude(course_id__in=valid).delete()
            for cid in valid:
                Enrollment.objects.get_or_create(user=user, course_id=cid)
        return Response({'course_ids': sorted(valid)})
