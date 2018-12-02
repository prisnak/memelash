var config = {
  apiKey: "AIzaSyAe7DlB7RVw2fnY71443yayzDeGV3X7o_Q",
  authDomain: "raiders-project-revised.firebaseapp.com",
  databaseURL: "https://raiders-project-revised.firebaseio.com",
  projectId: "raiders-project-revised",
  storageBucket: "raiders-project-revised.appspot.com",
  messagingSenderId: "942825604688"
};
firebase.initializeApp(config);
var database = firebase.database();
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
var session, myName, id, timer, docP, myKey, fbKey, fbName, userInput;
var pageIndex = 0;
var userScore = 0;
var winningScore = 10;
var playersArr = [];
var submitArr = [];
var caption;
var submitNum = submitArr.length;
var submitOb;
$(".gameInfo").empty();
//TAKE INPUT session and player, RETURNS game screen
$(document).on("click", "#submit1", function() {
  event.preventDefault();
  session = $("#session-input").val();
  var sessionHUD = $("<p id='session'>").text(`Game Session: ${session}`);
  var captionArr;
  var captionsHUD = $('<p id="captionsHUD">');
  $(".gameInfo")
    .append(sessionHUD)
    .append(captionsHUD);
  myName = $("#name-input").val();
  if (session || myName != "") {
    database.ref(session + "/players").push({
      playerName: myName,
      player_points: 0
    });
    //this grabs all of the randomly generated child keys from /players path
    database.ref(session + "/players").on("child_added", function(snap) {
      fbKey = snap.key;
      var playersRef = database.ref(
        session + "/players/" + fbKey + "/playerName"
      );
      playersRef.on("value", function(snapshot) {
        fbName = snapshot.val();
        var playerOb = {
          id: fbKey,
          name: fbName
        };
        playersArr.push(playerOb);
        gameInfo();
      });
      console.log(`new key joined ${fbKey}`);
      $(".startContainer").empty();
      $("#h2P").text("waiting for more players!");
    });
  }
  database
    .ref(session)
    .child("players")
    .on("value", function(snap) {
      var playersNum = snap.numChildren();
      console.log(playersNum);
      if (playersNum >= 2) {
        $("#h2P").text("Get Ready!");
        seconds = 5;
        clearInterval(timer);
        timer = setInterval(setTimer, 1000);
        $(".start").addClass("hidden");
      }
      if (playersNum >= 4) {
        alert(
          "Reached max amount of players for this session. Try a different one"
        );
        $(".start").removeClass("hidden");
        clearInterval(timer);
        database
          .ref(session + "/players")
          .child(myKey)
          .remove();
      }
    });
});
//GAME SCREEN with player id, score, and session name
function gameInfo() {
  myKey = playersArr[0].id;
  for (i = 0; i < playersArr.length; i++) {
    console.log(`${playersArr[i].id} : ${playersArr[i].name}`);
    var id = playersArr[i].id;
    var name = playersArr[i].name;
    var playerHUD = $(`<p id=player>`).text(
      `Player: ${name} | Score: ${userScore}`
    );
    playerHUD.attr("data-id", `${id}`);
  }
  $(".gameInfo").append(playerHUD);
  console.log(`your key ${myKey}`);
}
//need to sync this to other player's browsers (do last -try at least)
//========================
function setTimer() {
  seconds = seconds - 1;
  database.ref(session).update({ timer: seconds });
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
      submitArr.splice(0, submitArr.length);
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
  console.log(submitArr);
  pageIndex = 1;
  userInput = "";
  userVote = "";
  database.ref(session).update({
    submits: []
  });
  $(".messageContainer").empty();
  $(".voteContainer").empty();
  var notify = $("<h4>")
    .text("caption this image!")
    .attr("id", "notifier");
  $(".gameNotifier").html(notify);
  createForm();
  seconds = 11;
  clearInterval(timer);
  timer = setInterval(setTimer, 1000);
  rn = Math.floor(Math.random() * 24) + 1;
  var rw = Math.floor(Math.random() * topic.length);
  var sw = topic[rw];
  var queryURL =
    "http://version1.api.memegenerator.net//Generators_Search?q=" +
    sw +
    "&pageSize=25&apiKey=ed0e5625-ed2d-4049-a830-bafce8b69716";
  //   console.log(queryURL);
  //   console.log(sw);
  $.ajax({
    url: queryURL,
    method: "GET",
    cache: true
  }).then(function(response) {
    // console.log(response);
    var imgDiv = $("<div>").addClass("image");
    var memeSRC = response.result[rn].imageUrl;
    var makeImg = $("<img>")
      .attr("src", memeSRC)
      //snap this to the database
      .attr("alt", response.result[rn].urlName);
    //this is how you get everything to sync up
    database.ref(session).update({ img_url: memeSRC });
    database.ref(session).on("value", function(snapshot) {
      memeImg = snapshot.val().img_url;
      imgDiv.append(makeImg.attr("src", snapshot.val().img_url));
      // imgDiv.prepend(docP);
      $(".displayImage").html(imgDiv);
    });
  });
}
//Create SUBMIT FORMS FOR PLAYER-GENERATED CAPTIONS
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
//SUBMITTING CAPTIONS

