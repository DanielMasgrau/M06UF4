const PORT = 7777;

let http = require('http');
let static = require('node-static');
let ws = require('ws'); 


//
// Create a node-static server instance to serve the './public' folder
//
let file = new static.Server('./public');
 
let http_server = http.createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    }).resume();
}).listen(PORT);


let ws_server = new ws.Server({server: http_server});
let player1, player2;
let ball;
ws_server.on('connection', function (conn) {
	console.log("Usuario conectado");

	if (player1 == null){		
		player1 = conn;
		
			let info = {
			player_num: 1
		};

		player1.send(JSON.stringify(info) );
		
		player1.on('close', function () {
		player1 = null;
		console.log("Player 1 disconnected");
		
		});
		
		player1.on('message', function (msg) {
		//console.log("Jugador 1: "+msg);
		if (player2 == null)
			return;

		let info = JSON.parse(msg);
		if (info.y != null) {
			player2.send( JSON.stringify(info));
		}
		else if(info.by != null) {
			player2.send( JSON.stringify(info) );
		}
		
		else if(info.score1 != null) {

			player2.send( JSON.stringify(info) );

			if(info.score1 >= 3 || info.score2 >= 3) {


			let data = {
				game_over: true
			};

			if (info.score1 >= 3)
				data.winner = 1;
			else
				data.winner = 2;

			let data_json = JSON.stringify(data);

			player1.send( data_json );
			player1.send( data_json );
			return;
		}

		
	   }
	});
}

	else if (player2 == null) {
		player2 = conn;
	
		let info = {
			player_num: 2
		}

		player2.send(JSON.stringify(info) );
	
		player2.on('close', function () {
		player2 = null;
		console.log("Player 2 disconnected");
		
		});
		
		setTimeout(function() {
			let info = {
				game_start: true
			};

			let info_json = JSON.stringify(info);
			
			player1.send( info_json );
			player1.send( info_json );
				

		}, 500);

		

		player2.on('message', function (msg) {
		//console.log("Jugador 2: "+msg);
		if (player1 == null)
			return;

		let info = JSON.parse(msg);
		if (info.y != null) {
			player1.send( JSON.stringify(info));
		
		console.log("Jugador 2: "+msg);

		}

	});
}
});
