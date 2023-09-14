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
                let summary = data[taburl]['summary'];
                let title = data[taburl]['title'];
                setsummaryhtml(summary,title);
                return true;
            }
            else{
                geturldata(taburl)
                .then((data) => {
                    // Add to storage
                    if(data.error === false){
                        let setdatapi = apiurl + "add";
                        setapidata(setdatapi,data,taburl);
                    }
                    else{
                        document.getElementById("content").innerHTML = "<div id='content'> <h2 class='heading'> Error: Not a pdf </h2> </div>";
                    }
                });
            }
        });

                
        return true;
    }

);

async function setapidata(url,data,taburl){

    let apidata = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name:taburl,
            pagetext:data.pagetext, 
            npages:data.npages,
            title:data.title
        })
    });

    apidata = await apidata.json();
    let summary = apidata[taburl]['summary'];
    let title = apidata[taburl]['title'];
    await setsummaryhtml(summary,title);

    console.log("Data added to API");

    return true;
};

async function geturldata(url){

    // check if url is undefined // check if the url is a pdf
    if(url === undefined || url === null || !(url.includes(".pdf"))){
        return {pagetext:'-1', error: true};
    }
    else{
        let pagedata = await getpagedata(url);
        return {
            pagetext : pagedata.text, 
            npages: pagedata.npages,
            title: pagedata.title, 
            error: false
        };
    }
};

async function getpagedata(pdfUrl){
    
    pdfjsLib.GlobalWorkerOptions.workerSrc = './pdfjs-3.10.111-dist/build/pdf.worker.js';
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    const md = await pdf.getMetadata();
    console.log(md);

    // Fetch the text from all the pages
    let _text = '';
    for(let i=1; i<=numPages; i++){
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items.map(function (s) {
            return s.str;
        }).join(' ');
        _text += text;
    }

    return {
        text: _text, 
        npages: numPages,
        title: md.info.Title
    }; 
};

async function makesummaryhtml(summary){

    let summaryhtml = summary.split('$$$');

    return summaryhtml;
};

async function setsummaryhtml(summary,title){

    let summaryhtml = await makesummaryhtml(summary);

    console.log(summaryhtml);

    customhtml = "<h2 class='heading'>"+title+"</h2>";

    for (let i = 0; i < summaryhtml.length; i++) {
         customhtml += "<p class='bubble'>"+summaryhtml[i]+"</p>";
    }

    document.getElementById("content").innerHTML = customhtml;

    return true;

}