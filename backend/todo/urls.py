from django.contrib import admin
from django.urls import path, include

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from api.views import RegisterView, LoginView

schema_view = get_schema_view(
   openapi.Info(
      title="To-do API",
      default_version='v1',
      contact=openapi.Contact(email="info@alijonov.uz"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # admin
    # path("admin/", admin.site.urls),

    # api
    path("api/v1/", include("api.urls")),

    # auth
    path("auth/register/", RegisterView.as_view(), name='register'),
    path("auth/login/", LoginView.as_view(), name='token_obtain_pair'),

    # doc
    path("", schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]

