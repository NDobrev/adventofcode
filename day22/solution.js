fs = require('fs');

function parsePlayer(data) {
    let [_, deck] = data.split(':\n');
    return deck.split('\n').map(x => Number(x));
}

function game(p1, p2) {
    let hp1 = new Set(), hp2 = new Set();
    while (p1.length  && p2.length) {
        if(hp1.has(p1.join('_')) || hp2.has(p2.join('_')))  {
            return true;
        }
        hp1.add(p1.join('_'));  hp2.add(p2.join('_'));
        let c1 = p1.splice(0,1)[0];
        let c2 = p2.splice(0,1)[0];
        let winner = false;
        if (c1 <= p1.length && c2 <= p2.length) {
            winner = game(p1.slice(0, c1), p2.slice(0, c2))
        } else {
            winner = c1 > c2;
        }
        if (winner) {
            p1.push(c1); p1.push(c2);
        } else {
            p2.push(c2); p2.push(c1);
        }
    }
    return p1.length > p2.length;
}

function run(file) {
    let [p1, p2] = file.split("\n\n").map(x => parsePlayer(x));
    game(p1, p2);
    return [p1.reverse().reduce((a,x, i) => a + x * (i + 1),0),
            p2.reverse().reduce((a,x, i) => a + x * (i + 1),0)]
}

fs.readFile("input.txt",  'utf8', (_,data) => console.log(run(data)));