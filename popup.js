let apiurl = "API_URL"


chrome.runtime.sendMessage({greeting: "GetText"},
    function (response) {
        taburl = response.text;

        fetch(apiurl)
        .then(response => response.json())
        .then(data => {

            // Check if the url is in the API
            if(data.hasOwnProperty(taburl)){
                console.log("API has the url");
                console.log(data);
                let title = data[taburl]['Title'];
                setsummaryhtml(title);
                return true;
            }
            else{
                setdatapiurl = apiurl + "add";
                setapidata(setdatapiurl,taburl);
            }
        });

                
        return true;
    }

);

async function setapidata(url,taburl){

    let apidata = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name:taburl
        })
    });

    apidata = await apidata.json();

    if(apidata.hasOwnProperty(taburl)){
       let title = apidata[taburl]['Title'];
        await setsummaryhtml(title);
        console.log("Data added to API");
    }
    else{
        console.log("Data not added to API");
    }

    return true;
};

async function makesummaryhtml(summary){

    let summaryhtml = summary.split('$$$');

    return summaryhtml;
};

async function setsummaryhtml(title){

    const customhtml = "<h2 class='heading'>"+title+"</h2>";

    document.getElementById("content").innerHTML = customhtml;

    return true;

}