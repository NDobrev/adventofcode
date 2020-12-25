fs = require('fs');

function multiplicativeOrder(desire) {
    let subjectNumber = 7;
    let value = 1;
    let loopSize = 0;
    while(true) {
        value = value * subjectNumber;
        value = value % 20201227;
        loopSize++;
        if (value == desire) {
            return loopSize;
        }
    }
}


function deviceLoop(subjectNumber, loopSize ) {
    console.log(subjectNumber, loopSize)
    let value = 1;
    for(let i = 0; i < loopSize; ++i) {
        value = value * subjectNumber;
        value = value % 20201227;
    }
    return value
}


function decrypt(data) {
    let number = data.split('\n').map(x => Number(x));
    let loops = number.map(x => multiplicativeOrder(x));
    return deviceLoop(number[0], loops[1]);
}


let measure = (f) =>  {
    return (...arguments) => {
    var start = new Date()
    let r = f(...arguments)
    console.info('Execution time: %dms',  new Date() - start)
    return r;
    }
}

let decryptMeasured = measure(decrypt);

fs.readFile("input_short.txt",  'utf8', (_,data) => console.log(decryptMeasured(data)));
fs.readFile("input.txt",  'utf8', (_,data) => console.log(decryptMeasured(data)));