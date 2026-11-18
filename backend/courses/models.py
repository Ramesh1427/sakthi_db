from django.db import models


class Course(models.Model):
    category = models.CharField(max_length=80)
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    tags = models.CharField(max_length=200, blank=True, help_text='Comma separated')

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return self.name

    def tag_list(self):
        return [t.strip() for t in self.tags.split(',') if t.strip()]


class Module(models.Model):
    """A group of topics inside a course, e.g. "Python Basics" or "Loops and Functions"."""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=150)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f'{self.course.name}: {self.title}'


class Topic(models.Model):
    """One syllabus topic (e.g. "Variables") with its own video."""
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='topics')
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    video_url = models.URLField(blank=True, help_text='YouTube link. Prefer "Unlisted" videos.')
    is_free_preview = models.BooleanField(default=False, help_text='Everyone can watch this video, even without access.')

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.title
