var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function() {

  getPostsFromDB();
  $('#post-button').click(buttonClick);
  $('#upload-button').click(uploadBtnClick);

});

function uploadImage(file) {
  var fileName = (new Date().getTime()) + '-' + file.name;
  var imageRef = firebase.storage().ref().child(USER_ID + "/" + fileName);
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
  database.ref(USER_ID).once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var post = childSnapshot.val();
        createPost(post, childKey);
      });
    });
}

function addPostToDB(text, image) {
  return database.ref(USER_ID).push({
    content: text,
    image: image,
    likes: 0
  });
}

function createPost(post, key) {
  $('#posts-container').append(`
    <li>
      <div data-post-id=${key} class="my-2">
        <img src="${post.image}" /><br
        <span data-content-id="${key}">${post.content}</span><br>
        <button type="button" class="btn btn-light" data-like-id="${key}">${post.likes} Curtidas</button>
        <button type="button" class="btn btn-dark" data-edit-id="${key}">Editar</button>
        <button type="button" class="btn btn-dark" data-delete-id="${key}">Excluir</button>
      </div>
    </li>
  `);

  $(`button[data-delete-id="${key}"]`).click(function() {
    database.ref(USER_ID + "/" + key).remove();
    $(this).parents('li').remove();
  });

  $(`button[data-edit-id="${key}"]`).click(function editPost() {
    $(`span[data-content-id="${key}"]`).html(`
        <textarea class="my-2" style="resize: none" id="edited-content" placeholder="Reescreva o post..."></textarea>
        <button type="button" class="btn btn-secondary mb-5" data-edited-post-id="${key}">Ok</button>
      `);

    var editedContent = $('#edited-content').val();
    $(`button[data-edited-post-id="${key}"]`).click(function() {
      $(`button[data-like-id="${key}"]`).insertBefore(`<span data-content-id="${key}">${editedContent}</span><br>`);
    })

    database.ref(USER_ID + "/" + key).once('value')
      .then(function() {
        return database.ref(USER_ID + "/" + key).update({
        content: editedContent
        });
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

// function uploadBtnClick() {
//   var file = $('#file-input').prop('files')[0];
//
//   console.log(new Date().getTime() + '-' + file.name);
//
//   console.log(file.name);
//   var imageRef = firebase.storage().ref().child(USER_ID + "/" + file.name);
//   imageRef.put(file)
//     .then(
//       function(snapshot){
//         console.log(snapshot);
//         console.log(imageRef.fullPath);
//       }
//     )
//     .then(() => {
//       imageRef.getDownloadURL().then((val) => {
//         console.log(val);
//       });
//     });
// }

// Postar texto + imagem
//   + text area + input file + botao pra postar
//   + salvar texto no banco
//   + pegar id do post no banco
//   + tenho arquivo ? se sim, upload junto com texto
