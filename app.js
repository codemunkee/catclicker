
/* jshint esversion: 6 */
(function() {
  var myHeaders = new Headers();

  function parseCatURL(rawXML) {
    // create an object model from the XML returned,
    // and retreive the URL for the cat picture
    const parser = new DOMParser();
    const xDOM = parser.parseFromString(rawXML, 'text/xml');
    return xDOM.getElementsByTagName("url")[0].textContent;
  }

  fetch('http://thecatapi.com/api/images/get?format=xml&results_per_page=1&size=small')
    .then(response => { return response.text();})
    .then(xml => console.log(parseCatURL(xml)));
})();
