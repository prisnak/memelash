//new branch 2018-07-19
console.log('new branch "ju-20180716-integrated"');
var votesA = 0;
var votesB = 0;
var playerInfo;
var uid;
var submitNum = 0;
var topic = [
  "funny",
  "beer",
  "jay-z",
  "rap",
  "dog",
  "cat",
  "girl",
  "boy",
  "poo",
  "president",
  "trump",
  "sports",
  "dance",
  "drunk",
  "laugh",
  "sloth",
  "confused",
  "help",
  "drake"
];

var rn = "";
var docP = "";
var seconds;
var timer;
var userInput;
var userVote;
var userScore = 0;
var pageIndex = 0;
var player;
var session;
var winningScore = 10;

function pageReader() {
  if (userInput.length >= 1) {
    voteRound();
  } else console.log(false);
}

//start screen NEW
$(document).on("click", "#submit1", function() {
  event.preventDefault();
  session = $("#session-input").val();
  player = $("#name-input").val();
  if (session || player != "") {
    $("#h2P").text("Get Ready!");
    seconds = 11;
    clearInterval(timer);
    timer = setInterval(setTimer, 1000);
    $(".start").addClass("hidden");
    gameInfo();
  }
});

function gameInfo() {
  $(".gameInfo").empty();
  var playerHUD = $("<p>").text(`Player: ${player} | Score: ${userScore}`);
  var sessionHUD = $("<p>").text(`Game Session: ${session}`);
  $(".gameInfo")
    .append(playerHUD)
    .append(sessionHUD);
}

function createForm() {
  var formDiv = $("<form>").addClass("formDiv");
  var textField = $("<input>")
    .attr("type", "text")
    .attr("placeholder", "your caption")
    .attr("id", "text");
  var submitButton = $("<input>")
    .attr("type", "submit")
    .attr("value", "submit")
    .attr("id", "submit");
  $("#text").val("");
  formDiv.append(textField).append(submitButton);
  $(".formContainer").html(formDiv);
}

// TIMER FUNCTION
function setTimer() {
  seconds = seconds - 1;
  var makeTimer = $("<h3>").html(`Time Remaining: ${seconds}`);
  $(".timer").html(makeTimer);
  if (pageIndex == 0) {
    if (seconds == 3) {
      $("#h2P").text("ready?");
    }
    if (seconds == 2) {
      $("#h2P").text("set");
    }
    if (seconds == 1) {
      $("#h2P").text("meme!");
    }
    if (seconds <= 0) {
      $(".container").empty();
      $("#mainImg").empty();
      $("#title").empty();
      $("#h2P").empty();
      findMeme();
      createForm();
    }
  }

  if (pageIndex == 1) {
    pageReader();
    if (seconds === 0) {
      voteRound();
      $(".gameNotifier").empty();
    }
  }
  if (pageIndex == 2) {
    if (seconds === 0) {
      showResults();
    }
  }
  if (pageIndex == 3) {
    if (seconds === 5) {
      finalResults();
    }
    if (seconds === 0) {
      findMeme();
    }
  }
  if (seconds <= 5) {
    $(".timer").attr("id", "warning");
  } else {
    $(".timer").attr("id", "");
  }
}

//MEME GENERATOR FUNCTION

function findMeme() {
  pageIndex = 1;
  gameInfo();
  userInput = "";
  userVote = "";
  $(".messageContainer").empty();
  $(".voteContainer").empty();
  var notify = $("<h4>")
    .text("caption this image!")
    .attr("id", "notifier");
  $(".gameNotifier").html(notify);
  createForm();
  seconds = 21;
  clearInterval(timer);
  timer = setInterval(setTimer, 1000);
  rn = Math.floor(Math.random() * 24) + 1;
  var rw = Math.floor(Math.random() * topic.length);
  var sw = topic[rw];
  var queryURL = `http://version1.api.memegenerator.net//Generators_Search?q=${sw}&pageSize=25&apiKey=ed0e5625-ed2d-4049-a830-bafce8b69716`;
  console.log(queryURL);
  console.log(sw);
  $.ajax({
    url: queryURL,
    method: "GET",
    cache: true
  }).then(function(response) {
    console.log(response);

    var imgDiv = $("<div>").addClass("image");
    docP = $("<h4>")
      .attr("id", "userText")
      .text("");

    //variable rn is used here at the image's source
    var makeImg = $("<img>")
      .attr("src", response.result[rn].imageUrl)
      .attr("alt", response.result[rn].urlName);

    imgDiv.append(makeImg);
    imgDiv.prepend(docP);
    $(".displayImage").html(imgDiv);
  });
}

