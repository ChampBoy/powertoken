from sqlalchemy import event
from sqlalchemy.event import listen
from sqlalchemy.pool import Pool

from background.database import db_session
from background.models import User,Activity,Event

def append_listener(target,initiator):
    print("Received modification for "+str(target))

listen(Event.completed,'modified',append_listener)