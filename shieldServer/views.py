# from django.contrib.sessions import serializers
# from django.contrib.postgres import serializers
from django.core import serializers
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json

from shieldServer import models
from .models import User, Borrower
from django.http import HttpResponse, JsonResponse


# Create your views here.
def home(request):
    return render(request, 'home.html')


def others(request, file):
    is_login = request.session.get('is_login', False)
    if is_login:
        print('have been login ')
        if file == 'lending':
            return render(request, 'lending.html')
        if file == 'repayment':
            return render(request, 'repayment.html')
        if file == 'lending_confirm':
            return render(request, 'lending_confirm.html')
        if file == 'lending_results':
            return render(request, 'lending_results.html')
        if file == 'login':
            return render(request, 'login.html')
        if file == 'query':
            return render(request, 'query.html')
        if file == 'query_analysis':
            return render(request, 'query_analysis.html')
        if file == 'query_result':
            return render(request, 'query_result.html')
        if file == 'home':
            return render(request, 'home.html')
        if file == 'accountinfo':
            return render(request, 'accountinfo.html')
    else:
        return render(request, 'home.html')


@csrf_exempt
def login(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        userID = req['userID']
        pwd = req['pwd']
        if userID == "":
            return JsonResponse({'result': 200, 'msg': '用户名为空'})
        elif pwd == "":
            return JsonResponse({'result': 200, 'msg': '密码为空'})

        searchName = User.objects.filter(username=userID)
        if searchName:
            searchUser = User.objects.filter(username=userID, password=pwd)
            if searchUser:
                request.session['username'] = userID
                request.session['is_login'] = True
                request.session.set_expiry(0)
                return JsonResponse({'result': 200, 'msg': 'login successfully'})
            else:
                return JsonResponse({'result': 200, 'msg': '密码错误'})
        else:
            return JsonResponse({'status': 200, 'msg': 'wrong user name or password'})


@csrf_exempt
def logout(request):
    if request.method == 'POST':
        request.session.clear_expired()
        request.session.flush()
    return JsonResponse({'status': 200, 'msg': 'logout successfully'})


@csrf_exempt
def repayment(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        search_context = req['search_context']
        search_status = req['search_status']
        if search_context == "":
            return JsonResponse({'result': 200, 'msg': '输入为空'})

        if search_status == "option1":
            searchPhone = Borrower.objects.all()
            print(searchPhone)
            return JsonResponse({})
            # return JsonResponse({'result': 200, 'msg': 'login successfully'})
            #     else:
            #         return JsonResponse({'result': 200, 'msg': '密码错误'})
            # else:
            #     return JsonResponse({'result': 200, 'msg': '用户名不存在'})


@csrf_exempt
def order_count(request):
    if request.method == 'POST':
        count = Borrower.objects.count()
    return JsonResponse({'result': 200, 'msg': count})


@csrf_exempt
def add_lending(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        borrower_Name = req['borrowerName']
        borrower_ID = req['borrowerID']
        borrower_Time = req['borrowerTime']
        borrower_Sum = req['borrowedSum']
        borrower_Phone = req['borrowerPhone']
        borrow_Type = req['borrowType']
        payback = req['payback']
        shouldPaybackTime = req['shouldPaybackTime']
        paybackTime = req['paybackTime']
        tradeOrder = req['tradeOrder']
        tradePlace = req['tradePlace']
        need_add_loan = Borrower.objects.get_or_create(
            borrower_name=borrower_Name,
            borrower_id=borrower_ID,
            borrower_time=borrower_Time,
            borrower_sum=borrower_Sum,
            borrow_type=borrow_Type,
            borrower_phone=borrower_Phone,
            payback=payback,
            should_payback_time=shouldPaybackTime,
            payback_time=paybackTime,
            trade_order=tradeOrder,
            trade_place=tradePlace)
        # if need_add_loan:

        # userID = req['userID']
        # pwd = req['pwd']
        # if userID == "":
        #     return JsonResponse({'result': 200, 'msg': '用户名为空'})
        # elif pwd == "":
        #     return JsonResponse({'result': 200, 'msg': '密码为空'})
        #
        # searchName = User.objects.filter(username=userID)
        # if searchName:
        #     searchUser = User.objects.filter(username=userID, password=pwd)
        #     if searchUser:
        #         request.session['username'] = userID
        #         request.session['is_login'] = True
        #         request.session.set_expiry(0)
        #         return JsonResponse({'result': 200, 'msg': 'login successfully'})
        #     else:
        #         return JsonResponse({'result': 200, 'msg': '密码错误'})
        # else:


@csrf_exempt
def accountinfo(request):
    if request.method == 'POST':
        # req = json.loads(request.body)
        print(request.session['username'])
        worker = User.objects.filter(username=request.session['username'])
        if worker:
            ajax_data = serializers.serialize("json", worker)
            print(ajax_data)
            # sta_str = {'status': 200, 'msg': 'get the person'}
            return JsonResponse(ajax_data, safe=False)
            # return JsonResponse({'status': 200, 'msg': 'con not get the person'})
        return JsonResponse({'status': 200, 'msg': 'con not get the person'})

