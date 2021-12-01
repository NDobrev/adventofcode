fs = require('fs');


function parseLine(line) {
    line = line.split('').filter(x => x != '(' && x != ')').join('');
    let [ingr, alerg] = line.split(" contains ");
    return [ingr.split(' '), alerg.split(', ')];
}

function section(a, b) {
  return a.filter(x => b.find(y => x === y));
}

function sub(a,b) {
  return a.filter(x => !b.find(y => x === y));
}

function addAlergensFromLine(line, alergens) { 
    let [ingrs, alergs] = line;

    for (let i = 0; i < alergs.length; ++i) {
        let alerg = alergs[i];
        if(!alergens[alerg]) {
            alergens[alerg] = ingrs;
        } else {
            alergens[alerg] = section(alergens[alerg], ingrs);
        }
    }
}
function compare(a, b) {
  if (a[0] < b[0]) return -1;
  if (a[0] > b[0]) return 1;
  return 0;
}

function goodProducts(data) {
    let lines = data.split('\n').map(x => parseLine(x));
    let alergens = {};
    for (let i = 0; i < lines.length; ++i) {
            addAlergensFromLine(lines[i], alergens);
    }
    ingrs = lines.map(x => x[0]);
    for (let i = 0; i < ingrs.length; ++i) {
        for (let alerg of Object.values(alergens)) {
            ingrs[i] = sub(ingrs[i], alerg);
        }
    }

    return ingrs.flat().length;
}

function badProducts(data) {
    let lines = data.split('\n').map(x => parseLine(x));
    let alergens = {};
    for (let line of lines) {
            addAlergensFromLine(line, alergens);
    }

    let al = Object.entries(alergens);
    for(let i = 0; i < al.length; ++i) {
        for(let j = 0; j < al.length; ++j) {
            if ( al[j][1].length == 1) {
                for(let k = 0; k < al.length; ++k) {
                    if (k != j) 
                        al[k][1] = sub(al[k][1],  al[j][1]);
                }
            }
        }
    }

    return al.sort(compare).map(x => x[1][0]).join(',');
}

fs.readFile("input.txt",  'utf8', (_,data) => console.log(goodProducts(data)));
fs.readFile("input.txt",  'utf8', (_,data) => console.log(badProducts(data)));