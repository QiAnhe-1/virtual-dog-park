/* ===========================================================
   Virtual Dog Park – script.js
   Round 3 功能 + 互动动画（烟花 / 饼干雨 / 毛绒球雨 / 日月交替）
   + 快乐表情（笑脸 / 瘪嘴脸 / 哭脸）
   =========================================================== */

// ---- Constants ----
// 浏览器 localStorage 的存储键名
const STORAGE_KEY = "virtualDogParkPetV1";

// 品种 → 本地 SVG 图片路径
const BREED_IMAGES = {
    "Beagle": "assets/beagle.svg",
    "Golden Retriever": "assets/golden-retriever.svg",
    "Poodle": "assets/poodle.svg"
};

// ---- State variable ----
let dog = null;

// ---- DOM references ----
const adoptionForm   = document.getElementById("adoption-form");
const breedSelect    = document.getElementById("breed-select");
const dogNameInput   = document.getElementById("dog-name-input");
const nameError      = document.getElementById("name-error");
const adoptBtn       = document.getElementById("adopt-btn");

const dogStatus      = document.getElementById("dog-status");
const dogImage       = document.getElementById("dog-image");
const dogNameDisplay = document.getElementById("dog-name-display");
const dogBreed       = document.getElementById("dog-breed");
const dogDay         = document.getElementById("dog-day");
const dogStage       = document.getElementById("dog-stage");
const dogHappiness   = document.getElementById("dog-happiness");
const growthBarFill  = document.querySelector(".growth-bar-fill");
const actionMessage  = document.getElementById("action-message");
const sunDecor       = document.getElementById("sun-decor");

const feedBtn        = document.getElementById("feed-btn");
const playBtn        = document.getElementById("play-btn");
const nextDayBtn     = document.getElementById("next-day-btn");
const restartBtn     = document.getElementById("restart-btn");


/* ===========================================================
   动画工具函数（纯视觉，不影响数据逻辑）
   =========================================================== */

/**
 * 在指定按钮附近放一串烟花。
 * 原理：拿到按钮在屏幕上的中心坐标，在那里生成若干个小元素，
 * 每个元素带随机的 --dx / --dy 位移变量，由 CSS 动画向外飞散。
 */
function launchFireworks(button, symbols) {
    const rect = button.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const particleCount = 18;

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement("span");
        p.className = "firework-particle";
        p.textContent = symbols[Math.floor(Math.random() * symbols.length)];

        // 随机方向 + 随机距离
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
        const distance = 60 + Math.random() * 70;

        p.style.left = cx + "px";
        p.style.top = cy + "px";
        p.style.setProperty("--dx", Math.cos(angle) * distance + "px");
        p.style.setProperty("--dy", Math.sin(angle) * distance + "px");
        p.style.fontSize = (0.9 + Math.random() * 0.8) + "rem";

        document.body.appendChild(p);

        // 动画结束后移除，避免 DOM 越积越多
        setTimeout(function () {
            if (p.parentNode) p.parentNode.removeChild(p);
        }, 900);
    }
}

/**
 * 从屏幕顶部撒下一场"雨"。
 * emoji 参数决定是饼干还是毛绒球。
 */
function startRain(emojiArray) {
    const itemCount = 26;

    for (let i = 0; i < itemCount; i++) {
        const item = document.createElement("span");
        item.className = "rain-item";
        item.textContent = emojiArray[Math.floor(Math.random() * emojiArray.length)];

        item.style.left = Math.random() * 100 + "vw";
        item.style.fontSize = (1.2 + Math.random() * 1.4) + "rem";
        item.style.animationDuration = (2.2 + Math.random() * 2) + "s";
        item.style.animationDelay = (Math.random() * 0.8) + "s";

        document.body.appendChild(item);

        setTimeout(function () {
            if (item.parentNode) item.parentNode.removeChild(item);
        }, 5200);
    }
}

