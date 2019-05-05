Laxalyzer
---
Keep track of all user stati inside your slack workspace.

```
npm install
npm start
open localhost:3000
```
and you are good to go to track the 'official' laxalyzer workspace. For live updates the events url needs to be rebent to your localhost/server.

The node server will fetch all slack users on startup and then listen to the slack event api for updates.
A dashboard vistor will receive live updates delivered from the server via websockets.


