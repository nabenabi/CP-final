$(function() {
    firebase.initializeApp(firebaseConfig);
    postsRef = firebase.database().ref('posts');

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

    $('#postButton').on('click', () => {
        createPost($('#titleInput').val(), $('#contentInput').val());
    });

    $('#loginButton').on('click', () => {
        login($('#loginEmail').val(), $('#loginPassword').val());
    });

    $('#logoutButton').on('click', logout);
});
