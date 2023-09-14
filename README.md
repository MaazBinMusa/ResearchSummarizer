# ResearchSummarizer


## Introduction

This is a proof of concept web extension, which summarizes 
any pdf open in the browser (not local though).


## Usage

- To use this template you require an API '/add' and '/' endpoint that takes 
[url, numb of pages] and returns [summary, title, number of pages]
- This API url needs to be added in the manifest.json file and popup.js file
- If PDF is visited for the first time, it takes 3-5 seconds for the summary to 
generate


### Version 1.0.0

- Processes only the first 50 sentences
- Applies Extractive summaraization on sentences
- Returns top 2 most important sentences


## Up-next

- Move API to a server with high memory processing capability
- Apply Abstractive summary on the important sentences