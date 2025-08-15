document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'w':
        case 'W':
            event.preventDefault();
            simulateKey('ArrowUp');
            break;
        case 'a':
        case 'A':
            event.preventDefault();
            simulateKey('ArrowLeft');
            break;
        case 's':
        case 'S':
            event.preventDefault();
            simulateKey('ArrowDown');
            break;
        case 'd':
        case 'D':
            event.preventDefault();
            simulateKey('ArrowRight');
            break;
    }
});

function simulateKey(key) {
    const event = new KeyboardEvent('keydown', { key: key });
    document.dispatchEvent(event);
}