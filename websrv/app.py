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
  

#########################


def GpioAction(inDuration):
  if IsGpioAvail:
    aChannelMapping = GPIO.BCM
    aRelayChannel = 4
    #
    GPIO.setmode(aChannelMapping)
    GPIO.setup(aRelayChannel, GPIO.OUT, initial=GPIO.LOW)
    #...........#
    GPIO.output(4, GPIO.HIGH)
    sleep( inDuration )
    GPIO.output(4, GPIO.LOW)
    #...........#
    GPIO.cleanup()
  else:
    #...........#
    sleep( inDuration )
    #...........#
    

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
  turbo.push(turbo.update(
    #render_template('knock.html', BtnResponseText='got it right'),
    'got it right',
    'BtnResponseDiv'
  ))
  #...........#
  GpioAction( 0.5 )
  #...........#
  sleep( 1.5 )
  #...........#
  turbo.push(turbo.update(
    render_template('knock_form.html'), 'KnockFormDiv'
  ))
  turbo.push(turbo.update(
    #render_template('knock.html', BtnResponseText=' '),
    ' ',
    'BtnResponseDiv'
  ))
  return ''


def HandleWrongKey():
  turbo.push(turbo.update(
    #render_template('knock.html', BtnResponseText='Wrong digits. Try again.'),
    'Wrong digits. Try again.',
    'BtnResponseDiv'
  ))
  #...........#
  sleep( 2.5 )
  #...........#
  turbo.push(turbo.update(
    render_template('knock_form.html'), 'KnockFormDiv'
  ))
  turbo.push(turbo.update(
    #render_template('knock.html', BtnResponseText=' '),
    ' ',
    'BtnResponseDiv'
  ))
  return ''


#########################


app = Flask(__name__)
turbo = Turbo(app)



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
          return HandleRightKey()
        else:
          return HandleWrongKey()          
    elif request.method == 'GET':
        return render_template('knock.html', KnockFormHtml=render_template('knock_form.html'))
        #return turbo.push(turbo.update( render_template('knock_form.html'), 'KnockFormDiv' ))
    else:
        return 'Not a valid request method for this route'


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')