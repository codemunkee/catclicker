
/* jshint esversion: 6 */
(function() {

  const catImage = document.getElementsByClassName('cat-image')[0];
  const clickCount = document.getElementsByClassName('click-count')[0];

  catImage.addEventListener('click', () => {
    updateCatPicture();
    clickCount.textContent = parseInt(clickCount.textContent) + 1;
  });

  function parseCatURL(rawXML) {
    // create an object model from the XML returned,
    // and retreive the URL for the cat picture
    const parser = new DOMParser();
    const xDOM = parser.parseFromString(rawXML, 'text/xml');
    return xDOM.getElementsByTagName("url")[0].textContent;
  }

  function updateCatPicture() {
    fetch('http://thecatapi.com/api/images/get?format=xml&results_per_page=1&size=small')
      .then(response => { return response.text();})
      .then(xml => {
        catImage.src = parseCatURL(xml);
    });
  }

  updateCatPicture();

})();
