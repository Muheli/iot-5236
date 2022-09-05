from flask import Flask, render_template, url_for, request
from turbo_flask import Turbo
from time import sleep
import sys
import os

IsGpioAvail = False
try:
  import RPi.GPIO as GPIO
  IsGpioAvail = True
except ImportError:
  print('GPIO not available for import.')
  
if IsGpioAvail:
  ChannelMapping = GPIO.BCM
  RelayChannel = 4

#########################

def IsProperGarageKey(inFormSelectList):
  aProperList = ['digit_1', 'digit_9']
  aMatchCt = 0;
  #
  for aSelection in inFormSelectList:
    if aSelection in aProperList:
      aMatchCt = aMatchCt + 1;
  #
  if (
    ( len(aProperList) == aMatchCt )
    and
    ( len(inFormSelectList) == aMatchCt )
  ):
    return True     # "Got it right"
  else:
    return False    # "Wrong digits. Try again."


def HandleRightKey():
  render_template('knock.html', BtnResponse='got it right')
  sleep( 0.5 )
  return render_template('knock.html')


def HandleWrongKey():
  render_template('knock.html', BtnResponse='Wrong digits. Try again.')
  sleep( 2.5 )
  return render_template('knock.html')


#########################


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html',
      inSysInfoA = sys.platform,
      inSysInfoB = os.name,
      inSysInfoC = 'GPIO present' if IsGpioAvail else 'GPIO not present' )


@app.route('/knock', methods=['GET', 'POST'])
def knock():
    if request.method == 'POST':
        if IsProperGarageKey(request.form):
          return render_template('knock.html', BtnResponse='got it right')
        else:
          return render_template('knock.html', BtnResponse='got it wrong')          
    elif request.method == 'GET':
        return render_template('knock.html')
    else:
        return 'Not a valid request method for this route'


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')