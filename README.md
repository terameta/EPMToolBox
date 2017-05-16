# AsliTool #

A toolbox for Oracle Hyperion EPM professionals.

### Road Map  ###
* Data Integration
    * Data Integration with MSSQL DB (Done)
    * Data Integration with Oracle DB
    * Data Integration with MySQL DB
* Metadata Management
* Dashboard

### Information ###
This repository is developed by Visual Studio Code (http://code.visualstudio.com)
The dev installation steps provide the information for this IDE.

### Installation ###

* Install node.js
* Pull from the repository
* npm install -g typescript

### Dev Installation ###
* Install node.js (https://nodejs.org/en/download/)
* Install Visual Studio Code (https://code.visualstudio.com/Download)
* npm install -g typescript
* npm install -g eslint
* npm install -g tslint
* npm install -g ts-node
* npm install -g @angular/cli
* npm install -g nodemon
* npm install -g npm-check-updates
* Update git hook
    * Edit file: <project-folder>/.git/hooks/post-commit
    * Type below content:
        * \#!/bin/sh
        * git push origin master
* Go to Visual Studio Code, Click to File->Preferences->Settings
    * Make sure you are currently on user settings while you are editing settings.json
    * Add "typescript.tsdk": "C:/Users/username/AppData/Roaming/npm/node_modules/typescript/lib" to the json.
    * Verify the path using npm list -g typescript
    * Restart VSCode, and see that at the right-bottom side of the window the correct version of typescript listed when editing a TS file.
* In Visual Studio Code 
    * Ctrl+Shit+P
    * Install extension
    * Install Below Extensions
        * tslint
		* eslint

### About ###
* Owner: Ali Dikici
* Community: Oracle EPM

### Self Notes ###
cd client && ng generate module dime/dimemap                                        (This will generate a module -> /src/app/dime/dimemap/dimemap.module.ts)
cd client && ng generate service dime/dimemap/dimemap                               (This will generate a service -> /src/app/dime/dimemap/dimemap.service.ts)
edit dimemap.service.ts and rename service from DimemapService to DimeMapService
edit dimemap.module.ts add providers array and add "DimeMapService" to this array
cd client && ng generate component dime/dimemap/dimemaps                            (This will generate a component -> /src/app/dime/dimemap/dimemaps/dimemaps.component.*)
cd client && ng generate component dime/dimemap/dimemap-toolbar                     (This will generate a component -> /src/app/dime/dimemap/dimemaps/dimemap-toolbar.component.*)
cd client && ng generate component dime/dimemap/dimemap-list                        (This will generate a component -> /src/app/dime/dimemap/dimemaps/dimemap-list.component.*)
cd client && ng generate component dime/dimemap/dimemap-detail                      (This will generate a component -> /src/app/dime/dimemap/dimemaps/dimemap-detail.component.*)
cd client && ng generate component dime/dimemap/dimemap                             (This will generate a component -> /src/app/dime/dimemap/dimemaps/dimemap.component.*)