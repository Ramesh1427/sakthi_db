from rest_framework.routers import SimpleRouter
from .views import BlogViewSet

router = SimpleRouter()
router.register('blogs', BlogViewSet, basename='blogs')
urlpatterns = router.urls
