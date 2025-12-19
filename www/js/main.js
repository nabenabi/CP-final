$(function() {
    if (window.__appInitialized) return; // guard against double init (e.g. hot reload / duplicate script)
    window.__appInitialized = true;

    const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
    postsRef = app.database().ref('posts');

    firebase.auth().onAuthStateChanged(user => {
        currentUser = user;
        if (user) {
            $('.logged-in').show();
            $('.logged-out').hide();
            $('#userEmail').text(user.email);
        } else {
            $('.logged-in').hide();
            $('.logged-out').show();
        }
        loadPosts();
    });

    $('#postButton').off('click').on('click', (e) => {
        e.preventDefault(); // 기본 동작 중단
        createPost($('#titleInput').val(), $('#contentInput').val());
    });

    $('#loginButton').on('click', () => {
        login($('#loginEmail').val(), $('#loginPassword').val());
    });

    $('#logoutButton').on('click', logout);
});
