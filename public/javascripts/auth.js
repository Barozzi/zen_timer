// jshint esversion: 6

$(document).ready(function () {
	const auth = firebase.auth();
	$("#signout-button").hide();

	$("#signin-button").click(function () {
		const email = $("#email-input").val();
		const password = $("#password-input").val();
		const promise = auth.signInWithEmailAndPassword(email, password);
		promise.catch(e =>{
			console.log(e);
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
			console.log(e);
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
			console.log(e);
			$("#warning-area").html([
				'<div class="ui negative message">',
				'<div class="header warning-header">',
				'We were not able to realize your identity.',
				' </div>',
				e.message,
				'</div>'
			].join('\n'));
		promise.then(e => {
			console.log(e);
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
			window.user = firebaseUser;
			$("#user-name").html(firebaseUser.email);
			$("#signin-button").hide();
			$("#create-user-button").hide();
			$("#signout-button").show();
			$("#email-input-field").hide();
			$("#password-input-field").hide();
			$.cookie("uid", firebaseUser.uid);
		} else {
			window.user = null;
			$("#user-name").html("");
			$("#signin-button").show();
			$("#create-user-button").show();
			$("#signout-button").hide();
			$("#email-input-field").show();
			$("#password-input-field").show();
			$.removeCookie("uid");
		}
	});
});

function toggleSigninButtons() {
}

// auth.signInWithEmailAndPassword(email, password);

// auth.createUserWithEmailAndPassword(email, password);

// auth.onAuthStateChange(firebaseUser => { });

//firebase.auth().signOut();
