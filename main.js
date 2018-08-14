$(document).ready(function() {
  $('#login-button').click(logInClick);
  
  $('#register-user-button').on('click', function(event) {
    event.preventDefault();

    var email = $('#register-email').val();
    var password = $('#register-password').val();

    registerUser(email, password);
  });

});

function logInClick(event) {
  event.preventDefault();

  var email = $('#sign-in-email').val();
  var password = $('#sign-in-password').val();

  logInUser(email, password);
}

function registerClick(event) {
  event.preventDefault();

  var email = $('#register-email').val();
  var password = $('#register-password').val();

  registerUser(email, password);
}

function logInUser(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(response) {
      var userId = response.user.uid;
      // adicionar a função que redireciona para a próxima tela (newsfeed?)
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
}


function registerUser(email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(response) 
      // adicionar a função que redireciona para a próxima tela (newsfeed?) 
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
}

