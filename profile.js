var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function() {

  getPostsFromDB();
  $('#post-button').click(buttonClick);

});

function buttonClick() {
  var newPost = $('#post-content').val();
  var postsFromDB = addPostToDB(newPost);

  createPost(newPost, postsFromDB.key);
}

function getPostsFromDB() {
  database.ref(USER_ID).once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();

        createPost(childData.content, childKey);
      });
    });
}

function addPostToDB(post) {
  return database.ref(USER_ID).push({
    content: post
  });
}

function createPost(content, key) {
  var newPost = $('#post-content').val();

  $('#posts-container').append(`
      <li>
        <p data-task-id=${key} >${content}</p>
      </li>
    `);
}