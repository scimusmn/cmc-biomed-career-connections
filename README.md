# SMM application template
Basic Gatsby/React template for starting a new kiosk or web project.

## Installation
Clone the template as a new project
```bash
# (Using SSH)
$ git clone git@github.com:scimusmn/app-template.git project-name
$ cd project-name
$ git remote set-url origin git@github.com:scimusmn/project-name.git

# (Using HTTPS)
$ git clone https://github.com/scimusmn/app-template.git project-name
$ cd project-name
$ git remote set-url origin https://github.com/scimusmn/project-name.git
```
> TODO: Change configs as well

Install dependencies with yarn
```
$ yarn
```
## Setting up serial communication
If you want to enable serial communication, via Stele, for this app, you'll need to register an `ipcRenderer` from `Electron` and import the [`arduino-base`](https://github.com/scimusmn/arduino-base) sub-module. This has all been automated with the following script: 
```bash
yarn install:arduino-base
```
Upon completion, you will see a new page at `src/pages/arduino.js` that can be used for testing Arduino communication.


## Cleanup
Once you're done going through the setup of this template, delete everything above this line and start filling out the README with your app details.

***

# Project: Application name

## Usage (required)
* Describe where this code used.
* Describe if this code is installed on a specific computer or can be generally installed on any computer.
* Describe the physical location where this code is used. Describe which computer this code is installed on. Describe this computer's location, including building, institution, museum, traveling show, gallery, and/or floor.

## About (required)
Technical description of this code.
* Describe the technical systems or languages that this code uses.
* Provide a brief overview of how the technical system works.

## Install (required)
Basic install instructions. This might describe the script's file path.

## TODO (optional)
This isn't a place to list every bug and issue, but it might serve as a useful place to mention big features that we'd like to add.
