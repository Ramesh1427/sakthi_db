from rest_framework.routers import SimpleRouter
from .views import QuestionViewSet

router = SimpleRouter()
router.register('interview-questions', QuestionViewSet, basename='interview-questions')
urlpatterns = router.urls