//VOTING FUNCTION
function voteRound() {
  pageIndex = 2;
  $(".formContainer").empty();
  var resultButton = $("<button>")
    .text("submit vote")
    .attr("id", "result");
  seconds = 11;
  clearInterval(timer);
  timer = setInterval(setTimer, 1000);
  docP.remove();
  var notify = $("<h4>")
    .text("vote for your favorite caption")
    .attr("id", "notifier");
  var radioDiv = $("<div>").addClass("radio");
  var createChoices = $(`<input type="radio" name="a" value="1">`).attr(
    "id",
    "radio"
  );
  var createLabel = $("<label>").text(userInput);
  radioDiv.append(createChoices).append(createLabel);
  $(".gameNotifier").html(notify);
  $(".voteContainer").append(radioDiv);
  $(".voteContainer").append(resultButton);
  //might need this loop later once we get multiple inputs
  // for (c in userInput) {
  //   console.log(userInput[c]);
  //   var notify = $("<h4>")
  //     .text("vote for your favorite caption")
  //     .attr("id", "notifier");
  //   var a = userInput[c];
  //   var radioDiv = $("<div>").addClass("radio");
  //   var createChoices = $(`<input type="radio" name="a" value="${c}">`).attr(
  //     "id",
  //     "radio"
  //   );
  //   var createLabel = $("<label>").text(a);
  //   radioDiv.append(createChoices).append(createLabel);
  //   $(".gameNotifier").html(notify);
  //   $(".voteContainer").append(radioDiv);
  //   $(".voteContainer").append(resultButton);
  // }
}

//RESULTS FUNCTION
function showResults() {
  pageIndex = 3;
  seconds = 6;
  clearInterval(timer);
  timer = setInterval(setTimer, 1000);
  var notify = $("<h4>")
    .text("get ready for the next round")
    .attr("id", "notifier");
  var q = parseInt($(`input:radio[name='a']:checked`).val());
  var voted = $("<h4>")
    .attr("id", "userText")
    .html(`the winner is: ${userInput}`);
  $(".gameNotifier").html(notify);
  $(".messageContainer").html(voted);
  userVote = q;
  if (q == 1){
    userScore = userScore+2;
    gameInfo();
    $('.voteContainer').empty();
    return;
  }
}
//RESULTS ONCLICK FUNCTION
$(document).on("click", "#result", function() {
  if (userVote.length == 1) {
    return;
  }
  showResults();
});

//FINAL RESULTS FUNCTION
function finalResults() {
  if (userScore == winningScore) {
    pageIndex = 4;
    clearInterval(timer);
    console.log("score reached");
    $(".timer").empty();
    $(".messageContainer").empty();
    // $('.displayImage').empty();
    $(".gameNotifier").empty();
    $(".voteContainer").empty();
    var makeImg = $("<img>")
      .attr("src", "https://media1.giphy.com/media/LtLknRg3zywOA/giphy.gif")
      .attr("alt", "winner")
      .css("width", "370px")
      .css("height", "264px");
    $(".displayImage").html(makeImg);
    $(".messageContainer").html(`<h3>${player} wins!</h3>`);
  } else {
    console.log("score not reached");
  }
}

//SUBMIT FUNCTION
$(document).on("click", "#submit", function() {
  event.preventDefault();
  var input = $("#text").val();
  //changed to 4 for demo purposes
  if (userInput.length >= 1) {
    return;
  }
  if (input == "") {
    return;
  } else if (input != "") {
    var b = $("#userText");
    b.text(input);
    $(".messageContainer").html(b);
    userInput = input;
    $("#text").val("");
    database.ref("submits").set({
      uid: uid,
      answer: input
    });
    submitNum++;
    database.ref().update({ submitCounter: submitNum });
  }
});

//Firebase Code

var config = {
  apiKey: "AIzaSyB8-0Nof8ZMt0-ax-P7fvqdTBM5_HSvGF0",
  authDomain: "raiders-project.firebaseapp.com",
  databaseURL: "https://raiders-project.firebaseio.com",
  projectId: "raiders-project",
  storageBucket: "raiders-project.appspot.com",
  messagingSenderId: "849203199588"
};

firebase.initializeApp(config);

var database = firebase.database();

var player = 0;
var players = database.ref("players");
var playerCounter = 0;
// playerCounter = database.ref('playerCount').on("value", function (snap) {
//     return snap.val();
// });

database.ref().set({
  players: JSON.stringify([]),
  votesA: 0,
  votesB: 0,
  submits: JSON.stringify([]),
  submitCounter: submitNum,
  playerCount: playerCounter
});

// database.ref('/players').on("value", function(snapshot) {
//     player = snapshot.val().value;
//     console.log(snapshot.val());

//   });

//AUTHENTICATION
firebase
  .auth()
  .signInAnonymously()
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    uid = user.uid;
    console.log(user.uid);
    // ...
  } else {
    // User is signed out.
    // ...
  }
  // ...
});

var user = firebase.auth().currentUser;
//user.updateProfile({
//  points: 2;
//})
//

$(document).on("click", ".btn", function(event) {
  event.preventDefault();
  var select = $(this);
  var selectArray = [select];
  database
    .ref("players")
    .child(uid)
    .set({
      player: select.attr("id"),
      points: 0
    });
  playerInfo = database.ref("players").child("player");
  // console.log(playerInfo[0]);
  database.ref().update({ playerCount: playerCounter });
  if (select.attr("id") == "1");
  if (select.attr("id") == "2");
  if (select.attr("id") == "3");
  if (select.attr("id") == "4");
  console.log(playerCounter);
  console.log(select);
});

database.ref("players").on("child_added", function(snapshot) {
  playerCounter++;
});

// $(document).on('click', '#vote', function() {
//     database.ref().update({submits: topTwoA.length});
// })

database.ref("submits").on("value", function(snap) {
  console.log("submitted");
});
database.ref("votesA").on("value", function(snap) {
  console.log("votes");
});
//
