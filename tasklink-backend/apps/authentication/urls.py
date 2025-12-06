from django.urls import path
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    EmailLoginView,
    UserProfileView,
    UserProfileUpdateView,
    PasswordChangeView,
    get_current_user,
    logout_view,
    search_users
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    # Use email-based login view
    path('login/', EmailLoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='profile-update'),
    path('password/change/', PasswordChangeView.as_view(), name='password-change'),
    path('me/', get_current_user, name='current-user'),
    path('users/search/', search_users, name='search-users'),
]
