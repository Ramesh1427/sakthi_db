from rest_framework import serializers
from .models import Blog


class BlogSerializer(serializers.ModelSerializer):
    technology_name = serializers.CharField(source='technology.name', read_only=True)

    class Meta:
        model = Blog
        fields = '__all__'
