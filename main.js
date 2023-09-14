const EMPTY_STRING = '';
const ZERO = 0;
const ONE = 1;
const NEGATIVE_OF_1 = -1;
const MAX_LENGTH = 11;
const ROUNDED_INDEX = 7;
const EQUAL_CHARACTER = '=';
const PLUS_CHARACTER = '+';
const MINUS_CHARACTER = '-';
const STRING_OF_DIVIDE_BY_ZERO = "/ 0 ";
const DIVIDE_BY_ZERO_ERROR_MESSAGE = "Cannot divide by zero";
const CALCULATION_NOT_COMPLETE_ERROR_MESSAGE = "This is not a calculation";
const FONT_SIZE_ERROR = "20px";
const FONT_SIZE_BASE = "42px";
const CACHE_KEY = "calculatorMemoryCache";
const POWER_OF_E = "e+";



let toggler = document.getElementById('toggler');
let calculator = document.querySelector('.calculator');

function changeSkin() {
    if(calculator.classList.contains('dark')) {
        toggler.querySelector('#light').style.display = 'block';
        toggler.querySelector('#dark').style.display = 'none';
    } else {
        toggler.querySelector('#light').style.display = 'none';
        toggler.querySelector('#dark').style.display = 'block';
    }
}
changeSkin();

toggler.addEventListener('click', function() {
    calculator.classList.toggle('dark');
    changeSkin();
})

let operationScreen = document.getElementById('history-operation-screen');
let resultScreen = document.getElementById('result-screen');

function checkErrorMessInResultScreen () {
    if (doesHasAnError()) {
        setResultScreenAndFontSize(EMPTY_STRING, FONT_SIZE_BASE);
    }
}

function doesHasAnError() {
    const result = resultScreen.innerHTML;
    return result === DIVIDE_BY_ZERO_ERROR_MESSAGE || result === CALCULATION_NOT_COMPLETE_ERROR_MESSAGE;
}

function changeResultScreen (value) {
    checkErrorMessInResultScreen();
    if (!isNotCompleteOperationNow()) {
        clearCalculator();
    }
    resultScreen.innerHTML = formatLengthOfResult(resultScreen.innerHTML + value);
}

function formatLengthOfResult(value) {
    let newResult = value.toString();
    if (newResult.includes(POWER_OF_E)) {
        let indexOfE = newResult.indexOf(POWER_OF_E);
        if (indexOfE > ROUNDED_INDEX + ONE) {
            newResult = newResult.substring(ZERO, ROUNDED_INDEX) + newResult.substring(indexOfE).replace(PLUS_CHARACTER, EMPTY_STRING);
        } else {
            newResult = newResult.replace(PLUS_CHARACTER, EMPTY_STRING);
        }
    }
    if (newResult.length > MAX_LENGTH) {
        newResult = newResult.slice(ZERO, MAX_LENGTH);
    }
    return newResult;
}

function clearCalculator () {
    operationScreen.innerHTML = EMPTY_STRING;
    setResultScreenAndFontSize(EMPTY_STRING, FONT_SIZE_BASE);
}

function clearLastCharacter () {
    checkErrorMessInResultScreen();
    resultScreen.innerHTML = resultScreen.innerHTML.slice(ZERO, NEGATIVE_OF_1);
}

function formatLastOperator () {
    let lastOperator = resultScreen.innerHTML;
    if (lastOperator.startsWith(MINUS_CHARACTER)) {
        return `(${lastOperator})`;
    } else if (lastOperator.startsWith(PLUS_CHARACTER)) {
        return lastOperator.slice(ONE);
    } else {
        return lastOperator;
    }
}

function changeOperation (operand) {
    checkErrorMessInResultScreen();
    const lastOperator = formatLastOperator();
    if (operationScreen.innerHTML === EMPTY_STRING || !isNotCompleteOperationNow()) {
        operationScreen.innerHTML = `${lastOperator} ${operand}`;
    } else {
        try {
            let result = eval(operationScreen.innerHTML + lastOperator);
            result = formatLengthOfResult(result);
            operationScreen.innerHTML = `${result} ${operand}`;
        } catch (e) {
            operationScreen.innerHTML = operationScreen.innerHTML.slice(ZERO, NEGATIVE_OF_1) + operand;
        }
    }
    resultScreen.innerHTML = EMPTY_STRING;
}

