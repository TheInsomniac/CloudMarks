###Bookmarking Service built upon Node.js, Express, NeDB/Mongo, Request, and Socket.IO
Allows one to quickly and easily bookmark a site for future reference. Saves the
URL and Page title.

*Recently added Socket.IO so that any browsers with the main index page open will
get updates on added/removed/edited item.*

#####To Display your current bookmarks:

    http://your_domain_here

#####To add a new bookmark using the browser location bar:
*Using google.com as an example:*

    http://your_domain_here/http://google.com

#####OR use the bookmarklet from your current page:

    javascript:window.open('http://YOUR_DOMAIN_HERE/'+document.location.href);

#####OR paste a url into the page with ctrl-v/cmd-v

#####To remove a single bookmark use the trash icon beside the item.
#####To edit a bookmark use the pen icon beside the item. Enter to accept, ESC to undo.
#####To remove all items, use the "Delete All" icon on the bottom.


###TODO:
 - Add login authentication
   - Added support for basic SERVER based HTTP Auth with a simple logout button
     that invalidates the logon username/pass (this is a hack but Passport.js confounds me)
 - Add support for multiple users
 - Anything else that I want/need or any pull requests that I can implement
