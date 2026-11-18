from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('courses.urls')),
    path('api/', include('videos.urls')),
    path('api/', include('labs.urls')),
    path('api/', include('interviews.urls')),
    path('api/', include('blogs.urls')),
    path('api/', include('dashboard.urls')),
    path('api/', include('enrollments.urls')),
    path('api/', include('home.urls')),
    path('api/', include('technologies.urls')),
]
