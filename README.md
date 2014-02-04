###Bookmarking Service built upon Node.js, Express, NeDB, and Request.
Allows one to quickly and easily bookmark a site for future reference. Saves the
URL and Page title.

#####To Display your current bookmarks:

    http://your_domain_here

#####To add a new bookmark using the browser location bar:
*Using google.com as an example:*

    http://your_domain_here/http://google.com

#####Or use the bookmarklet from your current page:

    javascript:window.open('http://YOUR_DOMAIN_HERE/'+document.location.href);

#####To remove a single bookmark use the trash icon beside the item.
#####To edit a bookmark use the pen icon beside the item. Enter to accept, ESC to undo.
#####To remove all items, use the "Delete All" icon on the bottom.


###TODO:
 - Add login authentication
 - Add support for multiple users
 - Anything else that I want/need or any pull requests that I can implement
