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

    updateCatData: function(catObject) {
      const id = parseInt(catObject.id);
      const name = catObject.name;
      const clicks = parseInt(catObject.clicks);
      let catData = JSON.parse(localStorage.cats);

      // find the index in the array of the particular cat object
      // and write the updated values
      for (let i = 0; i < catData.length; i++) {
        if (catData[i].id === id) {
          catData[i].name = name;
          catData[i].clicks = clicks;
        }
      }

      localStorage.cats = JSON.stringify(catData);
    },

    getCatsData: function() {
      return JSON.parse(localStorage.cats);
    },

    getCatData: function(id) {
      id = parseInt(id);
      const cat = model.getCatsData().filter(cat => {
        return cat.id === id;
      });
      return cat;
    },

    getActiveCatId: function() {
      return model.activeCat;
    },

    setActiveCatId: function(id) {
      id = parseInt(id);
      model.activeCat = id;
    },

    incrementClicks: function(id) {
      id = parseInt(id);
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

    adminOpen: false,

    init: function() {
      model.init();
      model.addCatData({id: 1, name: "Cat 1", clicks: 0});
      model.addCatData({id: 2, name: "Cat 2", clicks: 0});
      model.addCatData({id: 3, name: "Cat 3", clicks: 0});
      model.addCatData({id: 4, name: "Cat 4", clicks: 0});
      model.addCatData({id: 5, name: "Cat 5", clicks: 0});
      view.render();
    },

    updateCat: function (catObj) {
      model.updateCatData(catObj);
      view.render();
    },

    getCats: function() {
      return model.getCatsData();
    },

    getCat: function(id) {
      id = parseInt(id);
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
    render: function() {

      const cats = octopus.getCats();

      this.catLinkContainer = $('.cat-list ol');
      this.catLinkContainer.empty();

      function setActiveCat(id) {
        return () => {
          octopus.setActiveCatId(id);
        };
      }

      for (const cat of cats) {
        this.catLinkContainer.append(`<li>
          <a id="${cat.id}-cat-link" class="cat-link" href="#">${cat.name}</a>
          </li>`);
          $('#' + cat.id + '-cat-link').click(setActiveCat(cat.id));
      }

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
          $('.cat-image').unbind().click(() => { octopus.incrementClicks(); });
      });

      function openNav() {
        $('.sidenav').css('width', '250px');
        octopus.adminOpen = true;
        const cats = octopus.getCats();
        const activeCat = octopus.getCat(octopus.getActiveCatId());
        const adminCatSelect = $('.admin-cat-select');
        const adminCatName = $('.admin-cat-name');
        const adminCatClicks = $('.admin-click-count');

        adminCatSelect.empty();
        for (const cat of cats) {
          if (cat.id === activeCat.id) {
            adminCatSelect.append(`<option value="${cat.id}" selected>${cat.name}</option>`);
          } else {
            adminCatSelect.append(`<option value="${cat.id}">${cat.name}</option>`);
          }
        }

        adminCatName.val(activeCat.name);
        adminCatClicks.val(activeCat.clicks);

        // if the admin user selects a new cat, update DOM to show active cat
        adminCatSelect.change(function(item) {
          octopus.setActiveCatId(parseInt(item.target.value));
        });

        $('.adminUpdateBtn').unbind();
        $('.adminUpdateBtn').click(() => {
          octopus.updateCat({id: activeCat.id,
                          name: adminCatName.val(),
                          clicks: adminCatClicks.val() });
        });
      }

      function closeNav() {
        $('.sidenav').css('width', '0');
        octopus.adminOpen = false;
      }

      if (octopus.adminOpen) {
        openNav();
      }

      $('.closebtn').click(closeNav);
      $('.admin-button').unbind();
      $('.admin-button').click(openNav);
    }
  };

  octopus.init();

})();
