class Card {
    constructor(name, number, imageUrl, superType, subType, rarity) {
        this.name = name;
        this.number = number;
        this.imageUrl = imageUrl;
        this.superType = superType;
        this.subType = subType;
        this.rarity = rarity
    }
}

class PokemonCardCatalog {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 4;
        this.apiEndpoint = "https://api.pokemontcg.io/v1/cards";
        this.lastResponse = null;
        this.cards = null;
        this.loadMoreButton = null;
        this.searchInput = null;

        this.UiSelectors = {
            loadMoreButton: '[data-button-load]',
            searchInput: '[data-search-input]',
            catalogContainer: '[data-catalog-container]'
        };
    }

    initializeCatalog() {
        this.cards = [];
        this.initializeListeners();
        this.initializeLoader();
        this.getCards(this.currentPage, this.pageSize);
    }

    initializeListeners() {
        this.loadMoreButton = document.querySelector(this.UiSelectors.loadMoreButton);
        this.loadMoreButton.addEventListener('click', () => {
            this.getCards(this.currentPage, this.pageSize)
            this.searchInput.value = '';
        });

        this.searchInput = document.querySelector(this.UiSelectors.searchInput);
        this.searchInput.addEventListener('input', () => {
            const filteredCards = this.cards.filter(x => x.name.toLowerCase().includes(this.searchInput.value));
            if(this.searchInput.value !== '') {
                this.loadMoreButton.classList.remove('is-active');
            } else {
                this.loadMoreButton.classList.add('is-active');
            }

            this.drawElements(filteredCards);
        });
    }

    initializeLoader() {
        const loaderElement = document.createElement('div');
        loaderElement.classList.add('loader-element');

        const loader = document.createElement('div');
        loader.classList.add('loader');
        loader.setAttribute('data-loader',true);

        for(let i = 0; i < 3; i++) {
            loader.appendChild(loaderElement.cloneNode(true)); 
        }

        this.loadMoreButton.parentNode.appendChild(loader);
    }

    drawElements(elements) {
        let row;
        const catalogContainer = document.querySelector(this.UiSelectors.catalogContainer);
        catalogContainer.innerHTML = '';
        const numberOfRows = Math.ceil(elements.length / this.pageSize);
        
        for(let i = 0; i < numberOfRows; i++) {
            row = [];

            if(i < numberOfRows - 1) {
                for(let j = i * this.pageSize; j < this.pageSize * (i + 1); j++) {
                    row.push(elements[j]);
                }
            } else {
                for(let j = i * this.pageSize; j < elements.length; j++) {
                    row.push(elements[j]);
                }
            }

            this.createNewRow(row);
        }
    }

    createNewRow(cards) {
        const catalogContainer = document.querySelector(this.UiSelectors.catalogContainer);
        const node = document.createElement('div');
        node.classList.add('row');
        
        cards.forEach(card => {
            node.appendChild(this.buildCard(card));
        });

         catalogContainer.appendChild(node);
    }

    buildCard(card) {
        const cardNode = document.createElement('div');
        cardNode.classList.add('card');
   
        this.addCardInfo('h4', card.name, cardNode);
        this.addCardInfo('h5', `Nr: ${card.number}`, cardNode);
        this.addCardInfo('img', card.imageUrl, cardNode);
        this.addCardInfo('h6', `Rarity: ${card.rarity}`, cardNode);
        this.addCardInfo('h6', `Subtype: ${card.subType}`, cardNode);
        this.addCardInfo('h6', `Supertype: ${card.superType}`, cardNode);

        return cardNode;
    }

    addCardInfo(elementType, elementValue, parent) {
        const currentElement = document.createElement(elementType);
        if(elementType !== 'img') {
            currentElement.textContent = elementValue;
        } else {
            currentElement.setAttribute('src', elementValue);
        }

        parent.appendChild(currentElement);
    }


    getCards(pageNumber, pageSize) {
        const apiUrl = this.apiEndpoint + `?page=${pageNumber}&pageSize=${pageSize}`;
        const http = new XMLHttpRequest();
        this.sendGetRequest(http, apiUrl);
        this.currentPage++;
    }
    
    sendGetRequest(http, apiUrl) {
        http.onloadstart = () => {
            const button = document.querySelector('[data-button-load]');
            const loader = document.querySelector('[data-loader]');
            this.showLoader(button, loader);
        };

        http.onloadend = () => {
            const button = document.querySelector('[data-button-load]');
            const loader = document.querySelector('[data-loader]');
            this.hideLoader(button, loader);
        };

        http.onreadystatechange = () => {
            if(http.readyState === 4 && http.status === 200) {
                const lastReceivedCards = [];
                this.lastResponse = JSON.parse(http.responseText);

                this.lastResponse.cards.forEach(card => {
                    const newCard = new Card(card.name, card.number, card.imageUrl, card.supertype, card.subtype, card.rarity);
                    this.cards.push(newCard);
                    lastReceivedCards.push(newCard);
                });

                this.createNewRow(lastReceivedCards);
            };
        }
        
        http.open('GET', apiUrl, true);
        http.send(null);
    }

    showLoader(button, loader) {
        button.classList.remove('is-active');
        loader.classList.add('is-active');
    }

    hideLoader(button, loader) {
        button.classList.add('is-active');
        loader.classList.remove('is-active');
    }
}