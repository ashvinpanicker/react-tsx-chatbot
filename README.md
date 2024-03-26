# React Typescript Chatbot

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
This is a frontend chatbot application that's meant to be connected with a backend API. For more information visit https://sell247.ai

## Prerequisite 

NodeJS & npm/yarn, Git

## Environment Setup

Create a file in the project root directory called `.env` and add the following content with the respective information from the backend team

```
REACT_APP_API_SERVER_URL='https://<your-api-url>'
REACT_APP_API_USERNAME='username'
REACT_APP_API_PASSWORD='password'
REACT_APP_API_KEY='<your-api-key>'
REACT_APP_HOSTED_LOCATION = '<link-where-deployed>'
```

## Local Setup

1. Clone or download the repository - Open a terminal `git clone https://github.com/ashvinpanicker/react-tsx-chatbot`
2. `cd react-tsx-chatbot` and then install packages with `npm install` or `yarn install`
3. `yarn start` or `npm run start`
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


## Deployment

Since this a static site, I host it on https://render.com for free
Sign up for an account and connect the repository via github to deploy automatically

To deploy on a server, in the project directory, you can run:

`npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.



To learn React, check out the [React documentation](https://reactjs.org/).
