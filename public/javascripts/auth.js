// jshint esversion: 6

$(document).ready(function () {
	const auth = firebase.auth();
	$("#signout-button").hide();

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
		} else {
			if (window.zenTimerState) window.zenTimerState.user = null;
			$("#user-name").html("");
			$("#signin-button").show();
			$("#create-user-button").show();
			$("#signout-button").hide();
			$("#email-input").show();
			$("#password-input").show();
			$.removeCookie("uid");
		}
	});
});
