fs = require('fs');

function parseFile(file) {
  let parts = file.split('\n\n');
  let fields = parts[0].split('\n').map(x => {
    let [cl, rngs] = x.split(': ');
    rngs = rngs.split(' or ').map( x => x.split('-').map(n => Number(n)));
    return [cl, rngs]
  })
  fields = Object.fromEntries(fields);
  let my = parts[1].split('\n')[1].split(',').map(n => Number(n));
  let nearby = parts[2].split('\n');
  nearby.splice(0,1);
  nearby = nearby.map(x => x.split(',').map(n => Number(n)));
  return {
    fields: fields,
    nearby: nearby,
    my: my
  }
}

function validate(fields, a) {
  return Object.values(fields).some(x => x.some(y => y[0] <= a && a <= y[1]))
}

function errorRate(file) {
  let input = parseFile(file)
  return input.nearby.reduce((e, x) => {
    return e + x.reduce((a, v) => {
      if (validate(input.fields, v)) return a; 
      return a + v;
    }, 0)
  }, 0)
}

function getPossibleFields(fields, a) {
  return Object.entries(fields).filter(([k, x]) => x.some(y => y[0] <= a && a <= y[1])).map(x => x[0])
}

function section(a, b) {
  return a.filter(x => b.find(y => x === y));
}

function solve(fieldCandidates) {
  let result = [];
  for (let j = 0; j < fieldCandidates.length; ++j) {
    for (let i = 0; i < fieldCandidates.length; ++i) {
      let c = fieldCandidates[i];
      if (c.length == 1) {
        result[i] = c[0];
        fieldCandidates = fieldCandidates.map(x => x.filter(y => y !== result[i]));
        break;
      }
      
    }
  }
  return result.map((x, i) => [x,i]).filter(([x, i]) => x.includes("departure"));
}

function decodeTicket(file) {
  let input = parseFile(file)
  let fieldCandidates = [];
  for (let ticket of input.nearby) {
    for (let i = 0; i < ticket.length; ++i) {
      let x = ticket[i]
      let posFields = getPossibleFields(input.fields, x);
      if (posFields.length) {
        if (fieldCandidates[i] === undefined) {
          fieldCandidates[i] = posFields;
        } else {
          fieldCandidates[i] = section(fieldCandidates[i], posFields);
        }
      }
    }
  }
  let sr = solve(fieldCandidates);
  return sr.reduce((e, [n, i]) => {
    return e * input.my[i];
  }, 1)
}

//fs.readFile("day16_short",  'utf8', (_,data) => console.log(decodeTicket(data, 2020)));
fs.readFile("input.txt",  'utf8', (_,data) => console.log(decodeTicket(data, 2020)));
