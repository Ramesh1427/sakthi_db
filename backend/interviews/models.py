from django.db import models


class Question(models.Model):
    question = models.CharField(max_length=300)
    answer = models.TextField()
    technology = models.ForeignKey('technologies.Technology', on_delete=models.PROTECT, related_name='questions')

    def __str__(self):
        return self.question
