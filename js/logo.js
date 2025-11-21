const logoText = "LUXXCATALOG";
const logo = document.getElementById('logo');
const fonts = ['Experimento', 'GadetyperRegular', 'timesnewarial'];

function randomizeLogo() {
    logo.innerHTML = '';
    for (let char of logoText) {
        const span = document.createElement('span');
        span.classList.add('letter');
        span.textContent = char;
        span.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
        logo.appendChild(span);
    }
}

window.addEventListener('load', () => {
    randomizeLogo();
    setInterval(randomizeLogo, 117);
});
