from datetime import datetime, time, timedelta, MAXYEAR
import argparse, requests, sys, traceback, json
from background.database import db_session
from background.models import User,Activity,Event
jToken = 'erv3IiyWl91s49DgXvpFxxtjR9LrlDfElApWpVY3BRiEWC2B72aPH9DxRfDgnvnV'
# Checks whether all activities of a user have been completed
def check_completion(id,token):
    today = datetime.now()
    st = today.strftime("%Y-%m-%dT00:00:00")
    et = today.strftime("%Y-%m-%dT23:59:59")
    BASE_URL = "https://palalinq.herokuapp.com/api/people"
    req = requests.get(BASE_URL+"/"+str(id)+"/activities-with-events",params={"access_token":token,"from":st,"to":et})
    if check(req):
        jreq= req.json()
        prettyprint(jreq)
    else:
        print("Failure in getting todays events")
        return 
    
    total_event_count=0
    total_events_completed=0
    for activity in jreq:
        for event in activity["events"]:
            total_event_count+=1
            print("Event id: "+str(event["eid"]))
            print(event["didCheckin"])
            if(event["didCheckin"]):
                print("User checked in")
                total_events_completed+=1

    print("Total events : "+str(total_event_count))
    print("Total Completed events : "+str(total_events_completed))

def check(request):
	if request.status_code != 200:
		raise RuntimeError("Request could not be completed"+ str(req.status_code)+req.text)
	else:
		print("Request success!")
		return True

def main():
    check_completion(2175,jToken)

def prettyprint(file):
    print(json.dumps(file, indent=2))   
if __name__ == "__main__":
    main()

## db_session.add(User)