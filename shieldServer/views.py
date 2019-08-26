from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
def home(request):
    return render(request, 'home.html')
def others(request,file):
    if(file == 'lending'):
        return render(request, 'lending.html')
    if (file == 'repayment'):
        return render(request, 'repayment.html')
    if (file == 'lending_confirm'):
        return render(request, 'lending_confirm.html')
    if (file == 'lending_results'):
        return render(request, 'lending_results.html')
    if (file == 'login'):
        return render(request, 'login.html')
    if (file == 'query'):
        return render(request, 'query.html')
    if (file == 'query_analysis'):
        return render(request, 'query_analysis.html')
    if (file == 'query_result'):
        return render(request, 'query_result.html')
    if (file == 'home'):
        return render(request, 'home.html')

def login(request):
    pass