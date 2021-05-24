const msalConfig = {
  auth: {
    clientId: 'a491c229-5988-421e-a11f-41a9febe102d',
    redirectUri: 'http://localhost:8080'
  }
};

const msalRequest = {
  scopes: [
    'user.read',
    'mailboxsettings.read',
    'calendars.readwrite'
  ]
}