###Bookmarking Service built upon Node.js, Express, SQLITE, and Request.  
Allows one to quickly and easily bookmark a site for future reference. Saves the
URL and Page title.

#####To Display your current bookmarks:  
  
    http://your_domain_here

#####To add a new bookmark using the browser location bar:  
*Using google.com as an example:*  

    http://your_domain_here/http://google.com

#####Or use the bookmarklet from your current page:  

    javascript:window.open('http://YOUR_DOMAIN_HERE/'+document.location.href);

#####To remove a single bookmark use the red "X" beside the item.
#####To remove ALL bookmarks:  

    http://your_domain_here/clear

###TODO:
 - "Prettify" everything more
 - Add login authentication
 - Add support for multiple users
 - Anything else that I want/need or any pull requests that I can implement
