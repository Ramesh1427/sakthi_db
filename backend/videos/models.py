from django.db import models


class Video(models.Model):
    title = models.CharField(max_length=150)
    youtube_url = models.URLField(help_text='Full YouTube link')
    description = models.CharField(max_length=250, blank=True)

    def __str__(self):
        return self.title
