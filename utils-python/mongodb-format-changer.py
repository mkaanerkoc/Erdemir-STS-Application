import requests
import json
import pymongo
from datetime import datetime,timedelta
import sys
import time
import random
import math



from bson.json_util import dumps
from pymongo import MongoClient


def oldDatabase(channelID):
    local_client = MongoClient("localhost",27017)
    local_db = local_client['test-database']
    cursor = local_db['posts.d'+str(channelID)].find().sort([("serverDt",pymongo.DESCENDING)])
    for document in cursor:
        dumps(document)
        nl = {'serverDt': document['serverDt'],
        'tempC': document['tempC'],
        'humdC':document['humdC'],
        'temp1':document['temp1'],
        'temp2':document['temp2'],
        'mCrc':document['mCrc'],
        'rssi':document['rssi'],
        'devID':document['devID'],
        'nodeDt':document['nodeDt']}
        #print json.dumps(nl)
        collection = local_db['posts.alldata']
        collection.insert_one(nl)



oldDatabase(1)
oldDatabase(2)
oldDatabase(3)
oldDatabase(4)
oldDatabase(5)
oldDatabase(6)
oldDatabase(8)
oldDatabase(9)
oldDatabase(10)
