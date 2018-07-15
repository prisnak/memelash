//EC
var votesA = 0;
var votesB = 0;

var topic = ['funny', 'beer', 'jay-z', 'rap', 'dog', 'cat', 'girl', 'boy', 'poo', 'president', 'trump', 'sports', 'dance','drunk'];

var makeButton = $('<button>').text('meme').attr('id','start');
    $('.buttonContainer').append(makeButton);
var voteButton = $('<button>').text('vote').attr('id','vote');
    $('.buttonContainer').append(voteButton);
var resultButton = $('<button>').text('result').attr('id','result');
    $('.buttonContainer').append(resultButton);
var rn = '';
var docP = '';
// this stores user's input
var userInput = [];
var seconds = 61;
var timer;
// this empty array will hold all of the player's answers. 
var topTwoA = [];
// this stores user's vote
var userVote = [];

var formDiv = $('<form>').addClass('formDiv');
var textField = $('<input>').attr('type','text').attr('placeholder','your caption').attr('id','text');
var submitButton = $('<input>').attr('type', 'submit').attr('value','submit').attr('id','submit');
    formDiv.append(textField).append(submitButton);
            $('.inputContainer').append(formDiv);

function createForm(){
        $('#text').val("");
        formDiv.append(textField).append(submitButton);
        $('.inputContainer').append(formDiv);
}



// TIMER FUNCTION
function setTimer(){
    seconds = seconds - 1;
    var makeTimer = $('<p>').text(`Time Remaining: ${seconds}`);
    $('.timer').html(makeTimer);

    if (seconds === -1){
        resetTimer();
    }
}


//MEME GENERATOR FUNCTION

function findMeme (){
    formDiv.append(textField).append(submitButton);
        $('.inputContainer').append(formDiv);

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
        seconds = 61;
        clearInterval(timer);
        timer = setInterval(setTimer, 1000);
        docP.remove();
        userInput = [];
    for (c in topTwoA){   
        console.log(topTwoA[c]);
        var a = topTwoA[c];
        var radioDiv = $('<div>').addClass('radio');
        var createChoices = $(`<input type="radio" name="a" value="${c}">`).attr('id','radio');
        var createLabel = $('<label>').text(a);
            radioDiv.append(createChoices).append(createLabel);
            $('.inputContainer').append(radioDiv);
            // $('.inputContainer').append(createLabel); 
    }
}

//VOTING ONCLICK FUNCTION
$('.buttonContainer #result').on('click', function(){
    showResults();
})

//RESULTS FUNCTION
function showResults(){
    var q = $(`input:radio[name='a']:checked`).val();
    var voted = $('<p>').addClass('#userText');
        voted.text(topTwoA[q]);
        $('.inputContainer').prepend(voted);
        userVote = q;
        console.log(userVote);
        //============================================
        //EC
        if(userVote == 0) {
            console.log('first choice');
            votesA++;
            database.ref().update({votesA: votesA});
        }
        if(userVote == 1) {
            console.log('second choice');
            votesB++;
            database.ref().update({votesB: votesB++});
        }
}


  
//onclick that calls to findMeme function. we can change this later to a timed interval so it will pull the random photo for the next round.
$('.buttonContainer #start').on('click', function(){
    userInput = [];
    topTwoA = [];
    createForm();  
    seconds = 61;
    clearInterval(timer);
    findMeme();
    timer = setInterval(setTimer, 1000);
    docP.remove();
});
//onclick test for results function
$('.buttonContainer #vote').on('click', function(){
    voteRound();
})

//SUBMIT FUNCTION
$('form #submit').on('click', function(){
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
        $('.inputContainer').prepend(b);
        userInput.push(input);
        topTwoA.push(input);
        $('#text').val("");
        console.log(input);
    }

})



//==========================================================================


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
    submits: topTwoA.length,
    playerCount: playerCounter
})

// database.ref('/players').on("value", function(snapshot) {
//     player = snapshot.val().value;
//     console.log(snapshot.val());
    
//   });

$(document).one('click', '.player-button', function(event) {
    var select = $(this);
    var selectArray = [select];
    // database.ref('/players').push(1);
    database.ref('players').set({
        id: select.attr('id'),
        points: 0,
    });
    database.ref().update({playerCount: playerCounter});
    if(select.attr('id') == 'player-1') alert('hi player 1');
    if(select.attr('id') == 'player-2') alert('hi player 2');
    if(select.attr('id') == 'player-3') alert('hi player 3');
    if(select.attr('id') == 'player-4') alert('hi player 4');
    console.log(playerCounter);
    console.log(select);
    event.preventDefault();
})

database.ref("players").on("child_added", function(snapshot) {
    playerCounter++;;
});


$(document).on('click', '#vote', function() {
    database.ref().update({submits: topTwoA.length});
    
})

database.ref('submits').on("value", function(snap) {
    console.log('submitted');
  });
database.ref('votesA').on("value", function(snap) {
    console.log('votes');
});
