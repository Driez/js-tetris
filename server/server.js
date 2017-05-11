
const http = require("http");
const express = require("express");
const redis = require("promise-redis")();
const path = require("path");
const bodyParser = require("body-parser");
const coX = require("co-express");
const client = redis.createClient();
const app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


app.get("/",(req, res)=>{
	res.sendFile("./tetris.html",{root: __dirname + "/public"});
});


app.get("/scores", (req, res) => {
	let getScore = new Promise(function(resolve, reject){
		client.lrange("scoreList", 0, -1, (err, scoreList) =>{
			resolve(scoreList);
		});
	}).then(response=>{
		res.json(response);
	}).catch(reason =>{
		console.log(reason);
		res.json({error: reason});
	});
});

app.post("/scores", coX(function*(req, res){
	const scoreList = yield client.lrange("scoreList", [0, -1]);

	const username = req.body.username;
	const score = Number(req.body.score);
	let i = 0;
	let currentScore;
	while(scoreList[i] && score > Number(currentScore = scoreList[i].split('\t').pop())){
		i++;
	}

	if(!scoreList.length || i == scoreList.length){
		client.rpush("scoreList", (username + "\t" + score));
	}else if (scoreList){
		client.linsert("scoreList","BEFORE", scoreList[i], (username + "\t" + score));
	}
	res.json({ok:true});
}));


/*app.post("/scores", function(req, res){
	const {username, score} = req.body;

	console.log ();
	client.lrange("scoreList", 0, -1, (err, scoreList) => {
		if(scoreList.length){
			let i = scoreList.length - 1;
			console.log(scoreList);
			while ( i >= 0 && (score > scoreList[i].match(/\d+/))){
				i--;
			}
			client.linsert("scoreList", "BEFORE", scoreList[i], (username +"\t"+ score));
		}else{
			client.lpush("scoreList", username +"\t"+ score);	
		}
		res.json({ok:true});
	});
});*/

app.listen(8080, ()=>{
	console.log("listening on port 8080");
});



/*app.post("/scores", (req, res) => {
	new Promise((resolve, reject)=>{
		client.lrange("scoreList", 0, -1, (err, scoreList)=>{
			resolve(scoreList);
		});
	}).then( (result)=>{
		if(result.length){
			let i = result.length - 1,
				username = res.body.username,
				score = res.body.score;
			for( ; score > result[i].match(/\d+/); i--); // rewrite it to be readable
			return i;
		}else{
			client.lpush("scoreList", name +"	"+ score); // << never waited for?
			result = false;
		}
	}).then(result=>{
		if (result !== false){
			return client.lindex("scoreList", i); // << broken
		} else {
			return result;
		}
	}).then(result=>{
		if(result !== false){
			client.linsert("scoreList", "BEFORE", result, (username +"	"+ score));
			res.json({ok:true});
		}
	}). catch(reason=>{
		res.json({error: reason});
	});

});*/