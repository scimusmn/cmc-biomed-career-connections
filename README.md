# SMM application template
Basic template for starting a new kiosk or web project.

## Installation
Clone the template as a new project
```
$ git clone git@github.com:scimusmn/app-template.git project-name
$ git remote set-url origin git@github.com:scimusmn/project-name.git
```
TODO: Change configs as well

Get npm packages with yarn
```
$ yarn
```
## Setting up serial communication
If you want to enable serial communication, via Stele, for this app, you'll need to register an `ipcRenderer` from `Electron`. To do this, you will need to [customize the default `html.js` file](https://www.gatsbyjs.com/docs/custom-html/) to inject a script that makes the reference.
1. Make a copy of `.cache/default-html.js`. Place in the `src/` folder and rename to `html.js`. 
```bash
cd your-gatsby-repo
cp .cache/default-html.js src/html.js
```
2. Edit `src/html.js` and insert the entire `<script>` tag seen below. It should be the last tag before the `</body>` closing tag. We use React's [dangerouslySetInnerHTML](https://www.gatsbyjs.com/docs/custom-html/#adding-custom-javascript) attribute which should be used with caution, but this is an appropriate exception. 
```html
<body>
  ...
  {props.postBodyComponents}

  {/* Expose Electron's IPC Renderer for use within React Components */}
  <script
    dangerouslySetInnerHTML={{
      __html: `
        if (typeof require !== 'undefined') {
            window.ipcRef = require('electron').ipcRenderer;
          }
      `,
    }}
  />
</body>
```

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
