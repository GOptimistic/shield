from django.db import models


class User(models.Model):
    uid = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255, default='')
    password = models.CharField(max_length=255, default='')
    user_real_name = models.CharField(max_length=255, default='')
    user_phone = models.CharField(max_length=255, default='')
    user_rank = models.CharField(max_length=255, default='')

    def __str__(self):
        return self.username
# Create your models here.


class Borrower(models.Model):
    pid = models.AutoField(primary_key=True)
    borrower_name = models.CharField(max_length=255, default='')
    borrower_id = models.CharField(max_length=255, default='')
    borrower_time = models.DateTimeField().formfield()
    borrower_sum = models.FloatField()
    borrow_type = models.CharField(max_length=255, default='')
    borrower_phone = models.CharField(max_length=255, default='')
    payback = models.IntegerField()
    should_payback_time = models.DateTimeField()
    payback_time = models.DateTimeField()
    trade_order = models.CharField(max_length=255, default='')
    trade_place = models.CharField(max_length=255, default='')

    def __str__(self):
        borrow_list = {self.pid,self.borrower_name,self.borrower_id,self.trade_order,self.borrow_type,self.borrower_sum,self.borrower_time}
        # return borrow_list
        return self.borrower_name

