from audioop import reverse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import ChangePasswordSerializer, ContractSerializer, ForgetPasswordSerializer, InvoiceMethodSerializer, LoginSerializer, PaymentSerializer, ProjectSerializer, ScheduleSerializer, SignUpSerializer, UserSerializer
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Client, Contract, Entity, InvoiceMethod, Payment, Project, Schedule, User
from .serializers import EntitySerializer, ClientSerializer
from .permissions import IsAdminUserPermission
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated # type: ignore
from django.http import JsonResponse, Http404
from django.views.static import serve
from django.conf import settings
from django.shortcuts import render
from .models import Payment
from .serializers import InvoiceMethodSerializer
import pdfkit
from django.urls import reverse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.template.loader import render_to_string
from .models import Payment, InvoiceMethod
from .serializers import InvoiceMethodSerializer
import pdfkit
from django.http import HttpResponse
from jinja2 import Environment, FileSystemLoader
from django.http import JsonResponse 


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        token = serializer.validated_data['token']

        # Extract only the 'role' field from the user data
        role = user.role if hasattr(user, 'role') else None

        return Response({
            'message': 'Login successful',
            'token': token,
            'status': status.HTTP_200_OK,
            'role': role
        }, status=status.HTTP_200_OK)


class SignUpView(generics.CreateAPIView):
    serializer_class = SignUpSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            'message': 'User created successfully',
            'user': {
                'username': user.username,
                'email': user.email,
                'role': user.role,
            }
        }, status=status.HTTP_201_CREATED)
    

class ChangePasswordAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.get(email=serializer.validated_data['email'])
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)


class ForgetPasswordAPIView(APIView):
    def post(self, request):
        serializer = ForgetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.get(email=serializer.validated_data['email'])
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)


class EntityListCreateAPIView(generics.ListCreateAPIView):
    queryset = Entity.objects.all()
    serializer_class = EntitySerializer
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAdminUserPermission]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(EntityListCreateAPIView, self).get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            'message': 'Entity created successfully',
            'entity': serializer.data
        }, status=status.HTTP_201_CREATED)


class EntityRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entity.objects.all()
    serializer_class = EntitySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsAdminUserPermission]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(EntityRetrieveUpdateDeleteAPIView, self).get_permissions()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'message': 'Entity updated successfully' if not partial else 'Entity partially updated successfully',
            'entity': serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            'message': 'Entity deleted successfully' 
        }, status=status.HTTP_204_NO_CONTENT)


class ClientListCreateAPIView(generics.ListCreateAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAdminUserPermission]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(ClientListCreateAPIView, self).get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            'message': 'Client created successfully',
            'client': serializer.data
        }, status=status.HTTP_201_CREATED)


class ClientRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]  

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsAdminUserPermission]
        return super(ClientRetrieveUpdateDeleteAPIView, self).get_permissions()

    def retrieve(self, request, *args, **kwargs):
        client = self.get_object()
        serializer = self.get_serializer(client)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        client = self.get_object()
        serializer = self.get_serializer(client, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'message': 'Client updated successfully',
            'client': serializer.data
        }, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        client = self.get_object()
        serializer = self.get_serializer(client, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'message': 'Client partially updated successfully',
            'client': serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        client = self.get_object()
        client.delete()
        return Response({
            'message': 'Client deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


class ProjectListCreateAPIView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAdminUserPermission]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(ProjectListCreateAPIView, self).get_permissions()

    def create(self, request, *args, **kwargs):
        return super(ProjectListCreateAPIView, self).create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        return super(ProjectListCreateAPIView, self).list(request, *args, **kwargs)


class ProjectRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsAdminUserPermission]
        return super(ProjectRetrieveUpdateDeleteAPIView, self).get_permissions()

    def retrieve(self, request, *args, **kwargs):
        project = self.get_object()
        serializer = self.get_serializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        project = self.get_object()
        serializer = self.get_serializer(project, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'message': 'Project updated successfully',
            'project': serializer.data
        }, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        project = self.get_object()
        serializer = self.get_serializer(project, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'message': 'Project partially updated successfully',
            'project': serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        project = self.get_object()
        project.delete()
        return Response({
            'message': 'Project deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


class ContractListCreateAPIView(generics.ListCreateAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAdminUserPermission]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(ContractListCreateAPIView, self).get_permissions()

    def list(self, request, *args, **kwargs):
        return super(ContractListCreateAPIView, self).list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super(ContractListCreateAPIView, self).create(request, *args, **kwargs)


class ContractRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsAdminUserPermission]
        return super(ContractRetrieveUpdateDeleteAPIView, self).get_permissions()

    def retrieve(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = self.get_serializer(contract)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = self.get_serializer(contract, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'message': 'Contract updated successfully',
            'contract': serializer.data
        }, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = self.get_serializer(contract, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'message': 'Contract partially updated successfully',
            'contract': serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        contract = self.get_object()
        contract.delete()
        return Response({
            'message': 'Contract deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


class ScheduleListCreateAPIView(generics.ListCreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAdminUserPermission]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(ScheduleListCreateAPIView, self).get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            'message': 'Schedule created successfully',
            'client': serializer.data
        }, status=status.HTTP_201_CREATED)
    

class ScheduleRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsAdminUserPermission]
        return super(ScheduleRetrieveUpdateDeleteAPIView, self).get_permissions()

    def retrieve(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = self.get_serializer(contract)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = self.get_serializer(contract, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'message': 'Schedule updated successfully',
            'contract': serializer.data
        }, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = self.get_serializer(contract, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'message': 'Schedule partially updated successfully',
            'contract': serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        contract = self.get_object()
        contract.delete()
        return Response({
            'message': 'Schedule deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


class PaymentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAdminUserPermission]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(PaymentListCreateAPIView, self).get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            'message': 'Payment created successfully',
            'client': serializer.data
        }, status=status.HTTP_201_CREATED)
    

class PaymentRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsAdminUserPermission]
        return super(PaymentRetrieveUpdateDeleteAPIView, self).get_permissions()

    def retrieve(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = self.get_serializer(contract)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = self.get_serializer(contract, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'message': 'Payment updated successfully',
            'contract': serializer.data
        }, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = self.get_serializer(contract, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'message': 'Payment partially updated successfully',
            'contract': serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        contract = self.get_object()
        contract.delete()
        return Response({
            'message': 'Payment deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
    

class InvoiceMethodListCreateAPIView(generics.ListCreateAPIView):
    queryset = InvoiceMethod.objects.all()
    serializer_class = InvoiceMethodSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAdminUserPermission]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(InvoiceMethodListCreateAPIView, self).get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            'message': 'Invoice created successfully',
            'client': serializer.data
        }, status=status.HTTP_201_CREATED)
    

class InvoiceMethodRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InvoiceMethod.objects.all()
    serializer_class = InvoiceMethodSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsAdminUserPermission]
        return super(InvoiceMethodRetrieveUpdateDeleteAPIView, self).get_permissions()

    def retrieve(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = self.get_serializer(contract)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = self.get_serializer(contract, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'message': 'Invoice updated successfully',
            'contract': serializer.data
        }, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = self.get_serializer(contract, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'message': 'Invoice partially updated successfully',
            'contract': serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        contract = self.get_object()
        contract.delete()
        return Response({
            'message': 'Invoice deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
    

class GenerateInvoicePDF(APIView):
    def get(self, request, payment_id):
        try:
            payment = Payment.objects.get(id=payment_id)
            invoice_methods = payment.invoice_methods.all()
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Serialize invoice methods
        serialized_items = InvoiceMethodSerializer(invoice_methods, many=True).data

        # Calculate the account total and progress total dynamically
        account_total = sum(float(item['account_total']) for item in serialized_items)
        progress_total = sum(float(item['progress']) * float(item['account_total']) / 100 for item in serialized_items)

        invoice_data = {
            "client_name": payment.client.client_name,
            "client_address": payment.client.address,
            "project_name": payment.project.project_name,
            "application_number": payment.id,
            "works_complete_date": "31 August 2024",
            "application_date": payment.payment_sent_date,
            "payment_date": payment.payment_notice_back_date or "N/A",
            "account_total": account_total,
            "progress_total": progress_total,
            "items": serialized_items
        }

        # Load and render the Jinja2 template
        template_dir = '/home/dell/Steel-Automation/SteelAutomation/backend/Invoice_app/templates'
        env = Environment(loader=FileSystemLoader(template_dir))
        template = env.get_template('Invoice.html')

        html_content = template.render(invoice_data)

        # Generate PDF from the rendered HTML
        pdfkit_config = pdfkit.configuration(wkhtmltopdf='/usr/bin/wkhtmltopdf')
        output_filename = f'invoice_{payment_id}.pdf'
        output_path = f'/home/dell/Steel-Automation/SteelAutomation/backend/Invoice_app/pdf_files/{output_filename}'

        try:
            pdfkit.from_string(html_content, output_path, configuration=pdfkit_config)

            # Construct the URL for the generated PDF
            pdf_url = request.build_absolute_uri(reverse('generated_invoice_pdf', kwargs={'filename': output_filename}))
            return JsonResponse({'pdf_url': pdf_url}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def serve_pdf(request, filename):
    try:
        return serve(request, filename, document_root=f"{settings.BASE_DIR}/Invoice_app/pdf_files/")
    except FileNotFoundError:
        raise Http404("PDF not found.")