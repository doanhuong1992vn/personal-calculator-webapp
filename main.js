const EMPTY_STRING = '';
const ZERO = 0;
const ONE = 1;
const NEGATIVE_OF_1 = -1;
const EQUAL_CHARACTER = '=';
const PLUS_CHARACTER = '+';
const MINUS_CHARACTER = '-';
const STRING_OF_DIVIDE_BY_ZERO = "/ 0 ";
const DIVIDE_BY_ZERO_ERROR_MESSAGE = "Cannot divide by zero";
const CALCULATION_NOT_COMPLETE_ERROR_MESSAGE = "This is not a calculation";
const FONT_SIZE_ERROR = "20px";
const FONT_SIZE_BASE = "42px";



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

let memoryScreen = document.getElementById('memory-screen');
let operationScreen = document.getElementById('history-operation-screen');
let resultScreen = document.getElementById('result-screen');

function checkErrorMessInResultScreen () {
    if (doesHasAnError()) {
        resultScreen.innerHTML = EMPTY_STRING;
        resultScreen.style.fontSize = FONT_SIZE_BASE;
    }
}

function doesHasAnError() {
    const result = resultScreen.innerHTML;
    return result === DIVIDE_BY_ZERO_ERROR_MESSAGE || result === CALCULATION_NOT_COMPLETE_ERROR_MESSAGE;
}

function changeResultScreen (value) {
    checkErrorMessInResultScreen();
    if (!isNotCompleteOperationNow()) clearCalculator();
    resultScreen.innerHTML += value;
}

function clearCalculator () {
    operationScreen.innerHTML = EMPTY_STRING;
    resultScreen.innerHTML = EMPTY_STRING;
    resultScreen.style.fontSize = FONT_SIZE_BASE;
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
            operationScreen.innerHTML = `${eval(operationScreen.innerHTML + lastOperator)} ${operand}`;
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

function getResult () {
    if (resultScreen.innerHTML === EMPTY_STRING) resultScreen.innerHTML = `${ZERO}`;
    if (operationScreen.innerHTML === EMPTY_STRING) operationScreen.innerHTML = `${resultScreen.innerHTML} ${EQUAL_CHARACTER}`
    if (isNotCompleteOperationNow()) {
        const lastOperator = formatLastOperator();
        try {
            resultScreen.innerHTML = eval(operationScreen.innerHTML + lastOperator);
        } catch (e) {
            resultScreen.innerHTML = CALCULATION_NOT_COMPLETE_ERROR_MESSAGE;
            resultScreen.style.fontSize = FONT_SIZE_ERROR;
        }
        operationScreen.innerHTML = `${operationScreen.innerHTML} ${lastOperator} ${EQUAL_CHARACTER}`;
    } else {
        try {
            resultScreen.innerHTML = eval(operationScreen.innerHTML.slice(ZERO, NEGATIVE_OF_1));
        } catch (e) {
            resultScreen.innerHTML = CALCULATION_NOT_COMPLETE_ERROR_MESSAGE;
            resultScreen.style.fontSize = FONT_SIZE_ERROR;
        }
    }
    if (operationScreen.innerHTML.includes(STRING_OF_DIVIDE_BY_ZERO)) {
        resultScreen.innerHTML = DIVIDE_BY_ZERO_ERROR_MESSAGE;
        resultScreen.style.fontSize = FONT_SIZE_ERROR;
    }
}

function changeValueToNegativeOrPositive() {
    checkErrorMessInResultScreen();
    if (!isNotCompleteOperationNow()) operationScreen.innerHTML = EMPTY_STRING;
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