/**
 * 全屏播放一次"日月交替"：太阳升起落下 → 天空变暗 → 月亮升起落下。
 * 同时更新状态卡上的太阳装饰（变成月亮并移动位置）。
 */
function playDayNightCycle() {
    // 1. 更新状态卡上的太阳装饰
    if (sunDecor) {
        sunDecor.classList.add("night");
        sunDecor.textContent = "🌙";
        
        // 2 秒后恢复为太阳
        setTimeout(function () {
            sunDecor.classList.remove("night");
            sunDecor.textContent = "☀️";
        }, 2400);
    }

    // 2. 全屏遮罩动画
    const overlay = document.createElement("div");
    overlay.className = "day-night-overlay";

    const sun = document.createElement("span");
    sun.className = "sun-moon sun";
    sun.textContent = "☀️";

    const moon = document.createElement("span");
    moon.className = "sun-moon moon";
    moon.textContent = "🌙";

    overlay.appendChild(sun);
    overlay.appendChild(moon);

    // 点缀几颗星星
    for (let i = 0; i < 12; i++) {
        const star = document.createElement("span");
        star.className = "cycle-star";
        star.textContent = Math.random() > 0.5 ? "✦" : "✧";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.animationDelay = (Math.random() * 1.2) + "s";
        overlay.appendChild(star);
    }

    document.body.appendChild(overlay);

    setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 2400);
}


/* ===========================================================
   LOCAL STORAGE FUNCTIONS
   数据保存在浏览器 localStorage 中（键名 virtualDogParkPetV1），
   只存在于本机浏览器，不会上传，也不会被 Git 提交。
   =========================================================== */

function saveDog() {
    if (dog) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dog));
    }
}

function loadDog() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        try {
            dog = JSON.parse(savedData);
            adoptionForm.classList.add("hidden");
            dogStatus.classList.remove("hidden");
            updateDisplay();
        } catch (e) {
            console.error("Failed to parse saved dog data", e);
            localStorage.removeItem(STORAGE_KEY);
        }
    }
}

function clearSavedData() {
    localStorage.removeItem(STORAGE_KEY);
    dog = null;
}


/* ===========================================================
   CORE LOGIC FUNCTIONS
   =========================================================== */

function getGrowthStage(day) {
    if (day <= 1) return "Puppy";
    if (day <= 3) return "Young Dog";
    return "Adult Dog";
}

/**
 * 根据快乐值返回对应的表情符号。
 * > 80 笑脸，< 40 哭脸，其余瘪嘴脸。
 */
function getMoodFace(happiness) {
    if (happiness > 80) return "😄";
    if (happiness < 40) return "😢";
    return "😐";
}

function updateDisplay() {
    if (!dog) return;

    // 1. 图片与基础文字（用 textContent 安全输出）
    dogImage.src = BREED_IMAGES[dog.breed];
    dogImage.alt = "Illustration of a " + dog.breed;

    dogNameDisplay.textContent = dog.name;
    dogBreed.textContent = dog.breed;
    dogDay.textContent = dog.day;

    // 快乐值 + 表情（表情作为独立 span，不影响 happiness 数值本身）
    dogHappiness.textContent = dog.happiness;

    let moodFace = document.getElementById("mood-face");
    if (!moodFace) {
        moodFace = document.createElement("span");
        moodFace.id = "mood-face";
        moodFace.className = "mood-face";
        dogHappiness.parentNode.appendChild(moodFace);
    }
    moodFace.textContent = getMoodFace(dog.happiness);
    moodFace.title = "Happiness mood";

    // 2. 成长阶段文字（不只靠颜色/大小说明阶段）
    const stage = getGrowthStage(dog.day);
    dogStage.textContent = stage;

    // 3. 成长可视化：图片尺寸 + 进度条
    dogImage.classList.remove("dog-img-puppy", "dog-img-young", "dog-img-adult");

    if (stage === "Puppy") {
        dogImage.classList.add("dog-img-puppy");
        growthBarFill.style.width = "33%";
    } else if (stage === "Young Dog") {
        dogImage.classList.add("dog-img-young");
        growthBarFill.style.width = "66%";
    } else {
        dogImage.classList.add("dog-img-adult");
        growthBarFill.style.width = "100%";
    }
}

