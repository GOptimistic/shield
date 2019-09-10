# 本地服务器路由文件
from django.conf.urls import url
from django.urls import path
from . import views

urlpatterns = {
    path("repaymentApi", views.repayment, name='repayment'),  # 第一个参数表示路径
    path("repaymentPage", views.repaymentPage, name='registerPage'),
}
