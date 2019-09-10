# svm模块文件
import json
import os
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import seaborn as sns
import time, datetime
from shieldServer.models import Borrower
from shieldServer.views import trans_data
from sklearn.preprocessing import MinMaxScaler
from sklearn.externals import joblib

sns.set()


@csrf_exempt
def query_svm(request):
    query_data = trans_data()
    n = len(query_data)
    svm_input = []
    trand_code = []
    for i in range(0, n):
        svm_input.append([query_data[i].funded_amount, query_data[i].loan_duration * 12,
                          query_data[i].rate, query_data[i].installment, query_data[i].grade,
                          query_data[i].emp_length, query_data[i].home_ownership,
                          query_data[i].annual_income, query_data[i].verification_status,
                          int(time.mktime(query_data[i].borrower_time.timetuple())),
                          query_data[i].dti, query_data[i].delinq_2yrs,
                          int(time.mktime(query_data[i].e_credit_time.timetuple())),
                          query_data[i].out_prncp, query_data[i].total_pymnt,
                          query_data[i].total_rec_late_fee,
                          int(time.mktime(query_data[i].last_pymnt_d.timetuple())),
                          query_data[i].last_pymnt_amnt])
        trand_code.append(query_data[i].trade_order)
    print(svm_input)
    svm_input = np.array(svm_input)
    print(svm_input.shape)

    # 0-1
    scaler = MinMaxScaler()
    scaler.fit(svm_input)
    scaler.data_max_
    data_normorlize = scaler.transform(svm_input)
    print('--------------data_normorlize--------------')
    print(data_normorlize)
    # scaler=MinMaxScaler()
    # data_transformed = scaler.fit_transform(data)

    np.random.shuffle(data_normorlize)  # random layout
    print('--------------data_normorlize after shuffle--------------')
    print(data_normorlize)

    print(os.getcwd())
    model = joblib.load('shieldServer/shield2.model')
    print('--------------model--------------')
    print(model)
    estimator = model.best_estimator_
    print('\n--------------estimator--------------\n' + str(estimator))
    para = model.best_params_
    print('\n--------------para--------------\n' + str(para))
    ypred = model.predict(svm_input)
    print(ypred)
    yscore1 = model.decision_function(svm_input)
    yscore2 = model.predict_proba(svm_input)
    print('--------------yscore1--------------')
    print(yscore1)
    print('--------------yscore2--------------')
    print(yscore2)
    ypred = list(ypred)
    yscore = list(yscore2[:, 1])
    return JsonResponse({'status': 200, 'class': ypred, 'proba': yscore, 'trade_code': trand_code,
                         'id': query_data[0].borrower_id, 'default_times': query_data[0].delinq_2yrs,
                         'home': query_data[0].home_ownership, 'income': query_data[0].annual_income,
                         'work': query_data[0].emp_length})


@csrf_exempt
def lending_svm(request):
    if request.method == 'POST':
        isNull = False
        req = json.loads(request.body)
        borrower_name = req['borrowerName']
        borrower_id = req['borrowerID']
        local_info = Borrower.objects.filter(borrower_name=borrower_name, borrower_id=borrower_id) \
            .values('funded_amount', 'loan_duration', 'rate', 'installment', 'grade', 'emp_length', 'home_ownership',
                    'annual_income', 'verification_status', 'borrower_time', 'dti', 'delinq_2yrs', 'e_credit_time',
                    'out_prncp', 'total_pymnt', 'total_rec_late_fee', 'last_pymnt_d', 'last_pymnt_amnt')
        trade_code1 = Borrower.objects.filter(borrower_name=borrower_name, borrower_id=borrower_id).values(
            'trade_order')
        local_info = list(local_info)
        trade_code1 = list(trade_code1)
        n = len(local_info)
        svm_input = []
        trade_code2 = []
        for i in range(0, n):
            if local_info[i]['last_pymnt_d'] is None:
                isNull = True
                return JsonResponse({'isNull': isNull})
            svm_input.append([local_info[i]['funded_amount'], local_info[i]['loan_duration'] * 12,
                              local_info[i]['rate'], local_info[i]['installment'], local_info[i]['grade'],
                              local_info[i]['emp_length'], local_info[i]['home_ownership'],
                              local_info[i]['annual_income'], local_info[i]['verification_status'],
                              int(time.mktime(local_info[i]['borrower_time'].timetuple())), local_info[i]['dti'],
                              local_info[i]['delinq_2yrs'],
                              int(time.mktime(local_info[i]['e_credit_time'].timetuple())),
                              local_info[i]['out_prncp'], local_info[i]['total_pymnt'],
                              local_info[i]['total_rec_late_fee'],
                              int(time.mktime(local_info[i]['last_pymnt_d'].timetuple())),
                              local_info[i]['last_pymnt_amnt']])
            trade_code2.append(trade_code1[i]['trade_order'])


        print('-------------local_info----------------')
        print(local_info)
        svm_input = np.array(svm_input)
        print('-------------svm_input----------------')
        print(svm_input)
        # 0-1
        scaler = MinMaxScaler()
        scaler.fit(svm_input)
        scaler.data_max_
        data_normorlize = scaler.transform(svm_input)
        print('--------------data_normorlize--------------')
        print(data_normorlize)
        # scaler=MinMaxScaler()
        # data_transformed = scaler.fit_transform(data)

        np.random.shuffle(data_normorlize)  # random layout
        print('--------------data_normorlize after shuffle--------------')
        print(data_normorlize)

        print(os.getcwd())
        model = joblib.load('shieldServer/shield2.model')
        print('--------------model--------------')
        print(model)
        estimator = model.best_estimator_
        print('\n--------------estimator--------------\n' + str(estimator))
        para = model.best_params_
        print('\n--------------para--------------\n' + str(para))
        ypred = model.predict(svm_input)
        print(ypred)
        yscore1 = model.decision_function(svm_input)
        yscore2 = model.predict_proba(svm_input)
        print('--------------yscore1--------------')
        print(yscore1)
        print('--------------yscore2--------------')
        print(yscore2)
        ypred = list(ypred)
        yscore = list(yscore2[:, 1])
        print('py')
        return JsonResponse({'status': 200, 'class': ypred, 'proba': yscore, 'trade_code': trade_code2,
                             'id': borrower_id, 'default_times': local_info[0]['delinq_2yrs'],
                             'home': local_info[0]['home_ownership'], 'income': local_info[0]['annual_income'],
                             'work': local_info[0]['emp_length'], 'isNull': isNull})
