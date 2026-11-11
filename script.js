/* ===========================================================
   Virtual Dog Park – Round 2: Adoption, Feed, Play, Next Day
   =========================================================== */

// ---- Breed image mapping ----
// Maps each breed name to its local SVG file path.
const BREED_IMAGES = {
    "Beagle": "assets/beagle.svg",
    "Golden Retriever": "assets/golden-retriever.svg",
    "Poodle": "assets/poodle.svg"
};

// ---- State variable ----
// Holds the current dog object, or null if no dog has been adopted.
let dog = null;

// ---- DOM references ----
const adoptionForm  = document.getElementById("adoption-form");
const breedSelect   = document.getElementById("breed-select");
const dogNameInput  = document.getElementById("dog-name-input");
const nameError     = document.getElementById("name-error");
const adoptBtn      = document.getElementById("adopt-btn");

const dogStatus     = document.getElementById("dog-status");
const dogImage      = document.getElementById("dog-image");
const dogNameDisplay = document.getElementById("dog-name-display");
const dogBreed      = document.getElementById("dog-breed");
const dogDay        = document.getElementById("dog-day");
const dogStage      = document.getElementById("dog-stage");
const dogHappiness  = document.getElementById("dog-happiness");
const actionMessage = document.getElementById("action-message");

const feedBtn     = document.getElementById("feed-btn");
const playBtn     = document.getElementById("play-btn");
const nextDayBtn  = document.getElementById("next-day-btn");


/* -----------------------------------------------
   FUNCTION: getGrowthStage(day)
   Determines the growth stage based on the day number.
   Day 1 = Puppy, Days 2-3 = Young Dog, Day 4+ = Adult Dog.
----------------------------------------------- */
function getGrowthStage(day) {
    if (day <= 1) return "Puppy";
    if (day <= 3) return "Young Dog";
    return "Adult Dog";
}


/* -----------------------------------------------
   FUNCTION: updateDisplay()
   Refreshes every piece of text on the dog status
   panel so it matches the current dog state.
   Uses textContent (safe) instead of innerHTML.
----------------------------------------------- */
function updateDisplay() {
    if (!dog) return;

    // Set the dog image
    dogImage.src = BREED_IMAGES[dog.breed];
    dogImage.alt = "Illustration of a " + dog.breed;

    // Set text fields safely with textContent
    dogNameDisplay.textContent = dog.name;
    dogBreed.textContent = dog.breed;
    dogDay.textContent = dog.day;
    dogStage.textContent = getGrowthStage(dog.day);
    dogHappiness.textContent = dog.happiness;
}


/* -----------------------------------------------
   FUNCTION: showActionMessage(text)
   Displays a short feedback message below the
   action buttons. The message clears automatically
   after 2 seconds.
----------------------------------------------- */
let messageTimer = null;

function showActionMessage(text) {
    actionMessage.textContent = text;
    // Clear any previous timer so messages don't overlap
    if (messageTimer) clearTimeout(messageTimer);
    messageTimer = setTimeout(function () {
        actionMessage.textContent = "";
    }, 2000);
}


/* -----------------------------------------------
   FUNCTION: validateName(rawName)
   Checks the entered name against the rules:
     - Not empty after trimming whitespace
     - At most 20 characters (after trimming)
   Returns an object: { valid: true/false, name: trimmed name, error: message }
----------------------------------------------- */
function validateName(rawName) {
    var trimmed = rawName.trim();

    if (trimmed.length === 0) {
        return { valid: false, name: "", error: "Please enter a name for your dog." };
    }
    if (trimmed.length > 20) {
        return { valid: false, name: trimmed, error: "Name must be 20 characters or fewer." };
    }
    return { valid: true, name: trimmed, error: "" };
}


/* -----------------------------------------------
   EVENT: Adopt button click
   Validates the name, creates a new dog object
   with starting values, and switches the view
   from the adoption form to the dog status panel.
----------------------------------------------- */
adoptBtn.addEventListener("click", function () {
    var result = validateName(dogNameInput.value);

    if (!result.valid) {
        // Show the error message and stop
        nameError.textContent = result.error;
        return;
    }

    // Clear any previous error
    nameError.textContent = "";

    // Create the dog with starting state
    dog = {
        name: result.name,
        breed: breedSelect.value,
        day: 1,
        happiness: 50
    };

    // Switch views
    adoptionForm.classList.add("hidden");
    dogStatus.classList.remove("hidden");

    // Populate the status panel
    updateDisplay();
    showActionMessage("Welcome home, " + dog.name + "! 🐾");
});


/* -----------------------------------------------
   EVENT: Feed button click
   Increases happiness by 10, capped at 100.
----------------------------------------------- */
feedBtn.addEventListener("click", function () {
    if (!dog) return;

    if (dog.happiness >= 100) {
        showActionMessage(dog.name + " is already super happy! 😊");
        return;
    }

    dog.happiness = Math.min(dog.happiness + 10, 100);
    updateDisplay();
    showActionMessage(dog.name + " enjoyed the meal! +10 happiness 🍖");
});


/* -----------------------------------------------
   EVENT: Play button click
   Increases happiness by 10, capped at 100.
----------------------------------------------- */
playBtn.addEventListener("click", function () {
    if (!dog) return;

    if (dog.happiness >= 100) {
        showActionMessage(dog.name + " is already super happy! 😊");
        return;
    }

    dog.happiness = Math.min(dog.happiness + 10, 100);
    updateDisplay();
    showActionMessage(dog.name + " had fun playing! +10 happiness 🎾");
});


/* -----------------------------------------------
   EVENT: Next Day button click
   Advances the day counter by 1 and decreases
   happiness by 5, with a minimum of 0.
----------------------------------------------- */
nextDayBtn.addEventListener("click", function () {
    if (!dog) return;

    dog.day += 1;
    dog.happiness = Math.max(dog.happiness - 5, 0);
    updateDisplay();
    showActionMessage("It's now Day " + dog.day + ". " + dog.name + " is a " + getGrowthStage(dog.day) + "! 🌅");
});


// ---- Startup ----
console.log("Virtual Dog Park loaded – Round 2: Adoption & Care ready.");