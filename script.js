/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
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
const startTest = (wordCount = 50) => {
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
        mot_span.textContent = word;
        if (index < wordsToType.length) {
            mot_span.textContent += " ";
        }
        else {
            mot_span.textContent += ".";
        }
        
        if (index === 0) mot_span.style.color = "red"; // Highlight first word
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
    if (event.key === " ") { // Check if spacebar is pressed
        if (inputField.value.trim() === wordsToType[currentWordIndex]) {
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

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black";
        }
        wordElements[currentWordIndex].style.color = "red";
    }
};
// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
}); 
modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();

const howToPlay = document.querySelector('.navbar_play');
howToPlay.addEventListener('click', () => {
    const showToPlay = document.createElement('div');
    showToPlay.className = 'show_how_to_play';
    showToPlay.innerHTML = `
        <div class="show_content">
            <h2>How to Play</h2>
            <br>
            <br>
            <p>Type correctly on the entered words.
            Once all the words have been typed, press the space bar to move to the next word.</p>
            <br>
            <br>
            <p>There are three levels of difficulties:
            <span style="color: green">Easy</span>
            --><span style="color: orange">Medium</span> 
            --><span style="color: red">Hard</span>
            </p>
            <p>Choose wisely ! </p>
            <br>
            <br>
            <p><span>WARNING!</span></p>
            <p>One mistake and you restart from the beginning</p>
            <button class="close_content">OK</button>
        </div>
    `;
    document.body.appendChild(showToPlay);
    const closeBtn = showToPlay.querySelector('.close_content');
    closeBtn.addEventListener('click', () => {
        showToPlay.remove();
    });
});

const aboutIt = document.querySelector('.navbar_about');
aboutIt.addEventListener('click', () => {
    const showAbout = document.createElement('div');
    showAbout.className = 'show_about';
    showAbout.innerHTML = `
        <div class="show_about_content">
            <h2>About Type-IT</h2>
            <br>
            <br>
            <p style="font-size: xx-large">"type-it" is a site that allows you to evaluate 
            your typing speed without making mistakes.</p>
            <br>
            <br>
            <p>Our goal is to help you type faster, that's all.</p>
            <br>
            <br>
            <button class="close_content">OK</button>
        </div>
    `;
    document.body.appendChild(showAbout);
    const closeBtn = showAbout.querySelector('.close_content');
    closeBtn.addEventListener('click', () => {
        showAbout.remove();
    });
});