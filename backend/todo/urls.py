from django.contrib import admin
from django.urls import path, include

from api.views import RegisterViewSet, LoginView

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/v1/", include("api.urls")),

    path("auth/register/", RegisterViewSet.as_view(), name='register'),
    path("auth/login/", LoginView.as_view(), name='token_obtain_pair'),
]

