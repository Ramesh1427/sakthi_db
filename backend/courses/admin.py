from django.contrib import admin
from .models import Course, Module, Topic


class ModuleInline(admin.TabularInline):
    model = Module
    extra = 0


class TopicInline(admin.TabularInline):
    model = Topic
    extra = 0


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'tags')
    list_filter = ('category',)
    search_fields = ('name', 'tags')
    inlines = [ModuleInline]


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    list_filter = ('course',)
    inlines = [TopicInline]
