# Task Manager

## Summary
This is a Task Management React project written in typescript. This App utilises Node.js, Express and Axios to create a RESTful API to connect to the backend on AWS DynamoDB. 

## User Stories
#### - A user can type in their task into the input box and submit it which displays their task title and the status of their task i.e pending or complete
#### - A user can tick off their pending tasks which marks them as complete and crosses a line through them
#### - A user can delete a task from their task list by clicking the delete button

### How to start

To load the RESTful API first navigate to the 'src' file in the 'server' directory:
```
Ciptex/server/src
```
Then run the command: 
```
npx tsc && node index.js
```
Then to load the front end **create a new terminal** and navigate to the 'src' file in the 'client' directory:
```
Ciptex/client/src
```
Then run the command: 
```
npm start
```
## WireFrames
### Initial Page
![Alt text](./front-end/src/Screenshot%202024-08-27%20002707.png)

### After Checking task 
![Alt text](./front-end/src/Screenshot%202024-08-27%20003028.png)




