var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function() {

  getPostsFromDB();
  $('#post-button').click(buttonClick);

});

function buttonClick() {
  var newPost = $('#post-content').val();
  $('#post-content').val('');

  var postsFromDB = addPostToDB(newPost, 0);

  createPost(newPost, postsFromDB.key);
}

function getPostsFromDB() {
  database.ref(USER_ID).once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();

        createPost(childData.content, childData.likes, childKey);
      });
    });
}

function addPostToDB(post) {
  return database.ref(USER_ID).push({
    content: post,
    likes: 0
  });
}

function createPost(content, likes, key) {
  $('#posts-container').append(`
    <li>
      <div data-post-id=${key} class="my-2">
        <span data-content-id="${key}">${content}</span><br>
        <button type="button" class="btn btn-light" data-like-id="${key}-like">${likes} Curtidas</button>
        <button type="button" class="btn btn-dark" data-button-id="${key}-ed">Editar</button>
        <button type="button" class="btn btn-dark" data-button-id="${key}-bt">Excluir</button>
      </div>
    </li>
  `);

  $(`button[data-button-id="${key}-bt"]`).click(function() {
    database.ref(USER_ID + "/" + key).remove();
    $(this).parents('li').remove();
  });

  $(`button[data-button-id="${key}-id"]`).click(function() {
    var editedContent = prompt(`Editando esse post: ${content}`);
    $(`span[data-content-id=${key}]`).html(editedContent);
    return database.ref(USER_ID + "/" + key).update({
      content: editedContent
    });
  });

  $(`button[data-like-id="${key}-like"]`).click(function() {

    $(this).html(`${likes += 1} Curtidas`);

    database.ref(USER_ID + "/" + key).once('value')
      .then(function() {
        return database.ref(USER_ID + "/" + key).update({
        likes: likes
        });    
      });   
  });
}