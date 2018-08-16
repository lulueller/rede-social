$(document).ready(function() {
  $('#login-button').click(logInClick);
  $('#register-user-button').click(registerClick);

});

function logInClick(event) {
  event.preventDefault();

  var email = $('#sign-in-email').val();
  var password = $('#sign-in-password').val();

  logInUser(email, password);
}

function registerClick(event) {
  event.preventDefault();

  var user = {
    name: $('#user-name').val(),
    email: $('#register-email').val(),
    password: $('#register-password').val()
  };

  $('#user-name').val('');
  $('#register-email').val('');

  registerUser(user);
}

function logInUser(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(response) {
      var userId = response.user.uid;
      redirectToNewsFeed(userId);
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
}


function registerUser(user) {
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(function(response) {
      var userId = response.user.uid;
      firebase.database().ref(userId + '/profile').push(user)
        .then(() => redirectToNewsFeed(userId));
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
}

function redirectToNewsFeed(userId) {
  window.location = "profile.html?id=" + userId;
}