//push up to firebase = caption, player, id

$(document).on("click", "#submit", function() {
  event.preventDefault();
  caption = $("#text").val();

  //changed to 4 for demo purposes
  if (userInput.length >= 1) {
    // debugger;
    return;
  }
  if (caption == "") {
    return;
  } else if (caption != "") {
    var b = $("<div>").attr("id", "userCaption");
    b.text(caption);
    $(".messageContainer").html(b);
    $("#text").val("");
    database.ref(session + "/submits").push({
      _id: myKey,
      _caption: caption
    });
    database.ref(session + "/submits").on("child_added", function(snap) {
      // console.log(snap.key);
      var captionKey = snap.key;
      var captionRef = database.ref(
        session + "/submits/" + captionKey + "/_caption"
      );
      var captionIdRef = database.ref(
        session + "/submits/" + captionKey + "/_id"
      );
      var fbId, fbCaption;
      captionIdRef.on("value", function(snapId) {
        fbId = snapId.val();
      });
      captionRef.on("value", function(snapCap) {
        fbCaption = snapCap.val();
        var captionOb = {
          playerId: fbId,
          playerCaption: fbCaption,
          capKey: captionKey
        };
        submitArr.push(captionOb);
      });
      //   captionOb = {
      //     playerId: fbId,
      //     playerCaption: fbCaption,
      //     capKey: captionKey
      //   };
    });
  }
  console.log(caption);
  console.log(submitArr);
});

// VOTING FUNCTION
// FIX FIX FIX USER ONLY SEES OWN CAPTION AND NOT OTHER PLAYERS
function voteRound() {
  pageIndex = 2;
  $(".formContainer").empty();
  var notify = $("<h4>")
    .text("vote for your favorite caption")
    .attr("id", "notifier");
  seconds = 11;
  clearInterval(timer);
  timer = setInterval(setTimer, 1000);
  for (i = 0; i < submitArr.length; i++) {
    var c = submitArr[i].playerCaption;
    var cId = submitArr[i].capKey;
    var uId = submitArr[i].playerId;
    var radioDiv = $("<div>").addClass("radio");
    var createChoices = $(
      `<input type="radio" name="a" value=${i} data-id=${cId} data-uid=${uId}>`
    ).attr("id", "radio");
    var createLabel = $("<label>").text(c);
    radioDiv.append(createChoices).append(createLabel);
    $(".gameNotifier").html(notify);
    $(".voteContainer").append(radioDiv);

    //push votes into another object that will go up to firebase. take vote value, caption's submit id, and also user's id. use count in firebase to find which value is found most.
  }
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
  console.log(userVote);
  debugger;
  if (q == 1) {
    userScore = userScore + 2;
    $(".voteContainer").empty();
    //sync to database
    console.log(q);
    database.ref(session + "/players/" + myKey).update({
      player_points: userScore,
      player_submit_pos: q
    });
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
