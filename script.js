/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
let currentLettreIndex = 0;
let mot_precedant = "";
let mot_venant_backspace = false;
const wordsToType = [];

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
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;

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

    wordsToType.forEach((word, index) => {
        const mot_span = document.createElement("span");
        mot_span.className = "mot";
        mot_span.style.color = "white";
        
        if (index === currentWordIndex) {
            mot_span.classList.add("mot-actuelle");
        }
        
        for (let i = 0; i < word.length; i++) {
            const lettre_span = document.createElement('span');
            lettre_span.className = "lettre";
            lettre_span.textContent = word[i];
            
            if (index < currentWordIndex) {
                // lettre_span.style.color = "yellow";
                lettre_span.classList.add("correct");
            }
            else if (index === currentWordIndex) {
                if (i === currentLettreIndex) {
                    lettre_span.classList.add("lettre-actuelle");
                }
                if (i < currentLettreIndex) {
                    const ecrire_lettre = inputField.value[i];
                    if (ecrire_lettre === word[i] || mot_venant_backspace) {
                        lettre_span.classList.add("correct");
                    } else if (ecrire_lettre !== word[i]) {
                        lettre_span.classList.add("incorrect");
                    }
                }
            }
            mot_span.appendChild(lettre_span);
        }
        // if (index < (wordsToType.length - 1)) {
        //     mot_span.textContent += " ";
        // }
        // else {
        //     mot_span.textContent += ".";
        // }
        // mot_span.style.color = "gray";
        // if (index === 0) {
        //     mot_span.style.color = "green"; // Highlight first word 
        // }
        wordDisplay.appendChild(mot_span);
    });

    inputField.value = "";
    results.textContent = "";
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

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

// Highlight the current word in red
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex <= wordElements.length) {
        if (currentWordIndex > 0) { // (currentWordIndex < 0)
            wordElements[currentWordIndex - 1].style.color = "yellow";
        }
        // wordElements[currentWordIndex].style.color = "green";// specifier le mot actuelle
    }
    mot_precedant = inputField.value;
};

//mode d' effacement des mots apres un backspace
const efface_mot = (e) => {
    let valeur_entrer = inputField.value;

    if ((valeur_entrer.length === 0) && (e.key === 'Backspace') && (currentWordIndex > 0)) {
        //Revenir au mot precedant avec un backspace
        currentWordIndex--;
        inputField.value = wordsToType[currentWordIndex] + " ";
        mot_venant_backspace = true;
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

modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();