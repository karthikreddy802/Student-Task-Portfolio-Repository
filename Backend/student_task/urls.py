from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TaskViewSet, SubmissionViewSet, ProfileViewSet, NotificationViewSet, 
    PortfolioViewSet, UserViewSet, RegisterView, GeneratePortfolioView, PublicPortfolioView,
    SuggestTaskDescriptionView, PasswordResetView
)

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'submissions', SubmissionViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'portfolios', PortfolioViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('generate-portfolio/', GeneratePortfolioView.as_view(), name='generate-portfolio'),
    path('public-portfolio/<str:username>/', PublicPortfolioView.as_view(), name='public-portfolio'),
    path('suggest-task-description/', SuggestTaskDescriptionView.as_view(), name='suggest-task-description'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
]
