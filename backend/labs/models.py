from django.db import models


class Lab(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    technology = models.ForeignKey('technologies.Technology', on_delete=models.PROTECT, related_name='labs')

    def __str__(self):
        return self.title
