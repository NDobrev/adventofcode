fs = require('fs');

function speak(file, n) {
    let input = file.split(',');
    let numbers = new Array(n);
    let where = new Array(n);
    input.forEach((x, i) => {
        numbers[i] = x;
        where[x] = i;
    });
    let used = input.length;

    for (let i = used; i < n; ++i) {
        const lastNumber = numbers[i - 1];
        const lastSeen = where[lastNumber];
        numbers[i] = undefined === lastSeen ? 0 : i - lastSeen - 1;
        where[lastNumber] = i - 1;
    }
    return numbers.pop();
};

let measure = (f) =>  {
    return (...arguments) => {
    var start = new Date()
    let r = f(...arguments)
    console.info('Execution time: %dms',  new Date() - start)
    return r;
    }
    
}

let measuredSpeak = measure(speak);

fs.readFile("input.txt",  'utf8', (_,data) => console.log(measuredSpeak(data, 2020)));
fs.readFile("input.txt",  'utf8', (_,data) => console.log(measuredSpeak(data, 30000000)));
