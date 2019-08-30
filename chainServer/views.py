from django.shortcuts import render
from chainServer import clock


# Create your views here.
def broadcastreceiver(request):
    send_records = request.GET
    send_records = clock.Block(send_records)
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
