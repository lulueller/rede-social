var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function() {

  $('#post-button').on('click', function() {
    var newPost = $('#post-content').val();

    $('#posts-container').append(`
      <li>
        <p>${newPost}</p>
      </li>
      `);

    addPostToDB(newPost);
  });
});

function addPostToDB(post) {
  console.log('foi');
  return database.ref(USER_ID).push({
    content: post
  });
}