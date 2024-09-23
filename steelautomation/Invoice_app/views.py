from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import LoginSerializer, UserSerializer
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Entity
from .serializers import EntitySerializer

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Extract the validated user and token from the serializer
        user = serializer.validated_data['user']
        token = serializer.validated_data['token']

        # Serialize the user data to include it in the response
        user_data = UserSerializer(user).data

        # Return the token, user details, and status code
        return Response({
            'message': 'Login successful',
            'token': token,
            # 'user': user_data,  # Include serialized user details
            'status': status.HTTP_200_OK
        }, status=status.HTTP_200_OK)


# List all entities (GET) and Create new entity (POST)
class EntityListCreateAPIView(APIView):
    # permission_classes = [IsAuthenticated]  # Add any necessary permissions

    # GET request - list all entities
    def get(self, request, format=None):
        entities = Entity.objects.all()  # Fetch all entities
        serializer = EntitySerializer(entities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # POST request - create a new entity
    def post(self, request, format=None):
        serializer = EntitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Entity created successfully',
                'entity': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Retrieve, Update, and Delete a specific entity
class EntityRetrieveUpdateDeleteAPIView(APIView):
    # permission_classes = [IsAuthenticated]  # Add any necessary permissions

    # Helper function to get the object or return 404
    def get_object(self, pk):
        return get_object_or_404(Entity, pk=pk)

    # GET request - retrieve a specific entity
    def get(self, request, pk, format=None):
        entity = self.get_object(pk)
        serializer = EntitySerializer(entity)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # PUT request - update a specific entity
    def put(self, request, pk, format=None):
        entity = self.get_object(pk)
        serializer = EntitySerializer(entity, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Entity updated successfully',
                'entity': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PATCH request - partially update a specific entity
    def patch(self, request, pk, format=None):
        entity = self.get_object(pk)
        serializer = EntitySerializer(entity, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Entity partially updated successfully',
                'entity': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE request - delete a specific entity
    def delete(self, request, pk, format=None):
        entity = self.get_object(pk)
        entity.delete()
        return Response({
            'message': 'Entity deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
