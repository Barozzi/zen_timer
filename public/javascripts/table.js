// jshint esversion: 6

/**
 * GB
 * @name TableComponent
 * @desc mount the table of achivements
 * @mountsTo DIV with id=achievement-table
 */
$(document).ready(function () {
	window.zenTimerState.tableData = {};
	var uid = $.cookie("uid");
	const today = new Date().toLocaleDateString();

	firebase.database().ref("tableData/" + uid)
		.orderByChild("date").equalTo(today)
		.on("value", snap => {
			// console.log("SNAP: " + JSON.stringify(snap.val()));
			if (snap.val()) {
				window.zenTimerState.tableData = snap.val();
				mountTable(generateTable(generateTableRows(window.zenTimerState.tableData)));
			}
		});
});


// called via button click
function addAchievement() {
	// get data from input fields
	var newData = {
		session: window.zenTimerState.currentWorkSession,
		icon: window.zenTimerState.icon || "",
		intention: $("#intention-input").val() || "",
		achievement: $("#achievement-input").val() || "",
		date: new Date().toLocaleDateString(),
		time: new Date().toLocaleTimeString()
	};
	// reset input fields
	$("#intention-input").val("");
	$("#achievement-input").val("");
	// persist data to profile
	return writeNewTableData(newData);
}

function writeNewTableData(newData) {
	var uid = firebase.auth().currentUser.uid;
	newData.uid = uid;
	var newTableDataKey = firebase.database().ref("tableData/" + uid).push().key;
	var updates = {};
	updates['/tableData/' + uid + "/" + window.zenTimerState.currentWorkSession + "/achievements/" + newTableDataKey] = newData;
	return firebase.database().ref().update(updates);
}

function remove(achievementPath) {
	if (achievementPath === null) return;
	var doRemove = confirm("Remove this row?");
	if (doRemove) {
		var uid = firebase.auth().currentUser.uid;
		var updates = {};
		updates['/tableData/' + uid + "/" + achievementPath] = null;
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
	let TD_CLASS = "";
	let TR_CLASS = "";
	let TD_TIME = "table-time";
	let TD_INTENTION = "table-intention";
	let TD_DELETE = "table-delete";
	let rows = [];
	for (let key in tableData) {
		// First level are the workSessions
		let currentRow = tableData[key];
		let achievementCount = (currentRow.achievements) ? Object.keys(currentRow.achievements).length : 0;
		if (achievementCount === 0) {
			// Add an empty row to indicate there was a session with no logged achievements
			rows.push([
				"<tr class='" + TR_CLASS + "'>",
				"<td class='session-column'>" + currentRow.icon + "</td>",
				"<td class='" + TD_TIME + "'>" + currentRow.date + " " + currentRow.time + "</td>",
				"<td class='" + TD_INTENTION + "'>&nbsp;</td>",
				"<td class='" + TD_CLASS + "'>&nbsp;</td>",
				"<td>&nbsp;</td>",
				"</tr>"
			].join('\n'));
		} else {
			// Display all achievements as structured table rows
			for (let achievementKey in currentRow.achievements) {
				let firstKey = Object.keys(currentRow.achievements)[0];
				let isNewGroup = (firstKey === achievementKey);
				let currentAchievement = currentRow.achievements[achievementKey];
				rows.push(
					[
						"<tr class='" + TR_CLASS + "'>",
						(isNewGroup) ? "<td rowspan='" + achievementCount + "' class='session-column'>" + currentAchievement.icon + "</td>" : "",
						"<td class='" + TD_TIME + "'>" + currentAchievement.date + " " + currentAchievement.time + "</td>",
						"<td class='" + TD_INTENTION + "'>" + currentAchievement.intention + "</td>",
						"<td class='" + TD_CLASS + "'>" + currentAchievement.achievement + "</td>",
						"<td class='" + TD_DELETE + "'><div id='delete-row-" + achievementKey + "' class='ui button' onclick='remove(\"" + currentAchievement.session + "/achievements/" + achievementKey + "\")'><i class='remove icon delete-icon delete-button'></i></div></td>",
						"</tr>"
					].join('\n'));
			}
		}
	}
	let workSessionCount = (tableData) ? Object.keys(tableData).length : 0;
	rows.push("<tr><td class='table-total' colspan=5>" + workSessionCount + "</td></tr>");
	return rows.join('\n');
}
