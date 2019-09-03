from django.db import models


class User(models.Model):
    uid = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255, default='')
    password = models.CharField(max_length=255, default='')
    user_real_name = models.CharField(max_length=255, default='')
    user_phone = models.CharField(max_length=11, default='')
    user_rank = models.CharField(max_length=255, default='')

    def __str__(self):
        return self.username
# Create your models here.


class Borrower(models.Model):
    pid = models.AutoField(primary_key=True)
    borrower_name = models.CharField(max_length=255, default='')
    borrower_id = models.CharField(max_length=255, default='')
    borrower_time = models.DateTimeField()
    borrow_type = models.CharField(max_length=255, default='')
    borrower_phone = models.CharField(max_length=255, default='')
    payback = models.IntegerField()
    should_payback_time = models.DateTimeField()
    payback_time = models.DateTimeField()
    trade_order = models.CharField(max_length=255, default='')
    trade_place = models.CharField(max_length=255, default='')
    funding_terms = models.IntegerField()
    is_uploaded = models.IntegerField()
    loan_amount = models.FloatField(default=0.0)
    funded_amount = models.FloatField(default=0.0)
    rate = models.FloatField(default=0.0)
    installment = models.FloatField(default=0.0)
    grade = models.IntegerField(default=-1)
    emp_title = models.CharField(max_length=255, default='')
    emp_length = models.IntegerField(default=-1)
    annual_income = models.FloatField(default=0.0)
    verification_status = models.IntegerField(default=-1)
    home_ownership = models.IntegerField(default=-1)
    loan_status = models.IntegerField(default=-1)
    dti = models.FloatField(default=0.0)
    delinq_2yrs = models.IntegerField(default=-1)
    collect_attention = models.FloatField(default=0.0)
    out_prncp = models.FloatField()
    total_pymnt = models.FloatField()
    total_rec_late_fee = models.FloatField()
    last_pymnt_d = models.DateTimeField()
    last_pymnt_amnt = models.FloatField(default=0.0)
    purpose = models.CharField(max_length=255, default='')

    def __str__(self):
        borrow_list = {self.pid, self.borrower_name, self.borrower_id, self.trade_order, self.borrow_type,
                       self.borrower_sum, self.borrower_time}
        # return borrow_list
        return self.borrower_name


class Meta:
    app_label = 'shieldServer'