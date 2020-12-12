fs = require('fs');


function f(line) {
  let o = line.split(" ");
  let cnt = o[2].split(o[1][0]).length;
  cnt = cnt > 0 ? cnt - 1 : cnt;
  return cnt >= o[0].split('-')[0] && cnt <= o[0].split('-')[1]; 
}

function g(line) {
  let o = line.split(" ");
  let first = Number(o[0].split('-')[0]);
  let second = Number(o[0].split('-')[1]);
  return o[2][first - 1] == o[1][0] ^ o[2][second - 1] == o[1][0]; 
}

function validate(file, pred) {
    return file.split('\n').reduce((a, x) => a + pred(x), 0);
}


fs.readFile("input.txt",  'utf8', (_,data) => console.log(validate(data, f)))
fs.readFile("input.txt",  'utf8', (_,data) => console.log(validate(data, g)))