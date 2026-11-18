from django.db import models


class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    technology = models.ForeignKey('technologies.Technology', on_delete=models.PROTECT, related_name='blogs')

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return self.title
