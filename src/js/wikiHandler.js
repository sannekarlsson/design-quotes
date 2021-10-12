// Handle author's wikiInfo

export const wiki = {
    baseUrl: 'https://en.wikipedia.org/api/rest_v1',
    summary: '/page/summary/',
    info: document.querySelector('p.wiki'),
};

// Concatenate url and author into a request string
export function getWikiSummaryUrl(author) {
    return wiki.baseUrl + wiki.summary + author;
}

// Display summary for author's wiki
export function displayWiki(jsonObj) {
    // Show the longer summary if it exists
    if (jsonObj.extract) {
        wiki.info.textContent = jsonObj.extract;
    } else {
        wiki.info.textContent = jsonObj.description;
    }
    // Add author data attribute for reuse,
    // instead of making a new API request
    wiki.info.setAttribute('data-author', jsonObj.title);
    wiki.info.style.display = 'block';
}

// Clear wiki info
export function clearWiki() {
    wiki.info.style.display = 'none';
    wiki.info.setAttribute('data-author', '');
    wiki.info.textContent = '';
}

// Display an error message
export function noWikiFound(author) {
    wiki.info.innerHTML = `Sorry, there was no Wikipedia entry available. Maybe try a <a href="https://www.google.se/search?q=${author}">Google search?</a>`;
    wiki.info.setAttribute('data-author', author);
    wiki.info.style.display = 'block';
}