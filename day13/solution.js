fs = require('fs');

function calcTime(file) {
  let [target, intervals] = file.split("\n");
  target = Number(target);
  let ids = intervals.split(',').filter(x => x != 'x').map(x => Number(x));
  intervals = ids.map(x => Math.ceil(target / x) * x - target);
  let min = Math.min(...intervals); 
  let idx = intervals.indexOf(min);
  return min* ids[idx];
}

function compositeReminder(x, t, f) {
    for (let i = 0; i < x; ++i) {
        if (f(i) % x == t) return (y) => f(i + x * y);
    }
}

function calcTime2(file) {
  let ids = file.split("\n")[1].split(',').map((x, i) => Number(x) );
  return ids.reduce((a, c, i) => {
    if (isNaN(c) || i == 0) return a;
    return compositeReminder(c, c - i % c, a);
  }, x => x * ids[0])(0);
}


fs.readFile("input.txt",  'utf8', (_,data) => console.log(calcTime( data)));
fs.readFile("input.txt",  'utf8', (_,data) => console.log(calcTime2( data)));