export function checkSession() {
  if (!localStorage.getItem('jwtToken')) {
    // DONT Call api if there is no token.
    console.log('unable to load data because you are not logged in');
    throw 'unable to load data because you are not logged in';
  }
}
