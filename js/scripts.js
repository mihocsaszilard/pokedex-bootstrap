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
    const listItem = document.createElement('li');
    listItem.classList.add('list-item', 'light-shadow');
    const pokemonImg = document.createElement('img');
    pokemonImg.classList.add('list-img');
    const button = document.createElement('button');
    pokemonImg.src = 'img/pokeball.svg';
    button.innerText = pokemon.name;
    button.classList.add('pokemon-button');
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
      function extract(subItem){
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
    //clear all the existing content
    modalContainer.innerHTML = '';
    //create a div with class modal
    let modal = document.createElement('div');
    modal.classList.add('modal');
    //add the content
    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'X';
    closeButtonElement.addEventListener('click', hideModal);

    let elementContainer = document.createElement('div');
    elementContainer.classList.add('element-container');

    let imgElement = document.createElement('img');
    imgElement.classList.add('pokemon-img');
    let titleElement = document.createElement('h1');
    titleElement.classList.add('pokemon-title');
    let typeElement = document.createElement('p');
    typeElement.classList.add('pokemon-type');
    let heightElement = document.createElement('p');
    heightElement.classList.add('pokemon-height');

    imgElement.src = item.image;

    const itemNameCapitalized = item.name.charAt(0).toUpperCase() + item.name.slice(1);
    titleElement.innerText = itemNameCapitalized;

    if(item.type.length === 1){
      typeElement.innerText = 'Type: ' + item.type;
    }else {
      typeElement.innerText = 'Types: ' + item.type;
    }

    if (item.height > 10) {
      heightElement.innerText = 'Height: ' + item.height / 10 + ' m ';
    } else {
      heightElement.innerText = 'Height: ' + item.height + '0 cm ';
    }

    modal.appendChild(closeButtonElement);
    modal.appendChild(elementContainer);
    elementContainer.appendChild(imgElement);
    elementContainer.appendChild(titleElement);
    elementContainer.appendChild(typeElement);
    elementContainer.appendChild(heightElement);
    modalContainer.appendChild(modal);

    modalContainer.classList.add('is-visible');
  }

  // document.querySelector('#show-modal').addEventListener('click', () => {
  //   showModal('Modal title', 'Modal text');

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
        hideModal();
      }
    });

  function hideModal() {
    modalContainer.classList.remove('is-visible');
  }

  modalContainer.addEventListener('click', (e) => {
    let target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  });
  //Modal end

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
    for(let i = 0; i< darkLi.length; i++){
      if (checkBox.checked == true) {
        darkLi[i].classList.add('dark-shadow');
        darkLi[i].classList.remove('light-shadow');
      } else {
        darkLi[i].classList.add('light-shadow');
      }
    }
}
