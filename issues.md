# zen_timer

# Release_001

### E023 Enhancement: On page load, check the times stamp on the last session to determine if a session should be resumed

### E022 Enhancement: Hide input fields until there is an active session in window.zenTimerState.currentWorkSession

### E021 Enhancement: NPM Uninstall Mongo and Monk

### E011 Enhancement: Update all global state variables to a single global state object

### E014 Enhancement: Report View: allow user to enter start and end dates

### E015 Enhancement: Report View: display bar graph representation of data


################################################################################
# Complete Issues

### B002 BUG: The session column is quirky. When adding and then deleting rows the count and icon type can get messes up.
- should not be able to delete sessions. A session with no data should present next to an empty row
- Sorta fixed this, but it brings to light an issue in the data model that is causing an increased complexity in the code.
	- I should create a new session each time the button is clicked.
	- That session should record its icon and date and time
	- a sub array of the session should be the data rows
	- This way I actually store the sessions in the DB rather than inferring them from the first session.
- Add new tableData child node when user clicks start work:
	{ key, date, time, uid, icon, intentions[child-node] }
	- reference intentions by 'tableData/' + uid + '/' + currentSessionKey + '/' + intentionKey
	- State: {uid, currentSessionKey, currentIconIndex, currentTimer}
- Fixed / Ready for Release

### E001 Enhancement: Add a popup to confirm before deleting a row.
- Complete. This uses basoc JS confirm and the popup style doesn't match with the look and feel of the site.

### Put project under source control
5/21/2017 Sunday

### B001 BUG: if you trigger the signing-modal then the timer modal fails to show the counter or the message
- Idea: switch frlm Dimmer to second modal
- Complete: I swapped the dimm area for a second modal and that did the trick
- Reported the issue that I encountered on Github

### E002 Hide email and password fields when signed in
- Complete

### E003 Change the table Icon to match the r/p/s/l/s icon
- Complete

### B003 BUG: Deleting a row from the table removes it from the UI but the data is still in the DB
- COMPLETE
- Test this by deleting all rows and then adding a new row. Deleted rows display.
- I suspect this has to do with my reformatting the datamodel

### E004 Show a success message when logged in
- complete

### E005 Change the login form to a popover or something that doesn't require navigating off the main page
- Complete

### E006 Center session icon in TD column
- Complete

### E007 center the X icon in the delete button in the Table
- Complete

### E008 Add padding around signin modal
- Complete; Reformatted the modal so that it looks nice now

### E009 Add padding to the bottom of the page
- Complete




### Release_002

### E012 Enhancement: Allow uers to edit rows

### E013 Enhancement: Export table to csv into an input field with a 'copy to clipboard button'

### E016 Enhancement: Auth: Add GitHub OAUTH

### E017 Enhancement: Auth: Add G+ OAUTH

### E018 Enhancement: Auth: Add Twitter OAUTH

### E019 Enhancement: Auth: Get icon from auth provider to display in top right instead of the user icon

### Concern: Doesn't work in IE

### Nice to have: change the confirm dialog to have styles that match the rest of the app

### E010 Enhancement: Add error logging to db via try/catch
- Dump state and the error description to the zenLog table

### E020 Enhancement: Add a share bar to allow the user to share the app on twitter, facebook, g+
