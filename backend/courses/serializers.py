from rest_framework import serializers
from .models import Course


class CourseSerializer(serializers.ModelSerializer):
    """
    Everyone sees module and topic titles. A topic's `video_url` is included only when the
    viewer is staff, has been granted access to the course, or the topic is a free preview.
    """
    tag_list = serializers.ListField(read_only=True)
    has_access = serializers.SerializerMethodField()
    modules = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'category', 'name', 'description', 'tags', 'tag_list', 'has_access', 'modules']

    def _full_access(self, course):
        ctx = self.context
        return bool(ctx.get('is_staff') or course.pk in ctx.get('access_ids', ()))

    def get_has_access(self, course):
        return self._full_access(course)

    def get_modules(self, course):
        full = self._full_access(course)
        return [{
            'id': m.id, 'title': m.title,
            'topics': [{
                'id': t.id, 'title': t.title,
                'is_free_preview': t.is_free_preview,
                'has_video': bool(t.video_url),
                'video_url': (t.video_url or None) if (full or t.is_free_preview) else None,
            } for t in m.topics.all()],
        } for m in course.modules.all()]
