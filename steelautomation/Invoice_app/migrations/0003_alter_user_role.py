# Generated by Django 5.1.1 on 2024-09-24 05:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Invoice_app", "0002_user_is_staff_alter_user_is_superuser"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[("ADMIN", "Admin"), ("STAFF", "Staff")], max_length=50
            ),
        ),
    ]
