//**************************************************************//
//  Component: Energy Distribution                              //
//  Project: Gateway to Science                                 //
//  Author  : Joe Meyer                                         //
//  Date    : 11/24/2020                                        //
//  Version : 2.0                                               //
//  Description : Control Panel sends events to React           //
//****************************************************************
#include <Adafruit_NeoPixel.h>
#include "source.h"
#include "arduino-base/Libraries/SerialController.hpp"
#include "arduino-base/Libraries/Button.h"

//Pin assignments
const int neopixel_pin = 6;
const int start_btn_pin = 5;
const int start_btn_LED_pin = 7;
const int shift_in_latch_pin = 4;
const int shift_in_data_pin = 3;
const int shift_in_clock_pin = 2;
const int hydro_1_input_pin = A1;

SerialController serialController;
const long baudrate = 115200;

// message associated with the state of each shift in bit.
char *shiftInStrings[] = {
    "coal-1-jack",   //1
    "coal-2-jack",   //2
    "coal-3-jack",   //3
    "coal-4-jack",   //4
    "gas-1-jack",    //5
    "gas-2-jack",    //6
    "gas-3-jack",    //7
    "gas-4-jack",    //8
    "hydro-1-jack",  //9
    "hydro-2-jack",  //10
    "hydro-3-jack",  //11
    "hydro-4-jack",  //12
    "wind-1-jack",   //13
    "wind-2-jack",   //14
    "wind-3-jack",   //15
    "wind-4-jack",   //16
    "solar-1-jack",  //17
    "solar-2-jack",  //18
    "solar-3-jack",  //19
    "solar-4-jack",  //20
    "coal-1-switch", //21
    "coal-2-switch", //22
    "coal-3-switch", //23
    "coal-4-switch", //24
};

long cableStates, prevCableStates;
unsigned long currentMillis, prevSendMillis = 0;

// Declare NeoPixel strip object for bar graphs:
Adafruit_NeoPixel pixels(95, neopixel_pin, NEO_GRB + NEO_KHZ800);
Button startButton;
Source hydro1(&serialController, "hydro-1-lever", hydro_1_input_pin);

void setup()
{
    // Ensure Serial Port is open and ready to communicate
    serialController.setup(baudrate, &onParse);

    //define pin modes
    pinMode(start_btn_LED_pin, OUTPUT);
    pinMode(shift_in_latch_pin, OUTPUT);
    pinMode(shift_in_clock_pin, OUTPUT);
    pinMode(shift_in_data_pin, INPUT);

    startButton.setup(start_btn_pin, [](int state) {
        if (state == 1)
        {
            serialController.sendMessage("start-button", "1");
        }
    });

    pixels.begin();
    pixels.clear();
    pixels.show();
}

void loop()
{
    currentMillis = millis();

    if ((currentMillis - prevSendMillis) > 200)
    {
        updateJacksSwitches();
        hydro1.sendIfNew();
        // lightBarGraph(10, hydro1.prevPercent);
    }
    startButton.update();
    serialController.update();
}

void updateJacksSwitches()
{
    //Pulse the latch pin:
    //set it to 1 to collect parallel data
    digitalWrite(shift_in_latch_pin, 1);
    //set it to 1 to collect parallel data, wait
    delayMicroseconds(20);
    //set it to 0 to transmit data serially
    digitalWrite(shift_in_latch_pin, 0);

    byte statesIn;
    //while the shift register is in serial mode
    //collect each shift register into a byte
    //the register attached to the chip comes in first
    statesIn = shiftIn(shift_in_data_pin, shift_in_clock_pin);
    cableStates = statesIn;
    statesIn = shiftIn(shift_in_data_pin, shift_in_clock_pin);
    cableStates = cableStates << 8;
    cableStates = cableStates | statesIn;

    statesIn = shiftIn(shift_in_data_pin, shift_in_clock_pin);
    cableStates = cableStates << 8;
    cableStates = cableStates | statesIn;

    statesIn = shiftIn(shift_in_data_pin, shift_in_clock_pin);
    cableStates = cableStates << 8;
    cableStates = cableStates | statesIn;

    if (prevCableStates != cableStates) // if the states changed...
    {
        long mask = 1;               // create a mask
        for (int n = 0; n < 24; n++) // iterate through each bit
        {
            if ((mask & prevCableStates) != (mask & cableStates)) //check if the bit changed since last state change.
            {
                if (mask & cableStates)                                   // jack pin is high (not connected)
                    serialController.sendMessage(shiftInStrings[n], "1"); // cable is removed
                else
                    serialController.sendMessage(shiftInStrings[n], "0"); // cable is inserted
            }

            mask = mask << 1; // shift the mask to check the next bit
        }
        prevCableStates = cableStates;
    }
}

