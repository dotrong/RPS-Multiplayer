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

var dbChatRef  = database.ref('/chat');

var con;

var userId;

var userNode;

var userName;

dbPlayerRef.on("child_added", function(snapshot) {

	var userObject = snapshot.val();

	//if (($('#player1').html().trim() == "") && ($('#player2').html().trim() == "")) {

	if (userObject.userId == userId) {

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

		$('#player1').attr("userId",userObject.userId);

		$('#player1').append(p,rockButton,'<br>',paperButton,'<br>',scissorsButton);

	}
	else {

		var p = $('<p>');
		p.text('Player: '+ userObject.userName);

		$('#player2').attr("userId",userObject.userId);

		$('#player2').append(p);

	}

});

$("#start").on("click", function() {

	userName = $("#userName").val().trim();

	$("#userName").val('');

	dbConnectedRef.on("value", function(snapshot) {

		if (snapshot.val()) {

			userId = dbPlayerRef.push().key;

			con = dbPlayerRef.push({

				userName: userName,
				win:0,
				loss: 0,
				state:'ready',
				userId: userId

			});

			userNode = con.key;

			// Remove user from the connection list when they disconnect.
			con.onDisconnect().remove();
		
		}

	});

});

$("#player1").on("click","button",function() {

	if ($(this).attr('id') == 'rock') {

		var dbRef = database.ref('/players' + '/'+userNode);

		dbRef.update({ state: 'rock'});
	}

	else if ($(this).attr('id') == 'paper') {

		var dbRef = database.ref('/players' + '/'+userNode);

		dbRef.update({ state: 'paper'});
	}

	else if ($(this).attr('id') == 'scissors') {

		var dbRef = database.ref('/players' + '/'+userNode);

		dbRef.update({ state: 'scissors'});
	}


});


dbPlayerRef.on("child_removed", function(snapshot) {

	console.log(snapshot.val());

	var userRemoveObj = snapshot.val();

	$('div[userId='+ userRemoveObj.userId +']').html('');
	$('div[userId='+ userRemoveObj.userId +']').removeAttr('userId');


});

var selection = [];


dbPlayerRef.on("child_changed", function(snapshot) {

	var userChanged = snapshot.val();

	selection.push({

		userId: userChanged.userId,
		state: userChanged.state

	});

	console.log(selection);

	if (selection.length == 2) {

		console.log("enough");

			var playerId_0 = selection[0].userId;
			var playerSelect_0 = selection[0].state;

			var playerId_1 = selection[1].userId;
			var playerSelect_1 = selection[1].state;

			var result = gameResult(playerSelect_0,playerSelect_1);

			if (result == 1) {

				//playerId_0 is winner

				$('div[userId='+ playerId_0 +']').append('<p> You are the winner </p>');

				$('div[userId='+ playerId_1 +']').append('<p> You lose! </p>');


			}

			else if (result == 2) {
				//playerId_1 is winner

				$('div[userId='+ playerId_1 +']').append('<p> You are the winner </p>');

				$('div[userId='+ playerId_0 +']').append('<p> You lose! </p>');
			}
			else {
				//draw

				$('div[userId='+ playerId_1 +']').append('<p> Draw </p>');

				$('div[userId='+ playerId_0 +']').append('<p> Draw </p>');
			}




	}

});



function gameResult(player1, player2) {

	if (((player1 == 'rock') && (player2 == 'scissors')) || ((player1 == 'paper') && (player2 == 'rock')) || 
		((player1 == 'scissors') && (player2 == 'paper'))) {
		return 1;
	}

	else if (((player2 == 'rock') && (player1 == 'scissors')) || ((player2 == 'paper') && (player1 == 'rock')) || 
		((player2 == 'scissors') && (player1 == 'paper'))) {
		return 2;
	}
	else {
		return 3;
	}


}

$("#send").on("click", function() {

	var msg = $('#chatMsg').val().trim();

	$('#chatMsg').val('');

	if (msg != '') {

		var con = dbChatRef.push({

			message: userName + ': ' + msg,

		});

		con.onDisconnect().remove();

	}



});

dbChatRef.on("child_added", function(snapshot) {

	var message = snapshot.val().message;

	$("#chatArea").append('<p>' + message + '</p>');


});

dbChatRef.on("child_removed", function(snapshot) {

	dbChatRef.remove();

	$("#chatArea").html('');


});
