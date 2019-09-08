from django.shortcuts import render
from chainServer import clock
from chainServer.models import Recordnodes
from django.http import HttpResponse, JsonResponse
import json

# Create your views here.
def broadcastreceiver(request):
    send_records = request.body
    send_records = json.loads(send_records)
    print(send_records)
    send_block = clock.Block()
    send_block.to_block(send_records)
    print(send_block.previous_hash)
    print(clock.chain[len(clock.chain) - 1].hash)
    if send_block.previous_hash == clock.chain[len(clock.chain) - 1].hash:
        clock.chain.append(send_block)
        print(send_block.data)
        Recordnodes(id=send_block.index, name=send_block.data['name'], ID_card=send_block.data['ID'],
                    money=send_block.data['money'],
                    funding_terms=send_block.data['funding_terms'], default_date=send_block.timestamp,
                    hash_previous=send_block.previous_hash, hash_current=send_block.hash).save()
        if clock.valid_chain(clock.chain):
            print("添加成功")
        else:
            print("区块添加无效")
            clock.consensus()
    else:
        print("warning: 区块链不同步")
        clock.consensus()
    return HttpResponse("收到广播")


def blacklist_search(request):
    if request.method == 'POST':
        black_list = Recordnodes.objects.all().values()
        black_list_list = list(black_list)
        for i in range(len(black_list_list)):
            black_list_list[i]['default_date'] = black_list_list[i]['default_date'].strftime('%Y-%m-%d %H:%I:%S')
        return JsonResponse(black_list_list, safe=False)
    return JsonResponse({'status': 200, 'msg': 'con not get the person'})
