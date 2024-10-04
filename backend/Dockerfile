# Use the official Python image
FROM python:3.11

# Set the working directory
WORKDIR /app

# Copy requirements.txt to the container
COPY backend/requirements.txt ./

# Upgrade pip and setuptools before installing dependencies
RUN python -m pip install --upgrade  && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY backend/ .

# Expose port 8000
EXPOSE 8000

# Start the Django application and create a superuser if it doesn't exist
CMD ["sh", "-c", "python manage.py makemigrations && \
                 python manage.py migrate && \
                 python create_superuser.py && \
                 python manage.py runserver 0.0.0.0:8000"]
