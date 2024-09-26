from django.urls import path
from Invoice_app.views import EntityListCreateAPIView, LoginView, EntityRetrieveUpdateDeleteAPIView
from django.urls import path
from .views import ClientListCreateAPIView, ClientRetrieveUpdateDeleteAPIView, ContractListCreateAPIView, ContractRetrieveUpdateDeleteAPIView, ProjectListCreateAPIView, ProjectRetrieveUpdateDeleteAPIView, SignUpView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path("login/", LoginView.as_view(), name='login'),
    path('entities/', EntityListCreateAPIView.as_view(), name='entity-list-create'),
    path('entities/<int:pk>/', EntityRetrieveUpdateDeleteAPIView.as_view(), name='entity-detail-update-delete'),
    path('clients/', ClientListCreateAPIView.as_view(), name='client-list-create'),
    path('clients/<int:pk>/', ClientRetrieveUpdateDeleteAPIView.as_view(), name='client-detail'),
    path('projects/', ProjectListCreateAPIView.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', ProjectRetrieveUpdateDeleteAPIView.as_view(), name='project-detail'),
    path('contracts/', ContractListCreateAPIView.as_view(), name='contract-list-create'),
    path('contracts/<int:pk>/', ContractRetrieveUpdateDeleteAPIView.as_view(), name='contract-detail'),
]
