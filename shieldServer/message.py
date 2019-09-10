# 接口类型：互亿无线触发短信接口，支持发送验证码短信、订单通知短信等。
# 账户注册：请通过该地址开通账户http://user.ihuyi.com/register.html
# 注意事项：
# （1）调试期间，请使用用系统默认的短信内容：您的验证码是：【变量】。请不要把验证码泄露给其他人。
# （2）请使用 APIID 及 APIKEY来调用接口，可在会员中心获取；
# （3）该代码仅供接入互亿无线短信接口参考使用，客户可根据实际需要自行编写；

# 发送短信接口文件
import json
import urllib
from urllib import parse
from django.http import JsonResponse, request
import http.client
from django.utils.crypto import random
from django.views.decorators.csrf import csrf_exempt

from shieldServer.models import User

# 请求的路径
host = "106.ihuyi.com"
sms_send_uri = "/webservice/sms.php?method=Submit"

# 查看用户名 登录用户中心->验证码通知短信>产品总览->API接口信息->APIID
account = "C47496960"
# 查看密码 登录用户中心->验证码通知短信>产品总览->API接口信息->APIKEY
password = "cb574d94c2cbcd0f039fa242e7efba1b"


@csrf_exempt
def send_message(request):
    req = json.loads(request.body)
    # 获取ajax的get方法发送过来的手机号码
    print(req)
    # 通过手机去查找用户是否已经注册
    user = User.objects.filter(user_phone=req)
    if len(user) == 0:
        return JsonResponse({'msg': "请输入已绑定手机号"})
    # 定义一个字符串,存储生成的6位数验证码
    message_code = ''
    for i in range(6):
        i = random.randint(0, 9)
        message_code += str(i)
    # 拼接成发出的短信
    text = "您的验证码是：" + message_code + "。请不要把验证码泄露给其他人。"
    print(text)
    # 把请求参数编码
    params = urllib.parse.urlencode(
        {'account': account, 'password': password, 'content': text, 'mobile': req, 'format': 'json'})
    # 请求头
    headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
    # 通过全局的host去连接服务器
    conn = http.client.HTTPConnection(host, port=80, timeout=30)
    # 向连接后的服务器发送post请求,路径sms_send_uri是全局变量,参数,请求头
    conn.request("POST", sms_send_uri, params, headers)
    # 得到服务器的响应
    response = conn.getresponse()
    # 获取响应的数据
    response_str = response.read()
    # 关闭连接
    conn.close()
    # 把验证码放进session中
    request.session['message_code'] = message_code
    print(eval(response_str.decode()))
    # 使用eval把字符串转为json数据返回
    # return JsonResponse(eval(response_str.decode()))
    return JsonResponse({'code': 2, 'msg': '提交成功', 'smsid': '15671340581975146394', 'message': message_code})

# if __name__ == '__main__':
#     mobile = req
#     text = "您的验证码是：121254。请不要把验证码泄露给其他人。"
#
#     print(send_sms(text, mobile))
