// Initialize Firebase
var config = {

	apiKey: "AIzaSyCCw3m4TpEzK44gD2vasLLByul1piZ99-Y",
	authDomain: "rps-multiplayer-7e61f.firebaseapp.com",
	databaseURL: "https://rps-multiplayer-7e61f.firebaseio.com",
	projectId: "rps-multiplayer-7e61f",
	storageBucket: "rps-multiplayer-7e61f.appspot.com",
	messagingSenderId: "265700239635"

};

firebase.initializeApp(config);

var database = firebase.database();

var dbConnectedRef = database.ref('.info/connected');

var dbPlayerRef  = database.ref('/players');

var numPlayer = 0;

var con;

dbPlayerRef.on("child_added", function(snapshot) {

	var userObject = snapshot.val();

	console.log(userObject);

	if ($('#player1').html().trim() == "") {

		var p = $('<p>');
		p.text('Player: '+ userObject.userName);

		var rockButton = $('<button>');
		rockButton.text('Rock');
		rockButton.attr('id','rock');

		var paperButton = $('<button>');
		paperButton.text('Paper');
		paperButton.attr('id','paper');

		var scissorsButton = $('<button>');
		scissorsButton.text('Scissors');
		scissorsButton.attr('id','scissors');

		$('#player1').append(p,rockButton,'<br>',paperButton,'<br>',scissorsButton);

	}
	else if ($('#player2').html().trim() == ""){

		var p = $('<p>');
		p.text('Player: '+ userObject.userName);

		var rockButton = $('<button>');
		rockButton.text('Rock');
		rockButton.attr('id','rock2');

		var paperButton = $('<button>');
		paperButton.text('Paper');
		paperButton.attr('id','paper2');

		var scissorsButton = $('<button>');
		scissorsButton.text('Scissors');
		scissorsButton.attr('id','scissors2');

		$('#player2').append(p,rockButton,'<br>',paperButton,'<br>',scissorsButton);

	}

});

$("#start").on("click", function() {

	var userName = $("#userName").val().trim();

	$("#userName").val('');

	dbConnectedRef.on("value", function(snapshot) {

		if (snapshot.val()) {

			con = dbPlayerRef.push({

				userName: userName,
				win:0,
				loss: 0,
				state:'ready'

			});

			//console.log(dbPlayerRef.push().key());

			// Remove user from the connection list when they disconnect.
			con.onDisconnect().remove();

		}

	});

});



