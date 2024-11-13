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


class ProjectListCreateAPIView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.request.method == "POST":
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



# class PaymentListCreateAPIView(generics.ListCreateAPIView):
#     queryset = Payment.objects.all()
#     serializer_class = PaymentSerializer
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticated]

#     def get_permissions(self):
#         if self.request.method == "POST":
#             self.permission_classes = [IsAdminUserPermission]
#         else:
#             self.permission_classes = [IsAuthenticated]
#         return super(PaymentListCreateAPIView, self).get_permissions()

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)

#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
#         return Response(
#             {"message": "Payment created successfully", "client": serializer.data},

#             status=status.HTTP_201_CREATED,
#         )
    

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

        print("second sheet ============================================================");

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





# class ExcelDataView(APIView):
#     parser_classes = [MultiPartParser, FormParser]
        
#     def post(self, request, *args, **kwargs):
#         serializer = FileUploadSerializer(data=request.data)
#         if serializer.is_valid():
#             # Save or process the file and return its metadata
#             file_data = serializer.save()
#             return Response(file_data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
#     def get(self, request, *args, **kwargs):
#         # Path to the Excel file
#         # file_path = r"C:\Users\home\Videos\Komal Work\xlsm\1. Doncaster Unit 02 & 03_AFP_SEPT 24.xlsm"
#         file_path = os.path.join(
#                 BASE_DIR,
#                 "xlsm_file_template/1. Doncaster Unit 02 & 03_AFP_SEPT 24.xlsm",
#             )
        
#         try:
#             # Load the specific sheet into a pandas DataFrame
#             df = pd.read_excel(file_path, sheet_name='BoQ_Detailed ', header=1, engine='openpyxl')
            
#             # Remove columns with "Unnamed" and drop rows that are entirely empty
#             df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
#             df.dropna(how='all', inplace=True)
            
#             # Convert the DataFrame to JSON
#             json_data = df.to_json(orient='records')
            
#             # Return JSON data as response
#             return Response(json_data, status=status.HTTP_200_OK)
        
#         except FileNotFoundError:
#             return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
#         except ValueError as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class InvoiceMethodListCreateAPIView(generics.ListCreateAPIView):
#     queryset = InvoiceMethod.objects.all()
#     serializer_class = InvoiceMethodSerializer
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticated]

#     def get_permissions(self):
#         if self.request.method == "POST":
#             self.permission_classes = [IsAdminUserPermission]
#         else:
#             self.permission_classes = [IsAuthenticated]
#         return super(InvoiceMethodListCreateAPIView, self).get_permissions()

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
#         return Response(
#             {"message": "Invoice created successfully", "client": serializer.data},
#             status=status.HTTP_201_CREATED,
#         )


# class InvoiceMethodRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = InvoiceMethod.objects.all()
#     serializer_class = InvoiceMethodSerializer
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticated]

#     def get_permissions(self):
#         if self.request.method in ["PUT", "PATCH", "DELETE"]:
#             self.permission_classes = [IsAdminUserPermission]
#         return super(InvoiceMethodRetrieveUpdateDeleteAPIView, self).get_permissions()

#     def retrieve(self, request, *args, **kwargs):
#         contract = self.get_object()
#         serializer = self.get_serializer(contract)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def update(self, request, *args, **kwargs):
#         contract = self.get_object()
#         serializer = self.get_serializer(contract, data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_update(serializer)
#         return Response(
#             {"message": "Invoice updated successfully", "contract": serializer.data},
#             status=status.HTTP_200_OK,
#         )

#     def partial_update(self, request, *args, **kwargs):
#         contract = self.get_object()
#         serializer = self.get_serializer(contract, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         self.perform_update(serializer)
#         return Response(
#             {
#                 "message": "Invoice partially updated successfully",
#                 "contract": serializer.data,
#             },
#             status=status.HTTP_200_OK,
#         )

#     def destroy(self, request, *args, **kwargs):
#         contract = self.get_object()
#         contract.delete()
#         return Response(
#             {"message": "Invoice deleted successfully"},
#             status=status.HTTP_204_NO_CONTENT,
#         )


# class GenerateXLS(APIView):
#     def get(self, request, payment_id):
#         try:
#             payment = Payment.objects.get(id=payment_id)
#             invoice_methods = payment.Payment_BoQDetailed.all()
#         except Payment.DoesNotExist:
#             return Response(
#                 {"error": "Payment not found."}, status=status.HTTP_404_NOT_FOUND
#             )

#         # Serialize invoice methods
#         serialized_items = PaymentBoQDetailedSerializer(invoice_methods, many=True).data

#         # Calculate the account total and progress total dynamically
#         account_total = sum(float(item["account_total"]) for item in serialized_items)
#         progress_total = sum(
#             float(item["progress"]) * float(item["account_total"]) / 100
#             for item in serialized_items
#         )

