from django.db import models


# Create your models here.
class Recordnodes(models.Model):
    name = models.CharField(max_length=255, null=False)
    ID_card = models.CharField(max_length=255, null=False)
    money = models.FloatField(max_length=20, null=False)
    funding_terms = models.IntegerField(null=False)
    default_date = models.DateTimeField(max_length=50, null=False)
    hash_previous = models.CharField(max_length=255, null=False)
    hash_current = models.CharField(max_length=255, null=False)
    # test = models.CharField(max_length=255,null=False)
    def __str__(self):
        return self.name


class Meta:
    app_label = 'chainServer'
