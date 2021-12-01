fs = require('fs');

function getMySeat(file) {
  return file.split('\n').map(str => Number("0b" + str.split('').map(e => Number(e == 'B' || e == 'R')).join(""))).sort().find((_, i, s) => s[i] == s[i+ 1]  - 2 ) + 1;
}

fs.readFile("input.txt",  'utf8', (_,data) => console.log(getMySeat(data)))