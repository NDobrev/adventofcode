fs = require('fs');

let directionStr = [
    'e', 'se', 'sw', 'w', 'nw', 'ne'
]

//Axial directions
let directions = [
    [+1, +0], //'e'
    [+0, +1], //se
    [-1, +1], //sw
    [-1, +0], // w
    [+0, -1], // nw
    [+1, -1], // ne
]

function parseInstructions(file) { 
    return file.split('\n').map(line => { 
        let instructions = [];
        while(line.length != 0) {
            for (let i = 0; i < directionStr.length; ++i) {
                let dir = directionStr[i];
                if (line.startsWith(dir)) {
                    line = line.slice(dir.length, line.length);
                    instructions.push(i);
                }
            }
        }
        return instructions;
    })
}

function add(a,b) {
    return [a[0] + b[0], a[1] + b[1]];
}

function neighbors(field, p) {
    return directions.reduce((a,x) => {
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
            if (active >  0 && active < 3) { result[pp] = 1}
        }

        directions.forEach((x) => {
            let pos = add(x, pp);
            if (field[pos] != 1 && !tested[pos]) {
            tested[pos] = 1;
            let active = neighbors(field, pos);
            
            if (active == 2) {
                result[pos] = 1;
            }
            }
        })
    }
    return result;
}

function initField(insturctions) {
    let field = {};

    for (let inst of insturctions) {
        
        let current = [0, 0];
        for (let dirIndex of inst) {
            current = add(current, directions[dirIndex]);
        }
        let id = current.join(',')
        if (!field[id]) {
            field[id] = 0;
        }
        field[id]++;
    }
    return field;
}

function countTiles(file, steps) {
    let insturctions = parseInstructions(file);
    let field = initField(insturctions);

    for (let i = 0; i < steps; ++i) {
        field = advance(field);
    }
    return [
        Object.values(field).filter(x => x % 2 == 1).length,
        Object.values(field).filter(x => x % 2 == 0).length
    ]
}


let measure = (f) =>  {
    return (...arguments) => {
    var start = new Date()
    let r = f(...arguments)
    console.info('Execution time: %dms',  new Date() - start)
    return r;
    }
}

let countTilesMeasured = measure(countTiles);

fs.readFile("input_short.txt",  'utf8', (_,data) => console.log(countTilesMeasured(data, 100)));
fs.readFile("input.txt",  'utf8', (_,data) => console.log(countTilesMeasured(data, 100)));