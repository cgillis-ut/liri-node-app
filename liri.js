
//capture strings that call twitter, spotify, etc
var stringInput = process.argv;
//request npm --for spotify & OMDB
var request = require("request");

//get 20 latest tweets & date created from twitter acct
if ("my-tweets" === stringInput[2]) {
	var twitter = require("twitter");
	var twitterKeys = require("./keys");
	var client = new twitter(twitterKeys);
	var params = {
		screen_name: "gtstudent_",
		count: 20
	};
	client.get("statuses/user_timeline", params, function(error, tweets, response) {
		if (!error) {
			for (var i = 0; i < tweets.length; i++) {
				console.log("\n Tweet: " + tweets[i].text + "\n Created: " + tweets[i].created_at);
			}
		} else {
			console.log("error");
		}
	});
}

//get song info based on user input, made into a function so that it can be used in 'do-what-it-says' below
function runSpotify(){
	var songName = stringInput[3];
	if (stringInput[3] === undefined) {
		songName = "ace%20of%20base";
	}
	
	request("https://api.spotify.com/v1/search?q=" + songName + "&type=track&market=US&limit=2", function(error, response, body) {
		if (error) {
			console.log("Error occurred: " + error);
			return;
		} else {
			console.log(" Artist: " + JSON.parse(body).tracks.items[0].album.artists[0].name + "\n Song Name: " + JSON.parse(body).tracks.items[0].name + "\n Spotify Link: " + JSON.parse(body).tracks.items[0].album.external_urls.spotify + "\n Album Name: " + JSON.parse(body).tracks.items[0].album.name);
		}
	});
}

if ("spotify-this-song" === stringInput[2]) {
	runSpotify();
}

//get movie info based on user input
if ("movie-this" === stringInput[2]) {
	var movieName = stringInput[3];
	if (stringInput[3] === undefined) {
		var movieName = "mr%20nobody";
	}
	request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json", function(error, response, body) {
    if (error) {
			console.log("Error occurred: " + error);
			return;
		} else {
			var movieObj = JSON.parse(body);
			console.log("Title: " + movieObj.Title +
				"\n Year: " + movieObj.Year +
				"\n IMDB: " + movieObj.imdbRating +
				"\n Rating: " + movieObj.Rated +
				"\n Country: " + movieObj.Country +
				"\n Language: " + movieObj.Language +
				"\n Plot: " + movieObj.Plot +
				"\n Actors: " + movieObj.Actors +
				"\n Rotten Tomatoes Rating: " + movieObj.Ratings[1].Value );
    }
  });
}

//read and do what random.txt says
if("do-what-it-says" === stringInput[2]) {
	//node file system
	var fs = require("fs");
	
	fs.readFile("random.txt", "utf8", function(error, data) {
		if(error){
			console.log(error);
			return;
		} else{
			var dataArr = data.split(",");
			stringInput[2] = dataArr[0];
			stringInput[3] = dataArr[1];
			runSpotify();
		}
});
}