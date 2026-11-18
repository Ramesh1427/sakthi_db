from rest_framework import serializers
from .models import Question


class QuestionSerializer(serializers.ModelSerializer):
    technology_name = serializers.CharField(source='technology.name', read_only=True)

    class Meta:
        model = Question
        fields = '__all__'
