# This is a walk through of creating the AC3 AWS Summit booth quiz

It uses AWS Amplify and React

Note. All charges incurred while building this are the responsibility of you and AC3 will not be held liable.

## Requirements
* An AWS Account
* A computer running MacOS or Linux (it might work on Windows too, YMMV)


## Create a React app
yarn create react-app aws-summit-booth-quiz

cd aws-summit-booth-quiz

## Amplify

1. [Setup Amplify](#setup-amplify)
2. [Add Hosting](#add-hosting)
3. [Add Auth](#add-auth)
4. [Create a navagation bar](#create-a-navagation-bar)
5. [Add an API](#add-an-api)
6. [Add the questions to the question table](#add-the-questions-to-the-question-table)
7. [Setup the core application](#setup-the-core-application)
8. [Question and registration](#question-and-registration)
9. [Contestant listing](#contestant-listing)
10. [Add Analytics](#add-analytics)


### Setup Amplify

```
amplify init
```

Example:
```
Note: It is recommended to run this command from the root of your app directory
? Enter a name for the project awssummitboothquiz
? Enter a name for the environment master
? Choose your default editor: Vim (via Terminal, Mac OS only)
? Choose the type of app that you're building javascript
Please tell us about your project
? What javascript framework are you using react
? Source Directory Path:  src
? Distribution Directory Path: build
? Build Command:  yarn run build
? Start Command: yarn run start
Using default provider  awscloudformation

For more information on AWS Profiles, see:
https://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html

? Do you want to use an AWS profile? Yes
? Please choose the profile you want to use my-aws-profile
```

Save our work:
```
git add .
git commit -m "amplify init"
```

Add some requirements:
```
yarn add aws-amplify aws-amplify-react react-table bootstrap react-router-dom
git add .
git commit -m "add all the node modules"
```

Start your local environment and look at the configuration:
```
yarn run start

amplify status
```

### Add Hosting
```
amplify add hosting

amplify publish
```

Save your work:
```
git add .
git commit -m "amplify add hosting"
```


edit src/App.js
Update:
```
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Hello Auckland AWS Usergroup</h1>
      </header>
```

Publish your changes:
```
amplify publish
```

Save your work:
```
git add .
git commit -m "first update to App.js"
```

### Add Auth

```
amplify add auth
```

Example output:
```
Using service: Cognito, provided by: awscloudformation

 The current configured provider is Amazon Cognito.

 Do you want to use the default authentication and security configuration? Default configuration
 Warning: you will not be able to edit these selections.
 How do you want users to be able to sign in when using your Cognito User Pool? Username
 Warning: you will not be able to edit these selections.
 What attributes are required for signing up? (Press <space> to select, <a> to toggle all, <i> to invert selection)Email
```

Check the status and create the new resources
```
amplify status
amplify push
```


Edit App.js
Add:
```
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import awsmobile from './aws-exports';

Amplify.configure(awsmobile);
```


Update:
```
export default withAuthenticator(App, true);
```

Publish your changes:
```
amplify publish
```

Save your work:
```
git add .
git commit -m "amplify add auth"
```

### Create a navagation bar

Edit index.js
Add:
```
import 'react-table/react-table.css'
import 'bootstrap/dist/css/bootstrap.css';
```

Edit Nav.js
Add:
```
import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = () => (
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
          <div>
            <ul className="navbar-nav mr-auto">
              <li className="nav-item"><NavLink className="nav-link" to="/" exact>Home</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/leaderboard" exact>LeaderBoard</NavLink></li>
            </ul>
          </div>
          <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item"><NavLink className="nav-link" to="/contestants" exact>Contestents</NavLink></li>
            </ul>
          </div>
        </nav>
);

export default Nav;
```

Edit App.js
Add:
```
import Nav from './Nav';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import QuestionTime from './QuestionTime';
import LeaderBoard from './LeaderBoard';
import Contestents from './Contestants';
```

Update:
```
  return (
      <Router>
        <div className="container">
          <Route path="/" render={routeProps => <Nav {...routeProps} />} />
          <Route exact path="/" component={QuestionTime} />
          <Route exact path="/leaderboard" component={LeaderBoard} />
          <Route exact path="/contestants" component={Contestants} />
        </div>
      </Router>
  );
```

Edit src/QuestionTime.js, src/LeaderBoard.js, src/Contestants,js
Add (and update as appropriate):
```
import React, { Component } from 'react';

class Contestants extends Component {
  render() {
    return (
      <div>Contestants</div>
    )
  }
}

export default Contestants;
```

Publish and save your work:
```
amplify publish

git add .
git commit -m "Routes and Nav"
```

### Add an API

```
amplify add api
```

Example output:
```
? Please select from one of the below mentioned services GraphQL
? Provide API name: questiontime
? Choose an authorization type for the API Amazon Cognito User Pool
Use a Cognito user pool configured as a part of this project
? Do you have an annotated GraphQL schema? Yes
? Provide your schema file path:
user@macos:~/Scratch/dev/gergnz/aws-summit-booth-quiz (master) $ amplify add api
? Please select from one of the below mentioned services GraphQL
? Provide API name: questiontime
? Choose an authorization type for the API Amazon Cognito User Pool
Use a Cognito user pool configured as a part of this project
? Do you have an annotated GraphQL schema? No
? Do you want a guided schema creation? Yes
? What best describes your project: Single object with fields (e.g., “Todo” with ID, name, description)
? Do you want to edit the schema now? Yes
Please edit the file in your editor: /Users/gregc/Scratch/dev/gergnz/aws-summit-booth-quiz/amplify/backend/api/questiontime/schema.graphql
? Press enter to continue
```

The GraphQL Schema
```
type Question @model {
  id: ID!
  question: String!
  answers: [String!]!
  answer: String!
  pillar: String!
}

type Competitor @model {
  id: ID!
  email: String!
  phone: String!
  name: String!
  starttime: String!
  endtime: String!
  answers: String!
  result: String!
}
```

Create your new resources and save:
```
amplify push

git add .
git commit -m "amplify add api"
```


### Add the questions to the question table
Edit files/questions.json
Update the Question DynamoDB table name.

```
aws dynamodb batch-write-item --request-items file://$PWD/files/questions.json
```

### Setup the core application

#### Question and registration
```
cp files/QuestionTime.js src/QuestionTime.js

amplify publish

git add .
git commit -m "add the core of the application"
```

#### Contestant listing
```
cp files/Contestants.js src/Contestants.js

amplify publish

git add .
git commit -m "add the Contestants"
```

### Add Analytics
```
amplify add analytics
```

Example Output:
```
user@macos:~/Scratch/dev/gergnz/aws-summit-booth-quiz [my-aws-profile] (master) $ amplify add analytics
Using service: Pinpoint, provided by: awscloudformation
? Provide your pinpoint resource name: awssummitboothquiz
Adding analytics would add the Auth category to the project if not already added.
? Apps need authorization to send analytics events. Do you want to allow guests and unauthenticated users to send analytics events? (
we recommend you allow this when getting started) No
Authorize only authenticated users to send analytics events. Use "amplify update auth" to modify this behavior.
Successfully updated auth resource locally.
Successfully added resource awssummitboothquiz locally

Some next steps:
"amplify push" builds all of your local backend resources and provisions them in the cloud
"amplify publish" builds all your local backend and front-end resources (if you have hosting category added) and provisions them in the cloud
```

Publish and save your work:
```
amplify publish

git add .
git commit -m "add the Contestants"
```
