from rest_framework.routers import SimpleRouter
from .views import HeroSlideViewSet

router = SimpleRouter()
router.register('hero-slides', HeroSlideViewSet, basename='hero-slides')
urlpatterns = router.urls
