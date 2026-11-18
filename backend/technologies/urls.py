from rest_framework.routers import SimpleRouter
from .views import TechnologyViewSet

router = SimpleRouter()
router.register('technologies', TechnologyViewSet, basename='technologies')
urlpatterns = router.urls
