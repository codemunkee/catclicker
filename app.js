/* jshint esversion: 6 */
(function() {

  let model = {
    init: function() {
      localStorage.cats = JSON.stringify([]);
      model.activeCat = 1;
    },

    addCatData: function(catObject) {
       let catData = JSON.parse(localStorage.cats);
       catData.push(catObject);
       localStorage.cats = JSON.stringify(catData);
    },

    getCatsData: function() {
      return JSON.parse(localStorage.cats);
    },

    getCatData: function(id) {
      const cat = model.getCatsData().filter(cat => {
        return cat.id === id;
      });
      return cat;
    },

    getActiveCatId: function() {
      return model.activeCat;
    },

    setActiveCatId: function(id) {
      model.activeCat = id;
    },

    incrementClicks: function(id) {
      let catData = model.getCatsData();
      for (let i = 0; i < catData.length; i++) {
        if (catData[i].id === id) {
          catData[i].clicks += 1;
        }
      }
      localStorage.cats = JSON.stringify(catData);
    }
  };

  let octopus = {
    init: function() {
      model.init();
      model.addCatData({id: 1, name: "Cat 1", clicks: 0});
      model.addCatData({id: 2, name: "Cat 2", clicks: 0});
      model.addCatData({id: 3, name: "Cat 3", clicks: 0});
      model.addCatData({id: 4, name: "Cat 4", clicks: 0});
      model.addCatData({id: 5, name: "Cat 5", clicks: 0});
      view.init();
      view.render();
    },

    getCats: function() {
      return model.getCatsData();
    },

    getCat: function(id) {
      // we put the index 0 at the end of the return so as
      // not to return the object's index in localStorage
      return model.getCatData(id)[0];
    },

    getActiveCatId: function() {
      return model.activeCat;
    },

    setActiveCatId: function(id) {
      model.setActiveCatId(id);
      view.render();
    },

    incrementClicks: function() {
      model.incrementClicks(this.getActiveCatId());
      view.render();
    }
  };

  let  view = {
    init: function() {
      const cats = octopus.getCats();

      this.catLinkContainer = $('.cat-list ol');
      this.catLinkContainer.empty();

      for (const cat of cats) {
        this.catLinkContainer.append(`<li>
          <a id="${cat.id}-cat-link" class="cat-link" href="#">${cat.name}</a>
          </li>`);
          $('#' + cat.id + '-cat-link').click(_ => {
            octopus.setActiveCatId(cat.id);
          });
      }
    },

    render: function() {
      const cat = octopus.getCat(octopus.getActiveCatId());
      let catImageHTML = `<figure id="${cat.id}-cat-box" class="cat-image-box">
              <h2>${cat.name}</h2>
              <p class="click-count">${cat.clicks}</p>
              <img class="cat-image" src="loading.gif" alt="cat picture"></img>
            </figure>`;
      $('.cat-box').empty();
      $('.cat-box').append(catImageHTML);

      catImage = $('.cat-image');

      function parseCatURL(rawXML) {
        // create an object model from the XML returned,
        // and retreive the URL for the cat picture
        const parser = new DOMParser();
        const xDOM = parser.parseFromString(rawXML, 'text/xml');
        return xDOM.getElementsByTagName("url")[0].textContent;
      }

      fetch('https://thecatapi.com/api/images/get?format=xml&results_per_page=1&size=small')
        .then(response => {
          return response.text();
        })
        .then(xml => {
          catImage.attr('src', parseCatURL(xml));
          $('.cat-image').click(() => { octopus.incrementClicks(); });
      });

    }
  };

  octopus.init();

})();
