var database = firebase.database();
var USER_ID = window.location.search.match(/\?user_id=(.*)&/)[1];
var PROFILE_ID = window.location.search.match(/profile_id=(.*)/)[1];

$(document).ready(function() {

  getPostsFromDB();
  $('#post-button').click(buttonClick);
  $('#follow-button').click(followBtn);
  loadUserProfile(PROFILE_ID);
  //console.log(user);
  //$('.user-name').val(user.name);

});

function uploadImage(file) {
  var fileName = (new Date().getTime()) + '-' + file.name;
  var imageRef = firebase.storage().ref().child(PROFILE_ID + "/" + fileName);
  return imageRef.put(file).then( () => imageRef.getDownloadURL());
}

async function buttonClick() {

  // verifica se existe arquivo
  var file = $('#file-input').prop('files')[0];
  var imageURL = '';

  if (file !== undefined) {
    imageURL = await uploadImage(file);
  }

  console.log(imageURL);

  var postContent = $('#post-content').val();
  $('#post-content').val('');

  var post = {
    content: postContent,
    image: imageURL,
    likes: 0
  }

  var postsFromDB = addPostToDB(postContent, imageURL);

  createPost(post, postsFromDB.key);
}

function getPostsFromDB() {
  database.ref(PROFILE_ID + "/posts/").once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var post = childSnapshot.val();

        createPost(post, childKey);
      });
    });
}

function addPostToDB(text, image) {
  return database.ref(PROFILE_ID + '/posts/').push({
    content: text,
    image: image,
    likes: 0
  });
}

function createPost(post, key) {
  $('#posts-container').prepend(`
    <li>
      <div data-post-id=${key} class="my-4">
        <img src="${post.image}" class="w-75 round-border"/><br>
        <span class="post-text" data-content-id="${key}">${post.content}</span><br>
        <button type="button" class="btn lilac-bg" data-like-id="${key}">${post.likes} Curtidas</button>
        <button type="button" class="btn text-white purple-bg" data-edit-id="${key}">Editar</button>
        <button type="button" class="btn text-white purple-bg" data-delete-id="${key}">Excluir</button>
      </div>
    </li>
  `);

  $(`button[data-delete-id="${key}"]`).click(function() {
    database.ref(PROFILE_ID + "/posts/" + key).remove();
    $(this).parents('li').remove();
  });

  $(`button[data-edit-id="${key}"]`).click(function() {
    var newContent = prompt("Alterando o post:", `${post.content}`);

    if (newContent === undefined || newContent.trim(' ') === '') {
      alert('Não deixe seu post vazio!')
    } else {
      $(`span[data-text-id=${key}]`).html(newContent);
      database.ref(PROFILE_ID + "/posts/" + key).update({
        content: newContent
      })
    }
  });

  $(`button[data-like-id="${key}"]`).click(function() {

    $(this).html(`${post.likes += 1} Curtidas`);

    database.ref(PROFILE_ID + "/posts/" + key).once('value')
      .then(function() {
        return database.ref(PROFILE_ID + "/posts/" + key).update({
        likes: post.likes
        });
      });
  });
}



function followBtn() {
  //user_id segue profile_id
  alert('Seguindo!');
  database.ref(USER_ID + '/following/').push({
    user_id: PROFILE_ID
  });
  database.ref(PROFILE_ID + '/followers/').push({
    user_id: USER_ID
  });
}


function loadUserProfile(userId) {
  var user = database.ref(userId + "/profile").once('value')
    .then(function (snapshot) {
      var user = snapshot.val();
      $('.user-name').html(user.name);
    });
}
