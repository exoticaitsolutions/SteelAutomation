import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set the settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'steelautomation.settings')
django.setup()

from django.contrib.auth import get_user_model

def create_superuser():
    User = get_user_model()
    
    username = 'admin'
    email = 'admin@example.com'
    password = '123'
    
    if User.objects.filter(username=username).exists():
        print(f"User with username '{username}' already exists.")
    else:
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f"Superuser '{username}' created successfully.")

if __name__ == "__main__":
    create_superuser()
