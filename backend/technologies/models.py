from django.db import models


class Technology(models.Model):
    """A database/technology used to group labs, interview Q&A and blogs (PostgreSQL, Oracle, MySQL...)."""
    name = models.CharField(max_length=60, unique=True)
    order = models.PositiveIntegerField(default=0, help_text='Smaller numbers first. The first one is the default tab on the website.')

    class Meta:
        ordering = ['order', 'id']
        verbose_name_plural = 'Technologies'

    def __str__(self):
        return self.name
