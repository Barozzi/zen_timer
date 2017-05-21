# zen_timer

# TODO

### BUG: The session column is quirky. When adding and then deleting rows the count and icon type can get messes up.
- should not be able to delete sessions. A session with no data should present next to an empty row

### Enhancement: Add a popup to confirm before deleting a row.

### Enhancement: Allow uers to edit rows

### Enhancement: Export table to csv into an input field with a 'copy to clipboard button'

### Enhancement: Report View: allow user to enter start and end dates

### Enhancement: Report View: display bar graph representation of data

### Enhancement: Auth: Add GitHub OAUTH

### Enhancement: Auth: Add G+ OAUTH

### Enhancement: Auth: Add Twitter OAUTH

### Enhancement: Auth: Get icon from auth provider to display in top right instead of the user icon

### Enhancement: Add a share bar to allow the user to share the app on twitter, facebook, g+

### Concern: Doesn't work in IE


################################################################################
# Complete Issues

### Put project under source control
5/21/2017 Sunday

### BUG: if you trigger the signing-modal then the timer modal fails to show the counter or the message
- Idea: switch frlm Dimmer to second modal
- Complete: I swapped the dimm area for a second modal and that did the trick
- Reported the issue that I encountered on Github

### Hide email and password fields when signed in
- Complete

### Change the table Icon to match the r/p/s/l/s icon
- Complete

### BUG: Deleting a row from the table removes it from the UI but the data is still in the DB
- COMPLETE
- Test this by deleting all rows and then adding a new row. Deleted rows display.
- I suspect this has to do with my reformatting the datamodel

### Show a success message when logged in
- complete

### Change the login form to a popover or something that doesn't require navigating off the main page
- Complete

### Center session icon in TD column
- Complete

### center the X icon in the delete button in the Table
- Complete

### Add padding around signin modal
- Complete; Reformatted the modal so that it looks nice now

### Add padding to the bottom of the page
- Complete
