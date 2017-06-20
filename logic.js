

angular.module.exports = addAWord;

var userId = "5";
var alreadySet = false;
var testDictionary = [];
var lang = getLanguage();


function addAWord() {
  var word = $("#myWord").val();
  var languatePareameter = "de-en";
  if (lang) {
    languatePareameter = "pl-en"
  }
  function updateFrontEndResult(data) {
    $('#result').hide().html(
      '<img src="britain.png" style="width:3 px;margin-right: 15px;"><a id="cssDisplay" target="_blank" href="http://www.linguee.de/deutsch-englisch/search?source=auto&query=' +
      data.translatedWord + '">' + data.translatedWord + '</a>' + (data.sameWord ? "   (The same word in english. Will not be added to dictionary.)" : "")).fadeIn(500);
  }
  basicFunctions.addWord(word, languatePareameter, updateFrontEndResult);
}


function getDictionaryRefString() {
  if (firebase.auth().currentUser) {
    if (userId) {
      if (lang)
        return '/' + userId + '/dictionary/' + lang + '/';
      else
        return '/' + userId + '/dictionary/';
    } else {
      if (lang)
        return '/dictionary/' + lang + '/';
      else
        return '/dictionary/';
    }

  }
}

function initApp() {
  facebookAuthentication.initApp();
}


function removeWord(word) {
  basicFunctions.removeWord(word);
}


function getWords() {

  var allReft = firebase.database().ref(getDictionaryRefString());
  console.log("REF " + getDictionaryRefString());

  allReft.on('value', function(data) {
    for (var x in data.val()) {
      testDictionary.push(data.val()[x]);
    }
  });

  allReft.orderByKey().on('child_added', function(data) {

    var flag = "german.png";
    if (lang) {
      flag = "polish.png";
    }
    $("#right ul").append(
      '<li><span class="tab"><a class="list" target="_blank" href="http://www.linguee.de/deutsch-englisch/search?source=auto&query=' +
      data.val().german + '"><img src="' + flag + '" style="width:25px;margin-right: 15px;">' + data.val().german +
      ' - ' + data.val().english +
      '<img src="britain.png" style="width:25px;margin-left: 15px;"></a></span><img onclick="removeWord(\'' +
      data.val().german +
      '\')" id="removeElementImg" src="delete.png" style="width:25px;margin-left: 45px;"></li>');
  });
}

function getRandomWords() {
  var number = 15;
  var randomWords = [];
  for (i = 0; i < number; i++) {
    var index = Math.floor(Math.random() * testDictionary.length);
    randomWords.push(testDictionary[index]);
  }
  return randomWords;
}


function startTest() {

  var s = new quiz();
  console.log(s.words[1]);
  s.startTest();



}


var quiz = function() {
  this.words = function() {
    return getRandomWords()
  }(),
  this.startTest = function() {
    $("#btnTest").remove();
    for (var i = this.words.length - 1; i >= 0; i--) {
      $(".testList").append('<li data-eng="' + this.words[i].english + ' " data-id="' + i + '" style="display: none"><p><span> Do you know what <span class="bolded">' + this.words[i].german + '</span> means ?</span><input id="testWord" onkeypress="chcekAnswer(event)" type="text" value="" placeholder=""></input></p></li>');
    }
    ;
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


function chcekAnswer(event) {
  var currentQuestion = $(".testList").children(".active");
  if (event.keyCode == 13 && !currentQuestion.hasClass("clicked")) {
    currentQuestion.addClass("clicked")
    var correct = parseInt($(".correct.score").html());
    var notcorrect = parseInt($(".notCorrect.score").html());


    var guess = currentQuestion.find("input").val().trim();

    var answer = currentQuestion.data("eng").trim();
    console.log(guess + " " + answer);
    var show = true;
    if (guess.toString().toUpperCase() === answer.toString().toUpperCase()) {
      currentQuestion.find("p").append("<span class='correct'>Correct</span>");
      correct++;
      $(".correct.score").html(correct)

    } else {
      currentQuestion.find("p").append("<span class='notCorrect'>Wrong. It is <span class='bolded'>" + answer + "</span></span>")
      notcorrect++;
      $(".notCorrect.score").html(notcorrect);
    }

    setInterval(function() {
      if (show) {
        changeQuestion(currentQuestion);
        show = false
      }
    }, 2000);

  }
}


function changeQuestion(currentQuestion) {
  currentQuestion.removeClass("active");
  currentQuestion.hide();
  var currentId = parseInt(currentQuestion.data("id"));
  var nextId = currentId + 1;
  $(".testList").find('[data-id="' + nextId + '"]').show();
  $(".testList").find('[data-id="' + nextId + '"]').find("input").focus();
  $(".testList").find('[data-id="' + nextId + '"]').addClass("active");
}

function getLanguage() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var c = url.searchParams.get("lang");
  return c;
}
