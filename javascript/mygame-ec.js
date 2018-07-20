
var player, playerInfo, memeImg, timer, seconds, scoreIcon, scoreSpan, q, queryURL;
var votesA, votesB, submitNum, playerCounter = 0;

var topic = ['funny', 'beer', 'jay-z', 'rap', 'dog', 'cat', 'girl', 'boy', 'poo', 'president', 'trump', 'sports', 'dance','drunk'];

var rn, docP = '';
// this stores user's input
// this empty array will hold all of the player's answers. 
// this stores user's vote
var userInput, topTwoA, userVote, playerActive = [];
var pageIndex = [0];

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
// TIMER FUNCTION
function setTimer(){
    seconds = seconds - 1;
    var makeTimer = $('<p>').html(`Time Remaining: ${seconds}`);
    $('#title').html(makeTimer);
    timerDatabase();

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
        if (seconds === 0){
            findMeme();
        }
    }

}

function timerDatabase () {
    database.ref('game').update({timer: seconds});
    database.ref("/game").on("value", function(snapshot) {
        // Print the local data to the console.
        seconds = snapshot.val().timer;
        console.log('snapshot ' + snapshot.val().timer);
        
    });
}
//=================================================================
//Submit Caption Form
function createForm(){
    var formDiv = $('<form>').addClass('formDiv');
    var textField = $('<input>').attr('type','text').attr('placeholder','your caption').attr('id','text');
    var submitButton = $('<input>').attr('type', 'submit').attr('value','submit').attr('id','submit');
    $('#text').val("");
    formDiv.append(textField).append(submitButton);
    $('.formContainer').html(formDiv);
}
//================================================================
//MEME GENERATOR FUNCTION
//will we need to make the response's imgUrl a firebase var so that all users see the same image?

function findMeme (){
    pageIndex = [];
    var page = 1;
    pageIndex.push(1);
    userInput = [];
    topTwoA = [];
    $('.gameNotifier').empty();
    $('.messageContainer').empty();
    $('.voteContainer').empty();
    createForm();
    //timer
    seconds = 21;
    clearInterval(timer);
    timer = setInterval(setTimer, 1000);
    timerDatabase();

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
//==================================================================
//VOTING FUNCTION
function voteRound(){
    timerDatabase();
    pageIndex = [];
    var page = 2;
    pageIndex.push(page);
        $('.formContainer').empty();
    var resultButton = $('<button>').text('submit vote').attr('id','result').addClass('submit-vote');
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
            $('.voteContainer').append(resultButton);        
    }
}
//==============================================
//RESULTS FUNCTION
function showResults(){
    timerDatabase();
    pageIndex = [];
    var page = 3;
    pageIndex.push(page);
    // $('.voteContainer').empty();
    seconds = 11;
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
        // debugger;
        userVote = q;
}
//RESULTS ONCLICK FUNCTION
$(document).on('click','#result', function(){
    // if (userVote.length == 1){
    //     return;
    // }
    showResults();
})

//=========================================================
//ASSIGNING PLAYERS
var checkSrc1 = $('#check1').attr('src'); 
var checkSrc2 = $('#check2').attr('src');
var checkSrc3 = $('#check3').attr('src');
var checkSrc4 = $('#check4').attr('src');


//No longer need hidden value

$(document).ready(function() {
    //keeps checks hidden on load
    checkSrc1 = '';
    checkSrc2 = '';
    checkSrc3 = '';
    checkSrc4 = '';
    $('#check1').attr('src', checkSrc1);
    $('#check2').attr('src', checkSrc2);
    $('#check3').attr('src', checkSrc3);
    $('#check4').attr('src', checkSrc4);

})

$(document).on('click', '.container button', function(event) {
    event.preventDefault();
    var player = parseInt($(this).attr("id"));
    scoreIcon = $('<div>').addClass('score');
    scoreSpan = $('<span>').attr('id','counter').text(0);
    scoreIcon.append(scoreSpan);
    database.ref('players').child('player-info').set({
        uid: uid,
        player: player,
        points: 0,
        submits: 0
    });
    playerInfo = database.ref('players').child('player');
    database.ref().update({playerCount: playerCounter});
    database.ref('players/player-info').update({
        uid: uid,
        player: player,
        points: 0,
        submits: 0
    })

    database.ref('/game').on('value', function (snap) {
        if(snap.child('player1C').exists()) {
            console.log('here');
            checkImg1 = $("#check1").attr('src', checkSrc1);
                console.log(snap.val().player1C);   
                $('#check1').html(checkImg1);
                scoreIcon.attr('id','player1');
                $('.scoreDiv').append(scoreIcon);
        }
        if (player == 1 ){
            playerActive.push(player);
            checkSrc1 = 'images/checked.png';
            // checkSrc1 = 'https://freeiconshop.com/wp-content/uploads/edd/checkmark-solid.png';
            database.ref('game').update({player1C: checkSrc1});
            // database.ref('/game').on('value', function (snap) {
                checkSrc1 = snap.val().player1C; 
                checkImg1 = $("#check1").attr('src', checkSrc1);
                console.log(snap.val().player1C);   
                // $('#check1').html(checkImg1);
                $('#check1').attr('src', snap.val().player1C);
                scoreIcon.attr('id','player1');
                $('.scoreDiv').append(scoreIcon);
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
            }
            if (playerActive.length == 1){
                $('#h2P').text('waiting for more players...');
                seconds = 11;
                clearInterval(timer);
                timer = setInterval(setTimer, 1000);
            }
            console.log(playerCounter);
            console.log(player);
        })

    })

//ADDING THEM TO THE PLAYER COUNTER
database.ref("players").on("child_added", function(snapshot) {
    playerCounter++;
});

//===========================================================
//SUBMITTING FORMS

$(document).on('click', '#submit', function(){
    event.preventDefault();
    var input = $('#text').val();
    
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
        database.ref('players/player-info').update({submits: 1});
    }
});

database.ref('submits').on("value", function(snap) {
    snap.val();
    console.log(snap.val());
    console.log('submitted');
});

//SUBMITTING VOTES

$(document).on('click', '.submit-vote', function () {
    event.preventDefault();
    var voteVal = $(`input:radio[name='a']:checked`).val();
    if(voteVal == 0) {
        votesA ++;
        database.ref().update({votesA: votesA});
    }
    if(voteVal == 1) {
        votesB ++;
        database.ref().update({votesB: votesB});
    }
});