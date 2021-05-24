function onDragStart(event) {
    event.dataTransfer
         .setData('text/plain', event.target.id);
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);
    const dropzone = event.target.closest('.board')
                          .querySelector('.card-container');
    
    dropzone.appendChild(draggableElement);
}

function boardTemplate() {
    let template = document.createElement('div');
    template.classList.add('board');
    template.ondragover = onDragOver;
    template.ondrop = onDrop;

    template.appendChild(boardHeaderTemplate());
    template.appendChild(cardContainerTemplate());
    template.appendChild(addCardTemplate());

    return template;
}

function boardFormTemplate() {
    let textForm = document.createElement('input');
    textForm.placeholder = "Insira Título de Lista";
    textForm.setAttribute('remote', true);

    let applyButton = document.createElement('button');
    applyButton.setAttribute('href', '#');
    applyButton.innerHTML = "Criar"
    applyButton.classList.add("apply-button");

    let cancelButton = document.createElement('button');
    cancelButton.setAttribute('href', '#');
    cancelButton.innerHTML = "Cancelar";
    cancelButton.classList.add("cancel-button");

    let template = document.createElement('form');
    template.classList.add('board-form');
    template.appendChild(textForm);
    template.appendChild(applyButton);
    template.appendChild(cancelButton);

    return template;
}


function boardHeaderTemplate() {
    let template = document.createElement('h3');
    template.classList.add('board-header');
    template.innerHTML = "[Board Text]";

    return template;
}

function cardContainerTemplate() {
    let template = document.createElement('div');
    template.classList.add('card-container');
    
    return template;
}

function cardTemplate() {
    if(!this.counter) { this.counter = 0 }
    this.counter += 1;

    let template = document.createElement('div');
    template.id = `drag-card-${this.counter}`;
    template.classList.add('card');
    template.setAttribute('draggable', true);
    template.ondragstart = onDragStart;
    template.innerHTML = "[Card Text]";

    return template;
}

function addCardTemplate() {
    let template = document.createElement('div');
    template.innerHTML = "+ Adicionar outro item";
    template.classList.add('new-card');
    template.onclick = event => {
        const board = event.target.parentNode;
        board.appendChild(cardTemplate());
        board.appendChild(event.target);
    }
    return template;
}

window.onload = () => {
    const boardContainer = document.getElementById('board-container');

    const newBoard = document.getElementById("new-board-button");
    newBoard.onclick = event => {
        boardContainer.appendChild(boardTemplate());
        boardContainer.appendChild(event.target);
    }

    // boardContainer.appendChild(boardFormTemplate());
}