function validateName(rawName) {
    const trimmed = rawName.trim();
    if (trimmed.length === 0) {
        return { valid: false, name: "", error: "Please enter a name for your dog." };
    }
    if (trimmed.length > 20) {
        return { valid: false, name: trimmed, error: "Name must be 20 characters or fewer." };
    }
    return { valid: true, name: trimmed, error: "" };
}

let messageTimer = null;
function showActionMessage(text) {
    actionMessage.textContent = text;
    if (messageTimer) clearTimeout(messageTimer);
    messageTimer = setTimeout(function () {
        actionMessage.textContent = "";
    }, 2500);
}


/* ===========================================================
   EVENT LISTENERS
   =========================================================== */

// 1. Adopt
adoptBtn.addEventListener("click", function () {
    const result = validateName(dogNameInput.value);

    if (!result.valid) {
        nameError.textContent = result.error;
        return;
    }

    nameError.textContent = "";

    dog = {
        name: result.name,
        breed: breedSelect.value,
        day: 1,
        happiness: 50
    };

    saveDog();

    adoptionForm.classList.add("hidden");
    dogStatus.classList.remove("hidden");

    updateDisplay();
    showActionMessage("Welcome home, " + dog.name + "! 🐾");
});

// 2. Feed —— 烟花 + 饼干雨
feedBtn.addEventListener("click", function () {
    if (!dog) return;

    if (dog.happiness >= 100) {
        showActionMessage(dog.name + " is already super happy! 😊");
        return;
    }

    dog.happiness = Math.min(dog.happiness + 10, 100);
    saveDog();
    updateDisplay();
    showActionMessage(dog.name + " enjoyed the meal! +10 happiness 🍖");

    // 视觉反馈
    launchFireworks(feedBtn, ["✨", "🎉", "⭐", "💫"]);
    startRain(["🍪", "🍪", "🦴", "🍪"]);
});

// 3. Play —— 烟花 + 毛绒球雨
playBtn.addEventListener("click", function () {
    if (!dog) return;

    if (dog.happiness >= 100) {
        showActionMessage(dog.name + " is already super happy! 😊");
        return;
    }

    dog.happiness = Math.min(dog.happiness + 10, 100);
    saveDog();
    updateDisplay();
    showActionMessage(dog.name + " had fun playing! +10 happiness 🎾");

    // 视觉反馈
    launchFireworks(playBtn, ["🎊", "✨", "🌟", "💖"]);
    startRain(["🧶", "⚽", "🎾", "🧸", "🧶"]);
});

// 4. Next Day —— 日月交替
nextDayBtn.addEventListener("click", function () {
    if (!dog) return;

    dog.day += 1;
    dog.happiness = Math.max(dog.happiness - 5, 0);
    saveDog();
    updateDisplay();

    const stage = getGrowthStage(dog.day);
    showActionMessage("Day " + dog.day + "! " + dog.name + " is now a " + stage + ". 🌅");

    // 视觉反馈
    playDayNightCycle();
});

// 5. Start Over
restartBtn.addEventListener("click", function () {
    if (!dog) return;

    const confirmed = confirm(
        "Are you sure you want to start over? This will permanently delete " + dog.name + "'s progress."
    );

    if (confirmed) {
        clearSavedData();

        dogStatus.classList.add("hidden");
        adoptionForm.classList.remove("hidden");
        dogNameInput.value = "";
        nameError.textContent = "";
    }
});


/* ===========================================================
   STARTUP —— 页面加载时立刻尝试从 localStorage 恢复狗狗
   =========================================================== */
loadDog();
console.log("Virtual Dog Park loaded – Round 3 + animations ready.");