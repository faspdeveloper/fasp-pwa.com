if ('serviceWorker' in navigator) {
  // console.log("hi");
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js')
      .then(function (registration) {
        console.log('Registration successful, scope is:', registration.scope);
      })
      .catch(function (error) {
        console.log('Service worker registration failed, error:', error);
      });
  })
}
document.addEventListener('DOMContentLoaded', function () {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, { edge: 'right' });
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, { edge: 'left' });
});

var db;

// function dbIntialition() {
if (!('indexedDB' in window)) {
  // console.log('This browser does not support IndexedDB');
} else {
  // console.log('In function');
  var openRequest = indexedDB.open('test_db', 1);
  // console.log("OpenRequset", openRequest);
  openRequest.onupgradeneeded = function (e) {
    // console.log('In Open Request');
    var db = e.target.result;
    // console.log('running onupgradeneeded');
    if (!db.objectStoreNames.contains('recipe')) {
      var storeOS = db.createObjectStore('recipe', { keyPath: 'id', autoIncrement: true });
      storeOS.createIndex("title", "title", { unique: true });
    }
  };
  openRequest.onsuccess = function (e) {
    // console.log('running onsuccess');
    db = e.target.result;
    // console.log("Db in success", db);
  };
  openRequest.onerror = function (e) {
    // console.log('onerror!');
    // console.dir(e);
  };
  // console.log("After open request")
}

// }
function addRecipe() {
  // var db = dbIntialition();
  addItem();
}

function addItem() {
  // var db = dbIntialition();
  var transaction = db.transaction(['recipe'], 'readwrite');
  var recipe = transaction.objectStore('recipe');
  var item = {
    title: document.getElementById("title").value,
    ingredients: document.getElementById("ingredients").value,
    created: new Date().getTime()
  };
  var request = recipe.add(item);

  request.onerror = function (e) {
    // console.log('Error', e.target.error.name);
  };
  request.onsuccess = function (e) {
    getListOfRecipe();
    document.getElementById("title").value = "";
    document.getElementById("ingredients").value = "";
    // location.reload();
    // console.log('Woot! Did it');
  };
}

function getListOfRecipe() {
  // console.log("inside list function");
  if (db != undefined) {
    var transaction = db.transaction(['recipe'], 'readwrite');
    var recipe = transaction.objectStore('recipe');
    // console.log("keyPath",recipe.keyPath);
    var getRequest = recipe.getAll();
    // console.log(getRequest.result);

    getRequest.onerror = function (event) {
      // Handle errors!
    };
    getRequest.onsuccess = function (event) {
      // Do something with the request.result!
      // console.log("Result", getRequest);
      // console.log(event.target.result.key)
      var myResult = [];
      myResult = getRequest.result;
      document.getElementById("recipeList").innerHTML = "";
      for (i = 0; i < myResult.length; i++) {
        // console.log(myResult[i].index)
        document.getElementById("recipeList").innerHTML += "<div class='card-panel recipe white row' id='divElement' onclick='updateOnClickFunction(" + myResult[i].id + ");'><img src='/img/dish.png' alt='recipe thumb'><div class='recipe-details'><div class='recipe-title'>" + myResult[i].title + "</div><div class='recipe-ingredients'>" + myResult[i].ingredients + "</div></div><div class='recipe-delete'><i class='material-icons'>delete_outline</i></div></div>";
        // console.log("Get Result" + getRequest.result[i].title);
      }
    };
  }
}

function updateOnClickFunction(keyVal) {
  // document.getElementById("side-form").style.display = 'block';
  var transaction = db.transaction(['recipe'], 'readwrite');
  var recipe = transaction.objectStore('recipe');
  var getRequest = recipe.get(keyVal);
  getRequest.onerror = function (event) {
    // Handle errors!
  };
  getRequest.onsuccess = function (event) {
    console.log(getRequest.result.title);
    document.getElementById("editDiv").style.display = 'block';
    document.getElementById("titleEdit").value = getRequest.result.title;
    document.getElementById("ingredientsEdit").value = getRequest.result.ingredients;
    document.getElementById("recipeId").value = getRequest.result.id;
    document.getElementById("createdDate").value = getRequest.result.created;
  };

}

function updateRecipe() {
  var transaction = db.transaction(['recipe'], 'readwrite');
  var recipe = transaction.objectStore('recipe');
  var item = {
    title: document.getElementById("titleEdit").value,
    ingredients: document.getElementById("ingredientsEdit").value,
    created: document.getElementById("createdDate").value,
    id: parseInt(document.getElementById("recipeId").value)
  };
  item.n
  // console.log("keyPath",recipe.keyPath);
  var getRequest = recipe.put(item);
  // console.log(getRequest.result);

  getRequest.onerror = function (event) {
    // Handle errors!
  };
  getRequest.onsuccess = function (event) {
    document.getElementById("titleEdit").value = '';
    document.getElementById("ingredientsEdit").value = '';
    document.getElementById("recipeId").value = '';
    document.getElementById("editDiv").style.display = 'none';
    getListOfRecipe();
  };
}