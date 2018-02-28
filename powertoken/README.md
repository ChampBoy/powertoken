# PowerToken Flask App 
### (Last Update, 1/29/2018)


## Dependencies:

* Python 2.7 (but should be compatible with Python 3)
* Flask (http://flask.pocoo.org/)
* TinyDB (http://tinydb.readthedocs.io/en/latest/intro.html)
* JavaScript Fetch API (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
* Fitbit Web API (https://dev.fitbit.com/reference/web-api/quickstart/)
* WEconnect Web API (documentation not available to the public)
* Python requests API (http://docs.python-requests.org/en/v0.10.6/user/install/#distribute-pip)

## Client Side:

The user navigates to the URL on which the application is hosted (currently https://powertoken.grouplens.org/). If he is not logged in, he will see "SIGN UP / SIGN IN" button. Clicking the button takes him to the PowerToken sign up / sign in page. He enters the username we gave him into the form field and clicks "NEXT". If he has already signed up with PowerToken, he is redirected to the homepage and is good to go.

If the user has never logged into PowerToken before, she is redirected to the WEconnect login page and must enter her WEconnect credentials. These credentials are not seen or saved by the researchers. Upon clicking next, she is redirected to the Fitbit login page, where she must grant the application permission to access her data. Then she is sent back to the homepage.

Back on the homepage, the user will see a welcome message and a "START" button. Clicking the "START" button will begin the PowerToken experiment.


## Server Side:

Run `python routes.py` at the command line to start the Flask server. The server will serve all webpages as part of the app. Check your server output to see what port it's running on (usually something like localhost:5000). We have ours set to run on an Apache/2.4.18 (Ubuntu) Server at powertoken.grouplens.org:443.

In routes.py you will see a collection of methods that are mapped to URLs (routes). You shouldn't try to manually enter these URLs because some require HTTP data.

In the /templates folder, you will see a collection of HTML files. These are served and modified by the Python code. They are very minimal. The key files are [home.html](templates/home.html) (the landing page), [pt_login.html](templates/pt_login.html), [wc_login.html](templates/wc_login.html), [fb_login.html](templates/fb_login.html), and [running.html](templates/running.html).

Similar to the routes, manually entering an HTML template might not yield the behavior you expect, because some of the templates are not hard-coded HTML, but populated by the Python code as they are served.

In the /static folder, you will find the golden egg. The JavaScript file [fb_login.js](static/fb_login.js) (which is run from [fb_login.html](templates/fb_login.html)) logs the user into Fitbit, goes through the OATH process, and sends an access code back to the server via the POST method of the /fb_login route. There is probably a more finessed way of doing this, but hey, it works.

The remainder of the code is in Python. The three classes used by the application are `PowerToken`, `WeConnect`, and `Fitbit`, which are located in the [powertoken.py](powertoken.py), [weconnect.py](weconnect.py), and [fitbit.py](fitbit.py) files, respectively. As might be expected, the `WeConnect` class handles API calls to WEconnect and the `Fitbit` class handles API calls to Fitbit. The `PowerToken` class mediates the interaction between the two endpoints.

The information entered by the user is not saved, only the access tokens and IDs received from the APIs.


## Tips:

It's best to use a virtualenv to setup Flask; see the Flask documentation for details.

Using the Fitbit API requires additional setup--if you don't have an account and app set up, see the Web API quickstart. This app uses implicit OATH flow (implemented with JavaScript / HTML), saves the access token to a JSON-based database on the server, and completes all subsequent API calls in Python.

You may want to keep the Flask server running even when you close your SSH session. In this case, the command `nohup python routes.py &` should do the trick. Should you want to kill the process, you will have to do so manually.

An alternative to using `nohup` is to make use of the Linux `screen` module. Create a new screen with the command `screen -r powertoken` and then run `python routes.py`. When you want to disconnect, type `Ctrl+A d`, and you may now close your SSH session. When you want to reconnect, just type `screen -r powertoken` to reconnect to the powertoken screen.