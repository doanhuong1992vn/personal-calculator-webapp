const EMPTY_STRING = '';
const INDEX_ZERO = 0;
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

function changeResultScreen (value) {
    resultScreen.innerHTML += value;
}

function clearCalculator () {
    operationScreen.innerHTML = EMPTY_STRING;
    resultScreen.innerHTML = EMPTY_STRING;
}

function clearOneChar () {
    resultScreen.innerHTML = resultScreen.innerHTML.slice(INDEX_ZERO, -1);
}

function changeOperation (operand) {
    if (operationScreen.innerHTML === EMPTY_STRING || !isNotCompleteOperationNow()) {
        operationScreen.innerHTML = `${resultScreen.innerHTML} ${operand}`;
    } else {
        operationScreen.innerHTML = `${eval(operationScreen.innerHTML + resultScreen.innerHTML)} ${operand}`;
    }
    resultScreen.innerHTML = EMPTY_STRING;
}

function isNotCompleteOperationNow () {
    const currentOperationScreen = operationScreen.innerHTML;
    return currentOperationScreen.charAt(currentOperationScreen.length - 1) !== "=";
}

function getResult () {
    if (isNotCompleteOperationNow()) {
        const lastOperator = resultScreen.innerHTML;
        resultScreen.innerHTML = eval(operationScreen.innerHTML + resultScreen.innerHTML);
        operationScreen.innerHTML = `${operationScreen.innerHTML} ${lastOperator} =`;
    } else {
        resultScreen.innerHTML = eval(operationScreen.innerHTML.slice(INDEX_ZERO, - 1));
    }


}

