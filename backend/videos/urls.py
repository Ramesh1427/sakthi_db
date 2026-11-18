from rest_framework.routers import SimpleRouter
from .views import VideoViewSet

router = SimpleRouter()
router.register('videos', VideoViewSet, basename='videos')
urlpatterns = router.urls
