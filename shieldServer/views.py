from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User
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
    else:
        return render(request, 'home.html')


@csrf_exempt
def login(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        userID = req['userID']
        pwd = req['pwd']
        searchArray = User.objects.filter(username=userID, password=pwd)
        if searchArray:
            request.session['username'] = userID
            request.session['is_login'] = 'true'
            request.session.set_expiry(7 * 24 * 60 * 60)
            return JsonResponse({'status': 200, 'msg': 'login successfully'})
        else:
            return JsonResponse({'status': 200, 'msg': 'wrong user name or password'})


def logout(request):
    request.session.clear_expired()
    request.session.flush()
