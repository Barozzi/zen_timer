// jshint esversion: 6

$(document).ready(function () {
	window.zenTimerState = {};
	$("#signin-link").click(function () {
		$("#signin-modal").modal("show");
	});
	$("#dimm-button").hide();
});


function resumeSession() {
	const minutesRemaining = 26 - (Math.floor((new Date() - window.zenTimerState.lastSessionStart) / 60000));
	if (minutesRemaining < 1) {
		startTimer();
		return;
	}
	let remaining = zeroPad(minutesRemaining) + ":00";
	$("#timer").html(remaining);
	$("#timer-dimmer").html(remaining);
	$("#dimm-button").show();
	$("#resume-session-button").hide();
	$("#inspiration").html(window.zenTimerState.icon + "<br><br>" + window.zenTimerState.inspiration);
	dimmPage();
	setTimeout(decrementCounter, 1000);
}

function timesUp() {
	// var audio = new Audio('/sounds/tinsha.wav');
	$("#start-button").toggle();
	$("#dimm-button").toggle();
	notifyUser();
	// audio.play();
}

function startTimer(time) {
	var remaining = "25:00";
	$("#timer").html(remaining);
	$("#timer-dimmer").html(remaining);
	$("#start-button").toggle();
	$("#dimm-button").toggle();
	$("#inspiration").html(rockPaperScissorsLizardSpock() + "<br><br>" + getInspiration());
	createNewWorkSession();
	dimmPage();
	setTimeout(decrementCounter, 1000);
}

function createNewWorkSession() {
	let uid = $.cookie("uid");
	if (!uid) return; // only save data for logged in users
	let newWorkSession = {
		date: new Date().toLocaleDateString(),
		time: new Date().toLocaleTimeString(),
		icon: window.zenTimerState.icon,
		inspiration: window.zenTimerState.inspiration
	};
	let newWorkSessionKey = firebase.database().ref("tableData/" + uid).push().key;
	window.zenTimerState.currentWorkSession = newWorkSessionKey;
	window.zenTimerState.currentWorkSessionStart = new Date();
	let updates = {};
	updates['/tableData/' + uid + "/" + newWorkSessionKey] = newWorkSession;
	return firebase.database().ref().update(updates);
}

function decrementCounter() {
	var remaining = $("#timer").text();
	if (remaining == "00:00") {
		timesUp();
		return;
	}
	var minutes = remaining.slice(0, 2);
	var seconds = remaining.slice(3, 5);
	if (seconds == "00") {
		minutes = zeroPad(Number(minutes) - 1);
		seconds = "59";
	} else {
		seconds = zeroPad(Number(seconds) - 1);
	}
	$("#timer").html("" + minutes + ":" + seconds);
	$("#timer-dimmer").html("" + minutes + ":" + seconds);
	setTimeout(decrementCounter, 1000);
}

function zeroPad(num) {
	return (num < 10) ? "0" + num : "" + num;
}

function dimmPage() {
	$("#inspiration-timer-modal").modal("show");
}

function notifyUser() {
	// Let's check if the browser supports notifications
	if (!("Notification" in window)) {
		alert("zen_timer: It is time to pause in reflection.");
	}

	// Let's check whether notification permissions have already been granted
	else if (Notification.permission === "granted") {
		// If it's okay let's create a notification
		var notification = new Notification("zen_timer: You have attained completeness.");
	}

	// Otherwise, we need to ask the user for permission
	else if (Notification.permission !== "denied") {
		Notification.requestPermission(function (permission) {
			// If the user accepts, let's create a notification
			if (permission === "granted") {
				var notification = new Notification("zen_timer: You have attained completeness.");
			}
		});
	}
}

function rockPaperScissorsLizardSpock() {
	var icons = [
		'<i class="hand lizard icon"></i>',
		'<i class="hand paper icon"></i>',
		'<i class="hand rock icon"></i>',
		'<i class="hand scissors icon"></i>',
		'<i class="hand spock icon"></i>'
	];
	var index = Math.floor(Math.random() * icons.length);
	window.zenTimerState.icon = icons[index];
	return icons[index];
}

