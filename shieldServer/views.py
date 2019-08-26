from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User
from django.http import HttpResponse, JsonResponse


# Create your views here.
def home(request):
    return render(request, 'home.html')


def others(request,file):
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


@csrf_exempt
def login(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        userID = req['userID']
        pwd = req['pwd']
        print('this is the print ', end="")
        searchArray = User.objects.filter(username=userID, password=pwd)
        if searchArray:
            return JsonResponse({'result': 200, 'msg': 'login successfully'})
        else:
            return JsonResponse({'result': 200, 'msg': 'wrong user name or password'})
