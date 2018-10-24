const aQuote = {
    element: document.querySelector('q'),
    author: document.querySelector('p.author'),
    endpointUrl: 'https://quotesondesign.com/wp-json/posts',
    filter: '?filter[orderby]=rand&filter[posts_per_page]=5',
};

// Insert the quote and its properties 
export function initQuote(jsonObj) {
    let cite = jsonObj.link;
    // If custom_meta is present, set Source as cite instead
    if (jsonObj.custom_meta) {
        cite = jsonObj.custom_meta.Source;
        // Remove the a tags from the content.
        cite.replace(/<\/?a>/g, '').trim();
    }
    aQuote.element.setAttribute('cite', cite);

    // Remove the p tags from the quote content.
    // Use innerHTML to display utf-8 characters correctly
    let taggedQuote = jsonObj.content;
    aQuote.element.innerHTML = taggedQuote.replace(/<\/?p>/g, '').trim();

    // Set up author's name
    aQuote.author.innerHTML = jsonObj.title;
}

// Return a request url
export function getQuoteRequest() {
    // Add a timestamp to get around the browser cache
    let time = Math.round(new Date().getTime() / 1000);
    let timestamp = '&timestamp=' + time;
    // Put them together to form a request url
    let request = aQuote.endpointUrl + aQuote.filter + timestamp;
    return request;
}