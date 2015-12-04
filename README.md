#Megastream

##Run with nodemon. To install node and dependencies: 

https://nodejs.org/download/

cd to megastream folder

npm install

npm install -g nodemon

##install bower dependencies (bower components are in the project so skip this step for now)

bower install

##to run, navigate to MegaStream folder and type:

nodemon server.js

##to deploy to firebase

grunt build              //creates dist folder for deploy (optional if grunt is configured)

firebase deploy
