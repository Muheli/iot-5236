from flask import Flask, render_template
from time import sleep
import sys
import os

GpioStatusStr = 'unknown GPIO status'
try:
  import RPi.GPIO as GPIO
  GpioStatusStr = 'GPIO present'
except ImportError:
  GpioStatusStr = 'GPIO not present'

Relay_channel = [17, 18]

#########################

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html',
      inSysInfoA = sys.platform,
      inSysInfoB = os.name,
      inSysInfoC = GpioStatusStr )

@app.route('/knock-knock')
def knk():
    return 'Whoz there?'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')