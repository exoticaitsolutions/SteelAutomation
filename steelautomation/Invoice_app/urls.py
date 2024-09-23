from django.urls import path
from Invoice_app.views import EntityListCreateAPIView, LoginView, EntityRetrieveUpdateDeleteAPIView

urlpatterns = [
    path("Login/", LoginView.as_view(), name='login'),
    path('entities/', EntityListCreateAPIView.as_view(), name='entity-list-create'),
    path('entities/<int:pk>/', EntityRetrieveUpdateDeleteAPIView.as_view(), name='entity-detail-update-delete'),
]