#         invoice_data = {
#             "client_name": payment.client.client_name,
#             "client_address": payment.client.address,
#             "project_name": payment.project.project_name,
#             "application_number": payment.id,
#             "works_complete_date": "31 August 2024",
#             "application_date": payment.payment_sent_date,
#             "payment_date": payment.payment_notice_back_date or "N/A",
#             "account_total": account_total,
#             "progress_total": progress_total,
#             "items": serialized_items,
#         }

#         # Load and update the Excel file
#         length_of_boq_summary = len(serialized_items)
#         print("length_of_boq_summary : ", length_of_boq_summary)

#         # file_path = '/home/dell/Project-Steel Automation/SteelAutomation/backend/Invoice_app/1. Doncaster Unit 02 & 03_AFP_SEPT 24.xlsm'
#         if length_of_boq_summary < 5:
#             file_path = os.path.join(
#                 BASE_DIR,
#                 "xlsm_file_template/2. Doncaster Unit 02 & 03_AFP_SEPT 24.xlsm",
#             )

#         elif 5 <= length_of_boq_summary < 21:
#             file_path = os.path.join(
#                 BASE_DIR,
#                 "xlsm_file_template/3. Doncaster Unit 02 & 03_AFP_SEPT 24.xlsm",
#             )
#         elif length_of_boq_summary < 16:
#             file_path = os.path.join(
#                 BASE_DIR,
#                 "xlsm_file_template/4. Doncaster Unit 02 & 03_AFP_SEPT 24.xlsm",
#             )

#             # file_path = '/home/dell/Project-Steel Automation/SteelAutomation/backend/Invoice_app/4. Doncaster Unit 02 & 03_AFP_SEPT 24.xlsm'
#         else:
#             file_path = os.path.join(
#                 BASE_DIR,
#                 "xlsm_file_template/1. Doncaster Unit 02 & 03_AFP_SEPT 24.xlsm",
#             )
#         print("---------------------------------------"*4)
#         print("file path : ", file_path)
#         print("---------------------------------------"*4)

