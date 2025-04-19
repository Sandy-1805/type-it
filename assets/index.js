const counter = document.querySelector(".counter");
const loadingbar = document.querySelector(".loading-bar-front");
const loading_bars = document.querySelector('.loading-bars');

//Pour accummuler la longueur de la bar de loading
let distance = 0;

let changePourcentage = () => {
    counter.innerText = `${distance}%`;
    loadingbar.style.width = `${distance}%`;
    distance++;
    if (distance <= 100) {
        setTimeout(changePourcentage, 30);
    }
    if (distance === 100) {
        loading_bars.style.display = 'none';
        counter.style.display = 'none';
        location.href = "./index.html";
    }
}
changePourcentage();