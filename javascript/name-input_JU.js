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

var gameSess, playerName, id;

$('#submit').on('click', function() {
    event.preventDefault();
    gameSess = $('#username-input').val();
    playerName = $('#password-input').val();
    // console.log(playerArray);
    database.ref(gameSess).on('child_added', function(childSnapshot){
        id = childSnapshot.val().playerName;
        console.log(id);
    })
    database.ref(gameSess).push({
        playerName: playerName
    })
})


