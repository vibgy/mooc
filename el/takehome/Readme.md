Design
------
index.js:              Contains the starting point of the code.

jsonCmdLineParser.js:  Contains the singleton function to consume stdin or a file stream and looks for a JSON object. As soon as it find a JSON object, it calls the callback to process the newly found item. Once the input streams ends, it calls the done function.

answers.js:            Contains code to process the newly found item in input stream. It maintains 4 indexes to find the answers to the four questions asked in the assignment.

cd.js:                 Contains code to post process a CD type, to calculate the total running time.

test.js:               Contains testing code. I have used mocha test framework to test the code. 

Installation
------------
You will need node.js installed
Just clone the repo and goto el/takehome

Running the code
----------------
cat test.json | node index.js

Running the tests
-----------------
Install test framework and dependencies
npm install 

To run the test
npm test
