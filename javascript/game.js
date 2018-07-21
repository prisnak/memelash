//new branch 2018-07-19
console.log('new branch "ju-20180716-integrated"');
var votesA = 0;
var votesB = 0;
var playerInfo;
var uid;
var submitNum = 0;
var topic = ['funny', 'beer', 'jay-z', 'rap', 'dog', 'cat', 'girl', 'boy', 'poo', 'president', 'trump', 'sports', 'dance','drunk','laugh','sloth','confused','help','drake'];

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
var pageIndex = [0];
var playerActive = [];


var scoreIcon;
//change winningScore to 10 once firebase is ready
var winningScore = 3;
//for demo purposes, created 4 vars for all players to play on one computer
var p1Score;
var p2Score;
var p3Score;
var p4Score;


function pageReader(){
        if (topTwoA.length == 2){
            voteRound();
        }else(console.log(false));
    }

//START SCREEN.
$(document).on("click", ".container button", function(){
    var player = parseInt($(this).attr("id"));
     scoreIcon = $('<span>').addClass('score');

    if (player == 1){
        
      $("#check1").removeClass("hidden");
        playerActive.push(player);
        scoreIcon.attr('id','player1').text(0);
        scoreIcon.addClass('m-2 rounded-circle bg-warning text-center text-white numberVote');
        $('.scoreDiv').removeClass("hidden");
        $('.scoreDiv').append(scoreIcon);
        //ju        
        p1Score = parseInt($('#player1').text());        
        $(this).remove();
    } else if(player == 2){
      $("#check2").removeClass("hidden");
        playerActive.push(player);
        scoreIcon.attr('id','player2').text(0);
        scoreIcon.addClass('m-2 rounded-circle bg-danger text-center text-white numberVote')
        $('.scoreDiv').removeClass("hidden")
        $('.scoreDiv').append(scoreIcon);
        //ju        
        p2Score = parseInt($('#player2').text());
        $(this).remove();
    } else if (player == 3){
      $("#check3").removeClass("hidden");
        playerActive.push(player);
        scoreIcon.attr('id','player3').text(0);
        $('.scoreDiv').removeClass("hidden")
        scoreIcon.addClass('m-2 rounded-circle bg-primary text-center text-white numberVote')
        //ju
        p3Score = parseInt($('#player3').text());                
        $('.scoreDiv').append(scoreIcon);
        $(this).remove();        
    } else if (player == 4){
      $("#check4").removeClass("hidden");
        playerActive.push(player);
        scoreIcon.attr('id','player4').text(0);
        scoreIcon.addClass('m-2 rounded-circle bg-success text-center text-white numberVote')
        $('.scoreDiv').removeClass("hidden")
        //ju
        p4Score = parseInt($('#player4').text());                
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


function createForm(){
    var formDiv = $('<form>').addClass('formDiv');
    var textField = $('<input>').attr('type','text').attr('placeholder','your caption').attr('id','text');
    var submitButton = $('<input>').attr('type', 'submit').attr('value','submit').attr('id','submit');
        $('#text').val("");
        formDiv.append(textField).append(submitButton);
        $('.formContainer').html(formDiv);
}



// TIMER FUNCTION
function setTimer(){
    seconds = seconds - 1;
    var makeTimer = $('<h3>').html(`Time Remaining: ${seconds}`);
    $('.timer').html(makeTimer);
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
            $('.container').empty();
            $('#mainImg').empty();
            $('#title').empty();
            $('#h2P').empty();
            findMeme();
            createForm();
        }
    }

    if (pageIndex == 1){
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
        if (seconds === 5){
            finalResults();
        }
        if (seconds === 0){
            findMeme();

            
            
        }
    }
    if (seconds <= 5){
        $('.timer').attr('id','warning');
    }else{
        $('.timer').attr('id','');
        
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
                docP = $('<h4>').attr('id','userText').text('');

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
//timer
        seconds = 11;
        clearInterval(timer);
        timer = setInterval(setTimer, 1000);
        docP.remove();
        userInput = [];
    for (c in topTwoA){   
        console.log(topTwoA[c]);
        var notify = $('<h4>').text('vote for your favorite caption').attr('id','notifier');
        var a = topTwoA[c];
        var radioDiv = $('<div>').addClass('radio');
        var createChoices = $(`<input type="radio" name="a" value="${c}">`).attr('id','radio');
        var createLabel = $('<label>').text(a);
            radioDiv.append(createChoices).append(createLabel);
            $('.gameNotifier').html(notify);
            $('.voteContainer').append(radioDiv);
            $('.voteContainer').append(resultButton);
            
    }


}

//RESULTS FUNCTION
function showResults(){
    pageIndex = [];
    var page = 3;
    pageIndex.push(page);
//timer
    seconds = 6;
    clearInterval(timer);
    timer = setInterval(setTimer, 1000);
    userInput = [];
    var notify = $('<h4>').text('get ready for the next round').attr('id','notifier');    
    var q = parseInt($(`input:radio[name='a']:checked`).val());
    var voted = $('<h4>').attr('id', 'userText').text(`the winner is: ${topTwoA[q]}`);
        $('.gameNotifier').html(notify);
        $('.messageContainer').append(voted);
        userVote.push(q);

        if (q == 0){
            p1Score++;
            $('#player1').text(p1Score);
            return;
        }
        else if (q == 1){
            p2Score++;
            $('#player2').text(p2Score);
            return;
        }
        
}
//RESULTS ONCLICK FUNCTION
$(document).on('click','#result', function(){
    if (userVote.length == 1){
        return;
    }
    showResults();

})

//FINAL RESULTS FUNCTION 
function finalResults(){
    if (p1Score == winningScore || p2Score == winningScore){
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
        if(p1Score == winningScore){
            $('.messageContainer').html(`<h3>player 1 wins!</h3>`);
        }
        if(p2Score == winningScore){
            $('.messageContainer').html(`<h3>player 2 wins!</h3>`);
        }

    }else{console.log('score not reached')};
}



//SUBMIT FUNCTION
$(document).on('click', '#submit', function(){
    event.preventDefault();
    var input = $('#text').val();
    //changed to 4 for demo purposes
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
    if(select.attr('id') == '1');
    if(select.attr('id') == '2');
    if(select.attr('id') == '3');
    if(select.attr('id') == '4');
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