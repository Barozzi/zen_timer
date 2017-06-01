// jshint esversion: 6

$(document).ready(function () {
	const auth = firebase.auth();
	$("#signout-button").hide();
	$("#resume-session-button").hide();

	$("#signin-button").click(function () {
		const email = $("#email-input").val();
		const password = $("#password-input").val();
		const promise = auth.signInWithEmailAndPassword(email, password);
		promise.catch(e =>{
			$("#warning-area").html([
				'<div class="ui negative message">',
				'<div class="header warning-header">',
				'We were not able to realize your identity.',
				' </div>',
				e.message,
				'</div>'
			].join('\n'));
		});
		promise.then(e => {
			$("#warning-area").html([
				'<div class="ui success message">',
				'<div class="header warning-header">',
				'You complete me',
				' </div>',
				e.message,
				'</div>'
			].join('\n'));
			});
	});

	$("#create-user-button").click(function () {
		const email = $("#email-input").val();
		const password = $("#password-input").val();
		const promise = auth.createUserWithEmailAndPassword(email, password);
		promise.catch(e => {
			$("#warning-area").html([
				'<div class="ui negative message">',
				'<div class="header warning-header">',
				'We were not able to realize your identity.',
				' </div>',
				e.message,
				'</div>'
			].join('\n'));
		promise.then(e => {
			$("#warning-area").html([
				'<div class="ui success message">',
				'<div class="header warning-header">',
				'You complete me',
				' </div>',
				e.message,
				'</div>'
			].join('\n'));
			});
		});
	});

	$("#signout-button").click(function () {
		firebase.auth().signOut();
		// window.location.reload(true);
	});

	firebase.auth().onAuthStateChanged(firebaseUser => {
		if (firebaseUser) {
			if (window.zenTimerState) {
				window.zenTimerState.user = firebaseUser;
			} else {
				window.zenTimerState = { user: firebaseUser };
			}
			connectToTableData(firebaseUser.uid);
			$("#user-name").html(firebaseUser.email);
			$("#signin-button").hide();
			$("#create-user-button").hide();
			$("#signout-button").show();
			$("#email-input").hide();
			$("#password-input").hide();
			$.cookie("uid", firebaseUser.uid);
			checkForInterruptedSession(firebaseUser.uid);
		} else {
			window.zenTimerState.user = null;
			window.zenTimerState.currentWorkSession = null;
			window.zenTimerState.lastSessionStart = null;
			window.zenTimerState.tableData = null;
			$("#user-name").html("");
			$("#signin-button").show();
			$("#create-user-button").show();
			$("#signout-button").hide();
			$("#email-input").show();
			$("#password-input").show();
			$.removeCookie("uid");
		}
		setButtonState();
		mountTable(generateTable(generateTableRows(window.zenTimerState.tableData)));
	});
});


function checkForInterruptedSession(uid) {
	firebase.database().ref("tableData/" + uid)
		.orderByChild("date").limitToLast(1).once("value", snap => {
			if (!snap.val()) return;
			const sessionId = Object.keys(snap.val())[0];
			const snapVal = snap.val()[sessionId];
			const lastSessionStart = new Date(snapVal.date + " " +snapVal.time);
			const minutesRemaining = 25 - (Math.floor((new Date() - lastSessionStart) / 60000));
			if (minutesRemaining > 0) {
				window.zenTimerState.lastSessionStart = lastSessionStart;
				window.zenTimerState.icon = snapVal.icon;
				window.zenTimerState.inspiration = snapVal.inspiration;
				window.zenTimerState.currentWorkSession = sessionId;
				setButtonState();
			}
		});
}
