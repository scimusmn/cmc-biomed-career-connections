/*
  Control.h - Control library for power distribution Gateway to Science
  Joe Meyer created 10/17/2019 at the science museum of mn
*/

#include "Arduino.h"
#include "source.h"

Source::Source(SerialController *_serial, char _name[7], int _pin)
{
  pin = _pin;
  pinMode(pin, INPUT);
  this->serialCont = _serial;
  name = _name;
}

// Public Methods //////////////////////////////////////////////////////////////
void Source::sendIfNew()
{
  percent = analogRead(pin);
  percent = map(percent, 40, 350, 0, 100);
  percent = constrain(percent, 0, 100);
  if (percent != prevPercent)
  {
    prevPercent = percent;
    serialCont->sendMessage(name, percent);
  }
}