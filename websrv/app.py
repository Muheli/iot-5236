from flask import Flask, render_template, url_for, request
from turbo_flask import Turbo
from time import sleep
import sys, os, json, signal
#import subprocess

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
    GPIO.setup(aRelayChannel, GPIO.OUT, initial=GPIO.HIGH)
    #GPIO.setup(aRelayChannel, GPIO.OUT)
    #...........#
    GPIO.output(aRelayChannel, GPIO.LOW)
    sleep( inDuration )
    GPIO.output(aRelayChannel, GPIO.HIGH)
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
        
        
@app.route('/server',  methods=['DELETE'])
def server():
    if request.method == 'DELETE':
      #raise RuntimeError('App shutdown requested ...')
      #subprocess.run("shutdown -h 0", shell=True, check=True)
      #shutdown_func = request.environ.get('werkzeug.server.shutdown')
      #if shutdown_func is None:
      #  raise RuntimeError('Not running werkzeug')
      #shutdown_func()
      #sys.exit('App shutdown requested ...')
      #
      # https://stackoverflow.com/a/60092131/19846634
      os.kill(os.getpid(), signal.SIGINT)
      return jsonify({ "success": True, "message": "Shutting down this Flask server app..." })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')