from django.urls import path
from rest_framework.routers import SimpleRouter
from .views import EnquiryViewSet, StatsView

router = SimpleRouter()
router.register('enquiries', EnquiryViewSet, basename='enquiries')
urlpatterns = [path('dashboard/stats/', StatsView.as_view())] + router.urls
