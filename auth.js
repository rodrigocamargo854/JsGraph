const msalClient = new msal.PublicClientApplication(msalConfig);

async function signIn() {
  // Login
  try {
    // Use MSAL to login
    const authResult = await msalClient.loginPopup(msalRequest);
    console.log('id_token acquired at: ' + new Date().toString());
    // Save the account username, needed for token acquisition
    sessionStorage.setItem('msalAccount', authResult.account.username);

    // Get the user's profile from Graph
    user = await getUser();
    // Save the profile in session
    sessionStorage.setItem('graphUser', JSON.stringify(user));
    updatePage(Views.home);
  } catch (error) {
    console.log(error);
    updatePage(Views.error, {
      message: 'Error logging in',
      debug: error
    });
  }
}

// async function locationteste() {

//   try {
//     const authResult = await msalClient.loginPopup(msalRequest);
//     console.log('id_token acquired at: ' + new Date().toString());
//     // Save the account username, needed for token acquisition
//     sessionStorage.setItem('msalAccount', authResult.account.username);

//     // Get the user's profile from Graph
//     localidade = await returnLocation();
//     // Save the profile in session
//     sessionStorage.setItem('graphUser', JSON.stringify(localidade));
//     updatePage(Views.home);
//     console.log("deu certo dentro try")

//   } catch (error) {
//     console.log(error);
//   }

  

// }

function signOut() {
  account = null;
  sessionStorage.removeItem('graphUser');
  msalClient.logout();
}

async function getToken() {
  let account = sessionStorage.getItem('msalAccount');
  if (!account){
    throw new Error(
      'User account missing from session. Please sign out and sign in again.');
  }

  try {
    // First, attempt to get the token silently
    const silentRequest = {
      scopes: msalRequest.scopes,
      account: msalClient.getAccountByUsername(account)
    };

    const silentResult = await msalClient.acquireTokenSilent(silentRequest);
    return silentResult.accessToken;
  } catch (silentError) {
    // If silent requests fails with InteractionRequiredAuthError,
    // attempt to get the token interactively
    if (silentError instanceof msal.InteractionRequiredAuthError) {
      const interactiveResult = await msalClient.acquireTokenPopup(msalRequest);
      return interactiveResult.accessToken;
    } else {
      throw silentError;
    }
  }
}