// Select DOM elements to work with
const authenticatedNav = document.getElementById('authenticated-nav');
const accountNav = document.getElementById('account-nav');
const mainContainer = document.getElementById('main-container');

const Views = { error: 1, home: 2, calendar: 3 };

function createElement(type, className, text) {
  var element = document.createElement(type);
  element.className = className;

  if (text) {
    var textNode = document.createTextNode(text);
    element.appendChild(textNode);
  }

  return element;
}

function showAuthenticatedNav(user, view) {
  authenticatedNav.innerHTML = '';

  if (user) {
    // Add Calendar link
    var calendarNav = createElement('li', 'nav-item');

    var calendarLink = createElement('button',
      `btn btn-link nav-link${view === Views.calendar ? ' active' : ''}`,
      'Calendário');
    calendarLink.setAttribute('onclick', 'getEvents();');
    calendarNav.appendChild(calendarLink);

    authenticatedNav.appendChild(calendarNav);
  }
}

function showAccountNav(user) {
  accountNav.innerHTML = '';

  if (user) {
    // Show the "signed-in" nav
    accountNav.className = 'nav-item dropdown';

    var dropdown = createElement('a', 'nav-link dropdown-toggle');
    dropdown.setAttribute('data-toggle', 'dropdown');
    dropdown.setAttribute('role', 'button');
    accountNav.appendChild(dropdown);

    var userIcon = createElement('i',
      'far fa-user-circle fa-lg rounded-circle align-self-center');
    userIcon.style.width = '32px';
    dropdown.appendChild(userIcon);

    var menu = createElement('div', 'dropdown-menu dropdown-menu-right');
    dropdown.appendChild(menu);

    var userName = createElement('h5', 'dropdown-item-text mb-0', user.displayName);
    menu.appendChild(userName);

    var userEmail = createElement('p', 'dropdown-item-text text-muted mb-0', user.mail || user.userPrincipalName);
    menu.appendChild(userEmail);

    var divider = createElement('div', 'dropdown-divider');
    menu.appendChild(divider);

    var signOutButton = createElement('button', 'dropdown-item', 'Sign out');
    signOutButton.setAttribute('onclick', 'signOut();');
    menu.appendChild(signOutButton);
  } else {
    // Show a "sign in" button
    accountNav.className = 'nav-item';

    var signInButton = createElement('button', 'btn btn-link nav-link', 'Sign in');
    signInButton.setAttribute('onclick', 'signIn();');
    accountNav.appendChild(signInButton);
  }
}

function showWelcomeMessage(user) {
  // Create jumbotron
  var jumbotron = createElement('div', 'jumbotron');

  var heading = createElement('h1', null, 'Atualização sobre o estado de risco por localização');
  jumbotron.appendChild(heading);

  var lead = createElement('p', 'lead',
    'Atualização sobre o estado de risco por localização' +
    ' a user\'s data from JavaScript.');
  jumbotron.appendChild(lead);

  if (user) {
    // Welcome the user by name
    var welcomeMessage = createElement('h4', null, `Bem Vindo ${user.displayName}!`);
    jumbotron.appendChild(welcomeMessage);

    var callToAction = createElement('p', null,
      'Use a barra de navegação para começar ');
    jumbotron.appendChild(callToAction);
  } else {
    // Show a sign in button in the jumbotron
    var signInButton = createElement('button', 'btn btn-primary btn-large',
      'Autenticar');
    signInButton.setAttribute('onclick', 'signIn();')
    jumbotron.appendChild(signInButton);
  }

  mainContainer.innerHTML = '';
  mainContainer.appendChild(jumbotron);
}

function showError(error) {
  var alert = createElement('div', 'alert alert-danger');

  var message = createElement('p', 'mb-3', error.message);
  alert.appendChild(message);

  if (error.debug) {
    var pre = createElement('pre', 'alert-pre border bg-light p-2');
    alert.appendChild(pre);

    var code = createElement('code', 'text-break text-wrap',
      JSON.stringify(error.debug, null, 2));
    pre.appendChild(code);
  }

  mainContainer.innerHTML = '';
  mainContainer.appendChild(alert);
}

function updatePage(view, data) {
  if (!view) {
    view = Views.home;
  }

  const user = JSON.parse(sessionStorage.getItem('graphUser'));

  showAccountNav(user);
  showAuthenticatedNav(user, view);

  switch (view) {
    case Views.error:
      showError(data);
      break;
    case Views.home:
      showWelcomeMessage(user);
      break;
    case Views.calendar:
      showCalendar(data);
      GrafCovid();
      break;
  }
}

updatePage(Views.home);

function GrafCovid() {
  let graf = document.createElement('div');
  
  let cidade1 = document.createElement('div');
  cidade1.id = 'cidade1'
  cidade1.innerHTML = cidadesColetadas[4] + "  <br> "+ Math.round(arrayGlobal[4])+"% Chance de contágio <br>  ___"
  graf.appendChild(cidade1)

  let cidade2 = document.createElement('div');
  cidade2.id = 'cidade2'
  cidade2.innerHTML = cidadesColetadas[3] + " <br> "+ Math.round(arrayGlobal[3])+"% Chance de contágio <br>  ___"
  graf.appendChild(cidade2)

  let cidade3 = document.createElement('div');
  cidade3.id = 'cidade3'
  cidade3.innerHTML = cidadesColetadas[2] +" <br> "+ Math.round(arrayGlobal[2])+"% Chance de contágio <br>  ___"
  graf.appendChild(cidade3)

  let cidade4 = document.createElement('div');
  cidade4.id = 'cidade4'
  cidade4.innerHTML = cidadesColetadas[1] +" <br> "+ Math.round(arrayGlobal[1])+"% Chance de contágio <br>  ___"
  graf.appendChild(cidade4)

  let cidade5 = document.createElement('div');
  cidade5.id = 'cidade5'
  cidade5.innerHTML = cidadesColetadas[0] +" <br> "+ Math.round(arrayGlobal[0])+"% Chance de contágio <br>  ___"
  graf.appendChild(cidade5)
  mainContainer.appendChild(graf);
}

