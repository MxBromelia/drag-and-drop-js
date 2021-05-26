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

function buildElement(
    tag,
    {
        classList = [], attributes = {},
        events = [], children = [],
        ...rest
    } = {}
) {
    let element = document.createElement(tag);

    for(klass of classList) {
        element.classList.add(klass);
    }

    for(let attr in attributes) {
        const value = attributes[attr];
        element.setAttribute(attr, value);
    }

    for(let ev in events) {
        const callback = events[ev];
        element[ev] = callback;
    }

    for(child of children) {
        element.appendChild(child);
    }

    for(prop in rest) {
        element[prop] = rest[prop];
    }

    return element;
}

function boardTemplate() {
    return buildElement(
        'div', {
            classList: ['board'],
            events: {
                ondragover: onDragOver,
                ondrop: onDrop
            }, children: [
                boardHeaderTemplate(),
                cardContainerTemplate(),
                addCardTemplate()
            ]
        }
    )
}

function boardHeaderTemplate() {
    return buildElement(
        'h3', {
            classList: ['board-header'],
            innerHTML: "[Board Text]",
        }
    )
}

function cardContainerTemplate() {
    return buildElement(
        'div', {classList:['card-container']}
    )
}

function cardTemplate() {
    if(!this.counter) { this.counter = 0 }
    this.counter += 1;

    return buildElement(
        'div', {
            id: `drag-card=${this.counter}`,
            classList: ['card'],
            attributes: {draggable: true},
            events: {ondragstart: onDragStart},
            innerHTML: `[Card ${this.counter} Text]`
        }
    )
}

function addCardTemplate() {
    return buildElement(
        'div', {
            classList: ['new-card'],
            innerHTML: "+ Adicionar outro item",
            events: {
                onclick: event => {
                    const board = event.target.parentNode;
                    board.appendChild(cardTemplate());
                    board.appendChild(event.target);
                }
            }
        }
    )
}

function boardFormTemplate() {
    const textForm = buildElement(
        'input', {
            placeholder: 'Insira Título da Lista',
    })
    const applyButton = buildElement(
        'button', {
            classList: ['apply-button'],
            attributes: {href: '#'},
            innerHTML: 'Criar'
    })
    const cancelButton = buildElement(
        'button', {
            classList: ['cancel-button'],
            attributes: {href: '#'},
            innerHTML: 'Cancelar',
        })
    return buildElement(
        'form', {
            classList: ['board-form'],
            children: [textForm, applyButton, cancelButton]
    })
}

window.onload = () => {
    const boardContainer = document.getElementById('board-container');

    const newBoard = document.getElementById("new-board-button");
    newBoard.onclick = event => {
        boardContainer.appendChild(boardTemplate());
        boardContainer.appendChild(event.target);
    }

    boardContainer.appendChild(boardFormTemplate());
}
