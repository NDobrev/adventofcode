fs = require('fs');

function f(input, target, s) {
    let r = input.find((e) => s[target-e]);
    return r * (target - r);
}
function g(file) {
    let input = file.split('\n').map(x => Number(x));
    let s = input.reduce((s,e) => {s[e] = e; return s;}, {})
    let r = input.find((e)=> f(input, 2020 - e, s), s)
    return r * f(input, 2020 - r, s)
}

fs.readFile("input.txt",  'utf8', (_,data) => console.log(g(data)))