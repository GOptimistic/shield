from django.shortcuts import render
from chainServer import clock
from django.http import JsonResponse
from chainServer.models import Recordnodes


# Create your views here.
def broadcastreceiver(request):
    send_records = request.GET
    send_records = clock.Block.to_block(send_records)
    if send_records.previous_hash == clock.chain[len(clock.chain) - 1].hash:
        clock.chain.append(send_records)
        if clock.valid_chain():
            print("收到广播，添加成功")
        else:
            print("收到广播，区块添加无效")
            clock.find_new_chains()
            clock.consensus()
    else:
        print("warning: 区块链不同步")
        clock.find_new_chains()
        clock.consensus()


def blacklist_search(request):
    if request.method == 'POST':
        black_list = Recordnodes.objects.all().values()
        black_list_list = list(black_list)
        for i in range(len(black_list_list)):
            black_list_list[i]['default_date'] = black_list_list[i]['default_date'].strftime('%Y-%m-%d %H:%I:%S')
        return JsonResponse(black_list_list, safe=False)
    return JsonResponse({'status': 200, 'msg': 'con not get the person'})
