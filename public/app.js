const conn = new WebSocket('ws://localhost:8080');
conn.onopen = function (e) {
    console.log('Connected to server');
}

conn.onerror = function (e) {
    console.log('Error: Could not connect to server');
}

conn.onclose = function (e) {
    console.log('Connection closed');
}

conn.onmessage = function (e) {
    const message = JSON.parse(e.data);

    const blockquote = document.createElement('blockquote');
    blockquote.textContent = message.text;
    if (message.sender) blockquote.className = 'sentMessage';

    const footer = document.createElement('footer');
    footer.textContent = (message.sender) ? 'You' : message.name;
    blockquote.appendChild(footer);

    const div = document.getElementsByClassName('message-list')[0];
    div.appendChild(blockquote);

    // scroll to bottom
    const content = document.getElementById('content');
    content.scrollTo(0, content.scrollHeight);
}

function formSubmit(e) {
    e.preventDefault();

    const input = document.getElementById('chat');

    if (input.value !== '') {
        const message = {
            type: 'message',
            text: input.value
        };

        input.value = '';

        conn.send(JSON.stringify(message));
    }
}

function colorChange() {
    const radioButtons = document.getElementsByName('color');

    let color;
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            color = radioButtons[i].value;
        }
    }
    
    document.cookie = `color=${color}`;

    const link = document.getElementsByTagName('link')[2];
    link.href = `design/color/${color}.css`;
}

function themeChange() {
    const theme = document.documentElement.getAttribute('data-theme');
    
    switch (theme) {
        case 'light':
            document.documentElement.setAttribute('data-theme', 'dark');
            document.cookie = `theme=dark`;
            break;
        case 'dark':
            document.documentElement.setAttribute('data-theme', 'light');
            document.cookie = `theme=light`;
            break;
    }
}

function onLoad() {
    let color = getCookie('color');
    if (color === '') color = 'yellow';
    
    document.cookie = `color=${color}`;
    
    const link = document.getElementsByTagName('link')[2];
    link.href = `design/color/${color}.css`;

    const radioButtons = document.getElementsByName('color');

    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].value === color) {
            radioButtons[i].checked = true;
        }
    }

    let theme = getCookie('theme');
    if (theme === '') theme = 'dark';

    document.cookie = `theme=${theme};`;

    document.documentElement.setAttribute('data-theme', theme);
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}