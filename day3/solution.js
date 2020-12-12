fs = require('fs');

function path(lines, p)
{
  let x = 0,y = 0,trees = 0;
  while(y < lines.length) {
    trees += lines[y][x] == '#';
    x = (x + p.x) % lines[0].length;
    y += p.y;
  }
  console.log(trees);
  
  return trees;
}

function allPaths(file) {
  let lines = file.split('\n');
  let patterns = [ [1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];
  return  patterns.reduce((s, [x,y]) => s * lines.reduce((t, l, i)=> t += (!(i % y) * (l[(x * (i / y)) % lines[0].length] == '#')) , 0), 1);
}

fs.readFile("input.txt",  'utf8', (_,data) => console.log(allPaths(data)))