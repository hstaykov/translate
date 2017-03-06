  // Initialize Firebase
  var config = {
      apiKey: "AIzaSyCVj3jA4I32b7YfW-KfkoOEb0lcksxAkm4",
      authDomain: "translator-5d242.firebaseapp.com",
      databaseURL: "https://translator-5d242.firebaseio.com",
      storageBucket: "translator-5d242.appspot.com",
      messagingSenderId: "323248333343"
  };
  firebase.initializeApp(config);

  angular.module.exports = addAWord;
  
var userId = "5";
var alreadySet = false;
var testDictionary = [];


   function addAWord() {
          var word = $("#myWord").val();
          if (word) {
              $.get(
                  "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170220T190751Z.804f007c23b914ea.50c6cef984e1cc17193a6608117fceaed88a6cfc&text=" +
                  word + "&lang=de-en",
                  function(data, status) {
                    var sameWord = true;
                    if(word != data.text){
                      sameWord = false;
                      var commentsRef = firebase.database().ref(getDictionaryRefString() + word);
                      var currentDate = new Date();
                      commentsRef.set({
                          english: data.text,
                          german: word,
                          date: currentDate.toUTCString()
                      });
                    }
                      $('#result').hide().html(
                          '<img src="britain.png" style="width:31px;margin-right: 15px;"><a id="cssDisplay" target="_blank" href="http://www.linguee.de/deutsch-englisch/search?source=auto&query=' +
                          data.text + '">' + data.text  + '</a>' + (sameWord ? "   (The same word in english. Will not be added to dictionary.)" : "")).fadeIn(500);
                  });
          }
      }
 


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

  // [END buttoncallback]
  /**
   * initApp handles setting up UI event listeners and registering Firebase auth listeners:
   *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
   *    out, and that is where we update the UI.
   */
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
              if(!alreadySet){
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
              if(!alreadySet){
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

          function getDictionaryRefString() {
            if(firebase.auth().currentUser)
            console.log("FFF" + firebase.auth().currentUser.uid);
      
              
                  console.log("userId " + userId);
                  if (userId) {
                      return '/' + userId + '/dictionary/';
                  } else {
                      return '/dictionary/';
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

         

          


           function getWords() {
            
          var allReft = firebase.database().ref(getDictionaryRefString());
          console.log("REF " + getDictionaryRefString());

          allReft.on('value', function(data){
              for(var x in data.val()){
                testDictionary.push(data.val()[x]);
              }
          });

          allReft.on('child_added', function(data) {

   
          
              $("#right ul").append(
                  '<li><span class="tab"><a target="_blank" href="http://www.linguee.de/deutsch-englisch/search?source=auto&query=' +
                  data.val().german + '"><img src="german.png" style="width:25px;margin-right: 15px;">' + data.val().german +
                  ' - ' + data.val().english +
                  '<img src="britain.png" style="width:25px;margin-left: 15px;"></a></span><img onclick="removeWord(\'' +
                  data.val().german +
                  '\')" id="removeElementImg" src="delete.png" style="width:25px;margin-left: 45px;"></li>');
          });
      }

      function getRandomWords(){
        var number = 5;
        var randomWords = [];
        for(i = 0 ; i<number ; i++){
          var index = Math.floor(Math.random() * testDictionary.length);
          randomWords.push(testDictionary[index]);
        }
        return randomWords;
      }


      function startTest(){
       
        var s = new quiz();
        console.log(s.words[1]);
        s.startTest();
       
          
        
      }

    
      var quiz = function(){
        this.words  = function(){return getRandomWords()}(),
        this.startTest = function(){
          $("#btnTest").remove();
          for (var i = this.words.length - 1; i >= 0; i--) {
             $(".testList").append('<li data-id="' + i +'" style="display: none"><p> Do you know what <a class="testWord">' + this.words[i].german +'</a> means ?<input id="testWord" ng-keyup="$event.keyCode == 13 ? testWord() : null" type="text" value="" placeholder=""></input></p></li>');
          };
          $(".testList").find('[data-id="0"]').show();
          $(".testList").find('[data-id="0"]').addClass("active");
        }
       
      }



      function myFunction() {
          var x = document.getElementById("myTopnav");
          if (x.className === "topnav") {
              x.className += " responsive";
          } else {
              x.className = "topnav";
          }
      }
  

function chcekAnswer(){

    var currentQuestion = $(".testList").children(".active");
    
    
}


function changeQuestion(currentQuestion){
    currentQuestion.removeClass("active");
    currentQuestion.hide();
    var currentId = parseInt(currentQuestion.data("id"));
    var nextId = currentId + 1;
    $(".testList").find('[data-id="'+nextId+'"]').show();
    $(".testList").find('[data-id="'+nextId+'"]').addClass("active");
}