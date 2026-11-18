from rest_framework.routers import SimpleRouter
from .views import LabViewSet

router = SimpleRouter()
router.register('labs', LabViewSet, basename='labs')
urlpatterns = router.urls
