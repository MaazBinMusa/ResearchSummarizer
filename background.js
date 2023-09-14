chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
    if( request.greeting === "GetText" )
    {
        var tabText = "Not set yet";
        chrome.tabs.query({active:true},function(tabs){
            
            if(tabs.length === 0) {
                sendResponse({text: tabText});
                return;
            }

            sendResponse( {text:tabs[0].url} );
            return true;
        });        
    }
    return true;
});