byte shiftIn(int myDataPin, int myClockPin)
{
    int i;
    int temp = 0;
    int pinState;
    byte myDataIn = 0;

    pinMode(myClockPin, OUTPUT);
    pinMode(myDataPin, INPUT);

    for (i = 7; i >= 0; i--)
    {
        digitalWrite(myClockPin, 0);
        delayMicroseconds(0.2);
        temp = digitalRead(myDataPin);
        if (temp)
        {
            pinState = 1;
            //set the bit to 0 no matter what
            myDataIn = myDataIn | (1 << i);
        }
        else
        {
            pinState = 0;
        }
        digitalWrite(myClockPin, 1);
    }
    return myDataIn;
}

// this function will run when serialController reads new data
void onParse(char *message, char *value)
{
    if (strcmp(message, "start-button-light") == 0)
    {
        digitalWrite(start_btn_LED_pin, atoi(value));
    }

    else if (strcmp(message, "solar-1-light-bar") == 0)
    {
        lightBarGraph(80, atoi(value)); // value of first pixel to be lit.
    }
    else if (strcmp(message, "solar-2-light-bar") == 0)
    {
        lightBarGraph(20, atoi(value)); // value of first pixel to be lit.
    }
    else if (strcmp(message, "wind-1-light-bar") == 0)
    {
        lightBarGraph(40, atoi(value)); // value of first pixel to be lit.
    }
    else if (strcmp(message, "wind-2-light-bar") == 0)
    {
        lightBarGraph(60, atoi(value)); // value of first pixel to be lit.
    }
    else if (strcmp(message, "coal-1-light") == 0) //TODO
    {
        lightPixel(0, value);
    }

    else if (strcmp(message, "coal-2-light") == 0) //TODO
    {
        lightPixel(1, value);
    }
    else if (strcmp(message, "coal-3-light") == 0) //TODO
    {
        lightPixel(2, value);
    }

    else if (strcmp(message, "get-all-states") == 0) //TODO
    {
        prevCableStates = ~prevCableStates;
        hydro1.prevPercent = 101;
    }

    else if (strcmp(message, "wake-arduino") == 0 && strcmp(value, "1") == 0)
    {
        // you must respond to this message, or else
        // stele will believe it has lost connection to the arduino
        serialController.sendMessage("arduino-ready", "1");
    }
    else
    {
        // helpfully alert us if we've sent something wrong :)
        serialController.sendMessage("unknown-command", "1");
    }
}

void lightPixel(int pixel_index, char *status)
{
    if (strcmp(status, "on") == 0)
        pixels.setPixelColor(pixel_index, pixels.Color(0, 75, 0));
    else if (strcmp(status, "warming") == 0)
        pixels.setPixelColor(pixel_index, pixels.Color(40, 10, 0));
    else if (strcmp(status, "off") == 0)
        pixels.setPixelColor(pixel_index, pixels.Color(0, 0, 0));

    pixels.show();

    //TODO
}

void lightBarGraph(int first_pixel, int percent) // displays an int, 0-100 on 8 neopixels given a starting pixel.
{
    percent = constrain(percent, 0, 100);
    int bar = percent * 2;
    for (int i = 0; i < 8; i++)
    {
        if (bar > 25)
        {
            pixels.setPixelColor(first_pixel + i, pixels.Color(0, 25, 0));
            bar = bar - 25;
        }
        else
        {
            pixels.setPixelColor(first_pixel + i, pixels.Color(0, bar, 0));
            bar = 0;
        }
    }
    pixels.show();
}