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

  var name = $('#user-name').val();
  $('#user-name').val('');
  var email = $('#register-email').val();
  $('#register-email').val('');
  var password = $('#register-password').val();

  registerUser(email, password);
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


function registerUser(email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
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

function redirectToNewsFeed(userId) {
  window.location = "profile.html?id=" + userId;
}