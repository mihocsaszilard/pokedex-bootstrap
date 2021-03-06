setTimeout(function() {
  loadingScreen = document.querySelector('#loading-screen');
  page = document.querySelector('#page');
  loadingScreen.classList.add('hidden');
  page.classList.remove('hidden');
}, 2000);

let itemPerPage = '20';
const totalItems = 1118;
const totalPages = totalItems / parseInt(itemPerPage);
const roundedTotalPages = Math.ceil(totalPages);

//wrapping pokemonList array in an IIFE
const pokemonRepository = (function() {
  const pokemonList = [];
  let offset = 0;
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon?offset=' + offset + '&limit=20';
   document.getElementById('next').addEventListener('click', showMore);

  function showMore() {
    if(offset < totalItems){
      apiUrl = 'https://pokeapi.co/api/v2/pokemon?offset=' + offset + '&limit=100';
      console.log(apiUrl);
      offset = offset + 20;
    } else {
      offset = 1120;
    }
    return apiUrl;
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    const pokemonUl = document.querySelector('.pokemon-list');
    const listItem = document.createElement('div');
    listItem.classList.add('list-item', 'back', 'rounded', 'shadow', 'text-center', 'm-md-4', 'm-sm-2', 'col-sm-12', 'col-md-4', 'col-lg-3', 'col-xs-12');
    // listItem.setAttribute('id', 'box');
    const pokemonImg = document.createElement('img');
    pokemonImg.classList.add('list-img', 'd-flex', 'pt-5', 'm-auto');
    const button = document.createElement('button');
    button.classList.add('pokemon-button', 'btn', 'btn-outline-light', 'mx-auto', 'mt-4', 'd-flex');
    pokemonImg.src = 'img/pokeball.svg';
    button.innerText = pokemon.name;

    listItem.addEventListener('mousemove', colorChange);
    listItem.addEventListener('mouseout', noColor);
    listItem.addEventListener('mouseenter', addText);
    listItem.addEventListener('mouseleave', removeText);

    const text = document.createElement('p');
    text.classList.add('text-light', 'mt-3');

    text.innerHTML = 'Click to meet ' + pokemon.name + '!';

    function colorChange(e) {
      listItem.style.backgroundColor = 'rgba(' + e.offsetX / 2 + ',' + e.offsetY / 2 + ',' + e.offsetX / 3 + ', .2)';
    }

    function noColor() {
      listItem.style.backgroundColor = 'rgba(0,0,0,.1)';
    }

    function addText() {
      listItem.appendChild(text);
    }

    function removeText() {
      listItem.removeChild(text);
    }

    listItem.appendChild(pokemonImg);
    listItem.appendChild(button);
    pokemonUl.appendChild(listItem);
    //console.log(listItem);
    //listItem.style.backgroundColor = '#fff';

    listItem.addEventListener('click', function() {
      showDetails(pokemon);
    });
  }

  async function loadList() {
    showLoadingMessage();
    try {
      const response = await fetch(showMore());
      console.log(response);
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
    } catch (e) {
      hideLoadingMessage();
      console.error(e);
    }
  }

  //adding pokemon if it is an object and is not null
  function add(pokemon) {
    if (typeof pokemon === 'object' &&
      'name' in pokemon &&
      'detailsUrl' in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log(`The Pokemon is not correct!<br>`);
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
      item.baseXp = details.base_experience;
      item.type = pokemonTypes;
    } catch (e) {
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
      modalHeader.addClass('d-block text-warning');
      //clear all the existing content
      modalTitle.empty();
      modalBody.empty();
      //create element for name in modal content
      const nameElement = `<h1>  ${item.name}  </h1>`;
      //create img element in modal content
      const imageElement = $('<img class="modal-img img-thumbnail" width="50%">');
      imageElement.attr('src', item.image);
      //create element for height
      let heightElement;
      if (item.height < 10) {
        heightElement = $(`<p class="text-warning mt-2"> Height: ${item.height  * 10} cm </p>`);
      } else {
        heightElement = $(`<p class="text-warning mt-2"> Height: ${item.height  / 10} m </p>`);
      }
      //create element for types
      const typeElement = $(`<p class="mx-auto w-50"> Type: ${item.type} </p>`);

      //highlighting the type field with the corresponding color
      if (item.type.includes('fire')) {
        typeElement.addClass('fire-bg');
      } else if (item.type.includes('grass')) {
        typeElement.addClass('grass-bg');
      } else if (item.type.includes('water')) {
        typeElement.addClass('water-bg');
      } else if (item.type.includes('poison')) {
        typeElement.addClass('poison-bg');
      } else if (item.type.includes('ground')) {
        typeElement.addClass('ground-bg');
      } else if (item.type.includes('ground')) {
        typeElement.addClass('ground-bg');
      } else if (item.type.includes('fairy')) {
        typeElement.addClass('fairy-bg');
      } else if (item.type.includes('flying')) {
        typeElement.addClass('flying-bg');
      } else if (item.type.includes('normal')) {
        typeElement.addClass('normal-bg');
      } else if (item.type.includes('electric')) {
        typeElement.addClass('electric-bg');
      } else if (item.type.includes('bug')) {
        typeElement.addClass('bug-bg');
      } else {
        typeElement.style.backgroundColor = '#fff';
      }

      const xpElement = $(`<p class="text-warning"> XP: ${item.baseXp} </p>`);

      modalHeader.append(modalTitle);
      modalTitle.append(nameElement);
      modalBody.append(imageElement);
      modalBody.append(heightElement);
      modalBody.append(typeElement);
      modalBody.append(xpElement);

      $('#exampleModal').modal('toggle');
    });
  }

  //Search  -jQuery
  $(document).ready(function() {
    $('#nameInput').on('keyup', function() {
      var value = $(this).val().toLowerCase();
      $('#pokemon-list div').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  });

  //Search
  // const filter = document.getElementById('nameInput');
  // const itemList = document.getElementById('pokemon-list')
  // filter.addEventListener('keyup', filterItems);
  //
  // function filterItems(e){
  //   // convert text to lowercase
  //   let text = e.target.value.toLowerCase();
  //   // Get list
  //   let items = itemList.getElementsByTagName('div');
  //   // Convert to an array
  //   for(let i=0; i<items.length; i++){
  //     let itemName = items[i].innerText;
  //     if(itemName.toLowerCase().indexOf(text) !== -1){
  //       items[i].style.display = 'visible';
  //       console.log (itemName);
  //     } else {
  //       items[i].style.display = 'none';
  //     }
  //   }
  // }

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
    // console.log(pokemon.detailsUrl);
  });
});
