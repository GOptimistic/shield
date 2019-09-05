import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from scipy import stats
import numpy
import seaborn as sns
import time, datetime

from sklearn.svm import SVC

sns.set()
from shieldServer.views import trans_data
from sklearn import decomposition
from sklearn.decomposition import PCA
from sklearn.datasets import load_digits
# from sklearn.metrics import accuracy
from sklearn.model_selection import GridSearchCV
from sklearn import svm
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import roc_auc_score
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report


@csrf_exempt
def query_svm(request):
    query_data = trans_data()
    n = len(query_data)
    svm_input = []
    for i in range(0, n):
        svm_input.append([query_data[i].verification_status, query_data[i].emp_length,
                          query_data[i].home_ownership, query_data[i].installment, query_data[i].last_pymnt_amnt,
                          query_data[i].dti, query_data[i].loan_duration * 12,
                          int(time.mktime(query_data[i].e_credit_time.timetuple())),
                          query_data[i].grade, query_data[i].annual_income, query_data[i].out_prncp,
                          query_data[i].total_pymnt, query_data[i].rate, query_data[i].funded_amount,
                          int(time.mktime(query_data[i].borrower_time.timetuple())),
                          int(time.mktime(query_data[i].last_pymnt_d.timetuple())), query_data[i].delinq_2yrs,
                          query_data[i].total_rec_late_fee])
    print(svm_input)
    svm_input = np.array(svm_input)
    print(svm_input.shape)

    x_fit = [
        [-1, 5, 3, 0.0, 0.0, 0.0, 36, 1536076800, -1, 100000.0, 0.0, 0.0, 0.0475, 8000.0, 1567068342, 1567353600, -1,
         0.0],
        [-1, 5, 3, 0.0, 0.0, 0.0, 60, 1536076800, -1, 100000.0, 0.0, 0.0, 0.049, 50000.0, 1567068765, 1567353600, -1,
         0.0],
        [-1, 5, 3, 0.0, 0.0, 0.0, 60, 1536076800, -1, 100000.0, 0.0, 0.0, 0.049, 200000.0, 1567070146, 1567353600, -1,
         0.0],
        [-1, 5, 3, 0.0, 0.0, 0.0, 60, 1536076800, -1, 100000.0, 0.0, 0.0, 0.049, 50000.0, 1567068765, 1567353600, -1,
         0.0]]
    y_fit = [0, 1, 0, 1]
    # for i in range(0, svm_input.shape[0]):
    #     y_fit.append(np.random.randint(0, 2))
    # print(y_fit)

    # 0-1
    scaler = MinMaxScaler()
    scaler.fit(svm_input)
    # scaler.data_max_
    data_normorlize = scaler.transform(svm_input)
    print('--------------data_normorlize--------------')
    print(data_normorlize)
    # scaler=MinMaxScaler()
    # data_transformed = scaler.fit_transform(data)

    np.random.shuffle(data_normorlize)  # random layout
    print('--------------data_normorlize after shuffle--------------')
    print(data_normorlize)

    # SVM
    parameters = {'kernel': ['linear', 'rbf', 'sigmoid', 'poly'], 'C': np.linspace(0.1, 20, 50),
                  'gamma': np.linspace(0.1, 20, 20)}
    # parameters = {'kernel': ['linear'], 'C': 0.1, 'gamma': 0.1}
    svc = svm.SVC(probability=True)
    print(svc)
    model = GridSearchCV(svc, parameters, cv=2, scoring='accuracy', iid=True, refit=True)
    model.fit(x_fit, y_fit)
    print('--------------before--------------')
    print(model.best_estimator_)
    print(model.best_params_)
    model.best_estimator_ = SVC(C=0.1, cache_size=200, class_weight=None, coef0=0.0, decision_function_shape='ovr',
                                degree=3, gamma=0.1, kernel='linear', max_iter=-1, probability=True,
                                random_state=None, shrinking=True, tol=0.001, verbose=False)
    model.best_params_ = {'C': 0.1, 'gamma': 0.1, 'kernel': 'linear'}
    print('--------------after--------------')
    print(model.best_estimator_)
    print(model.best_params_)
    # model.set_params(model.best_params_)
    # estimator = model.estimator
    print('--------------model--------------')
    print(model)
    ypred = model.predict(svm_input)
    print(ypred)
    return JsonResponse({'status': 200})
