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

url1 = 'http://5.11.157.98/v1/site/'
url2 = 'http://5.11.240.184/v1/site/'

def GetFirstEntry(siteID,channelID,Interval):
    url = ""
    if siteID==1:
        url="2017-05-30T13:00:00"
    elif siteID==2:
        url="2017-05-30T13:00:00"
    url = datetime.strptime( url, "%Y-%m-%dT%H:%M:%S" )
    lastDateTime = (url + timedelta(seconds = 2)).isoformat()
    endDateTime  = (url + timedelta(minutes = Interval)).isoformat()
    return {'s':lastDateTime,'e':endDateTime}

def FindLastEntry(channelID,Interval):
    local_client = MongoClient("localhost",27017)
    local_db = local_client['test-database']
    if channelID == 7:
        return 0x00
    if channelID < 1:
        return 0x00
    if channelID > 10:
        return 0x00
    cursor = local_db['posts.alldata'].find({'devID':channelID}).sort([("serverDt",pymongo.DESCENDING)]).limit(1)
    for document in cursor:
        dumps(document)
        lastDateTime = (document['serverDt']+ timedelta(seconds = 1       )).isoformat()
        endDateTime  = (document['serverDt'] +timedelta(minutes = Interval)).isoformat()
        return {'s':lastDateTime,'e':endDateTime}


def calculateDifferenceinMin(date1,date2):
    d1_ts = time.mktime(date1.timetuple())
    d2_ts = time.mktime(date2.timetuple())
    return int(d2_ts-d1_ts) / 60


def GetOldDatas(channelID,itemCount):
    count = 0
    client = MongoClient('localhost', 27017)
    local_db = client['test-database']
    cursor = local_db['posts.alldata'].find({'devID':channelID}).sort([("serverDt",pymongo.DESCENDING)]).limit(itemCount)
    aboveRow=0
    belowRow=0
    aboveRow = cursor[0]
    dumps(aboveRow)
    #print "Start row : "+str(aboveRow)
    for belowRow in cursor:
        dumps(belowRow)
        belowRow['serverDt'] = belowRow['serverDt'].replace(second=0, microsecond=0)
        aboveRow['serverDt'] = aboveRow['serverDt'].replace(second=0, microsecond=0)
        timeDiff = calculateDifferenceinMin(belowRow['serverDt'],aboveRow['serverDt'])
        if timeDiff>1 and timeDiff < 180:
            #print str(timeDiff) +"  "+
            dTemp1 = (oldTemp1-float(belowRow['temp1']))/(timeDiff)
            dTemp2 = (oldTemp2-float(belowRow['temp2']))/(timeDiff)
            dTempC = (oldTempC-float(belowRow['tempC']))/(timeDiff)
            dHumdC = (oldHumdC-float(belowRow['humdC']))/(timeDiff)

            lastTemp1=oldTemp1
            lastTemp2=oldTemp2
            lastTempC = oldTempC
            lastHumdC = oldHumdC
            lastRSSI = oldRSSI

            for i in range(1,timeDiff):
                count = count + 1
                #print(aboveRow['serverDt'] + timedelta(minute=i))
                lastTemp1 = lastTemp1 - dTemp1 + (random.random()*0.08)-0.04
                lastTemp1 = float(format(round(lastTemp1,2)))

                lastTemp2 = lastTemp2 - dTemp2 + (random.random()*0.08)-0.04
                lastTemp2 = float(format(round(lastTemp2,2)))

                lastTempC = lastTempC - dTempC + (random.random()*0.1)-0.05
                lastTempC = float(format(round(lastTempC,2)))

                lastHumdC = lastHumdC - dHumdC + (random.random()*0.1)-0.05
                lastHumdC = float(format(round(lastHumdC,2)))
                #print "*"+str(aboveRow['serverDt'] - timedelta(minutes=i))+" "+ str(lastTemp1)+" "+ str(lastTemp2)+" "+ str(lastTempC)+" "+ str(lastHumdC)
                local_db['posts.alldata'].insert_one({'serverDt':aboveRow['serverDt'] - timedelta(minutes=i),'nodeDt':(aboveRow['serverDt'] - timedelta(minutes=i)).strftime('%H:%M:%S-%d/%m/%Y'),'devID':channelID,'temp1':lastTemp1,'temp2':lastTemp2,'tempC':lastTempC,'humdC':lastHumdC
                ,'rssi':lastRSSI+random.randint(-10,10),'mCrc':23235})

        aboveRow=belowRow
        oldTemp1 = belowRow['temp1']
        oldTemp2 = belowRow['temp2']
        oldTempC = belowRow['tempC']
        oldHumdC = belowRow['humdC']
        oldRSSI  = belowRow['rssi']

    print "Received old datas count is : " +str(count) + " for channel : "+str(channelID)

def InsertNewItemsToLocal(response,channelID):
    client = MongoClient('localhost', 27017)
    local_db = client['test-database']
    count = 0
    if len(response)<1:
        return
    print "The last available data at : "+response[0]['serverDt']
    for l in response:
        count = count + 1
        #print l
        srvDt = datetime.strptime(l['serverDt'],"%Y-%m-%dT%H:%M:%S.%fZ")
        nl = {'serverDt': srvDt,
        'tempC': l['tempC'],
        'humdC':l['humdC'],
        'temp1':l['temp1'],
        'temp2':l['temp2'],
        'mCrc':l['mCrc'],
        'rssi':l['rssi'],
        'devID':l['devID'],
        'nodeDt':srvDt.strftime('%H:%M:%S-%d/%m/%Y')}
        collection = local_db['posts.alldata']
        collection.insert_one(nl)

    GetOldDatas(channelID,len(response)*2)
    print str(count) + " items have added"
    print "Data syncing finished for Site " + str(channelID)



def CollectData(siteID,channelID,Interval):
    print "***************************************"
    print "Data syncing started for Site " + str(channelID)
    url = ""
    if siteID==1:
        url=url1
    elif siteID==2:
        url=url2
    else:
        print "Wrong Site ID"
        return
    url = url +str(channelID)+"/data/"
    dateObj = FindLastEntry(channelID,Interval)
    if dateObj is None:
        dateObj = GetFirstEntry(siteID,channelID,Interval)
    lastDateTime = dateObj['s']
    toDateTime   = dateObj['e']
    print "The start date/time is     : "+dateObj['s']
    print "The end date/time is       : "+dateObj['e']
    payload = {'from': lastDateTime, 'to': toDateTime,'limit':str(Interval*2),'timebase':'1'}
    r = requests.get(url,timeout=10, params=payload)
    InsertNewItemsToLocal(json.loads(r.text),channelID)

def CollectTask(interval):
    CollectData(1,1,interval)
    CollectData(1,2,interval)
    CollectData(1,3,interval)
    CollectData(1,4,interval)
    CollectData(1,5,interval)
    CollectData(1,6,interval)
    CollectData(2,8,interval)
    CollectData(2,9,interval)
    CollectData(2,10,interval)

CollectTask(960)
