fs = require('fs');

let asm1 = {
  N: (s, v) => s.p[1] += v,
  S: (s, v) => s.p[1] -= v,
  E: (s, v) => s.p[0] += v,
  W: (s, v) => s.p[0] -= v,
  L: (s, v) => s.d = (4 + s.d + v / 90) % 4,
  R: (s, v) => s.d = (4 + s.d - v / 90) % 4,
  F: (s, v) => asm1[['E', 'N', 'W', 'S'][s.d]](s, v), 
}
let asm2 = {
  N: (s, v) => s.wp[1] += v,
  S: (s, v) => s.wp[1] -= v,
  E: (s, v) => s.wp[0] += v,
  W: (s, v) => s.wp[0] -= v,
  L: (s, v) => {let k = v / 90; while(k--) s.wp = [-s.wp[1], s.wp[0]]},
  R: (s, v) => {let k = v / 90; while(k--) s.wp = [s.wp[1], -s.wp[0]]},
  F: (s, v) => {
    s.p[0] += s.wp[0] * v;
    s.p[1] += s.wp[1] * v;
  } 
}

function execute(asm, file) {
  let instructions = file.split('\n').map(x => [x[0], Number(x.slice(1))]);
  let state = { p: [0, 0], d: 0, wp: [10, 1]};
  let end = instructions.reduce((s, [i, v]) => { asm[i](s, v); return s;}, state);
  return Math.abs(end.p[0]) + Math.abs(end.p[1]); 

}

fs.readFile("input.txt",  'utf8', (_,data) => console.log(execute(asm1, data)));
fs.readFile("input.txt",  'utf8', (_,data) => console.log(execute(asm2, data)));