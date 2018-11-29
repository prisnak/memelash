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
    "funny", "beer","jay-z", "rap", "dog", "cat", "girl", "boy", "poo", "president", "trump", "sports", "dance", "drunk", "laugh", "sloth", "confused", "help", "drake"
];
var session, player, id, timer,  docP, myKey, randomPKey, userInput;
var pageIndex = 0;
var userScore = 0;
var winningScore = 10;
//TAKE INPUT session and player, RETURNS game screen
$(document).on('click', '#submit1', function() {
    event.preventDefault();
    session = $('#session-input').val();
    player = $('#name-input').val();
    if (session || player != "") {
        $("#h2P").text("Get Ready!");
        seconds = 5;
        clearInterval(timer);
        timer = setInterval(setTimer, 1000);
        $(".start").addClass("hidden");
        gameInfo();
        database.ref(session + '/players').push({
            playerName: player
        });
        //this grabs all of the randomly generated child keys from /players path
        database.ref(session + '/players').on('child_added', function(snap){
            randomPKey = snap.key;
            console.log(randomPKey);
        })
        //this grabs the most recent one
        database.ref(session).child('players')
          .limitToLast(1).on('child_added', function(snap){
            myKey = snap.key;
            console.log(myKey);
            database.ref(session + '/players/' + myKey).update({
                player_submits: 0,
                player_points: 0,
                player_submit_pos: null
            })
        })
    }
    database.ref(session).child('players').on('value', function(snap){
        var playersNum = snap.numChildren();
        console.log(playersNum);
        if(playersNum > 4) {
            alert('Reached max amount of players for this session. Try a different one');
            $('.start').removeClass('hidden');
            clearInterval(timer);
            database.ref(session + '/players').child(myKey).remove();
        } 
    })
})
//GAME SCREEN with player id, score, and session name
function gameInfo() {
    $(".gameInfo").empty();
    var playerHUD = $("<p>").text(`Player: ${player} | Score: ${userScore}`);
    var sessionHUD = $("<p>").text(`Game Session: ${session}`);
    var captionArr;
    var captionsHUD = $('<p id="captionsHUD">');
    $(".gameInfo")
        .append(playerHUD)
        .append(sessionHUD)
        .append(captionsHUD);
}
  //need to sync this to other player's browsers (do last -try at least)
  //========================
