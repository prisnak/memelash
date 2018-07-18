//new branch 2018-07-16
console.log('new branch "ju-20180716-integrated"');
var votesA = 0;
var votesB = 0;
var playerInfo;
var uid;
var submitNum = 0;
var topic = ['funny', 'beer', 'jay-z', 'rap', 'dog', 'cat', 'girl', 'boy', 'poo', 'president', 'trump', 'sports', 'dance','drunk'];

var rn = '';
var docP = '';
// this stores user's input
var userInput = [];
var seconds;
var timer;
// this empty array will hold all of the player's answers. 
var topTwoA = [];
// this stores user's vote
var userVote = [];
//this array will help cycle through input, vote, and result rounds
var pageIndex = [0];
var playerActive = [];

var scoreIcon;
var scoreSpan;


//START SCREEN.
$(document).on("click", ".container button", function(){
    var player = parseInt($(this).attr("id"));
     scoreIcon = $('<div>').addClass('score');
     scoreSpan = $('<span>').attr('id','counter').text(0);
        scoreIcon.append(scoreSpan);

    if (player == 1){
      $("#check1").removeClass("hidden");
        playerActive.push(player);
        scoreIcon.attr('id','player1');
        $('.scoreDiv').append(scoreIcon);

    } else if(player == 2){
      $("#check2").removeClass("hidden");
        playerActive.push(player);
        scoreIcon.attr('id','player2');
        $('.scoreDiv').append(scoreIcon);
    } else if (player == 3){
      $("#check3").removeClass("hidden");
        playerActive.push(player);
        scoreIcon.attr('id','player3');
        $('.scoreDiv').append(scoreIcon);
    } else if (player == 4){
      $("#check4").removeClass("hidden");
        playerActive.push(player);
        scoreIcon.attr('id','player4');
        $('.scoreDiv').append(scoreIcon);
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


function createForm(){
    var formDiv = $('<form>').addClass('formDiv');
    var textField = $('<input>').attr('type','text').attr('placeholder','your caption').attr('id','text');
    var submitButton = $('<input>').attr('type', 'submit').attr('value','submit').attr('id','submit');
        $('#text').val("");
        formDiv.append(textField).append(submitButton);
        $('.formContainer').html(formDiv);
}
//this checks when the topTwoA array's max two inputs are added. once max is reached, voteRound starts. So players do not have to wait for timer to reach 0
function pageReader(){
    if (topTwoA.length == 2){
        console.log(true);
        voteRound();
    }else(console.log(false));
}

// TIMER FUNCTION
function setTimer(){
    seconds = seconds - 1;
    var makeTimer = $('<p>').html(`Time Remaining: ${seconds}`);
    $('#title').html(makeTimer);
    
    
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
        //pageReader is only used in pageIndex 1 (input round) local if else statements caused bugs so its own function worked fine. it will check every second
        pageReader();
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


//MEME GENERATOR FUNCTION
function findMeme (){
    pageIndex = [];
    var page = 1;
    pageIndex.push(page);
    userInput = [];
    topTwoA = [];
    userVote = [];
    $('.gameNotifier').empty();
    $('.messageContainer').empty();
    $('.voteContainer').empty();

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
    var queryURL = `http://version1.api.memegenerator.net//Generators_Search?q=${sw}&pageSize=25&apiKey=ed0e5625-ed2d-4049-a830-bafce8b69716`;

    console.log(queryURL);
    // console.log(qm);
    console.log(sw);
    // added extra values to help our app work across different browsers and phones. (this worked for my last homework)
        $.ajax({
            url: queryURL,
            method: 'GET',
            cache: true,
        })

        .then(function(response){
                console.log(response);

            var imgDiv = $('<div>').addClass('image');
                docP = $('<p>').attr('id','userText').text('');

            //variable rn is used here at the image's source  
            var makeImg = $('<img>').attr('src', response.result[rn].imageUrl).attr('alt',response.result[rn].urlName);
                
                imgDiv.append(makeImg);
                imgDiv.prepend(docP);
                $('.displayImage').html(imgDiv);

            });

}

//VOTING FUNCTION
function voteRound(){
    pageIndex = [];
    var page = 2;
    pageIndex.push(page);
        $('.formContainer').empty();
    var resultButton = $('<button>').text('submit vote').attr('id','result');
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

//RESULTS FUNCTION
function showResults(){
    pageIndex = [];
    var page = 3;
    pageIndex.push(page);
    // $('.voteContainer').empty();
    seconds = 11;
    clearInterval(timer);
    timer = setInterval(setTimer, 1000);
    userInput = [];
    var notify = $('h2').text('get ready for the next round');    
    var q = $(`input:radio[name='a']:checked`).val();
    var voted = $('<p>').addClass('#userText');
    voted.text(`the winner is: ${topTwoA[q]}`);
        $('.gameNotifier').html(notify);
        $('.messageContainer').append(voted);
        userVote = q;
}
//RESULTS ONCLICK FUNCTION
$(document).on('click','#result', function(){
    if (userVote.length == 1){
        return;
    }
    showResults();

})


//SUBMIT FUNCTION
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
        console.log(topTwoA.length);
        database.ref('submits').set({
            uid: uid,
            answer: input
        })
        submitNum++;
        database.ref().update({submitCounter: submitNum});
    }

})

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
var players = database.ref('players');
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
})

// database.ref('/players').on("value", function(snapshot) {
//     player = snapshot.val().value;
//     console.log(snapshot.val());
    
//   });

//AUTHENTICATION
firebase.auth().signInAnonymously().catch(function(error) {
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

$(document).on('click', '.btn', function(event) {
    event.preventDefault();
    var select = $(this);
    var selectArray = [select];
    database.ref('players').child(uid).set({
        player: select.attr('id'),
        points: 0,
    });
    playerInfo = database.ref('players').child('player');
    // console.log(playerInfo[0]);
    database.ref().update({playerCount: playerCounter});
    if(select.attr('id') == '1') alert('hi player 1');
    if(select.attr('id') == '2') alert('hi player 2');
    if(select.attr('id') == '3') alert('hi player 3');
    if(select.attr('id') == '4') alert('hi player 4');
    console.log(playerCounter);
    console.log(select);
})

database.ref("players").on("child_added", function(snapshot) {
    playerCounter++;;
});

// $(document).on('click', '#vote', function() {
//     database.ref().update({submits: topTwoA.length});
// })

database.ref('submits').on("value", function(snap) {
    console.log('submitted');
  });
database.ref('votesA').on("value", function(snap) {
    console.log('votes');
});
//