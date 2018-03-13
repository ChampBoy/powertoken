"""
module common\n
Functions common to both the weconnect and fitbit modules.\n
Created by Abigail Franz on 2/16/2018\n
Last modified by Abigail Franz on 2/20/2018
"""

import logging, requests

logging.basicConfig(filename="pt.log", level=logging.DEBUG, 
		format="%(asctime)s: %(message)s", datefmt="%m/%d/%Y %I:%M:%S %p")

def is_valid(response):
	"""
	Return a Boolean value indicating the success of an HTTP request.
	"""
	if response.status_code >= 300:
		logging.error(format(" Request could not be completed. Error: %d %s" 
				% (response.status_code, response.text)))
		return False
	else:
		return True