fs = require('fs');

function maskAsNumber(str) {
  let mask = 0;
  let value = 0;
  return [parseInt(str.split('').map(x => Number(x == 'X')).join(''), 2), 
  parseInt(str.split('').map(x => Number(x == '1')).join(''), 2)];
}

function applyMask(number, mask) {
  bits = Number(number).toString(2).padStart(36, 0).split('');
  
  let result = []
  mask.forEach((x,i) => {
    result[i] = bits[i];
    if (x !== 'X') {
      result[i] = x;
    }
  })
  return result;
}

function execute1(file) {
  let instructions = file.split('\n').map(x => x.split(" = "));
  let memory = {};
  let mask = []
  instructions.forEach(inst => {
    if (inst[0] === "mask") {mask = inst[1].split(''); return }
    let address = Number(/[0-9]+/.exec(inst[0])[0]);
    memory[address] = parseInt(applyMask(inst[1], mask).join(''), 2);
  })
  return Object.values(memory).reduce((a, x) => a + x, 0)
}

function applyAddressMask(address, mask) {
  bits = Number(address).toString(2).padStart(36, 0).split('');
  let result = []
  mask.forEach((x,i) => {
    if (x === '0') {
      result[i] = bits[i];
    } else if (x === '1') {
      result[i] ='1';
    } else if (x === 'X'){
      result[i] = 'X';
    } else {
      console.log(bad);
    }
  })
  return result;
}

function execute2(file) {
  let instructions = file.split('\n').map(x => x.split(" = "));
  let memory = {};
  let mask = []
  instructions.forEach(inst => {
    if (inst[0] === "mask") {mask = inst[1].split(''); return }
    let address = Number(/[0-9]+/.exec(inst[0])[0]);
  
    let moddedAddr = applyAddressMask(address, mask);

    let fbc = moddedAddr.filter(x => x === 'X').length;

    memory[moddedAddr.join('')] = { 
      sum: Math.pow(2, fbc) * Number(inst[1]),
      end: Math.pow(2, fbc) * Number(inst[1]),
      value: Number(inst[1]),
      overlaps: moddedAddr
    };

  })
  return Object.values(memory).reduce((a, x) => { return a + x.sum; }, 0)
}
fs.readFile("day14",  'utf8', (_,data) => console.log(execute1(data)));
// Try something smart but currently not working
//fs.readFile("day14",  'utf8', (_,data) => console.log(execute2(data)));
