import json
import os
import openpyxl
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from steelautomation.settings import BASE_DIR, MEDIA_ROOT, MEDIA_URL
from .serializers import *
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import EntitySerializer, ClientSerializer
from .permissions import IsAdminUserPermission
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .models import Payment
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Payment
import openpyxl
from rest_framework import viewsets
import pandas as pd 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .serializers import FileUploadSerializer
from openpyxl import load_workbook
from datetime import datetime
from django.db.models import Sum, F, ExpressionWrapper, DecimalField
from decimal import Decimal
from collections import defaultdict


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        token = serializer.validated_data["token"]

        # Extract only the 'role' field from the user data
        role = user.role if hasattr(user, "role") else None

        return Response(
            {
                "message": "Login successful",
                "token": token,
                "status": status.HTTP_200_OK,
                "role": role,
            },
            status=status.HTTP_200_OK,
        )


class SignUpView(generics.CreateAPIView):
    serializer_class = SignUpSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                "message": "User created successfully",
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class ChangePasswordAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.get(email=serializer.validated_data["email"])
        user.set_password(serializer.validated_data["new_password"])
        user.save()
    
        return Response(
            {"message": "Password changed successfully."}, status=status.HTTP_200_OK
        )


class ForgetPasswordAPIView(APIView):
    def post(self, request):
        serializer = ForgetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.get(email=serializer.validated_data["email"])
        user.set_password(serializer.validated_data["new_password"])
        user.save()

        return Response(
            {"message": "Password changed successfully."}, status=status.HTTP_200_OK
        )


class EntityListCreateAPIView(generics.ListCreateAPIView):
    queryset = Entity.objects.all()
    serializer_class = EntitySerializer
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.request.method == "POST":
            self.permission_classes = [IsAdminUserPermission]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(EntityListCreateAPIView, self).get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "Entity created successfully", "entity": serializer.data},
            status=status.HTTP_201_CREATED,
        )



class EntityRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entity.objects.all()
    serializer_class = EntitySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            self.permission_classes = [IsAdminUserPermission]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(EntityRetrieveUpdateDeleteAPIView, self).get_permissions()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {
                "message": (
                    "Entity updated successfully"
                    if not partial
                    else "Entity partially updated successfully"
                ),
                "entity": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"message": "Entity deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


class ClientListCreateAPIView(generics.ListCreateAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == "POST":
            self.permission_classes = [IsAdminUserPermission]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(ClientListCreateAPIView, self).get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "Client created successfully", "client": serializer.data},
            status=status.HTTP_201_CREATED,
        )


class ClientRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
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
        return Response(
            {"message": "Client updated successfully", "client": serializer.data},
            status=status.HTTP_200_OK,
        )

    def partial_update(self, request, *args, **kwargs):
        client = self.get_object()
        serializer = self.get_serializer(client, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {
                "message": "Client partially updated successfully",
                "client": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        client = self.get_object()
        client.delete()
        return Response(
            {"message": "Client deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )



def create_folders(base_path, structure):
    for folder, subfolders in structure.items():
        current_path = os.path.join(base_path, folder)
        os.makedirs(current_path, exist_ok=True)
        create_folders(current_path, subfolders)

class ProjectListCreateAPIView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.request.method == "POST":
            self.permission_classes = [IsAdminUserPermission]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):

        response = super().create(request, *args, **kwargs)

        project_id = response.data['id']
        project_name = response.data['project_name']

        folder_name = f"{project_id}_{project_name}"

        base_path = f"/home/dell/Videos/" 

        folder_structure = {
            folder_name: { 
                '1. Tender': {
                    'Quote': {},
                    'REV A UNIT 4': {},
                    'Structural Steelwork': {
                        '18-04-2024 - Unit 2': {},
                        '18-04-2024 - Unit 3': {}
                    },
                    'Tender Drawings': {
                        'Premier Park Doncaster - Units 2 & 3 [Structural Steelwork Tender Enquiry]': {}
                    }
                },
                '2. Sub-Contract': {},
                '3. Variations': {
                    'VO1': {
                        'Appendices': {},
                        'Final Lists': {},
                        'Internal': {}
                    },
                    'VO2': {
                        'Appendices': {},
                        'Final Lists': {}
                    },
                    'VO3': {
                        'Appendices': {},
                        'Final Lists': {}
                    }
                },
                '4. Payment Applications': {
                    '1. Sept 24': {
                        'Appendices': {}
                    },
                    '2. October 24': {
                        'Appendices': {}
                    }
                },
                '5. Reporting': {},
                '6. Sub_Let Packages': {},
                '7. Misc': {}
            }
        }

        create_folders(base_path, folder_structure)

        return response

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class ProjectRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
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
        return Response(
            {"message": "Project updated successfully", "project": serializer.data},
            status=status.HTTP_200_OK,
        )

    def partial_update(self, request, *args, **kwargs):
        project = self.get_object()
        serializer = self.get_serializer(project, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {
                "message": "Project partially updated successfully",
                "project": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        project = self.get_object()
        project.delete()
        return Response(
            {"message": "Project deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


class ContractListCreateAPIView(generics.ListCreateAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.request.method == "POST":
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
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
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
        return Response(
            {"message": "Contract updated successfully", "contract": serializer.data},
            status=status.HTTP_200_OK,
        )

    def partial_update(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = self.get_serializer(contract, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {
                "message": "Contract partially updated successfully",
                "contract": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        contract = self.get_object()
        contract.delete()
        return Response(
            {"message": "Contract deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


class ScheduleListCreateAPIView(generics.ListCreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == "POST":
            self.permission_classes = [IsAdminUserPermission]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(ScheduleListCreateAPIView, self).get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "Schedule created successfully", "client": serializer.data},
            status=status.HTTP_201_CREATED,
        )


class ScheduleRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
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
        return Response(
            {"message": "Schedule updated successfully", "contract": serializer.data},
            status=status.HTTP_200_OK,
        )

    def partial_update(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = self.get_serializer(contract, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {
                "message": "Schedule partially updated successfully",
                "contract": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        contract = self.get_object()
        contract.delete()
        return Response(
            {"message": "Schedule deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


class PaymentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == "POST":
            self.permission_classes = [IsAdminUserPermission]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(PaymentListCreateAPIView, self).get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

    
        original_workbook_path = "/home/dell/Videos/vivek work/SteelAutomation/backend/xlsm_file_template/template1.xlsm"  
        if not os.path.exists(original_workbook_path):
            return Response(
                {"error": "Original workbook not found."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        wb = load_workbook(original_workbook_path)
        sheet_name = "BoQ_Detailed " 
        if sheet_name not in wb.sheetnames:
            return Response(
                {"error": f"Sheet '{sheet_name}' not found in the workbook."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        sheet = wb[sheet_name]
        start_row = 5  
        row = start_row + 1  
        print("----------"*20, serializer.data)

        boq_details = serializer.data.get("Payment_BoQDetailed", [])

        final_total = 0

        for item in boq_details:
  
            final_total += float(item['total'])

        print("Final Total:", final_total)

        if not boq_details:
            return Response(
                {"error": "No BoQ details found in the response."},
                status=status.HTTP_400_BAD_REQUEST
            )

        start_row = 4
        for index, item in enumerate(boq_details):
            row = start_row + index + 1

            sheet[f"B{row}"] = item.get("item", "")
            sheet[f"C{row}"] = item.get("category_name", "")
            sheet[f"D{row}"] = item.get("type_name", "")
            sheet[f"E{row}"] = item.get("zone_name", "")
            sheet[f"F{row}"] = item.get("acw", "",)
            sheet[f"G{row}"] = item.get("pcs", "")
            sheet[f"H{row}"] = item.get("qty", "")
            sheet[f"I{row}"] = item.get("unit_name", "")
            sheet[f"J{row}"] = item.get("rate", "")
            sheet[f"K{row}"] = item.get("total", "") 
        sheet[f"K45"] = final_total

        print("second sheet ============================================================")

        sheet_name2 = 'BoQ_Summary' 
        if sheet_name2 not in wb.sheetnames:
            return Response(
                {"error": f"Sheet '{sheet_name2}' not found in the workbook."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        else:
            print("BOQ Summary sheet is find------------------------" )
        
        result = PaymentBoQDetailed.objects.values('category__name', 'zone__name')\
                                        .annotate(
                                            QTY=Sum('qty'),
                                            RATE=Sum('rate'),
                                            TOTAL=Sum(F('rate') * F('qty')),
                                            total_amount=Sum('total')
                                        )

        BOQ_Summary =[]

        for item in result:
            entry = {
                'Category_Name': item['category__name'],
                'Zone_Name' : item['zone__name'],
                'Total_Quantity': item['QTY'],
                'Total_Rate': item['RATE'],
                'Total_Amount': item['total_amount']
            }

            BOQ_Summary.append(entry)

        print("BOQ_Summary=====>>>>",BOQ_Summary)
 

        sheet = wb[sheet_name2]  
        start_row = 5
        for index, item in enumerate(BOQ_Summary):
            row = start_row + index + 1

            sheet[f"B{row}"] = item.get("Category_Name", "")
            sheet[f"C{row}"] = item.get("Zone_Name", "")
            sheet[f"D{row}"] = item.get("Total_Quantity", "")
            sheet[f"F{row}"] = item.get("Total_Rate", "")
            sheet[f"G{row}"] = item.get("Total_Amount", "",)
        

        print("Third sheet ============================================================")
        
        sheet_name3 = 'AFP Summary' 
        if sheet_name3 not in wb.sheetnames:
            return Response(
                {"error": f"Sheet '{sheet_name2}' not found in the workbook."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        else:
            print("AFP Summary sheet is find------------------------" )
        
        total_amount_by_category = defaultdict(list)

        for item in BOQ_Summary:
            total_amount_by_category[item['Category_Name']].append(item['Total_Amount'])

        final_result_category_total = []

        for category, amounts in total_amount_by_category.items():
            detailed_amounts = ' + '.join([str(amount) for amount in amounts])
            total_amount = round(sum(amounts), 2)  
            final_result_category_total.append({"category_name": category, "total_amount": total_amount})

        print("final_result_category_total=======>>", final_result_category_total)

        sheet = wb[sheet_name3]  
        start_row = 14
        for index, item in enumerate(final_result_category_total):
            row = start_row + index + 1

            sheet[f"C{row}"] = item.get("category_name", "")
            sheet[f"E{row}"] = item.get("total_amount", "")

    

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        new_workbook_path = f"/home/dell/Videos/vivek work/SteelAutomation/backend/xlsm_file_template/payment_{timestamp}.xlsm"  # Replace with your save path

        wb.save(new_workbook_path)
        wb.close()
        file_url = f"/media/payment_{timestamp}.xlsm"

        return Response(
            {
                "message": "Payment created successfully and data stored in Excel",
                "client": serializer.data,
                "file_url": file_url
            },
            status=status.HTTP_201_CREATED,
        )


class PaymentRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
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
        return Response(
            {"message": "Payment updated successfully", "contract": serializer.data},
            status=status.HTTP_200_OK,
        )

    def partial_update(self, request, *args, **kwargs):
        contract = self.get_object()
        serializer = self.get_serializer(contract, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {
                "message": "Payment partially updated successfully",
                "contract": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        contract = self.get_object()
        contract.delete()
        return Response(
            {"message": "Payment deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


class ItemCategoryViewSet(viewsets.ModelViewSet):
    queryset = ItemCategory.objects.all()
    serializer_class = ItemCategorySerializer


class ItemTypeViewSet(viewsets.ModelViewSet):
    queryset = ItemType.objects.all()
    serializer_class = ItemTypeSerializer


class ItemZoneViewSet(viewsets.ModelViewSet):
    queryset = ItemZone.objects.all()
    serializer_class = ItemZoneSerializer



class ItemUnitViewSet(viewsets.ModelViewSet):
    queryset = ItemUnit.objects.all()
    serializer_class = ItemUnitSerializer


class PaymentBoQDetailedListCreateAPIView(generics.ListCreateAPIView):
    queryset = PaymentBoQDetailed.objects.select_related('unit', 'category', 'type', 'zone')
    serializer_class = PaymentBoQDetailedSerializer
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.request.method == "POST":
            self.permission_classes = [IsAdminUserPermission]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        # Validate the incoming data using the serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Return a custom success message upon successful creation
        return Response(
            {"message": "BoQ Detail created successfully", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )

class ExcelDataView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    uploaded_file_path = None  # Class attribute to store the file path

    def post(self, request, *args, **kwargs):
        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Get the uploaded file
                uploaded_file = serializer.validated_data['file']

                # Define the directory and file path
                upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
                os.makedirs(upload_dir, exist_ok=True)  # Create the 'uploads' directory if it doesn't exist
                file_path = os.path.join(upload_dir, uploaded_file.name)

                # Save the file to the server
                with open(file_path, 'wb+') as destination:
                    for chunk in uploaded_file.chunks():
                        destination.write(chunk)

                # Store the file path in a class attribute for access in the get method
                ExcelDataView.uploaded_file_path = file_path

                # Read and process the Excel file
                df = pd.read_excel(file_path, sheet_name='BoQ_Detailed ', header=1, engine='openpyxl')
                df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
                df.dropna(how='all', inplace=True)

                # Filter out rows where specific columns are null
                required_columns = ['Cat', 'Type', 'Zone', 'Unit']
                df = df.dropna(subset=required_columns, how='any')  # Drop rows with null values in required columns

                # Convert the DataFrame to JSON and parse it for correct format
                json_data = df.to_json(orient='records')
                json_data_parsed = json.loads(json_data)

                # Replace 'Cat', 'Type', 'Zone', 'Unit' values with IDs from database
                item_category_map = {name: id for id, name in ItemCategory.objects.values_list('id', 'name')}
                item_type_map = {name: id for id, name in ItemType.objects.values_list('id', 'name')}
                item_zone_map = {name: id for id, name in ItemZone.objects.values_list('id', 'name')}
                item_unit_map = {name: id for id, name in ItemUnit.objects.values_list('id', 'name')}

                for data in json_data_parsed:
                    data['Cat'] = item_category_map.get(data['Cat'], None)
                    data['Type'] = item_type_map.get(data['Type'], None)
                    data['Zone'] = item_zone_map.get(data['Zone'], None)
                    data['Unit'] = item_unit_map.get(data['Unit'], None)

                return Response({"message": "File uploaded successfully", "data": json_data_parsed}, status=status.HTTP_201_CREATED)

            except FileNotFoundError:
                return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
            except ValueError as e:
                return Response({"error": f"Value error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


