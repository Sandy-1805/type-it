/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let mot_precedant = "";
let mot_venant_backspace = false;
let currentWordIndex = 0;
let currentLetterIndex = 0;
const wordsToType = [];
const letterStatus = [];

const modeSelect = document.getElementById("mode-header");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialize the typing test
const startTest = (wordCount = 20) => {
    wordDisplay.innerHTML = ""; // Clear display
    wordsToType.length = 0; // Clear previous words
    startTime = null;
    previousEndTime = null;

    currentWordIndex = 0;
    currentLetterIndex = 0;

    if (modeSelect.value === "easy") {
        wordCount = 20;
    }
    else if (modeSelect.value === "medium") {
        wordCount = 45;
    }
    else if (modeSelect.value === "hard") {
        wordCount = 50
    }

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    //Commence un mot par une majuscule
    let letterCapitalize = (str) => {
        let result = "";

        for (let i = 0; i < str.length; i++) {
            if (i === 0) {
                result += str[i].toUpperCase();
            }
            else {
                result += str[i];
            }
        }
        return result;
    }
    wordsToType[0] = letterCapitalize(wordsToType[0]);

    for (let i = 0; i < wordsToType.length; i++) {
        letterStatus[i] = [];

        for (let j = 0; j < wordsToType[i].length; j++) {
            letterStatus[i][j] = wordsToType[i];
            letterStatus[i].push(letterStatus[i][j]);
        }
        letterStatus.push(letterStatus[i]);
    }

    displayWords();
    inputField.value = "";
    results.textContent = "";
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

let displayWords = () => {
    wordDisplay.innerHTML = "";

    wordsToType.forEach((word, index) => {
        const wordSpan = document.createElement("span");

        if (index === currentWordIndex) {
            wordSpan.classList.add("mot-actuelle");
        }

        word.split("").forEach((char, charIndex) => {
            const charSpan = document.createElement("span");
            charSpan.className = "letter";
            charSpan.textContent = char;

            if (letterStatus[index][charIndex] !== null) {
                charSpan.classList.add(letterStatus[index][charIndex]);
            }

            if (index === currentWordIndex && charIndex === currentLetterIndex) {
                charSpan.classList.add("current");
            }

            wordSpan.appendChild(charSpan);
        });
        wordDisplay.appendChild(wordSpan);
        wordDisplay.appendChild(document.createTextNode(" "));
    });
}

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    if (!startTime) {
        return { wpm: 0, accuracy: 0 };
    }
    const elapsedTime = (Date.now() - startTime) / (1000 * 60); // Seconds

    let totalChars = 0;
    let correctChars = 0;
    let spaceCount = 0;

    for (let i = 0; i < currentWordIndex; i++) {
        totalChars += wordsToType[i].length + 1;
        correctChars += wordsToType[i].length;
    }

    const valeur_entrer = inputField.value;
    const mot_actuelle = wordsToType[currentWordIndex];

    totalChars += valeur_entrer.length;

    if (valeur_entrer.includes(' ')) {
        spaceCount++;
    }

    for (let i = 0; i < valeur_entrer.length; i++) {
        if (i < mot_actuelle.length && valeur_entrer[i] === mot_actuelle[i]) {
            correctChars++;
        }
    }

    const wpm = ((totalChars + spaceCount) / 5) / (elapsedTime); // 5 chars = 1 word
    const accuracy = (correctChars / totalChars) * 100;

    return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    const valeur_entrer = inputField.value;
    const mot_actuelle = wordsToType[currentWordIndex];

    if (event.key === " " && valeur_entrer.trim().length === mot_actuelle.length) {
        event.preventDefault();

        if (!startTime) startTime = Date.now();

        const { wpm, accuracy } = getCurrentStats();

        const mot_wpm = document.querySelector("#wpm");
        const mot_accuracy = document.querySelector("#accuracy");

        const progres_title_win = document.querySelector(".progression-win");
        const progres_icon_win = document.querySelector(".progres-icon-win");
        const progres_title_lose = document.querySelector(".progression-lose");
        const progres_icon_lose = document.querySelector(".progres-icon-lose");

        results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;
        mot_wpm.innerText = `WPM: ${wpm}`;
        mot_accuracy.innerText = `ACCURACY: ${accuracy}%`;

        if (accuracy >= 70) {
            progres_title_lose.classList.add("not-display");
            progres_icon_lose.classList.add("not-display");
        }
        else if (accuracy < 70) {
            progres_title_win.classList.add("not-display");
            progres_icon_win.classList.add("not-display");
        }

        currentWordIndex++;
        inputField.value = "";  // Clear input field after space
        displayWords();
    }
};

