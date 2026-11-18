from django.contrib import admin
from .models import Enquiry


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'course', 'is_read', 'created')
    list_filter = ('is_read',)
