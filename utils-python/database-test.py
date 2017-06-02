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


def testDatabase(channelID):
    aboveRow=0
    belowRow=0
    local_client = MongoClient("localhost",27017)
    local_db = local_client['test-database']
    cursor = local_db['posts.d'+str(channelID)].find().sort([("serverDt",pymongo.DESCENDING)])
    aboveRow = cursor[0]
    for document in cursor:
        dumps(document)




oldDatabase(1)
oldDatabase(2)
oldDatabase(3)
oldDatabase(4)
oldDatabase(5)
oldDatabase(6)
oldDatabase(8)
oldDatabase(9)
oldDatabase(10)
