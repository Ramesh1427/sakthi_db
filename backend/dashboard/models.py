from django.db import models


class Enquiry(models.Model):
    """Message sent from the public website's enquiry form."""
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    course = models.CharField(max_length=150, blank=True)
    message = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created']
        verbose_name_plural = 'Enquiries'

    def __str__(self):
        return f'{self.name} ({self.course or "general"})'