function getInspiration() {
	// EM dash  is \u2014
	var quotes = [
		"Be the ball.",
		"The project of a thousand hours, begins with a single click.",
		"You're just like Kevin Bacon.",
		"I am a leaf on the wind \u2014 watch how I soar",
		"Want me to make that modem sound? You know \u2014 for old times sake?",
		"If you want something in this world. Go get it. Period.",
		"Time for some thrillin' heroics.",
		"Be excellent to each other",
		"I'm your huckleberry.",
		"In the beginning the Universe was created. <br>This has made a lot of people very angry and has been widely regarded as a bad move.",
		"Strange things are afoot at the Circle-K.",
		"Warp speed",
		"Course heading, Captain?",
		"Live long, and prosper.",
		"I will not fear. <br>Fear is the mind-killer. <br>I will face my fear. <br>I will let it pass through me. <br>When the fear has gone, <br>there shall be nothing. <br>Only I will remain.",
		"Be undeniably good.",
		"Be so good they can't ignore you.",
		"Thankfully, persistence is a great substitute for talent.",
		"There is nothing that can't be done.",
		"A day without sunshine is like, you know, night.",
		"Don't believe anything you read on the net. Except this. Well, including this, I suppose.",
		"You live and learn. At any rate, you live.",
		"Don't Panic.",
		"I love deadlines. I love the whooshing noise they make as they go by.",
		"Always listen to experts. They'll tell you what can't be done, and why. <br>Then do it.",
		"Find what you love and let it kill you.",
		"An intellectual says a simple thing in a hard way. An artist says a hard thing in a simple way.",
		"What matters most is how well you walk through the fire",
		"<img src='https://imgs.xkcd.com/comics/app.png' />",
		"<img src='https://imgs.xkcd.com/comics/tags.png' />",
		"<img src='https://imgs.xkcd.com/comics/cell_number.png' />",
		"<img src='https://imgs.xkcd.com/comics/bug.png' />",
		"<img src='https://imgs.xkcd.com/comics/reload.png'/>",
		"Mindfulness, the Root of Happiness",
		"Whatever has the nature to arise has the nature to cease.",
		"Generosity, love, compassion, or devotion do not depend on a high IQ.",
		"Every time we become aware of a thought as opposed to being lost in a thought,<br> we experience that opening of the mind.",
		"The most precious gift we can offer others is our presence.",
		"Observe the space between your thoughts, then observe the observer.",
		"Carpe Diem!",
		"You keep clicking that button. I do not think it does what you think it does.",
		"You are kind. You are smart. You are important.",
		"Remember, the Force will be with you. Always.",
		"Help me Obi-Wan Kenobi. You're my only hope.",
		"Wax on, wax off.",
		"Chewie, we're home.",
		"No one can eat fifty eggs",
		"Challenge accepted!",
		"Each morning we are born again. What we do today is what matters most.",
		"Begin at once to live, and count each separate day as a separate life.",
		"Respond; don’t react. Listen; don’t talk. Think; don’t assume.",
		"When you realize nothing is lacking, the whole world belongs to you.",
		"There is no spoon.",
		"Terrific, a six-demon bag. Sensational. What's in it, Egg?<br> Wind, fire, all that kind of thing!",
		"Yo! Gimme a goat.",
		"Code and know you are coding.",
		"A foolish consistency is the hobgoblin of little minds. <br>[Try something new today!]",
		"Work like your fingers are kissing the code.",
		"Be mindful. Be greatful. Be positive. Be true. Be kind.",
		"You are safe. You are loved. You are beautiful.",
		"You are what Marcellus Wallace looks like."
	];
	var index = Math.floor(Math.random() * quotes.length);
	window.zenTimerState.inspiration = quotes[index];
	return quotes[index];
}
