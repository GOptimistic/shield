import os
# import pandas as pd
import numpy as np
# import matplotlib.pyplot as plt
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
# from scipy import stats
# import numpy
import seaborn as sns
import time, datetime
# from sklearn.svm import SVC
from shieldServer.views import trans_data
# from sklearn import decomposition
# from sklearn.decomposition import PCA
# from sklearn.datasets import load_digits
# # from sklearn.metrics import accuracy
# from sklearn.model_selection import GridSearchCV
# from sklearn import svm
from sklearn.preprocessing import MinMaxScaler
# from sklearn.metrics import roc_auc_score
# from sklearn.metrics import accuracy_score
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import classification_report
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

    # x_fit = [
    #     [-1, 5, 3, 0.0, 0.0, 0.0, 36, 1536076800, -1, 100000.0, 0.0, 0.0, 0.0475, 8000.0, 1567068342, 1567353600, -1,
    #      0.0],
    #     [-1, 5, 3, 0.0, 0.0, 0.0, 60, 1536076800, -1, 100000.0, 0.0, 0.0, 0.049, 50000.0, 1567068765, 1567353600, -1,
    #      0.0],
    #     [-1, 5, 3, 0.0, 0.0, 0.0, 60, 1536076800, -1, 100000.0, 0.0, 0.0, 0.049, 200000.0, 1567070146, 1567353600, -1,
    #      0.0],
    #     [-1, 5, 3, 0.0, 0.0, 0.0, 60, 1536076800, -1, 100000.0, 0.0, 0.0, 0.049, 50000.0, 1567068765, 1567353600, -1,
    #      0.0]]
    # y_fit = [0, 1, 0, 1]
    # for i in range(0, svm_input.shape[0]):
    #     y_fit.append(np.random.randint(0, 2))
    # print(y_fit)

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
    print('\n--------------estimator--------------\n'+str(estimator))
    para = model.best_params_
    print('\n--------------para--------------\n'+str(para))
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
                         'home': query_data[0].home_ownership,'income': query_data[0].annual_income,
                         'work': query_data[0].emp_length})
