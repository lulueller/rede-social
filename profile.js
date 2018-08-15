var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];
var selectedFile;

$(document).ready(function() {

  getPostsFromDB();
  $('#post-button').click(buttonClick);
  $('#upload-button').click(uploadBtnClick);

});

function buttonClick() {
  var newPost = $('#post-content').val();
  $('#post-content').val('');

  var postsFromDB = addPostToDB(newPost);

  createPost(newPost, 0, postsFromDB.key);
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
        <button type="button" class="btn btn-light" data-like-id="${key}">${likes} Curtidas</button>
        <button type="button" class="btn btn-dark" data-edit-id="${key}">Editar</button>
        <button type="button" class="btn btn-dark" data-delete-id="${key}-bt">Excluir</button>
      </div>
    </li>
  `);

  $(`button[data-delete-id="${key}"]`).click(function() {
    database.ref(USER_ID + "/" + key).remove();
    $(this).parents('li').remove();
  });

  $(`button[data-edit-id="${key}"]`).click(function() {
    var editedContent = prompt(`Editando esse post: ${content}`);
    $(`span[data-content-id=${key}]`).html(editedContent);
    return database.ref(USER_ID + "/" + key).update({
      content: editedContent
    });
  });

  $(`button[data-like-id="${key}"]`).click(function() {

    $(this).html(`${likes += 1} Curtidas`);

    database.ref(USER_ID + "/" + key).once('value')
      .then(function() {
        return database.ref(USER_ID + "/" + key).update({
        likes: likes
        });
      });
  });
}

function uploadBtnClick() {
  var file = $('#file-input').prop('files')[0];
  var imageRef = firebase.storage().ref().child(USER_ID + "/" + 'dogo');
  imageRef.put(file).then(
    function(snapshot){
      console.log('Upload concluido');
    }
  );
}
