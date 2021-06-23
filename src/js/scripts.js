//wrapping pokemonList array in an IIFE
const pokemonRepository = (function() {
  const pokemonList = [];
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=100';

  //adding pokemon if it is an object and is not null
  function add(pokemon) {
    if (typeof pokemon === 'object' &&
      'name' in pokemon &&
      'detailsUrl' in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log('The Pokemon is not correct' + '<br>');
    }
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    const pokemonUl = document.querySelector('.pokemon-list');
    const listItem = document.createElement('div');
    listItem.classList.add('list-item', 'light-shadow', 'text-sm-center', 'col-12', 'col-sm-4', 'p-sm-3', 'col-md-4', 'p-md-5', 'text-lg-center', 'col-lg-3', 'p-lg-5', 'col-xl-2', 'p-xl-3');
    const pokemonImg = document.createElement('img');
    pokemonImg.classList.add('list-img');
    const button = document.createElement('button');
    pokemonImg.src = 'img/pokeball.svg';
    button.innerText = pokemon.name;
    button.classList.add('pokemon-button', 'btn', 'btn-outline-light');
    listItem.appendChild(pokemonImg);
    listItem.appendChild(button);
    pokemonUl.appendChild(listItem);

    listItem.addEventListener('click', function() {
      showDetails(pokemon);
    });
  }

  async function loadList() {
    showLoadingMessage();
    try {
          const response = await fetch(apiUrl);
          const json = await response.json();
          hideLoadingMessage();
          json.results.forEach(function(item) {
              const itemNameCapitalized = item.name.charAt(0).toUpperCase() + item.name.slice(1);
              let pokemon = {
                  name: itemNameCapitalized,
                  detailsUrl: item.url
              };
              add(pokemon);
              //console.log(pokemon);
          });
      }
      catch (e) {
          hideLoadingMessage();
          console.error(e);
      }
  }

  async function loadDetails(item) {
    showLoadingMessage();
    const url = item.detailsUrl;
    try {
      const response = await fetch(url);
      const details = await response.json();
      hideLoadingMessage();

      //now we add the details to the pokemon
        item.image = details.sprites.front_default;
        item.height = details.height;

        //extracting the types & creating an array to hold them
        let pokemonTypes = details.types.map(extract);
        function extract(subItem_1) {
          return subItem_1.type.name;
        }
        item.type = pokemonTypes;
      }

    catch (e) {
      hideLoadingMessage();
      console.error(e);
    }
  }

  function showDetails(item) {
    loadDetails(item).then(function() {
      showModal(item);
    });
  }

  function showLoadingMessage() {
    document.querySelector('#loading').style.visibility = 'visible';
  }

  function hideLoadingMessage() {
    document.querySelector('#loading').style.visibility = 'hidden';
  }

  // Modal
  function showModal(item) {
    pokemonRepository.loadDetails(item).then(function() {
      const modalBody = $('.modal-body');
      modalBody.addClass('text-center');
      const modalTitle = $('.modal-title');
      const modalHeader = $('.modal-header');
      modalHeader.addClass('d-block');
      //clear all the existing content
      modalTitle.empty();
      modalBody.empty();
      //create element for name in modal content
      const nameElement = '<h1>' + item.name + '</h1>';
      //create img element in modal content
      const imageElement = $('<img class="modal-img img-thumbnail" width="50%">');
      imageElement.attr('src', item.image);
      //create element for height
      let heightElement;
      if (item.height < 10) {
        heightElement = $('<p>' + 'Height: ' + item.height * 10 + 'cm' + '</p>');
      } else {
        heightElement = $('<p>' + 'Height: ' + item.height / 10 + 'm' + '</p>');
      }
      //create element for types
      const typeElement = $('<p>' + 'Type: ' + item.type + '</p>');

      modalHeader.append(modalTitle);
      modalTitle.append(nameElement);
      modalBody.append(imageElement);
      modalBody.append(heightElement);
      modalBody.append(typeElement);

      $('#exampleModal').modal('toggle');
    });
  }

  //Search
  $(document).ready(function() {
    $('#nameInput').on('keyup', function() {
      var value = $(this).val().toLowerCase();
      $('#pokemon-list div').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  });


  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails
  };
})();

pokemonRepository.loadList().then(function() {
  //data is loaded!
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
