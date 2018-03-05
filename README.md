# AsliTool

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# README #

Follow below steps to install:

* Download from repository to a folder, and navigate to the folder
* Install node-gyp using: npm install -g node-gyp
	* If global install is failing with error: EACCESS: permission denied, access '/usr/lib/node_modules' follow below steps
		* mkdir ~/.npm-global
		* npm config set prefix '~/.npm-global'
		* edit file ~/.profile and add below line:
			* export PATH=~/.npm-global/bin:$PATH
		* source ~/.profile
		* npm install -g node-gyp
* Install python: sudo apt install python
* cp system.conf.sample system.conf
* Update system.conf file
* Update epmtools.service file according to your needs
* Copy epmtools.service file to /lib/systemd/system/epmtools.service
* Run below commands:
	* sudo systemctl daemon-reload
	* sudo systemctl enable epmtools.service
	* sudo systemctl start epmtools.service
* Create a crontab entry with the following line (after updating to the correct folder):
	* \* \* \* \* \* sudo sh -c "chmod +x ~/com-epmvirtual-evdi/croner.sh;  sh ~/com-epmvirtual-evdi/croner.sh  >> ~/com-epmvirtual-evdi/log/croner.log"
	
### How do I follow the logs? ###
sudo journalctl -u epmtools -f

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact