##Megastream

Run with nodemon. To install node and dependencies: 

cd to megastream folder

https://nodejs.org/download/

npm install -g nodemon

npm install

#install bower dependencies

bower install

#to run, navigate to MegaStream folder and type:

nodemon server.js

#to deploy to firebase

grunt build              //creates dist folder for deploy (optional)

firebase deploy
