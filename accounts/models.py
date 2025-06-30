from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class CustomUser(AbstractUser):
    full_name = models.CharField(max_length=100, blank=True)
    password = models.CharField(max_length=128, blank=False)
    email = models.EmailField(unique=True, blank=False)