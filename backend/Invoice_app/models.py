from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from Invoice_app.utils import UserManager

Role_CHOICES = [
    ("ADMIN", "Admin"),
    ("STAFF", "Staff"),
]

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, choices=Role_CHOICES)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username
    

class Entity(models.Model):
    entity_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.entity_name
    

class Client(models.Model):
    entity = models.ForeignKey(Entity, on_delete=models.CASCADE)
    client_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    address = models.TextField(blank=False)

    def __str__(self):
        return self.entity.entity_name
    

class Project(models.Model):
    entity = models.ForeignKey(Entity, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    project_name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.project_name
    

class Contract(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    contract_details = models.TextField(blank=True)

    def __str__(self):
        return f"Contract {self.contract_id} for {self.project}"
    

class Schedule(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE)
    payment_due_date = models.DateField()
    notice_back_days = models.IntegerField()
    payment_days = models.IntegerField()

    def __str__(self):
        return f"Schedule {self.schedule_id} for {self.contract}"
    

class Payment(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE)
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)
    payment_category = models.CharField(max_length=255, unique=True)
    payment_sent_date = models.DateField(null=True, blank=True)
    payment_notice_back_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, blank=True)
    claiming_value = models.DecimalField(max_digits=10, decimal_places=2)
    contractor_value = models.DecimalField(max_digits=10, decimal_places=2)
    final_value = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Payment {self.payment_id} for {self.contract}"
    

class EmailReminder(models.Model):
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE)
    reminder_sent_date = models.DateField(null=True, blank=True)
    reminder_content = models.TextField(blank=True)

    def __str__(self):
        return f"Reminder {self.reminder_id} for Payment {self.payment}"

    
class UserProjectMap(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    access_level = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user} access to {self.project} - Level: {self.access_level}"
