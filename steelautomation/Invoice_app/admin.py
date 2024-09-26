from django.contrib import admin
from Invoice_app.models import *

admin.site.register(User)
admin.site.register(Entity)
admin.site.register(Client)
admin.site.register(Project)
admin.site.register(Contract)
admin.site.register(Schedule)
admin.site.register(Payment)
admin.site.register(EmailReminder)
admin.site.register(UserProjectMap)
