import json
import requests
import hashlib as hasher
import datetime as date
from django.http import JsonResponse
from chainServer.models import Recordnodes


class Block:
    def __init__(self, index, timestamp, data, previous_hash):
        self._index = index
        self._timestamp = timestamp
        self._data = data
        self._previous_hash = previous_hash
        self._hash = self.hash_block()

    def to_block(self, blockdict):
        self._index = blockdict.index
        self._timestamp = blockdict.timestamp
        self._data = blockdict.data
        self._previous_hash = blockdict.previous_hash
        self._hash = blockdict.hash

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
    return Block(0, date.datetime.now(), None, "0")


chain = [create_genesis_block()]
my_url = 'https://49.232.23.19:8001/'


# get data from Recordnodes to chain
def getchain():
    recordlist = Recordnodes.objects.all()
    for var in recordlist:
        chain.append(Block(var.id, var.default_date, {'name': var.name, 'ID': var.ID_card, 'money': var.money,
                                                      'funding_terms': var.funding_terms}, var.hash_previous))


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
peer_nodes = ['https://139.219.2.48']


def printchain():
    for i in range(len(chain)):
        print("Block #{} 已经加入区块链!".format(chain[i].index))
        print("Hash: {}".format(chain[i].hash))
        print("Data: {}\n".format(chain[i].data))
    print(len(chain))


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
        print("money: {}\n".format(new_record['borrower_sum']))
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
        chain_to_send = json.dumps(chain_to_send)
    return JsonResponse(chain_to_send)


def find_new_chains():
    # Get the blockchains of every other node
    other_chains = []
    for node_url in peer_nodes:
        # Get their chains using a GET request
        block = requests.get(node_url + "/get").content
        # Convert the JSON object to a Python dictionary
        block = json.loads(block)
        # Add it to our list
        other_chains.append(block)
    return other_chains


def consensus():
    # Get the blocks from other nodes
    othernodeschains = find_new_chains()
    # If our chain isn't longest,
    # then we store the longest chain
    longest_chain = chain
    for chains in longest_chain:
        chains = {
            'index': str(chains.index),
            'timestamp': str(chains.timestamp),
            'data': str(chains.data),
            'previous_hash': chains.previous_hash,
            'hash': chains.hash
        }
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
        Recordnodes.objects.all().delete()
        print("delete origin data")
        for chains in longest_chain:
            chains.data = eval(chains.data)
            chain.append(Block(chains.id, chains.default_date, chains.data, chains.previous_hash))
            Recordnodes(id=chains.index, name=chains.data['name'], ID_card=chains.data['ID'],
                        money=chains.data['money'], funding_terms=chains.data['funding_terms'],
                        default_date=chains.timestamp, hash_previous=chains.previous_hash,
                        hash_current=chains.hash).save()


def mine(requestrecords):
    record(requestrecords)
    last_block = chain[len(chain) - 1]
    # the current block being mined
    # Now we can gather the data needed to create the new block
    for i in range(len(this_nodes_records)):
        new_block_data = {
            'name': this_nodes_records[i]['borrower_name'],
            'ID': this_nodes_records[i]['borrower_id'],
            'money': this_nodes_records[i]['borrower_sum'],
            'funding_terms': this_nodes_records[i]['funding_terms'],
        }
        new_block_index = last_block.index + 1
        new_block_timestamp = date.datetime.now()
        last_block_hash = last_block.hash

        # Now create the new block!
        mined_block = Block(
            new_block_index,
            new_block_timestamp,
            new_block_data,
            last_block_hash
        )
        chain.append(mined_block)
        for node_url in peer_nodes:
            # Let the other nodes know we mined a block
            requests.post(node_url + "/receive", data=mined_block.to_dict())
        last_block = chain[len(chain) - 1]
        Recordnodes(id=mined_block.index, name=mined_block.data['name'], ID_card=mined_block.data['ID'],
                    money=mined_block.data['money'],
                    funding_terms=mined_block.data['funding_terms'], default_date=mined_block.timestamp,
                    hash_previous=mined_block.previous_hash, hash_current=mined_block.hash).save()

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
