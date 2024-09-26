# Use the official Python image
FROM python:3.11

# Set the working directory
WORKDIR /app

# Copy requirements.txt
COPY backend/requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY backend/ .

# Expose port 8000
EXPOSE 8000

# Start the Django application and create a superuser if it doesn't exist
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py create_superuser && python manage.py runserver 0.0.0.0:8000"]
