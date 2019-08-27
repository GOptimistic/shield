from django.db import models


# Create your models here.
class Test(models.Model):
    name = models.CharField(max_length=10,default=" ")
    name2 = models.CharField(max_length=10,default=" ")

    def __str__(self):
        return self.name
