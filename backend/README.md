# Project Name
## SteelAutomation

# Setup Instructions

## Installation

### Python Installation Process
Before proceeding, ensure Python is installed on your system. If not, you can download and install Python from [python.org](https://www.python.org/downloads/).

### Setting up a Virtual Environment
To work with Django, it's recommended to create a virtual environment. Follow the steps outlined in the [Python documentation](https://docs.python.org/3/tutorial/venv.html) or use tools like `virtualenv` or `venv`.

### Installing Django
Once the virtual environment is set up, you can install Django within it. Refer to the [Django documentation](https://docs.djangoproject.com/en/stable/intro/install/) for detailed instructions on installing Django.

## Getting Started

### Clone the Project
```bash
git clone https://github.com/exoticaitsolutions/SteelAutomation.git
```

## Navigate to the Project Directory

```bash
  cd SteelAutomation
```

# Install Dependencies
### Using requirements.txt
```
pip install -r requirements.txt
```

# Individual Dependencies

***Core Headers***
```
pip install django-cors-headers
```

***django-rest-swagger***
```
pip install django-rest-swagger
```
***drf_yasg***
```
pip install drf_yasg
```

***Setuptools***
```
python -m pip install --upgrade pip setuptools
```

# Makemigration
```bash
python manage.py makemigrations
```

# Makemigration
```bash
python manage.py migrate
```

# create admin
```bash
python create_superuser.py
```

# Run Project
```bash
python manage.py runserver
```


