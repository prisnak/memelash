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

database.ref().set({
    players: JSON.stringify([]),
    votes: 0,
    submits: 0,
    playerCount: playerCounter
})

// database.ref('/players').on("value", function(snapshot) {
//     player = snapshot.val().value;
//     console.log(snapshot.val());
    
//   });

$(document).one('click', '.player-button', function(event) {
    var select = $(this);
    var selectArray = [select];
    database.ref('/players').push(1);
    playerCounter++;   
    database.ref().update({
        // players: JSON.stringify([]),
        // votes: 0,
        // submits: 0,
        playerCount: playerCounter});
    console.log(playerCounter);
    console.log(select);
    event.preventDefault();
})

