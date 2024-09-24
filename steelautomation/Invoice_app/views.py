from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import ContractSerializer, LoginSerializer, ProjectSerializer, SignUpSerializer, UserSerializer
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Client, Contract, Entity, Project
from .serializers import EntitySerializer, ClientSerializer
from .permissions import IsAdminUserPermission
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        token = serializer.validated_data['token']

        user_data = UserSerializer(user).data

        return Response({
            'message': 'Login successful',
            'token': token,
            'status': status.HTTP_200_OK
        }, status=status.HTTP_200_OK)


class SignUpView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User created successfully',
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EntityListCreateAPIView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request, format=None):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)

        entities = Entity.objects.all()
        serializer = EntitySerializer(entities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        serializer = EntitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Entity created successfully',
                'entity': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EntityRetrieveUpdateDeleteAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Entity, pk=pk)

    def get(self, request, pk, format=None):
        entity = self.get_object(pk)
        serializer = EntitySerializer(entity)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        self.check_permissions(request)
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        entity = self.get_object(pk)
        serializer = EntitySerializer(entity, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Entity updated successfully',
                'entity': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, format=None):
        self.check_permissions(request)
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        entity = self.get_object(pk)
        serializer = EntitySerializer(entity, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Entity partially updated successfully',
                'entity': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        self.check_permissions(request)
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        entity = self.get_object(pk)
        entity.delete()
        return Response({
            'message': 'Entity deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


class ClientListCreateAPIView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request, format=None):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)

        clients = Client.objects.all()
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        serializer = ClientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Client created successfully',
                'client': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClientRetrieveUpdateDeleteAPIView(APIView):
    authentication_classes = [TokenAuthentication]

    def get_object(self, pk):
        return get_object_or_404(Client, pk=pk)

    def get(self, request, pk, format=None):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)

        client = self.get_object(pk)
        serializer = ClientSerializer(client)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        client = self.get_object(pk)
        serializer = ClientSerializer(client, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Client updated successfully',
                'client': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, format=None):
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        client = self.get_object(pk)
        serializer = ClientSerializer(client, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Client partially updated successfully',
                'client': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        client = self.get_object(pk)
        client.delete()
        return Response({
            'message': 'Client deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

class ProjectListCreateAPIView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request, format=None):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)

        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Project created successfully',
                'project': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectRetrieveUpdateDeleteAPIView(APIView):
    authentication_classes = [TokenAuthentication]

    def get_object(self, pk):
        return get_object_or_404(Project, pk=pk)

    def get(self, request, pk, format=None):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)

        project = self.get_object(pk)
        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        project = self.get_object(pk)
        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Project updated successfully',
                'project': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, format=None):
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        project = self.get_object(pk)
        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Project partially updated successfully',
                'project': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        project = self.get_object(pk)
        project.delete()
        return Response({
            'message': 'Project deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


class ContractListCreateAPIView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request, format=None):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)

        contracts = Contract.objects.all()
        serializer = ContractSerializer(contracts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        serializer = ContractSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Contract created successfully',
                'contract': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContractRetrieveUpdateDeleteAPIView(APIView):
    authentication_classes = [TokenAuthentication]

    def get_object(self, pk):
        return get_object_or_404(Contract, pk=pk)

    def get(self, request, pk, format=None):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)

        contract = self.get_object(pk)
        serializer = ContractSerializer(contract)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        contract = self.get_object(pk)
        serializer = ContractSerializer(contract, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Contract updated successfully',
                'contract': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, format=None):
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        contract = self.get_object(pk)
        serializer = ContractSerializer(contract, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Contract partially updated successfully',
                'contract': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        self.permission_classes = [IsAdminUserPermission]
        self.check_permissions(request)

        contract = self.get_object(pk)
        contract.delete()
        return Response({
            'message': 'Contract deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
