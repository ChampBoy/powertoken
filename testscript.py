from datetime import datetime, time, timedelta, MAXYEAR
import argparse, requests, sys, traceback, json
from background.database import db_session
from background.models import User,Activity,Event

def main():
    users=db_session.query(User).all()
    for user in users:
        print("User id : "+str(user.wc_id))
    # print(users)
    activities=db_session.query(Activity).filter_by(user_id=5).all()
    print(activities)
    db_session.delete(activities[0])
    db_session.delete(activities[1])
    db_session.delete(activities[2])
    db_session.commit()
    activities=db_session.query(Activity).all()
    # events=db_session.query(Event).all()
    # print(events)
    db_session.close()
    print(activities)

if __name__ == "__main__":
    main()