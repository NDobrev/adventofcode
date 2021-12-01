fs = require('fs');
let directions = []

for (let x = -1; x < 2; ++x)
  for (let y = -1; y < 2; ++y)
    for (let z = -1; z < 2; ++z)
      for (let w = -1; w < 2; ++w)
        if(!(x == 0 && y == 0 && z == 0 && w == 0) ) directions.push([x,y,z,w])

function add(a,b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]]
}

function neighbors(field, p, l = false) {
  
  return directions.reduce((a,x) => {
    if (l && x[2] == -1)
      console.log(x,  field[add(x, p)] == 1)
    return a + Number(field[add(x, p)] == 1)
  }, 0)
}

function advance(field) {
  let result = {}
  let tested = {}
  for (let p of  Object.keys(field)) {
    let pp = p.split(',').map(x => Number(x))
    if (field[p] == 1) {
      let active = neighbors(field, pp);
      //console.log(pp, active);
      if (active == 2 || active == 3) { result[pp] = 1}
      //console.log(result);
    }

    directions.forEach((x) => {
      let pos = add(x, pp);
      if (field[pos] != 1 && !tested[pos]) {
        tested[pos] = 1;
        let active = neighbors(field, pos);
        
        if (active == 3) {
          if (pos[1] == 2 && pos[2] == 1 && !result[pos]) {
            console.log('--------------',pos, active);
            //neighbors(field, pos, true);
          }
          result[pos] = 1;
        }
      }
    })
  }
  return result;
}

function print(field) {
  for (let i = -1; i < 2;++i) {
    for (let j = -3; j < 4;++j) {
      let r = []
      for (let k = -3; k < 4;++k) {
        r.push((field[[j,k, i,0]]  == 1) ? '#' : '.');
      }
      console.log(r.join(''))
    }
    console.log("\n")
  }
}

function simulate(file, steps) {

  let field = {}; 
  file.split('\n').forEach((x, i) => x.split('').forEach((y, j) => {
    if (y == '#')
      field[[i,j,0,0]] = Number(y == '#')
  }))
  print(field);
  for ( let i = 0; i < steps; ++i) {
    field = advance(field);
    console.log("Step:", i)
    //print(field);
  }
  //console.log(field);
  return Object.keys(field).length;
}

//fs.readFile("day17_short",  'utf8', (_,data) => console.log(simulate(data, 6)));
fs.readFile("input.txt",  'utf8', (_,data) => console.log(simulate(data, 6)));