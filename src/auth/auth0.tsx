import auth0 from 'auth0-js';

const config = {
  domain: 'dev-2ud79wo6.eu.auth0.com',
  clientId: 'HafpU6Cd8pPj08ikj53Xs63vi5ZpLUNr'
}

let auth: Auth

export const getAuth = (): Auth => {
  if (!auth) {
    auth = new Auth()
  }
  return auth
}

class Auth {
  accessToken: any;
  idToken: any;
  expiresAt: any;
  profile: any;

  auth0 = new auth0.WebAuth({
    domain: config.domain,
    clientID: config.clientId,
    redirectUri: 'http://localhost:3000/callback',
    responseType: 'token id_token',
    scope: 'openid email'
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        console.error(`Failed to auth: `, err)
//        history.replace('/home');
//        console.log(err);
        alert(`Error: ${err.error}.`);
      }
    });
    window.location.hash = '';
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult: any) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
    this.getUserInfo();
  }

  async getUserInfo() {
    this.auth0.client.userInfo(this.accessToken, (err, profile) => {
      if (profile) {
        console.log('profile: ', profile)
        this.profile = profile;
      }
    })
  }

  getProfile() {
    return this.profile;
  }

  async renewSession() {
    return new Promise((res, rej) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          console.log('got auth result: ', authResult)
          this.setSession(authResult);
          res();
        } else if (err) {
          this.logout();
          console.log('error renewing, logged out: ', err);
          //alert(`Could not get a new token (${err.error})`);// ${err.error_description}).`);
          rej();
        }
      });
    })
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }

  login() {
    this.auth0.authorize();
  }
}
