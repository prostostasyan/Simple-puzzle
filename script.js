Array.prototype.shuffle = function () {
    let i = this.length, j, temp;
    if (i == 0) return this;
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
}

function convertToSimpleArray(array) {
    let res = [];
    for (let i = 0; i < array.length; i++)
        if (!Array.isArray(array[i]))
            res.push(array[i]);
        else
            res = res.concat(convertToSimpleArray(array[i]));
    return res;
}

let selected = sizeMatrix.querySelector('input[ type="number"]');
let record = null;
let moveCount = 0;
let firstGame = true;
let arrNumb = [];
let rows;
let numberCells;

let table = () => {
    let countArr = 1;
    let arrMatrix = Array(numberCells - 1).fill(0).map(() => countArr++);
    arrMatrix = arrMatrix.shuffle();
    arrMatrix.push(0);
    let newMatrix = [];
    let count = 0;
    for (let i = 0, idRow = 0; i < rows; i++) {
        let tr = document.createElement('tr');
        newMatrix.push([]);
        for (let j = 0; j < rows; j++) {
            newMatrix[i][j] = arrMatrix[count];
            let td = document.createElement('td');
            if (arrMatrix[count] !== 0) {
                let div = document.createElement('div');
                div.innerHTML = arrMatrix[count++];
                div.classList.add(`cell`);
                td.append(div);
            }
            tr.append(td);
        }
        idRow++;
        field.append(tr);
    }
    return newMatrix;
}

let choiceFunc = () => {
    rows = selected.value;
    console.log(rows);
    numberCells = +rows * +rows;
    console.log(numberCells);
    if (firstGame) {
        field.classList.toggle('hidden');
        firstGame = false;
        arrNumb = table();
        console.log(arrNumb);
        setTimeout(() => {
            window.scrollTo(0, window.outerHeight);
        }, 10);
        choice.value = 'Начать заново';
    } else {
        field.innerHTML = '';
        arrNumb = table();
        console.log(arrNumb);
        setTimeout(() => {
            window.scrollTo(0, window.outerHeight);
        }, 10);
        choice.value = 'Начать заново';
    }
}

let changeArr = (elem) => {
    let row;
    let col;
    const targ = +elem.innerHTML;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < rows; j++) {
            if (arrNumb[i][j] === targ) {
                row = i;
                col = j;
            }
        }
    }
    console.log(arrNumb[row][col]);
    if ((row - 1) >= 0) {
        if (arrNumb[row - 1][col] === 0) {
            arrNumb[row][col] = 0;
            arrNumb[row - 1][col] = targ;
            console.log('top', arrNumb);
            move(elem, 'top');
        }
    }
    if ((row + 1) < rows) {
        if (arrNumb[row + 1][col] === 0) {
            arrNumb[row][col] = 0;
            arrNumb[row + 1][col] = targ;
            console.log('bottom', arrNumb);
            move(elem, 'bottom');
        }
    }
    if ((col - 1) >= 0) {
        if (arrNumb[row][col - 1] === 0) {
            arrNumb[row][col] = 0;
            arrNumb[row][col - 1] = targ
            console.log('left', arrNumb);
            move(elem, 'left');
        }
    }
    if ((col + 1) < rows) {
        if (arrNumb[row][col + 1] === 0) {
            arrNumb[row][col] = 0;
            arrNumb[row][col + 1] = targ;
            console.log('right', arrNumb);
            move(elem, 'right');
        }
    }
}

let move = (elem, direction) => {
    let size = 112;
    if (direction == 'left') {
        let value = +elem.style.left.slice(0, -2) - size;
        elem.style.left = `${value}px`;
    } else if (direction == 'right') {
        let value = +elem.style.left.slice(0, -2) + size;
        elem.style.left = `${value}px`;
    } else if (direction == 'bottom') {
        let value = +elem.style.top.slice(0, -2) + size;
        elem.style.top = `${value}px`;
    } else if (direction == 'top') {
        let value = +elem.style.top.slice(0, -2) - size;
        elem.style.top = `${value}px`;
    }
}

let testOnWin = () => {
    let tryArr = convertToSimpleArray(arrNumb);
    console.log(tryArr)
    let count = 1;
    let win = false;
    tryArr.forEach(e => {
        if (+e === count) {
            console.log('Совпадение №', e.innerHTML)
            count++;
        }
        if (count === numberCells && !win) {
            setTimeout(() => {
                alert(`You won. Your moves: ${moveCount}`);
                let result = moveCount;
                if (record === null || result < record) {
                    record = moveCount;
                    records.innerHTML = `Ваш рекорд составляет: ${record}`;
                    alert(`Поздравляем!!! Ваш рекорд составляет: ${record}`);
                    rows = null;
                }
                alert("Начать заново?");
                moveCount = 0;
                field.innerHTML = '';
                choiceFunc();
            }, 300);
            win = true;
        }
        if (+e === 0) --count;
    })
}

choice.addEventListener('click', () => choiceFunc());

field.addEventListener('click', function (event) {
    if (event.target.className == 'cell') {
        let eventTarget = event.target;
        changeArr(eventTarget);
        testOnWin();
        moveCount++;
    }
})

selected.addEventListener('input', () => {
    if (selected.value > 9) {
        selected.value = 9;
    }
    if (selected.value < 3) {
        selected.value = 3;
    }
});