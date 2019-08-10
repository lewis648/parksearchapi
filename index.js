'use strict';

const apiKey = 'C3lWeeZ6Bio9x54I3ar4KVRhQuW6tW4FDFMBCAaR'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  //confirm response 
  console.log(responseJson);
  $(".resultsP").empty();
  //to iterate through addresses
  let i, j = "";
  for (i in responseJson.data) {
    $('.resultsP').append(
      `<h3>${responseJson.data[i].fullName}</h3>
      <a href=" ${responseJson.data[i].url}">Visit Park's Website</a>
      <p>${responseJson.data[i].description}</p>`);
    for (j in responseJson.data[i].addresses) {
      $('.resultsP').append(
        `<p>${responseJson.data[i].addresses[j].type} Address:<br>${responseJson.data[i].addresses[j].line1} ${responseJson.data[i].addresses[j].line2}<br>${responseJson.data[i].addresses[j].city}, ${responseJson.data[i].addresses[j].stateCode} ${responseJson.data[i].addresses[j].postalCode}</p>`);
    }
  }
  //enhancement for later - make state list drop-down and remove this message
  if( $('.resultsP').is(':empty') ) {
    $('.resultsP').append(
        `<p class = "error-message">No results found. Please check if the <a href="https://pe.usps.com/text/pub28/28apb.htm">state abbreviation<a> is correct.</p>`
    );
  }
  $(".results").removeClass("hidden");
};

function getData(query, limit = 10, fields = 'addresses') {
  const params = {
    stateCode: query,
    limit,
    fields,
    api_key: apiKey
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;

  //Confirm url
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      //throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      console.log(err);
      //$('#js-error-message').text(`Something went wrong: ${err.message}`);
      alert("Something went wrong, try again!");
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    let searchTerm = $('#js-search-term').val();
    let maxResults = $('#js-max-results').val();
    getData(searchTerm, maxResults);
  });
}

$(watchForm);