// Highlight the current word in bacground-color 
const highlightNextWord = () => {
    const valeur_entrer = inputField.value;
    const mot_actuelle = wordsToType[currentWordIndex];
    // currentLetterIndex = valeur_entrer.length

    if (!letterStatus[currentWordIndex]) {
        letterStatus[currentWordIndex] = [];
    }

    for (let i = 0; i < valeur_entrer.length; i++) {
        if (i < mot_actuelle.length) {
            if (valeur_entrer[i] === mot_actuelle[i]) {
                letterStatus[currentWordIndex][i] = "correct";
            } else {
                letterStatus[currentWordIndex][i] = "incorrect";
            }
        }
    }

    for (let i = valeur_entrer.length; i < mot_actuelle.length; i++) {
        letterStatus[currentWordIndex][i] = null;
    }

    if (valeur_entrer.endsWith(" ") && valeur_entrer.trim().length === mot_actuelle.length) {
        currentWordIndex++;
        currentLetterIndex = 0;
        inputField.value = "";
    }
    displayWords();
};

//mode d' effacement des mots apres un backspace
const efface_mot = (e) => {
    let valeur_entrer = inputField.value;

    if ((valeur_entrer.length === 0) && (e.key === 'Backspace') && (currentWordIndex > 0)) {
        //Revenir au mot precedant avec un backspace
        currentWordIndex--;
        currentLetterIndex = wordsToType[currentWordIndex].length;
        inputField.value = wordsToType[currentWordIndex];
        mot_venant_backspace = true;

        // Mettre à jour l'affichage
        displayWords();
        e.preventDefault(); // Empêcher le comportement par défaut du backspace
    }
    else {
        mot_venant_backspace = false;
    }
}

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
});

inputField.addEventListener('keydown', efface_mot);
inputField.addEventListener('input', highlightNextWord)
modeSelect.addEventListener("change", () => startTest());

inputField.addEventListener("keydown", (e) => {
    let alphabet = "qwertyuiopasdfghjklzxcvbnm".split("");
    const touchs = document.querySelectorAll(".touch");
    for (let i = 0; i < 26; i++) {
        if (e.key === touchs[i].innerText.toLowerCase() || e.key === alphabet[i]) {
            touchs[i].classList.add("clicked");
            setTimeout(() => {
                touchs[i].classList.remove("clicked");
            }, 2000);
        }
    }
})

document.addEventListener('DOMContentLoaded', () => {
    let counter = document.querySelector("#count-down");

    const count_a_rebour = (count) => {
        counter.innerText = `${count}s`;
        count--;

        setTimeout(() => {
            counter.innerText = `${count}s`;

            if (count <= 0) {
                const resultats_to_display = document.querySelector(".resultats");
                resultats_to_display.classList.add("resultat-display");
                return;
            }
            count_a_rebour(count);
        }, 1000)
    }
    count_a_rebour(60);
});

const menu = document.querySelector("#menu-bars");
const navbar = document.querySelector(".navbar");
menu.addEventListener('click', () => {
    navbar.classList.toggle("navbar-display");
})

const help = document.querySelector(".help-container");
const button_interrogation = document.querySelector(".interrogation");
const footer = document.querySelector("footer");
const button_to_footer = document.querySelector(".description");

button_interrogation.addEventListener("click", () => {
    navbar.classList.remove("navbar-display");
    help.classList.toggle("help-display");
    footer.classList.remove("footer-display");
});

button_to_footer.addEventListener('click', () => {
    navbar.classList.remove("navbar-display");
    footer.classList.toggle("footer-display");
    help.classList.remove("help-display");
})

// Start the test
startTest();