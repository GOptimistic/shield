from django.shortcuts import render, render_to_response
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User, Borrower
from django.http import HttpResponse, JsonResponse
from django.core import serializers


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
        # if search_context == "":
        #     return JsonResponse({'result': 200, 'msg': '输入为空'})

        if search_status == "option1":
            search = Borrower.objects.all()

            for e in search:
                if e.borrower_id == search_context:
                    if ~e.payback:
                        pid.append(e.pid)
                        borrower_name.append(e.borrower_name)
                        borrower_id.append(e.borrower_id)
                        trade_order.append(e.trade_order)
                        trade_type.append(e.borrow_type)
                        trade_money.append(e.borrower_sum)
                        trade_date.append(e.borrower_time)
                        end_date.append(e.payback_time)
        else:
            search = Borrower.objects.all()
            for e in search:
                if e.trade_order == search_context:
                    if ~e.payback:
                        pid.append(e.pid)
                        borrower_name.append(e.borrower_name)
                        borrower_id.append(e.borrower_id)
                        trade_order.append(e.trade_order)
                        trade_type.append(e.borrow_type)
                        trade_money.append(e.borrower_sum)
                        trade_date.append(e.borrower_time)
                        end_date.append(e.payback_time)
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
                       + "\",\"trade_date\": \"" + str(trade_date[i]) + "\", \"end_date\":\"" + str(
                    end_date[i]) + "\"}, "

        jsonArr = "[" + data + "]"
        print(jsonArr)
        print(type(jsonArr))
        json_data = json.loads(jsonArr)
        print(type(json_data))
        print(json_data)
    return JsonResponse(json_data, safe=False)


def repaymentPage(request):
    return render_to_response("repayment.html")


@csrf_exempt
def accountinfo(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        worker = ''
        worker = User.objects.get(username=request.session['username'])
        return JsonResponse(json.dump(worker))

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
