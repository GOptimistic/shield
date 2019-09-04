from django.shortcuts import render, render_to_response
from django.views.decorators.csrf import csrf_exempt
import json
import time
import datetime
from .models import User, Borrower
from django.http import HttpResponse, JsonResponse
from django.core import serializers

from datetime import datetime
from django.utils.timezone import now
from apscheduler.scheduler import Scheduler
from time import sleep

from chainServer.clock import mine, findbyidname


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
                        trade_money.append(e.out_prncp)
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
                        trade_money.append(e.out_prncp)
                        trade_date.append(e.borrower_time)
                        end_date.append(e.should_payback_time)
        data = ""
        for i in range(len(pid)):
            if i == len(pid) - 1:
                data = data + "{\"p_index\": " + str(pid[i]) + ", \"borrower_name\": \"" + str(borrower_name[i]) \
                       + "\", \"borrower_id\": \"" + str(borrower_id[i]) + "\",\"trade_order\": \"" + str(
                    trade_order[i]) \
                       + "\", \"trade_type\": \"" + str(trade_type[i]) + "\", \"trade_money\": \"" + str(trade_money[i]) \
                       + "\",\"trade_date\": \"" + str(trade_date[i]) + "\", \"end_date\":\"" + str(end_date[i]) + "\"}"
            else:
                data = data + "{\"p_index\": " + str(pid[i]) + ", \"borrower_name\": \"" + str(borrower_name[i]) \
                       + "\", \"borrower_id\": \"" + str(borrower_id[i]) + "\",\"trade_order\": \"" + str(
                    trade_order[i]) \
                       + "\", \"trade_type\": \"" + str(trade_type[i]) + "\", \"trade_money\": \"" + str(trade_money[i]) \
                       + "\",\"trade_date\": \"" + str(trade_date[i]) + "\", \"end_date\":\"" + str(
                    end_date[i]) + "\"}, "

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
def add_lending(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        borrower_Name = req['borrowerName']
        borrower_ID = req['borrowerID']
        borrower_Time = req['borrowerTime']
        loan_amount = float(req['loanedMoney'])
        funded_amount = float(req['fundedAmount'])
        rate = float(req['rate'])
        loan_duration = int(req['loanDuration'])
        borrower_Phone = req['borrowerPhone']
        borrow_Type = req['borrowType']
        payback = req['payback']
        shouldPaybackTime = req['shouldPaybackTime']
        tradeOrder = req['tradeOrder']
        tradePlace = req['tradePlace']
        funding_terms = req['funding_terms']
        is_upload = req['isUpload']
        home_ownership = int(req['homeOwnership'])
        emp_title = req['empTitle']
        emp_length = int(req['empLength'])
        annual_income = float(req['annualIncome'])
        grade = req['grade']

        installment = funded_amount * ((1 + rate) ** loan_duration) / (12 * loan_duration)
        block_info = findbyidname(borrower_ID, borrower_Name)
        delinq = len(json.loads(block_info))

        coll_attention = cal_dti(loan_amount, funded_amount, loan_duration, annual_income, home_ownership, delinq,
                                 2, funded_amount / (installment * 12 * loan_duration))
        need_add_loan = Borrower.objects.get_or_create(
            borrower_name=borrower_Name,
            borrower_id=borrower_ID,
            borrower_time=borrower_Time,
            loan_amount=loan_amount,
            funded_amount=funded_amount,
            rate=rate,
            loan_duration=loan_duration,
            home_ownership=home_ownership,
            emp_title=emp_title,
            emp_length=emp_length,
            delinq_2yrs=delinq,
            annual_income=annual_income,
            loan_status=2,
            collect_attention=coll_attention,
            borrow_type=borrow_Type,
            borrower_phone=borrower_Phone,
            payback=payback,
            should_payback_time=shouldPaybackTime,
            trade_order=tradeOrder,
            trade_place=tradePlace,
            funding_terms=funding_terms,
            is_uploaded=is_upload,
            installment=installment,
            dti=installment * 12 / annual_income,
            grade=grade,
            out_prncp=funded_amount,
            purpose=borrow_Type,
            last_pymnt_d=None
        )
        if need_add_loan:
            return JsonResponse({'status': 200, 'msg': 'add successfully'})
        return JsonResponse({'status': 200, 'msg': 'add failed'})


def cal_dti(loan, funded, duration, income, house, delinq, status, left):
    result = 0.0
    income_weight = 0.0
    house_weight = 0.0
    status_weight = 0.0
    if income > 200000:
        income_weight = 0.1
    elif 200000 >= income > 100000:
        income_weight = 0.2
    elif 100000 >= income > 50000:
        income_weight = 0.3
    else:
        income_weight = 0.4

    if house == 1:
        house_weight = 0.2
    elif house == 2:
        house_weight = 0.1
    elif house == 3:
        house_weight == 0.3
    else:
        house_weight == 0.4

    if status == 1:
        return result
    elif status == 2:
        status_weight = 0.2
    elif status == 3:
        status_weight = 0.34
    else:
        status_weight = 0.46

    result = (
                         loan - funded) / funded * 0.15 + 1 / duration * 0.11 + income_weight * 0.14 + house_weight * 0.14 + delinq * 0.18 + status_weight * 0.12 + left * 0.16
    return result


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


@csrf_exempt
def lending_result(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        borrower_name = req['borrowerName']
        borrower_id = req['borrowerID']
        local_info = Borrower.objects.filter(borrower_name=borrower_name, borrower_id=borrower_id) \
            .values('borrower_name', 'borrow_type', 'borrower_id', 'borrower_phone', 'funded_amount', 'borrower_time',
                    'trade_order', 'trade_place', 'should_payback_time', 'last_pymnt_d')
        local_info = list(local_info)
        for i in range(len(local_info)):
            date_time = local_info[i]['last_pymnt_d']
            if date_time is not None:
                local_info[i]['last_pymnt_d'] = date_time.strftime('%Y-%m-%d %H:%I:%S')
            else:
                local_info[i]['last_pymnt_d'] = "N/A"
            local_info[i]['borrower_time'] = local_info[i]['borrower_time'].strftime('%Y-%m-%d %H:%I:%S')
            local_info[i]['should_payback_time'] = local_info[i]['should_payback_time'].strftime('%Y-%m-%d %H:%I:%S')
        local_num = len(local_info)
        local_info = json.dumps(local_info)
        block_info = findbyidname(borrower_id, borrower_name)
        block_num = len(json.loads(block_info))
        jsonStr = '{"localLength":' + str(local_num) + ', ' + '"local":' + local_info + ', "blockLength":' \
                  + str(block_num) + ', "block":' + block_info + '}'
        return JsonResponse(jsonStr, safe=False)


@csrf_exempt
def repayment_repay(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        repay = req['repay']
        repay_money = req['money']
        # repay_unpay
        repay_status = Borrower.objects.get(trade_order=repay['trade_order'])
        total_money = repay_status.funded_amount * pow(1 + repay_status.rate, repay_status.loan_status)
        rate_money = total_money - repay_status.funded_amount
        repay_status.last_pymnt_amnt = repay_money
        repay_status.last_pymnt_d = datetime.today().date()# datetime.strptime(time.strftime('%Y-%m-%d', time.localtime()), "%Y-%m-%d").date()
        repay_status.loan_status = 5
        if repay_status.total_pymnt >= rate_money:

            repay_status.out_prncp = float(repay_status.out_prncp) - float(repay_money)
            if repay_status.out_prncp < 0:
                repay_status.out_prncp = 0
                repay_status.payback = 1
                repay_status.loan_status = 6
        else:
            if repay_status.total_pymnt + float(repay_money) > rate_money:
                repay_status.out_prncp = repay_status.funded_amount - (repay_status.total_pymnt + repay_money - rate_money)
        repay_status.total_pymnt = repay_status.total_pymnt + float(repay_money)

        repay_status.save()
        return JsonResponse({'status': 200, 'msg': 'success'})
    return JsonResponse({'status': 200, 'msg': 'con not get the person'})


# 定时查询违约信息
def task_Fun():
    default_info = Borrower.objects.filter(is_uploaded=0, should_payback_time__lt=now(), payback=0) \
        .values('pid', 'borrower_name', 'borrow_type', 'borrower_id', 'borrower_phone', 'funded_amount', 'borrower_time'
                , 'funding_terms')
    default_info = list(default_info)
    for i in range(len(default_info)):
        date_time = default_info[i]['borrower_time']
        default_info[i]['borrower_time'] = date_time.strftime('%Y-%m-%d %H:%I:%S')
    jsonArray = json.dumps(default_info)
    Borrower.objects.filter(is_uploaded=0, should_payback_time__lt=now(), payback=0).update(is_uploaded=1)
    mine(jsonArray)
    sleep(1)


def remind():
    need_notice = Borrower.objects.filter(payback=0).values('borrower_name', 'borrower_id', 'borrower_phone',
                                                           'borrower_time', 'last_pymnt_d', 'installment')
    need_notice_first = need_notice.filter(last_pymnt_d=None)
    need_notice_not_first = need_notice.exclude(last_pymnt_d=None)
    print(need_notice_first)
    print(need_notice_not_first)


sched = Scheduler()


@sched.interval_schedule(seconds=600)
def my_task1():
    print('定时任务1开始\n')
    task_Fun()
    print('定时任务1结束\n')


sched.start()
