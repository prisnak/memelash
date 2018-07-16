var topic = ['funny', 'beer', 'jay-z', 'rap', 'dog', 'cat', 'girl', 'boy', 'poo', 'president', 'trump', 'sports', 'dance','drunk'];
var makeButton = $('<button>').text('meme').attr('id','start');
    $('.buttonContainer').append(makeButton);
var voteButton = $('<button>').text('vote').attr('id','vote');
    $('.buttonContainer').append(voteButton);

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
var pageIndex = [];

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
    var makeTimer = $('<p>').text(`Time Remaining: ${seconds}`);
    $('.timer').html(makeTimer);
    if (pageIndex == 1){
        if (seconds === -1){
            voteRound();
        }
    }
    if (pageIndex == 2){
        if (seconds === -1){
            showResults();
        }
    }
    if (pageIndex == 2){
        if (seconds === -1){
            findMeme();
        }
    }

}


//MEME GENERATOR FUNCTION

function findMeme (){
    pageIndex = [];
    var page = 1;
    pageIndex.push(1);
    userInput = [];
    topTwoA = [];
    $('.messageContainer').empty();
    $('.voteContainer').empty();

    //timer
    seconds = 31;
    clearInterval(timer);
    timer = setInterval(setTimer, 1000);

    // formDiv.append(textField).append(submitButton);
    //     $('.formContainer').append(formDiv);

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
        seconds = 31;
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
    var q = $(`input:radio[name='a']:checked`).val();
    var voted = $('<p>').addClass('#userText');
        voted.text(topTwoA[q]);
        $('.messageContainer').append(voted);
        userVote = q;
}
//RESULTS ONCLICK FUNCTION
$(document).on('click','#result', function(){
    showResults();
})




  
//onclick that calls to findMeme function. we can change this later to a timed interval so it will pull the random photo for the next round.
$('.buttonContainer #start').on('click', function(){
    createForm();
    findMeme();
});

//onclick test for vote function
$('.buttonContainer #vote').on('click', function(){
    voteRound();
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
        console.log(input);
    }

})

if (topTwoA.length == 2){
    console.log('true');
    voteRound();
};