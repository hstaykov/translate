var basicFunctions = (function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCVj3jA4I32b7YfW-KfkoOEb0lcksxAkm4",
    authDomain: "translator-5d242.firebaseapp.com",
    databaseURL: "https://translator-5d242.firebaseio.com",
    storageBucket: "translator-5d242.appspot.com",
    messagingSenderId: "323248333343"
  };
  firebase.initializeApp(config);


  // Example (Hund,de-en, callback)
  var addWord = function(word, language, callback) {
    if (word && language) {
      $.get(
        "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170220T190751Z.804f007c23b914ea.50c6cef984e1cc17193a6608117fceaed88a6cfc&text=" +
        encodeURIComponent(word) + "&lang=" + language,
        function(data, status) {
          var sameWord = true;
          if (word != data.text) {
            sameWord = false;
            var commentsRef = firebase.database().ref(getDictionaryRefString() + word);
            var currentDate = new Date();
            commentsRef.set({
              english: data.text,
              german: word,
              date: currentDate.toUTCString()
            });
          }
          var result = {};
          result.translatedWord = data.text;
          result.sameWord = sameWord;
          callback(result);
        });
    }
  }
  function removeWord(word) {
    if (word) {
      var commentsRef = firebase.database().ref(getDictionaryRefString() + word.toString());
      commentsRef.remove()
        .then(function() {
          console.log("Remove succeeded.")
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });
      location.reload();
    }
  }
  return {
    removeWord: removeWord,
    addWord: addWord,
  //  getWords: getWords
  }
})();

var facebookAuthentication = (function() {
  function toggleSignIn() {
    if (!firebase.auth().currentUser) {
      // [START createprovider]
      var provider = new firebase.auth.FacebookAuthProvider();
      // [END createprovider]
      // [START addscopes]
      //provider.addScope('user_birthday');
      // [END addscopes]
      // [START signin]
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // [START_EXCLUDE]
        /////     document.getElementById('quickstart-oauthtoken').textContent = token;
        // [END_EXCLUDE]
        location.reload();
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert('You have already signed up with a different auth provider for that email.');
        // If you are using multiple auth providers on your app you should handle linking
        // the user's accounts here.
        } else {
          console.error(error);
        }
      // [END_EXCLUDE]
      });
    // [END signin]
    } else {
      // [START signout]
      firebase.auth().signOut();
      location.reload();
    // [END signout]
    }
    // [START_EXCLUDE]
    document.getElementById('quickstart-sign-in').disabled = true;
    // [END_EXCLUDE]

  }
  function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]

    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        console.log("Change id to " + uid)
        userId = uid;
        $("#currentUser").html(displayName);
        $("#avatar").attr("src", photoURL);
        if (!alreadySet) {
          getWords()
          alreadySet = true;
        }
        // [START_EXCLUDE]
        //   document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
        document.getElementById('quickstart-sign-in').textContent = 'Log out';
        //   document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
        // [END_EXCLUDE]


      } else {
        // User is signed out.
        userId = "anonymous";
        $("#currentUser").html(displayName);
        $("#avatar").attr("src", photoURL);
        if (!alreadySet) {
          getWords()
          alreadySet = true;
        }

        // [START_EXCLUDE]
        //    document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
        document.getElementById('quickstart-sign-in').textContent = 'Log in with Facebook';
      //     document.getElementById('quickstart-account-details').textContent = 'null';
      //     document.getElementById('quickstart-oauthtoken').textContent = 'null';
      // location.reload();
      // [END_EXCLUDE]
      }
      // [START_EXCLUDE]
      document.getElementById('quickstart-sign-in').disabled = false;
    // [END_EXCLUDE]
    //  initLogic();
    });



    // [END authstatelistener]

  }
  return{
    toggleSignIn: toggleSignIn,
    initApp: initApp
  }
})();
