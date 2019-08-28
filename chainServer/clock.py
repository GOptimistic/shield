import json
import requests
import hashlib as hasher
import datetime as date
from django.http import HttpResponse
from django.http import JsonResponse
from chainServer.models import Recordnodes


class Block:
    def __init__(self, index, timestamp, data, previous_hash):
        self._index = index
        self._timestamp = timestamp
        self._data = data
        self._previous_hash = previous_hash
        self._hash = self.hash_block()

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

    def hash_block(self):
        sha = hasher.sha256()
        temp = str(self._index) + str(self._timestamp) + str(self._data) + str(self._previous_hash)
        sha.update(temp.encode("utf8"))
        return sha.hexdigest()
# get data from Recordnodes to chain
def create_genesis_block():
  # Manually construct a block with
  # index zero and arbitrary previous hash
  return Block(0, date.datetime.now(), {
    "record": None
  }, "0")
chain = [create_genesis_block()]
def getchain():
    recordlist=Recordnodes.objects.all()
    print(len(recordlist))
    for var in recordlist:
        chain.append(Block(var.id,var.default_date,{ 'name': var.name, 'ID':var.ID_card , 'money': var.money,'funding_terms':var.funding_terms},var.hash_previous))
getchain()
def next_block(last_block):
    this_index = last_block.index + 1
    this_timestamp = date.datetime.now()
    this_data = "我是新区块 " + str(this_index)
    this_hash = last_block.hash
    return Block(this_index, this_timestamp, this_data, this_hash)

# A completely random address of the owner of this node
miner_address = "q3nf394hjg-random-miner-address-34nf3i4nflkn3oi"
# This node's blockchain copy
# Store the transactions that
# this node has in a list
this_nodes_records = []
# Store the url data of every
# other node in the network
# so that we can communicate
# with them
peer_nodes = []
# A variable to deciding if we're mining or not
mining = False
# chain = [create_genesis_block()]
# previous_block =chain[0]
# num_of_blocks_to_add = 10
# for i in range(0, num_of_blocks_to_add):
#     block_to_add = next_block(previous_block)
#     chain.append(block_to_add)
#     previous_block = block_to_add
    # print("Block #{} 已经加入区块链!".format(block_to_add.index))
    # print("Hash: {}".format(block_to_add.hash))
    # print("Data: {}\n".format(block_to_add.data))
for i in range(len(chain)):
    print("Block #{} 已经加入区块链!".format(chain[i].index))
    print("Hash: {}".format(chain[i].hash))
    print("Data: {}\n".format(chain[i].data))
print(len(chain))
    # @node.route('/txion', methods=['POST'])
def record(request):
  # On each new POST request,
  # we extract the record data
  new_record = request.get_json()
  # Then we add the transaction to our list
  this_nodes_records.append(new_record)
  # Because the transaction was successfully
  # submitted, we log it to our console
  print ("New record")
  print ("name: {}\n".format(new_record['name'].encode('ascii','replace')))
  print ("ID: {}\n".format(new_record['ID'].encode('ascii','replace')))
  print ("money: {}\n".format(new_record['money']))
  print("funding-terms: ()\n".format(new_record['funding-terms']))
  # Then we let the client know it worked out
  return "Record submission successful\n"
# @node.route('/blocks', methods=['GET'])
#  GET block
  def get_blocks(request):
      pass
#   chain_to_send = chain
#   # Convert our blocks into dictionaries
#   # so we can send them as json objects later
#   for i in range(len(chain_to_send)):
#     block = chain_to_send[i]
#     block_index = str(block.index)
#     block_timestamp = str(block.timestamp)
#     block_data = str(block.data)
#     block_hash = block.hash
#     chain_to_send[i] = {
#       "index": block_index,
#       "timestamp": block_timestamp,
#       "data": block_data,
#       "hash": block_hash
#     }
#     chain_to_send[i] = json.dumps(chain_to_send[i])
#
#   sendstring="区块链详细信息： "
#   for i in range(len(chain_to_send)):
#     sendstring+=str(chain_to_send[i])
#   return HttpResponse(sendstring)

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

# def consensus():
#   # Get the blocks from other nodes
#   other_chains = find_new_chains()
#   # If our chain isn't longest,
#   # then we store the longest chain
#   longest_chain = chain
#   for chains in other_chains:
#     if len(longest_chain) < len(chains):
#       longest_chain = chains
#   # If the longest chain isn't ours,
#   # then we stop mining and set
#   # our chain to the longest one
#   chain = longest_chain

# def proof_of_work(last_proof):
#   # Create a variable that we will use to find
#   # our next proof of work
#   incrementor = last_proof + 1
#   # Keep incrementing the incrementor until
#   # it's equal to a number divisible by 9
#   # and the proof of work of the previous
#   # block in the chain
#   while not (incrementor % 9 == 0 and incrementor % last_proof == 0):
#     incrementor += 1
#   # Once that number is found,
#   # we can return it as a proof
#   # of our work
#   return incrementor

# @node.route('/mine', methods = ['GET'])
def mine(request):
  last_block = chain[len(chain) - 1]
  # the current block being mined
  # we reward the miner by adding a record
  this_nodes_records.append(
    { 'name': 'lww', 'ID': 142328, 'money': 1,'funding_terms':10}
  )
  # Now we can gather the data needed
  # to create the new block
  new_block_data = {
    "record": list(this_nodes_records)
  }
  new_block_index = last_block.index + 1
  new_block_timestamp = date.datetime.now()
  last_block_hash = last_block.hash
  # Empty transaction list
  this_nodes_records[:] = []
  # Now create the
  # new block!
  mined_block = Block(
    new_block_index,
    new_block_timestamp,
    new_block_data,
    last_block_hash
  )
  chain.append(mined_block)
  # Let the client know we mined a block
  return JsonResponse({
      "index": new_block_index,
      "timestamp": str(new_block_timestamp),
      "data": new_block_data,
      "hash": last_block_hash
  })

def show(request):
     showtext=""
     for i in chain:
         showtext+="Block #{}  ".format(i.index)
         showtext+="recorddata: {}".format(i.data)
         showtext+="hash:  {}".format(i.hash)
     return HttpResponse(showtext)
