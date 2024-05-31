from api.views import NFTViewSet, OwnershipViewSet
from django.urls import include, path
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'nft', NFTViewSet, basename="nft")
router.register(r'ownership', OwnershipViewSet, basename="ownership")
# router.register(r'upload_drawings', CreateDrawingsViewSet, basename="upload_drawings")

urlpatterns = [
    path('', include(router.urls)),
]
