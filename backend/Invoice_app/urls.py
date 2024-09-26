from django.urls import path
from Invoice_app.views import EntityListCreateAPIView, LoginView, EntityRetrieveUpdateDeleteAPIView
from django.urls import path
from .views import ChangePasswordAPIView, ClientListCreateAPIView, ClientRetrieveUpdateDeleteAPIView, ContractListCreateAPIView, ContractRetrieveUpdateDeleteAPIView, ForgetPasswordAPIView, PaymentListCreateAPIView, PaymentRetrieveUpdateDeleteAPIView, ProjectListCreateAPIView, ProjectRetrieveUpdateDeleteAPIView, ScheduleListCreateAPIView, ScheduleRetrieveUpdateDeleteAPIView, SignUpView

urlpatterns = [
    path("login/", LoginView.as_view(), name='login'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('change-password/', ChangePasswordAPIView.as_view(), name='change-password'),
    path('forget-password/', ForgetPasswordAPIView.as_view(), name='forget-password'),
    path('entities/', EntityListCreateAPIView.as_view(), name='entity-list-create'),
    path('entities/<int:pk>/', EntityRetrieveUpdateDeleteAPIView.as_view(), name='entity-detail-update-delete'),
    path('clients/', ClientListCreateAPIView.as_view(), name='client-list-create'),
    path('clients/<int:pk>/', ClientRetrieveUpdateDeleteAPIView.as_view(), name='client-detail'),
    path('projects/', ProjectListCreateAPIView.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', ProjectRetrieveUpdateDeleteAPIView.as_view(), name='project-detail'),
    path('contracts/', ContractListCreateAPIView.as_view(), name='contract-list-create'),
    path('contracts/<int:pk>/', ContractRetrieveUpdateDeleteAPIView.as_view(), name='contract-detail'),
    path('schedule/', ScheduleListCreateAPIView.as_view(), name='schedule-list-create'),
    path('schedule/<int:pk>/', ScheduleRetrieveUpdateDeleteAPIView.as_view(), name='schedule-detail'),
    path('payment/', PaymentListCreateAPIView.as_view(), name='payment-list-create'),
    path('Payment/<int:pk>/', PaymentRetrieveUpdateDeleteAPIView.as_view(), name='Payment-detail'),
]