function login(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(e => showMessage(e.code, 'error'));
}

function logout() {
    firebase.auth().signOut();
}
