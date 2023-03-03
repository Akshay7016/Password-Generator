const inputSlider = document.querySelector("[data-lengthSlider]")
const lengthDisplay = document.querySelector("[data-lengthNumber]")
const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generateButton")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// initial data
let password = "";
let passwordLength = 10;
let checkCount = 0;
setIndicator("#ccc")
handleSlider();


function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.textContent = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

const getRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

const generateRandomNumber = () => {
    return getRandomInteger(0, 9)
}

const generateLowerCase = () => {
    return String.fromCharCode(getRandomInteger(97, 123));
}

const generateUpperCase = () => {
    return String.fromCharCode(getRandomInteger(65, 91));
}

const generateSymbol = () => {
    const num = getRandomInteger(0, symbols.length);
    return symbols.charAt(num);
}

const calculatepasswordStrength = () => {
    let hasUpper = uppercaseCheck.checked ? true : false;
    let hasLower = lowercaseCheck.checked ? true : false;
    let hasNum = numbersCheck.checked ? true : false;
    let hasSymbol = symbolsCheck.checked ? true : false;

    if (hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

const copyContent = async () => {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.textContent = "Copied";
    } catch (error) {
        copyMsg.textContent = "Failed"
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

const shufflePassword = (array) => {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

const handleCheckBoxChange = () => {
    checkCount = 0;

    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    })

    // special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// event listener
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
})

// event listener
inputSlider.addEventListener("input", (event) => {
    passwordLength = event.target.value;
    handleSlider();
})

// event listener
copyBtn.addEventListener("click", () => {
    // id password is there then copy
    if (passwordDisplay.value) {
        copyContent();
    }
})

// event listener
generateBtn.addEventListener("click", () => {
    if (checkCount === 0) {
        return;
    }

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    let functionArray = [];

    if (uppercaseCheck.checked) {
        functionArray.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        functionArray.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        functionArray.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        functionArray.push(generateSymbol);
    }

    // compulsory addition
    for (let i = 0; i < functionArray.length; i++) {
        password += functionArray[i]();
    }

    // remaining addition
    for (let i = 0; i < passwordLength - functionArray.length; i++) {
        let randomIndex = getRandomInteger(0, functionArray.length);
        password += functionArray[randomIndex]();
    }

    // now shuffle password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    calculatepasswordStrength();
})