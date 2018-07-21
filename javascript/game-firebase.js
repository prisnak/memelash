var topic = ['funny', 'beer', 'jay-z', 'rap', 'dog', 'cat', 'girl', 'boy', 'poo', 'president', 'trump', 'sports', 'dance','drunk'];

var rn, docP = '';
var seconds, timer; 
var topTwoA, userInput, userVote, playerActive = [];
var pageIndex = [0];

var scoreIcon, scoreSpan, myScore, q, queryURL;

var winningScore, oppScore = 3;
var playerCounter = 0;
var votesA = 0;
var votesB = 0;
var submitNum = 0;

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


var player, playerInfo, memeImg, checkImg1;
var players = database.ref('players');



database.ref().set({
    players: JSON.stringify([]),
    votesA: votesA,
    votesB: votesB,
    submits: JSON.stringify([]),
    submitCounter: submitNum,
    playerCount: playerCounter,
    game: JSON.stringify([])
})
//=======================================================
//AUTHENTICATION
firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        uid = user.uid;
        console.log(user.uid);
    } else {
        // User is signed out.
    }
});
var user = firebase.auth().currentUser;
//==================================================================
//CONNECTIONS

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function(snap) {
  // If they are connected..
  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

connectionsRef.on("value", function(snap) {
  // The number of online users is the number of children in the connections list.
  $("#watchers").text(snap.numChildren());
});
//===========================================================
//Function to make page automatically start vote round after submits are in
function pageReader(){
    if (topTwoA.length == 2){
        voteRound();
    }else(console.log(false));
}
//==================================================================
//ASSIGNING PLAYERS
var checkSrc1 = $('#check1').attr('src'); 
var checkSrc2 = $('#check2').attr('src');
var checkSrc3 = $('#check3').attr('src');
var checkSrc4 = $('#check4').attr('src');
checkSrc1 = '';
checkSrc2 = '';
checkSrc3 = '';
checkSrc4 = '';
//No longer need hidden value

$(document).ready(function() {
    //keeps checks hidden on load

    $('#check1').attr('src', checkSrc1);
    $('#check2').attr('src', checkSrc2);
    $('#check3').attr('src', checkSrc3);
    $('#check4').attr('src', checkSrc4);

})

//PSUEDOCODE
//this is the code that I tried to implement to show how the player was chosen
//if(snap.child('player1C') == imgsrc) {
//    - update the current browser to display the check mark
//    to indicate that a player has been chosen
//    - deactivate the button once it has been selected
//    -update to the firebase to have everything sync across different browsers
//}
database.ref('/game').on('value', function (snap) {
    if(snap.child('player1C') == 'images/checked.png') {
        console.log('here');
        checkSrc1 = snap.val().player1C; 
        checkImg1 = $("#check1").attr('src', checkSrc1);
        console.log(snap.val().player1C);   
        $('#check1').html(checkImg1);
        $('#check1').attr('src', snap.val().player1C);
        scoreIcon.attr('id','player1');
        $('.scoreDiv').append(scoreIcon);
    }


    $(document).on('click', '.container button', function(event) {
        event.preventDefault();
        var player = parseInt($(this).attr("id"));
        scoreIcon = $('<div>').addClass('score');
        scoreSpan = $('<span>').attr('id','counter').text(0);
        scoreIcon.append(scoreSpan);
        playerInfo = database.ref('players').child('player');
        database.ref().update({playerCount: playerCounter});
        database.ref('players/player-info').update({
            uid: uid,
            player: player,
            points: 0,
            submits: 0
        })

        if (player == 1){
            playerActive.push(player);
            checkSrc1 = 'images/checked.png';
            database.ref('game').update({player1C: checkSrc1});
            checkSrc1 = snap.val().player1C; 
            checkImg1 = $("#check1").attr('src', checkSrc1);
            console.log(snap.val().player1C);   
            // $('#check1').html(checkImg1);
            $('#check1').attr('src', snap.val().player1C);
            scoreIcon.attr('id','player1');
            $('.scoreDiv').append(scoreIcon);
            myScore = parseInt($('#player1').text());        
            $(this).remove();
            // })    
        } 
        if (player == 2){
            playerActive.push(player);
            checkSrc2 = 'images/checked.png';
            database.ref('game').update({player2C: checkSrc2});
            checkSrc2 = snap.val().player2C; 
            var checkImg = $("#check2").attr('src', snap.val().player2C);
            console.log(snap.val().player2C);   
            console.log(checkSrc2);
            $('#check2').html(checkImg);
            scoreIcon.attr('id','player2');
            $('.scoreDiv').append(scoreIcon);
            oppScore = parseInt($('#player2').text());
            $(this).remove();
        } 
        if (player == 3){
            playerActive.push(player);
            checkSrc3 = 'images/checked.png';
            database.ref('game').update({player3C: checkSrc3});
            checkSrc3 = snap.val().player3C; 
            var checkImg = $("#check3").attr('src', snap.val().player3C);
            console.log(snap.val().player3C);   
            console.log(checkSrc3);
            $('#check3').html(checkImg);
            scoreIcon.attr('id','player3');
            $('.scoreDiv').append(scoreIcon);
            $(this).remove();  
        } 
        if (player == 4){
            playerActive.push(player);
            checkSrc4 = 'images/checked.png';
            database.ref('game').update({player4C: checkSrc4});
            checkSrc4 = snap.val().player4C; 
            var checkImg = $("#check4").attr('src', snap.val().player4C);
            console.log(snap.val().player4C);   
            console.log(checkSrc4);
            $('#check4').html(checkImg);
            scoreIcon.attr('id','player4');
            $('.scoreDiv').append(scoreIcon);
            $(this).remove();
        }
        if (playerActive.length == 1){
            $('#h2P').text('waiting for more players...');
        } 
        if (playerActive.length == 2){
            $('#h2P').text('almost ready!');
        } 
        if (playerActive.length == 3){
            $('#h2P').text('all set! get ready!');
            seconds = 11;
            clearInterval(timer);
            timer = setInterval(setTimer, 1000);
        } 
    })
})
//================================================================
//Submit Caption Form
function createForm(){
    var formDiv = $('<form>').addClass('formDiv text-center m-3');
    var textField = $('<input>').attr('type','text').attr('placeholder','your caption').attr('id','text');
    var submitButton = $('<input>').attr('type', 'submit').attr('value','submit').attr('id','submit');
    $('#text').val("");
    formDiv.append(textField).append(submitButton);
    $('.formContainer').html(formDiv);
}
//================================================================
// TIMER FUNCTION
function setTimer(){
    seconds = seconds - 1;
    var makeTimer = $('<p>').html(`Time Remaining: ${seconds}`);
    $('#title').html(makeTimer);
    database.ref('game').update({timer: seconds});

    if (pageIndex == 0){
        if (seconds == 3){
            $('#h2P').text('ready?');
        }
        if (seconds == 2){
            $('#h2P').text('set');
        }
        if (seconds == 1){
            $('#h2P').text('meme!');
        }
        if(seconds <= 0){
            console.log('true');
            $('.container').empty();
            $('#mainImg').empty();
            $('#title').empty();
            $('#h2P').empty();
            findMeme();
            createForm();
        }
    }
    if (pageIndex == 1){
        if (seconds === 0){
            voteRound();
            $('.gameNotifier').empty();  
        }
    }
    if (pageIndex == 2){
        if (seconds === 0){
            showResults();
        }
    }
    if (pageIndex == 3){
        if (seconds === 5){
            finalResults();
        }
        if (seconds === 0){
            findMeme();
        }
    }
    if (seconds <= 5){
        $('.timer').attr('id','warning');
    } else {
        $('.timer').attr('id','');

    }
}

//=================================================================

//MEME GENERATOR FUNCTION
//will we need to make the response's imgUrl a firebase var so that all users see the same image?

function findMeme (){
    pageIndex = [];
    var page = 1;
    pageIndex.push(page);
    userInput = [];
    topTwoA = [];
    userVote = [];
    
    $('.messageContainer').empty();
    $('.voteContainer').empty();
    var notify = $('<h4>').text('caption this image!').attr('id','notifier');
    $('.gameNotifier').html(notify);
    createForm();
    //timer
    seconds = 21;
    clearInterval(timer);
    timer = setInterval(setTimer, 1000);

    //generate random number to pull a random object/image from the 25 memes pulled from the ajax response
    rn = Math.floor(Math.random()* 24) +1;
    
    //pull a random search word from topic array to widen meme search. used .length in case we want to add more 
    var rw = Math.floor(Math.random()* topic.length);
    var sw = topic[rw];

    // added variable sw to the queryURL 
    queryURL = `http://version1.api.memegenerator.net//Generators_Search?q=${sw}&pageSize=25&apiKey=ed0e5625-ed2d-4049-a830-bafce8b69716`;
    console.log(queryURL);
    // console.log(qm);
    console.log(sw);
    // added extra values to help our app work across different browsers and phones. (this worked for my last homework)
    $.ajax({
        url: queryURL,
        method: 'GET',
        cache: true,
    }).then(function(response) {
        console.log(response);
        var imgDiv = $('<div>').addClass('image');
        docP = $('<p>').attr('id','userText').text('');

        //variable rn is used here at the image's source  
        var memeSRC = response.result[rn].imageUrl;
        var makeImg = $('<img>').attr('src', memeSRC).attr('alt',response.result[rn].urlName);
        //this is how you get everything to sync up
        database.ref('game').update({img_url:  memeSRC});
        database.ref("/game").on("value", function(snapshot) {
            // Print the local data to the console.
            console.log('snapshot ' + snapshot.val().img_url);
            memeImg = snapshot.val().img_url;
            console.log(memeImg);  
            imgDiv.append(makeImg.attr('src', (snapshot.val().img_url)));
            imgDiv.prepend(docP);
            $('.displayImage').html(imgDiv);
        });
    });
}
//===========================================
//SUBMITTING FORMS

$(document).on('click', '#submit', function(){
    event.preventDefault();
    var input = $('#text').val();
    //PSUEDOCODE
    // Create snapshot of which player uid submitted the form
    //this keeps track of the first submit
    //database.ref("player/player-info").on("value", function(snapshot) {
    //  var sumbitUID = snapshot.val().uid;
    //  if (topTwoA.length == 1) {
            //database.ref('submits').update({
        //      uid: submitUID,
        //      answer: answer,
        //      votePos: votesA
    //      })
    //}
    //this keeps track of the second submit
       //  if (topTwoA.length == 2) {
            //database.ref('submits').update({
        //      uid2: uid,
        //      answer2: answer,
        //      votePos2: votesB
    //      })
    //}
    //  
    //  
        //}
    if (topTwoA.length >= 2){
        return;
    }
    if (input == ''){
        return;
    } 
    else if (input != ""){
        var b = $('#userText');
        b.text(input);
        $('.messageContainer').html(b);
        userInput.push(input);
        topTwoA.push(input);
        $('#text').val("");
        database.ref('submits').set({
            uid: uid,
            answer: input
        })
        submitNum++;
        database.ref().update({submitCounter: submitNum});
        database.ref('players/player-info').update({submits: submitNum});
    }
});

database.ref('submits').on("value", function(snap) {
    snap.val();
    console.log(snap.val());
    console.log('submitted');
});
//==========================================
//VOTING FUNCTION
function voteRound(){

    pageIndex = [];
    var page = 2;
    pageIndex.push(page);
        $('.formContainer').empty();
    var submitVButton = $('<button>').text('submit vote').attr('id','voteSubmit')
        seconds = 11;
        clearInterval(timer);
        timer = setInterval(setTimer, 1000);
        docP.remove();
        userInput = [];
    for (c in topTwoA){   
        console.log(topTwoA[c]);
        var notify = $('h2').text('vote for your favorite caption');
        var a = topTwoA[c];
        var radioDiv = $('<div>').addClass('radio');
        var createChoices = $(`<input type="radio" name="a" value="${c}">`).attr('id','radio');
        var createLabel = $('<label>').text(a);
        radioDiv.append(createChoices).append(createLabel);
        $('.gameNotifier').append(notify);
        $('.voteContainer').append(radioDiv);
        $('.voteContainer').append(submitVButton);        
    }

}
//==============================================
//RESULTS FUNCTION
function showResults(){
    pageIndex = [];
    var page = 3;
    pageIndex.push(page);
    seconds = 6;
    clearInterval(timer);
    timer = setInterval(setTimer, 1000);
    userInput = [];
    var notify = $('h2').text('get ready for the next round');    
    //value of the vote that was checked (also its position) its either 0 or 1
    q = $(`input:radio[name='a']:checked`).val();
    console.log(q);
    var voted = $('<p>').addClass('#userText');
    voted.text(`the winner is: ${topTwoA[q]}`);
    $('.gameNotifier').html(notify);
    $('.messageContainer').append(voted);
    userVote.push(q);
    if(q == 0) {
        votesA ++;
        database.ref().update({votesA: votesA});
        database.ref('votesA').on('value', function (snap) {
            $('#player1').text(snap.val().votesA);
        })
        return;
    } else if (q == 1) {
        votesB++;
        database.ref().update({votesB: votesB});
        database.ref('votesB').on('value', function (snap) {
            $('#player2').text(snap.val().votesA);
        })
    }   
}
//RESULTS ONCLICK FUNCTION
$(document).on('click','#voteSubmit', function(){
    if (userVote.length == 1){
        return;
    }
    showResults();
});

//FINAL RESULTS FUNCTION 
function finalResults(){
    if (myScore == winningScore || oppScore == winningScore){
        pageIndex = [];
        var page = 4;
        pageIndex.push(page);
        clearInterval(timer);
        console.log('score reached');
        $('.timer').empty();
        $('.messageContainer').empty();
        // $('.displayImage').empty();
        $('.gameNotifier').empty();
        $('.voteContainer').empty();
        var makeImg = $('<img>').attr('src', 'https://media1.giphy.com/media/LtLknRg3zywOA/giphy.gif').attr('alt','winner');  
        $('.displayImage').html(makeImg);
        if(myScore == winningScore){
            $('.messageContainer').html(`<h3>player 1 wins!</h3>`);
        }
        if(oppScore == winningScore){
            $('.messageContainer').html('player 2 wins!');
        } else {console.log('score not reached');}
    }
    if(votesA > votesB) {
        database.ref('/players/player-info').update({points: 2});
        //, function(){
        //     database.ref().update({
        //         votesA: 0,
        //         votesB: 0
        //     })
        // });

        database.ref().update({
            votesA: 0,
            votesB: 0
        })

    }
    if(votesB > votesA) {
        database.ref('players/player-info').update({points: 2});
    //         , function(){
    //         database.ref().update({
    //             votesA: 0,
    //             votesB: 0
    //         })
    // }
        database.ref().update({
            votesA: 0,
            votesB: 0
        })


    } 
}


  

//ADDING THEM TO THE PLAYER COUNTER
database.ref("players").on("child_added", function(snapshot) {
    playerCounter++;
});
//=============================================================



//SUBMITTING VOTES

// $(document).on('click', '.submit-vote', function () {
//     event.preventDefault();
//     var voteVal = $(`input:radio[name='a']:checked`).val();
//     if(voteVal == 0) {
//         votesA ++;
//         database.ref().update({votesA: votesA});
//     }
//     if(voteVal == 1) {
//         votesB ++;
//         database.ref().update({votesB: votesB});
//     }
//     if(votesA > votesB) console.log('more votes to a')
