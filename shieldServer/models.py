from django.db import models


class User(models.Model):
    uid = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255,default='')
    password = models.CharField(max_length=255,default='')

    def __str__(self):
        return self.username
# Create your models here.
