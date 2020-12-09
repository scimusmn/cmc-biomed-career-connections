/*
  control.h - Control library for power distribution Gateway to Science
  Joe Meyer created 10/17/2019 at the science museum of mn
*/
#include "Arduino.h"
#include "arduino-base/Libraries/SerialController.hpp"

// ensure this library description is only included once
#ifndef Source_h
#define Source_h

// library interface description
class Source
{
  // user-accessible "public" interface
public:
  Source(SerialController *, char[7], int); //neopixel, first pixel
  void sendIfNew();
  int prevPercent;

  // library-accessible "private" interface
private:
  int percent;
  char *name;
  int pin;
  SerialController *serialCont;
};

#endif