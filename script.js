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
    
    if(event.target.classList.contains('card')) {
        dropzone.insertBefore(draggableElement, event.target);
    } else {
        dropzone.appendChild(draggableElement);
    }
}

function buildElement(tag, options) {
    const element = document.createElement(tag);
    return setElement(element, options);
}

function setElement(
    element,
    {
        classList = [], attributes = {},
        events = [], children = [],
        ...rest
    } = {}
) {

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

function Board(header) {
    const cardContainer = CardContainer();
    const board = buildElement('div');
    return setElement(
        board, {
            classList: ['board'],
            events: {
                ondragover: onDragOver,
                ondrop: onDrop
            }, children: [
                RemoveElementButton(board),
                BoardHeader(header),
                cardContainer,
                AddCardButton(cardContainer)
            ],
            // attributes: {draggable: true}
        }
    )
}

function BoardHeader(header) {
    return buildElement(
        'h3', {
            classList: ['board-header'],
            innerHTML: header,
        }
    )
}

function CardContainer() {
    return buildElement(
        'div', {classList:['card-container']}
    )
}

function RemoveElementButton(element) {
    return buildElement(
        'div', {
            classList: ['remove-card'],
            innerHTML: '<i class="fas fa-trash"></i>',
            events: { onclick: () => { element.remove(); } }
        }
    )
}

function Card(str_text) {
    if(!this.counter) { this.counter = 0 }
    this.counter += 1;

    const text = document.createTextNode(str_text);
    const card = buildElement('div');

    return setElement(
        card, {
            id: `drag-card-${this.counter}`,
            classList: ['card'],
            attributes: {draggable: true},
            children: [
                text,
                RemoveElementButton(card)
            ], events: {ondragstart: onDragStart},
        }
    )
}

function TextField(placeholder) {
    return buildElement(
        'input', {
            placeholder: placeholder,
            attributes: { required: true }
        }
    )
}

function FormApplyButton() {
    return buildElement(
        'button', {
            classList: ['apply-button'],
            innerHTML: 'Criar'
        }
    )
}

function FormCancelButton(addElementButton, elementForm) {
    return buildElement(
        'button', {
            classList: ['cancel-button'],
            attributes: { type: 'button' },
            innerHTML: 'Cancelar',
            events: {
                onclick: () => {
                    addElementButton.hidden = false;
                    elementForm.remove();
                }
            }
        }
    )
}

function CardForm(addCardButton, cardContainer) {
    const cardForm = buildElement('form');
    const cardFormTextField = TextField("Insira Título do Cartão");
    return setElement(
        cardForm, {
            classList: ['card-form'],
            children: [
                cardFormTextField,
                FormApplyButton(),
                FormCancelButton(addCardButton, cardForm)
            ], onsubmit: event => {
                const card = Card(cardFormTextField.value);

                addCardButton.hidden = false;
                cardContainer.appendChild(card);
                event.target.remove();
                return false;
            }
        }
    )
}

function BoardForm() {
    const boardForm = buildElement('form');
    const boardFormTextField = TextField("Insira Título da Lista");
    return setElement(
        boardForm, {
            classList: ['board-form'],
            children: [
                boardFormTextField,
                FormApplyButton(),
                FormCancelButton(AddBoardButton, boardForm)
            ], onsubmit: event => {
                const board = Board(boardFormTextField.value);

                AddBoardButton.hidden = false;
                BoardContainer.insertBefore(board, AddBoardButton);
                event.target.remove();
                return false;
            }
    });
}

function addCard(addCardButton, cardContainer, {target, ..._}) {
    addCardButton.hidden = true;
    const cardForm = CardForm(addCardButton, cardContainer);

    cardContainer.appendChild(cardForm);
    cardForm.querySelector('input').focus();
}

function AddCardButton(cardContainer) {
    const addCardButton = buildElement('div');
    return setElement(
        addCardButton, {
            classList: ['new-card'],
            innerHTML: "+ Adicionar outro item",
            events: {
                onclick: event => { addCard(addCardButton, cardContainer, event); }
            }
        }
    )
}

function addBoard(event) {
    AddBoardButton.hidden = true;

    const boardForm = BoardForm();
    BoardContainer.insertBefore(boardForm, event.target);
    boardForm.querySelector('input').focus();
}

const AddBoardButton = buildElement(
    'a', {
        innerHTML: "+ Adicionar Outra Lista",
        classList: ['new-board'],
        id: 'new-board-button',
        events: { onclick: addBoard }
    })

const BoardContainer = buildElement(
    'a', {
        classList: ['board-container'],
        id: 'board-container',
        children: [AddBoardButton]
    })

window.onload = () => { document.body.appendChild(BoardContainer); };
