import json
import requests
import hashlib as hasher
import datetime as date
from django.http import JsonResponse
from chainServer.models import Recordnodes
import socket
import ast


class Block:
    def __init__(self, index=-1, timestamp=None, data=None, previous_hash=None):
        self._index = index
        self._timestamp = timestamp
        self._data = data
        self._previous_hash = previous_hash
        self._hash = self.hash_block()

    def to_block(self, blockdict):
        self._index = blockdict['index']
        self._timestamp = blockdict['timestamp']
        self._data = blockdict['data']
        self._previous_hash = blockdict['previous_hash']
        self._hash = blockdict['hash']

    @property
    def hash(self):
        return self._hash

    @property
    def timestamp(self):
        return self._timestamp

    @property
    def index(self):
        return self._index

    @property
    def data(self):
        return self._data

    @property
    def previous_hash(self):
        return self._previous_hash

    def hash_block(self):
        sha = hasher.sha256()
        temp = str(self._index) + str(self._timestamp) + str(self._data) + str(self._previous_hash)
        sha.update(temp.encode("utf8"))
        return sha.hexdigest()

    def set_data(self, strdata):
        self._data = eval(strdata)

    def to_dict(self):
        blockdict = {'index': self._index, 'timestamp': self._timestamp, 'data': self._data,
                     'previous_hash': self._previous_hash, 'hash': self._hash}
        return blockdict


def create_genesis_block():
    # Manually construct a block with
    # index zero and arbitrary previous hash
    return Block(0, 0, None, None)


def get_out_ip():
    url = r'http://www.trackip.net/'
    r = requests.get(url)
    txt = r.text
    ip = txt[txt.find('title') + 6:txt.find('/title') - 1]
    return (ip)


global chain
chain = [create_genesis_block()]
my_ip = get_out_ip()
hostname = socket.gethostname()
my_ip = "http://" + my_ip + ":8001/"
print(my_ip)


# get data from Recordnodes to chain
def getchain():
    recordlist = Recordnodes.objects.all()
    for var in recordlist:
        chain.append(Block(var.id, var.default_date, {'name': var.name, 'ID_card': var.ID_card, 'money': var.money,
                                                      'funding_terms': var.funding_terms}, var.hash_previous))


def printchain():
    for i in range(len(chain)):
        print("Block #{} 已经加入区块链!".format(chain[i].index))
        print("Hash: {}".format(chain[i].hash))
        print("Data: {}".format(chain[i].data))
    print("区块链长度为：" + str(len(chain)))


def getlastblock():
    if Recordnodes.objects.exists():
        querylist = Recordnodes.objects.all()
        last_block_query = querylist[len(querylist) - 1]
        print(last_block_query)
        return Block(len(querylist), last_block_query.default_date,
                     {'name': last_block_query.name, 'ID_card': last_block_query.ID_card,
                      'money': last_block_query.money,
                      'funding_terms': last_block_query.funding_terms}, last_block_query.hash_previous)
    else:
        print('区块链数据库为空')
        return create_genesis_block()


getchain()


def next_block(last_block, data):
    this_index = last_block.index + 1
    this_timestamp = date.datetime.now()
    this_data = data
    this_hash = last_block.hash
    return Block(this_index, this_timestamp, this_data, this_hash)


# Store the records that this node has in a list
this_nodes_records = []
# Store the url data of every other node in the network so that we can communicate  with them
peer_nodes = ["http://139.219.2.48:8001/", "http://49.232.23.19:8001/"]
if peer_nodes.__contains__(my_ip):
    print(my_ip)
    print("即将remove")
    peer_nodes.remove(my_ip)


def valid_chain(tocheckchain):
    # Determine if a given blockchain is valid

    last_block = tocheckchain[0]
    current_index = 1
    while current_index < len(tocheckchain):
        block = chain[current_index]
        print(f'{last_block}')
        print(f'{block}')
        print("\n-----------\n")
        # Check that the hash of the block is correct
        if block.previous_hash != last_block.hash:
            return False
        last_block = block
        current_index += 1
    return True


def record(requestrecords):
    # extract the record data
    requestrecords = json.loads(requestrecords)
    for i in range(len(requestrecords)):
        new_record = requestrecords[i]
        # Then we add the record to our list
        this_nodes_records.append(new_record)
        # Because the transaction was successfully
        # submitted, we log it to our console
        print("New record")
        print("name: {}\n".format(new_record['borrower_name'].encode('ascii', 'replace')))
        print("ID: {}\n".format(new_record['borrower_id'].encode('ascii', 'replace')))
        print("money: {}\n".format(new_record['funded_amount']))
        print("funding-terms: ()\n".format(new_record['funding_terms']))
    # Then we let the client know it worked out
    return "Record submission successful\n"