function setTimer() {
    seconds = seconds - 1;
    // console.log(seconds);
    database.ref(session).update({timer: seconds});
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
    var notify = $("<h4>").text("caption this image!").attr("id", "notifier");
    $(".gameNotifier").html(notify);
    createForm();
    seconds = 21;
    clearInterval(timer);
    timer = setInterval(setTimer, 1000);
    rn = Math.floor(Math.random() * 24) + 1;
    var rw = Math.floor(Math.random() * topic.length);
    var sw = topic[rw];
    var queryURL = 'http://version1.api.memegenerator.net//Generators_Search?q=' + sw + '&pageSize=25&apiKey=ed0e5625-ed2d-4049-a830-bafce8b69716';
    console.log(queryURL);
    console.log(sw);
    $.ajax({
        url: queryURL,
        method: "GET",
        cache: true
    }).then(function(response) {
        console.log(response);
        var imgDiv = $("<div>").addClass("image");
        // docP = $("<h4>").attr("id", "userText").text("");
        //variable rn is used here at the image's source
        var memeSRC = response.result[rn].imageUrl;
        var makeImg = $("<img>").attr("src", memeSRC)
        //snap this to the database
            .attr("alt", response.result[rn].urlName);

        //this is how you get everything to sync up
        database.ref(session).update({img_url:  memeSRC});
        database.ref(session).on("value", function(snapshot) {
            memeImg = snapshot.val().img_url;
            imgDiv.append(makeImg.attr('src', (snapshot.val().img_url)));
            // imgDiv.prepend(docP);
            $('.displayImage').html(imgDiv);
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
var submitArr = [];
var caption;
var submitNum = submitArr.length;

$(document).on("click", "#submit", function() {
    event.preventDefault();
    caption = $("#text").val();

    //changed to 4 for demo purposes
    if (userInput.length >= 1) {
        debugger;
        return;
    }
    if (caption == "") {
        return;
    } else if (caption != "") {
        var b = $("#userText");
        b.text(caption);
        $(".messageContainer").html(b);
        // userInput = caption;
        $("#text").val("");
        submitArr.push(caption);
        database.ref(session + '/players/' + myKey).update({
            player_submits: submitArr.length,
            player_points: userScore
        })
        database.ref(session).update({
            submitarr: submitArr,
            submitnum: submitArr.length
        });
        database.ref(session).child('submitarr').on('value', function(snap){
            captionArr = snap.val();
            console.log('Caption Arr:' + captionArr);
            $('#captionsHUD').text(captionArr);
            console.log('Snap NUM Child :' + snap.numChildren());
            if(snap.numChildren() == 2) {
                alert('max number of submits for this picture');
            }
        })
    }
    console.log(caption);   
});

function pageReader() {
//========================
    if (userInput.length >= 1) {
        //want to make this userInput read the snap.children of submits for a userEntry in the database
        //basically I want this to go to read the database and then respond
        database.ref(session).child('submitarr').on('value', function(snap){
            // if(snap.numChildren()== 0) ;
            submitArr = snap.val();
            console.log(snap.numChildren());
            console.log(submitArr);  
        })
        voteRound();
    } else console.log(false);
}

// VOTING FUNCTION
function voteRound() {
    pageIndex = 2;
    $(".formContainer").empty();
    var resultButton = $("<button>")
      .text("submit vote")
      .attr("id", "result");
    seconds = 11;
    clearInterval(timer);
    timer = setInterval(setTimer, 1000);
    // docP.remove();

    database.ref(session).child('submittarr').on('child_added', function(snap){
        for (c in submitArr) {
            console.log(submitArr[c]);
            var notify = $("<h4>")
            .text("vote for your favorite caption")
            .attr("id", "notifier");
            var a = submitArr[c];
            var radioDiv = $("<div>").addClass("radio");
            //need to make the create choices looking at the database to make the choices
            //make a variable that replaces the c
            var createChoices = $(`<input type="radio" name="a" value="${c}">`).attr(
            "id",
            "radio"
            );
            var createLabel = $("<label>").text(a);
            radioDiv.append(createChoices).append(createLabel);
            $(".gameNotifier").html(notify);
            $(".voteContainer").append(radioDiv);
            $(".voteContainer").append(resultButton);
        }
    })
    for (c in submitArr) {
        console.log(submitArr[c]);
        var notify = $("<h4>")
        .text("vote for your favorite caption")
        .attr("id", "notifier");
        var a = submitArr[c];
        var radioDiv = $("<div>").addClass("radio");
        //need to make the create choices looking at the database to make the choices
        //make a variable that replaces the c
        var createChoices = $(`<input type="radio" name="a" value="${c}">`).attr(
        "id",
        "radio"
        );
        var createLabel = $("<label>").text(a);
        radioDiv.append(createChoices).append(createLabel);
        $(".gameNotifier").html(notify);
        $(".voteContainer").append(radioDiv);
        $(".voteContainer").append(resultButton);
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

    if (q == 1){
        userScore = userScore+2;
        // gameInfo();
        $('.voteContainer').empty();
        //sync to database
        console.log(q);
        database.ref(session + '/players/' + myKey).update({
            player_points: userScore,
            player_submit_pos: q
        })
        return;
    }
    gameInfo();
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
          .css("width", "370px").css("height", "264px");
        $(".displayImage").html(makeImg);
        $(".messageContainer").html(`<h3>${player} wins!</h3>`);
    } else {
        console.log("score not reached");
    }
}  