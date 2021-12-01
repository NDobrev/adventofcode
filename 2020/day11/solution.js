fs = require('fs');

function searchInDir(field, x, y, dirx, diry) {
  let cx = x;
  let cy = y;
  do {
    cx += dirx;
    cy += diry;
    if (field[cx] && field[cx][cy] == '#') return 1;
    if (field[cx] && field[cx][cy] == 'L') return 0;
  } while(field[cx] && field[cx][cy])
  return 0;
}

function  occupied(field, x, y) {
  return [[-1,-1],  [-1,0], [-1, 1],
          [0, -1],  /*[1, 0]*/, [0, 1],
          [1, -1],  [1, 0], [1, 1],].reduce((a, d) => a + searchInDir(field,x,y, d[0], d[1]),0);
}

function advance(field) {
  let nextField = [];
  for (let i = 0; i < field.length; i++) {
    nextField[i] = [];
    for(let j = 0; j < field[i].length; j++) {
      let oc = occupied(field, i, j);
      if (field[i][j] == 'L' && oc == 0)
        nextField[i][j] = '#';
      else if (field[i][j] == '#' && oc >= 5 )
        nextField[i][j] = 'L';
      else
        nextField[i][j] = field[i][j];
    }  
  }  
  return nextField;
}

function simulate(file) {
  const start = Date.now();
  field = file.split('\n').map(x => x.split(''));
  let next = field;
  do {
    field = next;
    next = advance(field);
  } while(field.flat().join('') != next.flat().join('')) 
  const millis = Date.now() - start;
  console.log(`Trivial millis elapsed = ${millis}`);
  return field.flat().reduce((a, x) => a + (x == '#'), 0);
}

fs.readFile("input.txt",  'utf8', (_,data) => console.log(simulate(data)));

function findChildren(field, x, y, dirx, diry) {
  let cx = x;
  let cy = y;
  do {
    cx += dirx;
    cy += diry;
    if (field[cx] && field[cx][cy] == 'L') return (cx << 16) + cy;
  } while(field[cx] && field[cx][cy])
  return -1;
}

function  getChildren(field, x, y) {
  return [[-1,-1],  [-1,0], [-1, 1],
          [0, -1],  /*[1, 0]*/, [0, 1],
          [1, -1],  [1, 0], [1, 1],].reduce((a, d) => {
            let child = findChildren(field, x, y, ...d);
            if (child != -1) a.push(child);
            return a;
          }, []);
}


function bfs(graph) {
  let next = Object.values(graph).filter( x => x.ch.length < 5);
  while(next.length) {
    let firstWave = next;
    let secondWave = []
    next = [];
    for (vertex of firstWave) vertex.solved = 0;
    for (vertex of firstWave) {
      secondWave.push(...vertex.ch.map(x => graph[x]).filter(x => x.solved == 2));
    }
    firstWave = [...new Set(firstWave)];
    for (vertex of secondWave) vertex.solved = 1;
    for (vertex of secondWave) {
      next.push(...vertex.ch.map(x => graph[x]).filter(x => x.ch.filter(x => graph[x].solved == 2).length < 5 && x.solved == 2));
    }
    next = [...new Set(next)];

  }
  return graph;
}

function solve(file) {
  const start = Date.now();
  let field = file.split('\n').map(x => x.split(''));
  let graph = {};
  for (let i = 0; i < field.length; i++) {
    for(let j = 0; j < field[i].length; j++) {
      if (field[i][j] == '.') continue;
      graph[(i << 16) + j] = {ch :getChildren(field, i, j), solved: 2};
    }  
  }  

  graph = bfs(graph);
  
  Object.keys(graph).forEach(x => {
    field[x >> 16][x & (1<< 16)- 1] = graph[x].solved ? 'L' : '#';
  })
  const millis = Date.now() - start;
  console.log(`Graph millis elapsed = ${millis}`);
  return field.flat().reduce((a, x) => a + (x == '#'), 0);
}

fs.readFile("input.txt",  'utf8', (_,data) => console.log(solve(data)));