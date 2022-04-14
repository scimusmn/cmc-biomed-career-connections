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

Create a matching remote repo with the same project name (`scimusmn/project-name`) using the GitHub [website](https://github.com/scimusmn/) or [CLI](https://cli.github.com/).

Set appropriate [repo permissions](https://smm.atlassian.net/wiki/spaces/MED/pages/6488196/Git+-+SMM+central+repo+-+GitHub#Repo-permissions) so others have access.


## Setting up serial communication
If you want to enable serial communication, via Stele, for this app, you'll need to register an `ipcRenderer` from `Electron` and import the [`arduino-base`](https://github.com/scimusmn/arduino-base) sub-module. This has all been automated with the following script: 
```bash
yarn install:arduino-base
```
Upon completion, you will see a new page at `src/pages/arduino.js` that can be used for testing Arduino communication.

## Using Contentful as a CMS
To connect your application to Contentful, first gather the following information from an existing Contentful Space:
- `Space ID`
- `Content delivery API - access token`
- `Content management - access token`
- The ID of the `Content Type` you would like to use for page generation

Then run the following script:
```bash
yarn install:contentful
```

Your app is now connected to your Contentful Space (except for Gatsby Cloud Previews). Full manual instructions [here](https://smm.atlassian.net/l/c/T13XPLU9).


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
