from django.db import models


class HeroSlide(models.Model):
    """A slide in the home page hero slider, editable from the admin dashboard."""
    ART = [('db', 'Database'), ('code', 'Code editor'), ('terminal', 'Terminal')]
    title = models.CharField(max_length=150)
    text = models.CharField(max_length=300, blank=True)
    button_text = models.CharField(max_length=40, default='View courses')
    button_link = models.CharField(max_length=120, default='#courses', help_text='e.g. #courses, #videos, #contact')
    art = models.CharField(max_length=10, choices=ART, default='db', help_text='Illustration shown beside the text')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.title
