fs = require('fs');

function speak(file, n) {
    let input = file.split(',');
    let where = new Array(n);
    input.forEach((x, i) => {
        where[x] = i + 1;
    });
    let used = input.length;
    let lastNumber = 0;
    for (let i = used + 1; i < n; ++i) {
        const lastSeen = where[lastNumber];
        where[lastNumber] = i;
        lastNumber = lastSeen == undefined ? 0 : i - lastSeen;
    }
    return  lastNumber;
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
