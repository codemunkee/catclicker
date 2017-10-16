
/* jshint esversion: 6 */
(function() {

  const catImages = document.getElementsByClassName('cat-image');
  const clickCount = document.getElementsByClassName('click-count')[0];

  for (let catImage of catImages) {
    catImage.addEventListener('click', handleCatClick);
  }

  function incrementClick(elCatImage) {
    // go through nodes in cat image's parent element
    for (let node of elCatImage.parentNode.children) {
      // find the click-count element and increment it
      if (node.className === 'click-count') {
        node.textContent = parseInt(node.textContent) + 1;
      }
    }
  }

  function handleCatClick() {
      updateCatPicture(this);
      incrementClick(this);
  }

  function parseCatURL(rawXML) {
    // create an object model from the XML returned,
    // and retreive the URL for the cat picture
    const parser = new DOMParser();
    const xDOM = parser.parseFromString(rawXML, 'text/xml');
    return xDOM.getElementsByTagName("url")[0].textContent;
  }

  function updateCatPicture(catImage) {
    fetch('https://thecatapi.com/api/images/get?format=xml&results_per_page=1&size=small')
      .then(response => { return response.text();})
      .then(xml => {
        catImage.src = parseCatURL(xml);
      });
  }
})();
