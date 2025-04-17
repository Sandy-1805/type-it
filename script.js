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

const modeSelect = document.getElementById("mode");
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
const startTest = (wordCount = 5) => {
    wordDisplay.innerHTML = ""; // Clear display
    wordsToType.length = 0; // Clear previous words
    startTime = null;
    previousEndTime = null;

    currentWordIndex = 0;
    currentLetterIndex = 0;

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
    // wordsToType.forEach((word, index) => {
    //     const mot_span = document.createElement("span");
    //     mot_span.className = "mot";
    //     mot_span.style.color = "var(--text-color)";

    //     if (index === currentWordIndex) {
    //         mot_span.classList.add("mot-actuelle");
    //     }

    //     for (let i = 0; i < word.length; i++) {
    //         const lettre_span = document.createElement('span');
    //         lettre_span.className = "lettre";
    //         lettre_span.textContent = word[i];

    //         if (index < currentWordIndex) {
    //             lettre_span.classList.add("correct");
    //         }
    //         else if (index === currentWordIndex) {
    //             if (i === currentLetterIndex) {
    //                 lettre_span.classList.add("lettre-actuelle");
    //             }
    //             if (i < currentLetterIndex) {
    //                 const ecrire_lettre = inputField.value[i];
    //                 if (ecrire_lettre === word[i] || mot_venant_backspace) {
    //                     lettre_span.classList.add("correct");
    //                 } else if (ecrire_lettre !== word[i]) {
    //                     lettre_span.classList.add("incorrect");
    //                 }
    //             }
    //         }
    //         mot_span.appendChild(lettre_span);
    //     }
    //     // if (index < (wordsToType.length - 1)) {
    //     //     mot_span.textContent += " ";
    //     // }
    //     // else {
    //     //     mot_span.textContent += ".";
    //     // }
    //     // mot_span.style.color = "gray";
    //     // if (index === 0) {
    //     //     mot_span.style.color = "green"; // Highlight first word 
    //     // }
    //     wordDisplay.appendChild(mot_span);
    // });

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
    const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60); // 5 chars = 1 word
    const accuracy = (wordsToType[currentWordIndex].length / inputField.value.length) * 100;

    return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    const valeur_entrer = inputField.value;
    const mot_actuelle = wordsToType[currentWordIndex];

    if (event.key === " " && valeur_entrer.length === mot_actuelle.length) { // Check if spacebar is pressed
        if (valeur_entrer.trim() === mot_actuelle) {
            if (!previousEndTime) previousEndTime = startTime;
            const { wpm, accuracy } = getCurrentStats();
            results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;

            currentWordIndex++;
            previousEndTime = Date.now();
            highlightNextWord();

            inputField.value = ""; // Clear input field after space
            event.preventDefault(); // Prevent adding extra spaces
        }
    }
};

// Highlight the current word in bacground-color 
const highlightNextWord = () => {
    const valeur_entrer = inputField.value;
    const mot_actuelle = wordsToType[currentWordIndex];
    currentLetterIndex = valeur_entrer.length

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

    if (currentWordIndex < (wordsToType.length - 1)) {
        if (valeur_entrer === mot_actuelle + " " || ((valeur_entrer + " ").length === (mot_actuelle + " ").length)) {
            currentWordIndex++;
            currentLetterIndex = 0;
            inputField.value = "";
        }
    }

    displayWords();
    // const wordElements = wordDisplay.children;

    // if (currentWordIndex <= wordElements.length) {
    //     if (currentWordIndex > 0) { // (currentWordIndex < 0)
    //         wordElements[currentWordIndex - 1].style.color = "var(--primary-color)";
    //     }
    //     // wordElements[currentWordIndex].style.color = "green";// specifier le mot actuelle
    // }
    // mot_precedant = inputField.value;
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

// Start the test
startTest();

// const counter = document.querySelector(".counter"); 
// const start = documnet.querySelector(".start"); 
// start.addEventListener('click', () => {
//     start.style.display = 'none';
//     counter.style.display = 'inline-block';
    
//     const count_a_rebour = (count) => {
//         counter.classList.add("count-a-rebour");
//         counter.innerText = `${count}`;

//         count--;
//         setTimeout(() => {
//             counter.innerText = count;
//             if (count === 0) {
//                 counter.innerText = 'GO!';
//                 startTest();
//             }
//             count_a_rebour(count);
//         }, 1000)
//     }
//     count_a_rebour(3);
// });
// Récupère le bouton
const theme = document.getElementById("themeButton");

// Au clic, change le thème
theme.addEventListener("click", function() {
    // Si le body a la classe light-mode
    if (document.body.classList.contains("light-mode")) {
        // Passer en mode sombre
        document.body.classList.remove("light-mode");
        theme.textContent = "Light Mode"; // Change l'emoji
        localStorage.setItem("theme", "dark"); // Sauvegarde
    } else {
        // Passer en mode clair
        document.body.classList.add("light-mode");
        theme.textContent = "Dark Mode"; // Change l'emoji
        localStorage.setItem("theme", "light"); // Sauvegarde
    }
});

// Vérifie le thème sauvegardé au chargement
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    theme.textContent = "Dark Mode";
} else {
    document.body.classList.remove("light-mode");
    theme.textContent = "Light Mode";
}