function isNotCompleteOperationNow () {
    const currentOperationScreen = operationScreen.innerHTML;
    const lastIndex = currentOperationScreen.length - ONE;
    return currentOperationScreen.charAt(lastIndex) !== EQUAL_CHARACTER;
}

function setResultScreenAndFontSize(result, fontSize) {
    resultScreen.innerHTML = result;
    resultScreen.style.fontSize = fontSize;
}

function getResult () {
    if (resultScreen.innerHTML === EMPTY_STRING) {
        resultScreen.innerHTML = `${ZERO}`;
    }
    if (operationScreen.innerHTML === EMPTY_STRING) {
        operationScreen.innerHTML = `${resultScreen.innerHTML} ${EQUAL_CHARACTER}`;
    }
    if (isNotCompleteOperationNow()) {
        const lastOperator = formatLastOperator();
        try {
            const result = eval(operationScreen.innerHTML + lastOperator);
            resultScreen.innerHTML = formatLengthOfResult(result);
        } catch (e) {
            setResultScreenAndFontSize(CALCULATION_NOT_COMPLETE_ERROR_MESSAGE, FONT_SIZE_ERROR);
        }
        operationScreen.innerHTML = `${operationScreen.innerHTML} ${lastOperator} ${EQUAL_CHARACTER}`;
    } else {
        try {
            const result = eval(operationScreen.innerHTML.slice(ZERO, NEGATIVE_OF_1));
            resultScreen.innerHTML = formatLengthOfResult(result);
        } catch (e) {
            setResultScreenAndFontSize(CALCULATION_NOT_COMPLETE_ERROR_MESSAGE, FONT_SIZE_ERROR);
        }
    }
    if (operationScreen.innerHTML.includes(STRING_OF_DIVIDE_BY_ZERO)) {
        setResultScreenAndFontSize(DIVIDE_BY_ZERO_ERROR_MESSAGE, FONT_SIZE_ERROR);
    }
}

function changeValueToNegativeOrPositive() {
    checkErrorMessInResultScreen();
    if (!isNotCompleteOperationNow()) {
        operationScreen.innerHTML = EMPTY_STRING;
    }
    if (resultScreen.innerHTML === EMPTY_STRING) {
        resultScreen.innerHTML = MINUS_CHARACTER;
    } else if (resultScreen.innerHTML.startsWith(PLUS_CHARACTER)) {
        resultScreen.innerHTML = `${MINUS_CHARACTER}${resultScreen.innerHTML.slice(ONE)}`;
    } else if (resultScreen.innerHTML.startsWith(MINUS_CHARACTER)) {
        resultScreen.innerHTML = `${PLUS_CHARACTER}${resultScreen.innerHTML.slice(ONE)}`;
    } else {
        resultScreen.innerHTML = `${MINUS_CHARACTER}${resultScreen.innerHTML}`;
    }
}

function getCache() {
    return localStorage.getItem(CACHE_KEY);
}

let memoryScreen = document.getElementById('memory-screen');

function setCacheAndMemoryScreen(value) {
    const formatValue = formatLengthOfResult(value);
    localStorage.setItem(CACHE_KEY, formatValue);
    memoryScreen.innerHTML = `M:${formatValue}`;
}

function increaseMemoryCache() {
    const valueCached = getCache();
    const valueToCache = isNaN(Number.parseFloat(resultScreen.innerHTML)) ? ZERO : resultScreen.innerHTML;
    if (valueCached === null) {
        setCacheAndMemoryScreen(valueToCache);
    } else {
        const newValueToCache = Number.parseFloat(valueCached) + Number.parseFloat(valueToCache);
        setCacheAndMemoryScreen(newValueToCache);
    }
}

function decreaseMemoryCache() {
    const valueCached = getCache();
    const valueToCache = isNaN(Number.parseFloat(resultScreen.innerHTML)) ? ZERO : resultScreen.innerHTML;
    if (valueCached !== null) {
        const newValueToCache = Number.parseFloat(valueCached) - Number.parseFloat(valueToCache);
        setCacheAndMemoryScreen(newValueToCache);
    }
}

function clearMemoryCache() {
    localStorage.removeItem(CACHE_KEY);
    memoryScreen.innerHTML = EMPTY_STRING;
}

function showCacheOnResultScreen() {
    const valueCached = getCache();
    if (valueCached !== null) {
        resultScreen.innerHTML = valueCached;
    }
}


