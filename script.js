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
    return buildElement(
        'div', {
            classList: ['board'],
            events: {
                ondragover: onDragOver,
                ondrop: onDrop
            }, children: [
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

function RemoveCardButton() {
    return buildElement(
        'div', {
            classList: ['remove-card'],
            innerHTML: '<i class="fas fa-trash"></i>',
            events: {
                onclick: event => {
                    const card = event.target.closest('.card');
                    card.remove();
                }
            }
        }
    )
}

function Card(str_text) {
    if(!this.counter) { this.counter = 0 }
    this.counter += 1;

    const text = document.createTextNode(str_text);

    return buildElement(
        'div', {
            id: `drag-card=${this.counter}`,
            classList: ['card'],
            attributes: {draggable: true},
            children: [
                text,
                RemoveCardButton()
            ], events: {ondragstart: onDragStart},
        }
    )
}

function CardFormTextField() {
    return buildElement(
        'input', {
            attributes: { required: true }
        }
    )
}

function CardFormApplyButton() {
    return buildElement(
        'button', {
            classList: ['apply-button'],
            innerHTML: 'Criar'
        }
    )
}

function CardFormCancelButton(addCardButton, cardForm) {
    return buildElement(
        'button', {
            attributes: { type: 'button' },
            classList: ['cancel-button'],
            innerHTML: 'Cancelar',
            events: {
                onclick: () => {
                    addCardButton.hidden = false;
                    cardForm.remove();
                }
            }
        }
    )
}

function CardForm(addCardButton, cardContainer) {
    const cardFormTextField = CardFormTextField();
    const cardForm = buildElement('form');
    return setElement(
        cardForm, {
            classList: ['card-form'],
            children: [
                cardFormTextField,
                CardFormApplyButton(),
                CardFormCancelButton(addCardButton, cardForm)
            ], onsubmit: event => {
                addCardButton.hidden = false;
                cardContainer.appendChild(Card(cardFormTextField.value));
                event.target.remove();
                return false;
            }
        }
    )
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

function BoardFormTextForm() {
    return buildElement(
        'input', {
            placeholder: 'Insira Título da Lista',
            attributes: { required: true }
    })
}

function BoardFormApplyButton() {
    return buildElement(
        'button', {
            classList: ['apply-button'],
            attributes: {href: '#'},
            innerHTML: 'Criar'
    })
}

function BoardFormCancelButton(boardForm) {
    return buildElement(
        'button', {
            classList: ['cancel-button'],
            attributes: {href: '#', type: 'button'},
            innerHTML: 'Cancelar',
            onclick: () => {
                AddBoardButton.hidden = false;
                boardForm.remove();
            }
    })
}

function BoardForm() {
    const boardForm = buildElement('form');
    const boardFormTextForm = BoardFormTextForm();
    return setElement(
        boardForm, {
            classList: ['board-form'],
            children: [
                boardFormTextForm,
                BoardFormApplyButton(),
                BoardFormCancelButton(boardForm)
            ], onsubmit: event => {
                AddBoardButton.hidden = false;
                BoardContainer.insertBefore(Board(boardFormTextForm.value), AddBoardButton);
                event.target.remove();
                return false;
            }
    });
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