function showCalendar(events) {
  let div = document.createElement('div');

  div.appendChild(createElement('h1', 'mb-3', 'Calendário'));

  let newEventButton = createElement('button', 'btn btn-light btn-lg mb-3', 'Novo Evento');
  newEventButton.setAttribute('onclick', 'showNewEventForm();');
  div.appendChild(newEventButton);

  let table = createElement('table', 'table');
  div.appendChild(table);

  let thead = document.createElement('thead');
  table.appendChild(thead);

  let headerrow = document.createElement('tr');
  thead.appendChild(headerrow);

  let organizer = createElement('th', null, 'Organizer');
  organizer.setAttribute('scope', 'col');
  headerrow.appendChild(organizer);

  let subject = createElement('th', null, 'Subject');
  subject.setAttribute('scope', 'col');
  headerrow.appendChild(subject);

  let start = createElement('th', null, 'Start');
  start.setAttribute('scope', 'col');
  headerrow.appendChild(start);

  let end = createElement('th', null, 'End');
  end.setAttribute('scope', 'col');
  headerrow.appendChild(end);

  let tbody = document.createElement('tbody');
  table.appendChild(tbody);

  for (const event of events) {
    let eventrow = document.createElement('tr');
    eventrow.setAttribute('key', event.id);
    tbody.appendChild(eventrow);

    let organizercell = createElement('td', null, event.organizer.emailAddress.name);
    eventrow.appendChild(organizercell);

    let subjectcell = createElement('td', null, event.subject);
    eventrow.appendChild(subjectcell);

    // Use moment.utc() here because times are already in the user's
    // preferred timezone, and we don't want moment to try to change them to the
    // browser's timezone
    let startcell = createElement('td', null,
      moment.utc(event.start.dateTime).format('M/D/YY h:mm A'));
    eventrow.appendChild(startcell);

    let endcell = createElement('td', null,
      moment.utc(event.end.dateTime).format('M/D/YY h:mm A'));
    eventrow.appendChild(endcell);
  }

  mainContainer.innerHTML = '';
  mainContainer.appendChild(div);
}

function showNewEventForm() {
  let form = document.createElement('form');

  let subjectGroup = createElement('div', 'form-group');
  form.appendChild(subjectGroup);

  subjectGroup.appendChild(createElement('label', '', 'Subject'));

  let subjectInput = createElement('input', 'form-control');
  subjectInput.setAttribute('id', 'ev-subject');
  subjectInput.setAttribute('type', 'text');
  subjectGroup.appendChild(subjectInput);

  let attendeesGroup = createElement('div', 'form-group');
  form.appendChild(attendeesGroup);

  attendeesGroup.appendChild(createElement('label', '', 'Attendees'));

  let attendeesInput = createElement('input', 'form-control');
  attendeesInput.setAttribute('id', 'ev-attendees');
  attendeesInput.setAttribute('type', 'text');
  attendeesGroup.appendChild(attendeesInput);

  let timeRow = createElement('div', 'form-row');
  form.appendChild(timeRow);

  let leftCol = createElement('div', 'col');
  timeRow.appendChild(leftCol);

  let startGroup = createElement('div', 'form-group');
  leftCol.appendChild(startGroup);

  startGroup.appendChild(createElement('label', '', 'Start'));

  let startInput = createElement('input', 'form-control');
  startInput.setAttribute('id', 'ev-start');
  startInput.setAttribute('type', 'datetime-local');
  startGroup.appendChild(startInput);

  let rightCol = createElement('div', 'col');
  timeRow.appendChild(rightCol);

  let endGroup = createElement('div', 'form-group');
  rightCol.appendChild(endGroup);

  endGroup.appendChild(createElement('label', '', 'End'));

  let endInput = createElement('input', 'form-control');
  endInput.setAttribute('id', 'ev-end');
  endInput.setAttribute('type', 'datetime-local');
  endGroup.appendChild(endInput);

  let bodyGroup = createElement('div', 'form-group');
  form.appendChild(bodyGroup);

  bodyGroup.appendChild(createElement('label', '', 'Body'));

  let bodyInput = createElement('textarea', 'form-control');
  bodyInput.setAttribute('id', 'ev-body');
  bodyInput.setAttribute('rows', '3');
  bodyGroup.appendChild(bodyInput);

  //------------------------------------------------------------

  let CoronaInput = createElement('textarea', 'form-control');
  CoronaInput.setAttribute('id', 'ev-corona');
  CoronaInput.setAttribute('rows', '4');
  CoronaInput.appendChild(CoronaInput);

  //-------------------------------------------------------------

  let createButton = createElement('button', 'btn btn-primary mr-2', 'Create');
  createButton.setAttribute('type', 'button');
  createButton.setAttribute('onclick', 'createNewEvent();');
  form.appendChild(createButton);

  let cancelButton = createElement('button', 'btn btn-secondary', 'Cancel');
  cancelButton.setAttribute('type', 'button');
  cancelButton.setAttribute('onclick', 'getEvents();');
  form.appendChild(cancelButton);

  mainContainer.innerHTML = '';
  mainContainer.appendChild(form);

}

