// jshint esversion: 6

// TODO - filter by uid - DONE
// TODO - filter by today - DONE
// TODO - display table with data if data exists on page load - DONE
// TODO - after auth navigate to the main page

/*

firebase.database().ref("tableData")  // connect to the tableData table
	.orderByChild("intention") // query on the field 'intention'
	.equalTo('foo')  // Search for all records with an intention value equal to 'foo'
	.once("value", snap => console.log(JSON.stringify(snap.val())));  // run this query once and log results to the console.

firebase.database().ref("tableData")
	.orderByChild("uid").equalTo(uid)
	.once("value", snap => console.log(JSON.stringify(snap.val())));
*/


/**
 * GB
 * @name TableComponent
 * @desc mount the table of achivements
 * @mountsTo DIV with id=achievement-table
 */
$(document).ready(function () {
	window.tableData = [];
	window.currentSession = 0;
	var uid = $.cookie("uid");
	const today = new Date().toLocaleDateString();
	console.log("cookie.uid" + $.cookie("uid"));
	console.log("uid " + uid);

	firebase.database().ref("tableData/" + uid)
		.orderByChild("date").equalTo(today)
		.on("value", snap => {
			console.log("SNAP: " + JSON.stringify(snap.val()));
			if (snap.val()) {
				window.tableData = snap.val();
				mountTable(generateTable(generateTableRows(window.tableData)));
			}
		});

	// firebase.database().ref("tableData")
	// 	.orderByChild("uid").equalTo(uid)
	// 	.orderByChild("date").equalTo(today)
	// 	.on("value", snap => {
	// 	console.log("SNAP: " + JSON.stringify(snap.val()));
	// 	if (snap.val()) {
	// 		window.tableData = snap.val();
	// 		mountTable(generateTable(generateTableRows(window.tableData)));
	// 	}
	// });
});

// called via button click
function addAchievement() {
	// get data from input fields
	var newData = {
		session: window.currentSession,
		icon: window.currentIcon || 0,
		intention: $("#intention-input").val(),
		achievement: $("#achievement-input").val(),
		date: new Date().toLocaleDateString(),
		time: new Date().toLocaleTimeString()
	};
	// reset input fields
	$("#intention-input").val("");
	$("#achievement-input").val("");
	// add input data to datModel
	// window.tableData.push(newData); // TODO - treat as object not array
	// persist data to profile
	writeNewTableData(newData);
	// mount table
	mountTable(generateTable(generateTableRows(window.tableData)));
}

function writeNewTableData(newData) {
	// Get a key for a new Post.
	// var newTableDataKey = firebase.database().ref().child('tableData').push().key;
	// Set uid for post
	var uid = firebase.auth().currentUser.uid;
	newData.uid = uid;
	var newTableDataKey = firebase.database().ref("tableData/" + uid).push().key;

	// Write the new post's data simultaneously in the posts list and the user's post list.
	var updates = {};
	updates['/tableData/' + uid + "/" + newTableDataKey] = newData;
	return firebase.database().ref().update(updates);
}

function remove(key) {
	if (key === null) return;
	var doRemove = confirm("Remove this row?");
	if (doRemove) {
		var uid = firebase.auth().currentUser.uid;
		delete window.tableData[key];
		mountTable(generateTable(generateTableRows(window.tableData)));
		var updates = {};
		updates['/tableData/' + uid + "/" + key] = null;
		return firebase.database().ref().update(updates);
	}
}

function mountTable(tableHtml) {
	$("#achievement-table").html(tableHtml);
}

function generateTable(tableRows) {
	var TABLE_CLASS = "ui celled structured table";
	return [
		"<table class='" + TABLE_CLASS + "'>",
		"<thead>",
		"<tr>",
		"<th class='session-column'>&nbsp;</th>",
		"<th>Time</th>",
		"<th>Intention</th>",
		"<th>Achievement</th>",
		"<th>Remove</th>",
		"</tr>",
		"</thead>",
		"<tbody>",
		tableRows,
		"</tbody>",
		"</table>"
	].join('\n');
}

function generateTableRows(tableData) {
	var icons = [
		'<i class="hand lizard icon"></i>',
		'<i class="hand peace icon"></i>',
		'<i class="hand paper icon"></i>',
		'<i class="hand rock icon"></i>',
		'<i class="hand scissors icon"></i>',
		'<i class="hand spock icon"></i>'
	];
	var TD_CLASS = "";
	var TR_CLASS = "";
	var TD_TIME = "table-time";
	var TD_INTENTION = "table-intention";
	var TD_DELETE = "table-delete";
	var rows = [];
	var currentSession = 0;
	for (var key in tableData) {
		var achievementsThisSession;
		var currentRow = tableData[key];
		var isNewGroup = (currentRow.session > currentSession) || (rows.length === 0);
		if (isNewGroup) {
			currentSession = currentRow.session;
			achievementsThisSession = calculateAchievementsThisSession(tableData, currentSession);
		}
		rows.push(
			[
				"<tr class='" + TR_CLASS + "'>",
				(isNewGroup) ? "<td rowspan='" + achievementsThisSession + "' class='session-column'>" + icons[Number(currentRow.icon)] + "</td>" : "",
				"<td class='" + TD_TIME + "'>" + currentRow.date + " " + currentRow.time + "</td>",
				"<td class='" + TD_INTENTION + "'>" + currentRow.intention + "</td>",
				"<td class='" + TD_CLASS + "'>" + currentRow.achievement + "</td>",
				"<td class='" + TD_DELETE + "'><div id='delete-row-" + key + "' class='ui button' onclick='remove(\"" + key + "\")'><i class='remove icon delete-icon delete-button'></i></div></td>",
				"</tr>"
			].join('\n')
		);
	}
	// rows.push("<tr><td class='table-total' colspan=5>"+rows.length+"</td></tr>");
	rows.push("<tr><td class='table-total' colspan=5>" + currentSession + "</td></tr>");
	window.currentSession = currentSession;
	return rows.join('\n');
}

function calculateAchievementsThisSession(tableData, session) {
	var count = 0;
	for (var key in tableData) {
		if (tableData[key].session === session) count++;
	}
	return count;
}
