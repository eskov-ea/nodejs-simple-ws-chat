const chatDisplay = document.querySelector('#chat');
const chatForm = document.querySelector('#ws-form');
const ws = new WebSocket('ws://127.0.0.1:8000');
ws.onmessage = message => {
    const messages = JSON.parse(message.data);
    messages.forEach( value => {
        const messageEl = document.createElement('div');
        messageEl.classList.add('message-el');

        const nameSpan = document.createElement('span');
        nameSpan.innerText = value.name;

        const messageText = document.createElement('p');
        messageText.innerText = value.message;

        messageEl.appendChild(nameSpan)
        messageEl.appendChild(messageText);

        chatDisplay.appendChild(messageEl);
    })
}
const sendMessage = e => {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;

    ws.send(JSON.stringify({
        name, message
    }));
    return false;
}
chatForm.addEventListener('submit', sendMessage);