#         # Load the workbooks with VBA support
#         wb1 = openpyxl.load_workbook(file_path, keep_vba=True)
#         selected_workbook = wb1
        # Update all sheets
        # sheet = wb1["AFP Summary"]

        # # Fixed cells data
        # sheet["B2"] = "Application For Payment"
        # sheet["B3"] = "Struct Steel Engineering Ltd."
        # sheet["B4"] = "38 Farnamullan Road, Faughard, Enniskillen, United"
        # sheet["B5"] = "+44 28 6638 7001"
        # sheet["B6"] = "structsteeleng.co.uk"
        # sheet["B8"] = "Client"
        # sheet["B9"] = invoice_data["client_name"]
        # sheet["B10"] = invoice_data["client_address"]
        # sheet["B11"] = "NW10 7SJ, United Kingdom"
        # sheet["F8"] = "Project"
        # sheet["F9"] = "Application Number:"
        # sheet["F10"] = "For Works Complete to:"
        # sheet["F11"] = "Application Date:"
        # sheet["F12"] = "Payment Date:"
        # sheet["H8"] = "Doncaster Unit 02 & 03"
        # sheet["H9"] = payment.id
        # sheet["H10"] = invoice_data["works_complete_date"]
        # sheet["H11"] = invoice_data["application_date"]
        # sheet["H12"] = invoice_data["payment_date"]

        # start_row = 15  # Starting row for item data
        # for index, item in enumerate(serialized_items):
        #     row = start_row + index
        #     sheet[f"B{row}"] = index + 1  # Update 'description' field
        #     sheet[f"C{row}"] = item.get("category", "N/A")  # Update 'description' field
        #     sheet[f"D{row}"] = item.get("zone", "N/A")  # Update 'description' field
        #     sheet[f"E{row}"] = item.get(
        #         "account_total", 0
        #     )  # Update 'account_total' field
        #     sheet[f"F{row}"] = item.get("progress", 0)  # Update 'progress' field
        #     sheet[f"G{row}"] = item.get("interim", 0)  # Update 'progress' field
        #     sheet[f"H{row}"] = item.get("comment", 0)  # Update 'progress' field
        # sheet["D24"] = account_total
        # sheet["F24"] = progress_total

        # sheet2 = wb1["BoQ_Summary"]
        # start_row_sheet2 = 5  # Starting row for item data in sheet2
        # length_serilizer = len(serialized_items)
        # print("length_serilizer : ", length_serilizer)
        # for index, item in enumerate(serialized_items):
        #     row = start_row_sheet2 + index
        #     sheet2[f"B{row}"] = item.get("category", "N/A")
        #     sheet2[f"C{row}"] = item.get("zone", "N/A")
        #     sheet2[f"D{row}"] = "qty"  # Assume 'qty' field is in item
        #     sheet2[f"E{row}"] = "unit"  # Assume 'unit' field is in item
        #     sheet2[f"F{row}"] = "rate"  # Assume 'rate' field is in item
        #     sheet2[f"G{row}"] = "total"  # Assume 'total' field is in item
        #     sheet2[f"H{row}"] = "progress %"  # Update progress percentage
        #     sheet2[f"I{row}"] = (
        #         "$ progress"  # float(item.get('progress', 0)) * float(item.get('total', 0)) / 100
        #     )
        #     sheet2[f"J{row}"] = item.get("comment", "")  # Update notes if exists

        # sheet2["G9"] = "total count"
        # sheet2["H9"] = "progress count"
        # sheet2["I9"] = "$ progress count"

        # sheets_to_update = {
        #     "BoQ_Summary": {
        #         "G9": "total count",
        #         "H9": "progress count",
        #         "I9": "$ progress count",
        #         # Add more cells as needed for this sheet...
        #     }
        # }

        # start_row_sheet2 = 5
        # sheet3 = wb1["BoQ_Detailed "]

        # print("serialized_items  : ", len(serialized_items))
        # for index, item in enumerate(serialized_items):
        #     row = start_row_sheet2 + index + 1
        #     sheet3[f"B{row}"] = "item_value"
        #     sheet3[f"C{row}"] = "category"
        #     sheet3[f"D{row}"] = "type"
        #     sheet3[f"E{row}"] = "zone"
        #     sheet3[f"F{row}"] = "ACW_value"
        #     sheet3[f"G{row}"] = "PCS_value"
        #     sheet3[f"H{row}"] = "QTY_value"
        #     sheet3[f"I{row}"] = "UNIT_value"
        #     sheet3[f"J{row}"] = "RATE_value"
        #     sheet3[f"K{row}"] = "total_value"

        # if selected_workbook:
        #     print(f"Selected workbook: {selected_workbook}")
        # else:
        #     print("No workbook selected based on the length criteria.")

        # for sheet_name, updates in sheets_to_update.items():

        #     if sheet_name in selected_workbook.sheetnames:
        #         sheet = selected_workbook[sheet_name]
        #         for cell, value in updates.items():
        #             sheet[cell] = value
        #     else:
        #         print(f"Sheet '{sheet_name}' not found in the selected workbook.")

            # Select the 'Variation Register' sheet
        # sheet4 = wb1["Variation Register"]
        # # Update specific cells
        # sheet4["C8"] = "not38 Farnamullan Road, Faughard, Enniskillen, United es"
        # sheet4["C10"] = "+44 28 6638 7001"
        # sheet4["C11"] = "structsteeleng.co.uk"

        # sheet4["I3"] = "Client"
        # sheet4["I4"] = "Variation Account Total"
        # sheet4["I5"] = "Agreed Value"
        # sheet4["I6"] = "To be Agreed"
        # sheet4["I7"] = "Progress Total"
        # sheet4["I8"] = "Agreed %"
        # sheet4["I9"] = "No. of Variations"
        # sheet4["I10"] = "No. of Variations Agreed"
        # sheet4["I11"] = "Variations to be Priced"

        # sheet4["K3"] = "Fit Out (UK) Ltd"
        # sheet4["K4"] = "£5,000.00"
        # sheet4["K5"] = "£0.00"
        # sheet4["K6"] = "£5,000.00"
        # sheet4["K7"] = "£0.00"
        # sheet4["K8"] = "0.00%"
        # sheet4["K9"] = "2 no."
        # sheet4["K10"] = "1 no."
        # sheet4["K11"] = "1 no."

        # sheet4["C14"] = "1"
        # sheet4["D14"] = "Intumescent Paint Off Site Application"
        # sheet4["E14"] = "08-08-2024"
        # sheet4["F14"] = "£0.00"
        # sheet4["I14"] = "Agreed"
        # sheet4["J14"] = "19-08-2024"
        # sheet4["L14"] = "100%"
        # sheet4["M14"] = "£0.00"
        # sheet4["N14"] = "In line with S/C % Complete"

        # # Define the new file path to save the updated Excel file in the media directory
        # output_dir = os.path.join(MEDIA_ROOT, "output_files")
        # os.makedirs(output_dir, exist_ok=True)
        # new_file_path = os.path.join(output_dir, "updated_invoice_template.xlsm")
        # wb1.save(new_file_path)

        # # Generate the file URL using MEDIA_URL
        # file_url = request.build_absolute_uri(
        #     f"{MEDIA_URL}output_files/updated_invoice_template.xlsm"
        # )

        # # Return the file URL as a JSON response
        # return JsonResponse({"file_url": file_url}, status=status.HTTP_200_OK)