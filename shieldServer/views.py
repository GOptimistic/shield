from django.shortcuts import render, render_to_response
from django.views.decorators.csrf import csrf_exempt
import json
import time
from .models import User, Borrower
from django.http import HttpResponse, JsonResponse
from django.core import serializers

from datetime import datetime
from django.utils.timezone import now
from apscheduler.scheduler import Scheduler
from time import sleep


from chainServer.clock import mine
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
        if file == 'accountinfo':
            return render(request, 'accountinfo.html')
        if file == 'home':
            return render(request, 'home.html')
        if file == 'home_after':
            return render(request, 'home_after.html')
        if file == 'changePsw':
            return render(request, 'changePsw.html')
        if file == 'repayment_repay':
            return render(request, 'repayment.html')
        if file == 'test_message':
            return render(request, 'test_message.html')
        if file == 'query_result':
            idNumber = request.GET.get('idNumber')
            loanNumber = request.GET.get('loanNumber')
            loanDate = request.GET.get('loanDate')
            print('idNumber:', idNumber)
            print('loanNumber:', loanNumber)
            print('loanDate:', loanDate)
            context = {}
            if idNumber == '' and loanNumber == '' and loanDate == '':
                print('必须填入一个条件')
                return render(request, 'query_result.html')
            query_person = Borrower.objects.all()
            if idNumber:
                query_person = query_person.filter(borrower_id=idNumber)
            if loanNumber:
                query_person = query_person.filter(trade_order=loanNumber)
            if loanDate:
                loanYear = loanDate.split('/', 2)[2]  # 获取年份
                loanMonth = loanDate.split('/', 2)[0]  # 获取月份
                loanDay = loanDate.split('/', 2)[1]  # 获取天数
                print(loanYear, loanMonth, loanDay)
                query_person = query_person.filter(borrower_time__year=loanYear, borrower_time__month=loanMonth,
                                                   borrower_time__day=loanDay)
            if query_person:
                print('success')
            else:
                print('false')

            return render(request, 'query_result.html', {'query_person': query_person})

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
    pid = []
    borrower_name = []
    borrower_id = []
    trade_order = []
    trade_type = []
    trade_money = []
    trade_date = []
    end_date = []

    if request.method == 'POST':
        req = json.loads(request.body)
        search_context = req['search_context']
        search_status = req['search_status']

        if search_status == "option1":
            search = Borrower.objects.all()
            for e in search:
                if e.borrower_id == search_context:
                    if e.payback == 0:
                        pid.append(e.pid)
                        borrower_name.append(e.borrower_name)
                        borrower_id.append(e.borrower_id)
                        trade_order.append(e.trade_order)
                        trade_type.append(e.borrow_type)
                        trade_money.append(e.borrower_sum)
                        trade_date.append(e.borrower_time)
                        end_date.append(e.should_payback_time)
        else:
            search = Borrower.objects.all()
            for e in search:
                if e.trade_order == search_context:
                    if e.payback == 0:
                        pid.append(e.pid)
                        borrower_name.append(e.borrower_name)
                        borrower_id.append(e.borrower_id)
                        trade_order.append(e.trade_order)
                        trade_type.append(e.borrow_type)
                        trade_money.append(e.borrower_sum)
                        trade_date.append(e.borrower_time)
                        end_date.append(e.should_payback_time)
        data = ""
        for i in range(len(pid)):
            if i == len(pid) - 1:
                data = data + "{\"p_index\": " + str(pid[i]) + ", \"borrower_name\": \"" + str(borrower_name[i]) \
                       + "\", \"borrower_id\": \"" + str(borrower_id[i]) + "\",\"trade_order\": \"" + str(trade_order[i]) \
                       + "\", \"trade_type\": \"" + str(trade_type[i]) + "\", \"trade_money\": \"" + str(trade_money[i]) \
                       + "\",\"trade_date\": \"" + str(trade_date[i]) + "\", \"end_date\":\"" + str(end_date[i]) + "\"}"
            else:
                data = data + "{\"p_index\": " + str(pid[i]) + ", \"borrower_name\": \"" + str(borrower_name[i]) \
                       + "\", \"borrower_id\": \"" + str(borrower_id[i]) + "\",\"trade_order\": \"" + str(trade_order[i]) \
                       + "\", \"trade_type\": \"" + str(trade_type[i]) + "\", \"trade_money\": \"" + str(trade_money[i]) \
                       + "\",\"trade_date\": \"" + str(trade_date[i]) + "\", \"end_date\":\"" + str(end_date[i]) + "\"}, "

        jsonArr = "[" + data + "]"
        print(jsonArr)
        print(type(jsonArr))
        json_data = json.loads(jsonArr)
        print(type(json_data))
        print(json_data)
    return JsonResponse(json_data, safe=False)


@csrf_exempt
def changePwd(request):
    req = json.loads(request.body)
    user_id = req['id']
    new_pwd = req['pwd']

    try:
        user = User.objects.get(username=user_id)
        user.password = new_pwd
        user.save()
        return JsonResponse({'msg': '修改成功！'})
    except User.DoesNotExist:
        return JsonResponse({'msg': '无此员工！'})




def repaymentPage(request):
    return render_to_response("repayment.html")


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
        funding_terms = req['funding_terms']
        is_upload = req['isUpload']
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
            trade_place=tradePlace,
            funding_terms=funding_terms,
            is_uploaded=is_upload)
        if need_add_loan:
            return JsonResponse({'status': 200, 'msg': 'add successfully'})
        return JsonResponse({'status': 200, 'msg': 'add failed'})


@csrf_exempt
def accountinfo(request):
    if request.method == 'POST':
        # req = json.loads(request.body)
        print(request.session['username'])
        worker = User.objects.filter(username=request.session['username']) \
            .values('username', 'user_real_name', 'user_phone')
        if worker:
            worker = list(worker)
            return JsonResponse(worker, safe=False)
        return JsonResponse({'status': 200, 'msg': 'con not get the person'})


def query(request, idNumber, loanNumber, loanDate):
    print('aaa')
    print(idNumber)
    print(loanNumber)
    print(loanDate)
    return render(request, 'home.html')


# 定时查询违约信息
def task_Fun():
    default_info = Borrower.objects.filter(is_uploaded=0, should_payback_time__lt=now(), payback=0)\
        .values('pid', 'borrower_name', 'borrow_type', 'borrower_id', 'borrower_phone', 'borrower_phone', 'borrower_sum',
                'borrower_time','funding_terms')
    default_info = list(default_info)
    for i in range(len(default_info)):
        date_time = default_info[i]['borrower_time']
        default_info[i]['borrower_time'] = date_time.strftime('%Y-%m-%d %H:%I:%S')
    jsonArray = json.dumps(default_info)
    mine(jsonArray)
    sleep(1)


sched = Scheduler()


@sched.interval_schedule(seconds=10)
def my_task1():
    print('定时任务1开始\n')
    task_Fun()
    print('定时任务1结束\n')


sched.start()


@csrf_exempt
def repayment_repay(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        repay_status = Borrower.objects.get(trade_order=req['trade_order'])
        repay_status.payback = 1
        repay_status.save()
    return JsonResponse({'status': 200, 'msg': 'con not get the person'})
