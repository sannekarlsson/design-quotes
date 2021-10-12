import { createDots, toggleBubbling } from './loader.js';
import { getQuoteRequest, initQuote } from './quoteHandler.js';
import { clearWiki, displayWiki, getWikiSummaryUrl, noWikiFound, wiki }
    from './wikiHandler.js';

'use strict';

// The default object needs to have the same structure as the json from the API call
const quote = {
    button: document.querySelector('button[name="quote"]'),
    collection: [],
    container: document.querySelector('.quote-container'),
    default: {
        content: {
            rendered: 'Perfection is boring. Getting better is where all the fun is.'
        },
        link: 'https://quotesondesign.com/dragos-roua/',
        title: {
            rendered: 'Dragos Roua'
        }
    },
};

const author = {
    button: document.querySelector('button[name="author"]'),
    find: 'Who is quoted?',
    hide: 'Hide author info',
}


// Loading animation
const loading = document.querySelector('.loader');
createDots(5);

// Add event listeners to buttons
author.button.addEventListener('click', toggleAuthor);
quote.button.addEventListener('click', getQuote);

// Initiate quote
getQuote();

// Get a quote to display
function getQuote() {
    // Reset wiki in case it is shown
    resetWiki();
    // Show loader and hide quote
    toggleLoaderAndQuote(1);
    // Get next quote to display
    let nextQuote = quote.collection.shift();
    if (nextQuote) {
        displayQuote(nextQuote);
    } else {
        fetchJson(getQuoteRequest(), displayAndStoreQuotes);
    }
}

// Display a quote
function displayQuote(jsonObj) {
    initQuote(jsonObj);
    // Set the author as value of button
    // to fetch author wiki on future button click
    author.button.value = jsonObj.title.rendered;

    // Hide loader and show quote
    toggleLoaderAndQuote(0);
}

// Store quotes for later access
function displayAndStoreQuotes(jsonObj) {
    // Display one of the fetched quotes
    displayQuote(jsonObj[0]);
    // Store the others for later access
    for (let i = 1; i < jsonObj.length; i++) {
        quote.collection.push(jsonObj[i]);
    }
}

// Calls to API's, expecting JSON
function fetchJson(request, callback) {

    fetch(request)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Fetch response with status: ${response.status}.`);
            }
        })
        .then((jsonObj) => {
            callback(jsonObj);
        })
        .catch((error) => {
            console.error(`Sorry! Something went wrong with the request. ${error}`);
            noEntryFound(request);
        });

}

// Toggle show & hide for loader animation and quote
function toggleLoaderAndQuote(loaderOpacity) {
    quote.container.style.opacity = loaderOpacity ? 0 : 1;
    loading.style.opacity = loaderOpacity;
    toggleBubbling(loaderOpacity);
}

// Toggle author button text as well as
// display and hide wiki summary.
function toggleAuthor(event) {
    let buttonText = author.button.textContent;
    if (buttonText === author.hide) {
        wiki.info.style.display = 'none';
        author.button.textContent = author.find;
    } else {
        author.button.textContent = author.hide;
        getWiki(event.target.value);
    }
}

// Display summary if wiki has already been fetched for 
// current author, otherwise make an API request.
function getWiki(author) {
    if (wiki.info.dataset.author === author) {
        wiki.info.style.display = 'block';
    } else {
        let request = getWikiSummaryUrl(author);
        fetchJson(request, displayWiki);
    }
}

// Clear the wiki element from previous author, 
// since a new quote will be displayed
// and toggle author button text.
function resetWiki() {
    author.button.textContent = author.find;
    clearWiki();
}

// Handle errors in API calls
function noEntryFound(url) {
    // Error in the Wikipedia response
    if (url.startsWith(wiki.baseUrl)) {
        noWikiFound(author.button.value);
    } else {
        // Error in the quote response
        displayQuote(quote.default);
        displayError(errorElement());
    }
}

// Create an element with a quote error message
function errorElement() {
    const el = document.createElement('p');
    el.className = 'no-entry';
    el.textContent = 'Sorry, could not fetch quotes. Will hopefully work soon again. This is a default quote in the mean time.';
    return el;
}

// Display quote error for 6 seconds
function displayError(errorElement) {
    // Only display 1 error message at a time
    if (document.querySelector('.no-entry')) {
        return;
    }
    quote.container.insertBefore(errorElement, document.querySelector('.button-group'));

    setTimeout(() => {
        quote.container.removeChild(errorElement);
    }, 10000);
}
