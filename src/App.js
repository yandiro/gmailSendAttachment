import './App.css';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import CreateEmail from './components/CreateEmail'

const SCOPE = 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.metadata'

const authUrlObj = {
  base: 'https://accounts.google.com/o/oauth2/v2/auth',
  client_id: process.env.REACT_APP_CLIENT_ID,
  redirect_uri: 'http://localhost:3000/create/',
  response_type: 'code',
  scope: SCOPE,
  access_type: 'offline',
  prompt: 'consent',
}

const authUrl = `${authUrlObj.base}?client_id=${authUrlObj.client_id}&redirect_uri=${authUrlObj.redirect_uri}&response_type=${authUrlObj.response_type}&scope=${authUrlObj.scope}&access_type=${authUrlObj.access_type}&prompt=${authUrlObj.prompt}`;

function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/create">
            <CreateEmail />
          </Route>

          <Route path="/" component={() => {
            window.location.href = authUrl;
            return null;
          }}>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