#  GET block
def get_blocks(request):
    chain_to_send = chain
    # Convert our blocks into dictionaries
    # so we can send them as json objects later
    for i in range(len(chain_to_send)):
        block = chain_to_send[i]
        block_index = str(block.index)
        block_timestamp = str(block.timestamp)
        block_data = str(block.data)
        block_previous_hash = block.previous_hash
        block_hash = block.hash
        chain_to_send[i] = {
            'index': block_index,
            'timestamp': block_timestamp,
            'data': block_data,
            'previous_hash': block_previous_hash,
            'hash': block_hash
        }
        chain_to_send[i] = json.dumps(chain_to_send[i])
    blockstr = chain_to_send[0]
    for i in range(len(chain_to_send) - 1):
        blockstr = blockstr + '**' + chain_to_send[i + 1]
    return JsonResponse(blockstr, safe=False)


def find_new_chains():
    # Get the blockchains of every other node
    other_chains = []
    for node_url in peer_nodes:
        # Get their chains using a GET request
        block = requests.get(node_url + "get/").content
        print(node_url)
        # Convert the JSON object to a Python dictionary
        print(block)
        block = bytes.decode(block)
        block = json.loads(block)
        print(block)
        # Add it to our list
        blocklist = str.split(block, '**')
        for i in blocklist:
            i = json.loads(i)
        other_chains.append(blocklist)
    return other_chains


def consensus():
    # Get the blocks from other nodes
    othernodeschains = find_new_chains()
    # If our chain isn't longest,
    # then we store the longest chain
    longest_chain = chain
    for i in range(len(longest_chain)):
        chainss = {
            'index': str(longest_chain[i].index),
            'timestamp': str(longest_chain[i].timestamp),
            'data': str(longest_chain[i]),
            'previous_hash': longest_chain[i].previous_hash,
            'hash': longest_chain[i].hash
        }
        longest_chain[i] = chainss
    change = False
    for chains in othernodeschains:
        if len(longest_chain) < len(chains):
            change = True
            longest_chain = chains
    # If the longest chain isn't ours,
    # then we stop mining and set
    # our chain to the longest one
    if change:
        chain.clear()
        chain = [create_genesis_block()]
        Recordnodes.objects.all().delete()
        print("delete origin data")
        for chains in longest_chain:
            chains['data'] = json.dumps(chains['data'])
            chain.append(Block(chains['index'], chains['timestamp'], chains['data'], chains.previous_hash))
            Recordnodes(id=chains['index'], name=chains.data['name'], ID_card=chains.data['ID_card'],
                        money=chains['data']['money'], funding_terms=chains['data']['funding_terms'],
                        default_date=chains['timestamp'], hash_previous=chains['previous_hash'],
                        hash_current=chains['hash']).save()


def mine(requestrecords):
    record(requestrecords)
    last_block = chain[len(chain) - 1]
    # the current block being mined
    # Now we can gather the data needed to create the new block
    printchain()
    for i in range(len(this_nodes_records)):
        new_block_data = {
            'name': this_nodes_records[i]['borrower_name'],
            'ID_card': this_nodes_records[i]['borrower_id'],
            'money': this_nodes_records[i]['funded_amount'],
            'funding_terms': this_nodes_records[i]['funding_terms'],
        }
        new_block_index = last_block.index + 1
        new_block_timestamp = this_nodes_records[i]['should_payback_time']
        last_block_hash = last_block.hash
        # Now create the new block!
        mined_block = Block(
            new_block_index,
            new_block_timestamp,
            new_block_data,
            last_block_hash
        )
        chain.append(mined_block)
        Recordnodes(id=mined_block.index, name=mined_block.data['name'], ID_card=mined_block.data['ID_card'],
                    money=mined_block.data['money'],
                    funding_terms=mined_block.data['funding_terms'], default_date=mined_block.timestamp,
                    hash_previous=mined_block.previous_hash, hash_current=mined_block.hash).save()
        for node_url in peer_nodes:
            # Let the other nodes know we mined a block
            mined_block_dict = mined_block.to_dict()
            # date_time = mined_block_dict['timestamp']
            # mined_block_dict['timestamp'] = date_time.strftime('%Y-%m-%d %H:%I:%S')
            mined_block_json = json.dumps(mined_block_dict)
            print(mined_block_json)
            print(node_url)
            print(requests.post(node_url + "receive/", mined_block_json).content)
        last_block = chain[len(chain) - 1]

    this_nodes_records[:] = []


# find records by ID_card and name
def findbyidname(id_card, need_name):
    default_info = Recordnodes.objects.filter(ID_card=id_card, name=need_name) \
        .values('ID_card', 'name', 'default_date', 'money')
    default_info = list(default_info)
    for i in range(len(default_info)):
        date_time = default_info[i]['default_date']
        default_info[i]['default_date'] = date_time.strftime('%Y-%m-%d %H:%I:%S')
    jsonArray = json.dumps(default_info)
    return jsonArray


def synchronous():
    print(getlastblock())
    print('3')
    print(chain[len(chain) - 1])
    print('4')
    if getlastblock() != chain[len(chain) - 1]:
        print('5')
        getchain()
        print("正在和数据库同步")
    else:
        print("已经同步")
