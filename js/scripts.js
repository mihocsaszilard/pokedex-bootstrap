//wrapping pokemonList array in an IIFE
const pokemonRepository = (function() {
  const pokemonList = [];
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=100';
  const modalContainer = document.querySelector('#modal-container'); //global scope

  //adding pokemon if it is an object and is not null
  function add(pokemon) {
    if (typeof pokemon === 'object' &&
      'name' in pokemon &&
      'detailsUrl' in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log('The Pokemon is not correct' + '<br>')
    }
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    const pokemonUl = document.querySelector('.pokemon-list');
    const listItem = document.createElement('div');
    listItem.classList.add('list-item', 'light-shadow', 'text-sm-center', 'col-12', 'col-sm-4', 'p-sm-3', 'col-md-4', 'p-md-5','text-lg-center', 'col-lg-3', 'p-lg-5', 'col-xl-2', 'p-xl-3');
    const pokemonImg = document.createElement('img');
    pokemonImg.classList.add('list-img');
    const button = document.createElement('button');
    pokemonImg.src = 'img/pokeball.svg';
    button.innerText = pokemon.name;
    button.classList.add('pokemon-button', 'btn', 'btn-outline-light');
    listItem.appendChild(pokemonImg);
    listItem.appendChild(button);
    pokemonUl.appendChild(listItem);

    listItem.addEventListener('click', function(event) {
      showDetails(pokemon);
    });
  }

  function loadList() {
    showLoadingMessage();
    return fetch(apiUrl).then(function(response) {
      return response.json();
    }).then(function(json) {
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
    }).catch(function(e) {
      hideLoadingMessage();
      console.error(e);
    })
  }

  function loadDetails(item) {
    showLoadingMessage();
    const url = item.detailsUrl;
    return fetch(url).then(function(response) {
      return response.json();
    }).then(function(details) {
      hideLoadingMessage();
      //now we add the details to the pokemon
      item.image = details.sprites.front_default;
      item.height = details.height;
      //extracting the types & creating an array to hold them
      let pokemonTypes = details.types.map(extract);

      function extract(subItem) {
        return subItem.type.name;
      }
      item.type = pokemonTypes;
    }).catch(function(e) {
      hideLoadingMessage();
      console.error(e);
    });
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
      //clear all the existing content
      modalTitle.empty();
      modalBody.empty();
      //create element for name in modal content
      const nameElement = item.name;
      //create img element in modal content
      const imageElement = $('<img class="modal-img" width="50%">');
      imageElement.attr('src', item.image);
      //create element for height
      const heightElement = $('<p>' + 'Height: ' + item.height + '</p>');
      //create element for types
      const typeElement = $('<p>' + 'Type: ' + item.type + '</p>');

      modalTitle.append(nameElement);
      modalBody.append(imageElement);
      modalBody.append(heightElement);
      modalBody.append(typeElement);

      $('#exampleModal').modal('toggle');
    });
  }


  $(document).ready(function() {
    $("#nameInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#pokemon-list div").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
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

function darkMode() {
  const checkBox = document.getElementById('check');
  const body = document.body;

  if (checkBox.checked == true) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }

  const darkLi = document.getElementById('pokemon-list').getElementsByTagName('li');
  for (let i = 0; i < darkLi.length; i++) {
    if (checkBox.checked == true) {
      darkLi[i].classList.add('dark-shadow');
      darkLi[i].classList.remove('light-shadow');
    } else {
      darkLi[i].classList.add('light-shadow');
    }
  }
}
