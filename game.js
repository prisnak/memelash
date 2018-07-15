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
    database.ref().update({playerCount: playerCounter});
    if(select.attr('id') == 'player-1') alert('hi player 1');
    if(select.attr('id') == 'player-2') alert('hi player 2');
    if(select.attr('id') == 'player-3') alert('hi player 3');
    if(select.attr('id') == 'player-4') alert('hi player 4');
    // if(selectArray.length > 1) return;
    console.log(playerCounter);
    console.log(select);
    event.preventDefault();
})

database.ref("players").on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    playerCounter++;
});
