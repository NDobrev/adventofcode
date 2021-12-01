fs = require('fs');

function parseTile(tile) {
  let [id, ...image] = tile.split('\n');
  let pixels = image.map(x => x.split(''));
  return [Number(id.split(' ')[1].split(':')[0]),pixels];
}

function rotate(tile) {
    let result = [];
    for (let i = 0; i < tile.length; ++i) {
        result.push([]);
        for (let j = 0; j < tile.length; ++j) {
            result[i][j] = tile[tile.length - 1 - j][i];
        }
    }
    return result;
}

function rotateKTimes(tile, k) {
    let result = tile;
    for (let i = 0; i < k; ++i) {
        result = rotate(result);
    }
    return result;
}

function flipX(tile) {
    let result = [];
    for (let i = 0; i < tile.length; ++i) {
        result.push([]);
        for (let j = 0; j < tile.length; ++j) {
            result[i][j] = tile[tile.length - 1 - i][j];
        }
    }
    return result;
}

function flipY(tile) {
    let result = [];
    for (let i = 0; i < tile.length; ++i) {
        result.push([]);
        for (let j = 0; j < tile.length; ++j) {
            result[i][j] = tile[i][tile.length - 1- j];
        }
    }
    return result;
}

function createMat(size, fill) {
    let result = new Array(size);
    for (let i = 0; i < size; ++i) {
        result[i] = new Array(size);
        result[i].fill(fill);
    }
    return result;
}

function tileEdges(tile) {
    return [
        topEdge(tile),
        rightEdge(tile),
        botEdge(tile),
        leftEdge(tile),
    ]
}

function topEdge(tile) {
    return  tile[0].map(x => x);
}

function rightEdge(tile) {
    return tile.map(x => x[tile.length - 1]);
}

function botEdge(tile) {
    return tile[tile.length -1].map(x => x);//.reverse();
}

function leftEdge(tile) {
    return tile.map(x => x[0]);//.reverse();
}

function conrnerMap(tiles) {
  let result = { };
  let add = (signature, id) => {
    let forward = signature.join('');
    result[forward] = result[forward] || [];
    result[forward].push(id);

    let reversed  = [...signature].reverse().join('');
    result[reversed] = result[reversed] || [];
    result[reversed].push(id);
  }
  for ([id, tile] of tiles) {
    tileEdges(tile).forEach(t => add(t, id))
  }
  return result;
}

function search(mapping, signature, id) {
    return [mapping[signature.join('')],
    mapping[[...signature].reverse().join('')]].flat().filter(x => x != id)
}

function findNeighbours(tiles , mapping) {
  let test = (signature, id) => search(mapping, signature, id);
  return tiles.map(([id, image]) => {
    return [id, [...new Set([
      test(image[0], id),
      test(image[image.length -1], id),
      test(image.map(x => x[0]), id),
      test(image.map(x => x[x.length - 1]), id),
    ].flat())]]
  })
}

function findStartOrientation(start, mapping) {
    let edges = tileEdges(start).map(x => Number(search(mapping, x, -1).length == 2)).join('');
    return {
        "1100": 3,
        "0110": 2,
        "0011": 1,
        "1001": 0,
    }[edges];
}

function copy(where, dh, dv, tile, sh, sv, size) {
    for (let i = 0; i < size; ++i) {
        for (let j = 0; j < size; ++j) {
            where[dh + i][dv + j] = tile[sh + i][j + sv];
        }
    }
}

function horizontalMatch(left, right) {
    return rightEdge(left).join('') == leftEdge(right).join('');
}

function vecticalMatch(top, bot) {
    return botEdge(top).join('') == topEdge(bot).join('');
}

function findHorizontalMatch(left, right) {
    let result = right;
    for (let i = 0; i < 4; ++i) {
        if (horizontalMatch(left,result)) {
            return result;
        }
        let fliped = flipX(result);
        if (horizontalMatch(left, fliped)) {
            return fliped;
        }
        result = rotate(result);
    }
    console.log("bad")
}

function findVerticalMatch(top, bot) {
    let result = bot;
    for (let i = 0; i < 4; ++i) {
        if (vecticalMatch(top,result)) {
            return result;
        }
        let fliped = flipY(result);
        if (vecticalMatch(top, fliped)) {
            return fliped;
        }
        result = rotate(result);
    }
    console.log("bad")
}

function reconstruct(start, tiles, mapping) {
    let size = Math.sqrt(Object.values(tiles).length);
    let startIndex = start[0];
    let startTile = tiles[startIndex];
    let startRotateions = findStartOrientation(startTile, mapping);
    let image = createMat(size,-1);

    image[0][0] = [startIndex, rotateKTimes(startTile, startRotateions)];
    for (let i = 0; i < size; ++i) {
        if (i > 0) {
            let [topId, topTile] = image[i- 1][0];
            let topBottomEdge = botEdge(topTile);
            let t = search(mapping, topBottomEdge, topId)[0];
            let tileToAdd = tiles[t];
            image[i][0] = [t, findVerticalMatch(topTile, tileToAdd)];
        }
        for (let j = 1; j < size; j++) {
            let [leftId, leftTile] = image[i][j - 1];
            let leftTileRightEdge = rightEdge(leftTile);
            let t = search(mapping, leftTileRightEdge, leftId)[0];
            let tileToAdd = tiles[t];
            image[i][j] = [t, findHorizontalMatch(leftTile, tileToAdd)]
        }
    }
    let tileSize = startTile.length;
    let final = createMat(size * (tileSize - 2), '@');
    
    for (let i = 0; i < image.length; ++i) {
        for (let j = 0; j < image.length; ++j) {
            let t = image[i][j][1];
            copy(final, i * (tileSize - 2), j * (tileSize - 2),t, 1, 1, t.length - 2)
        }
    }
    return final;
}

function monsterAt(image, h, v, monster) { 
    for (let i = 0; i < monster.length; ++i) {
        for (let j = 0; j < monster[i].length; ++j) {
            if (monster[i][j] == '#' && image[h + i][v + j] != '#') return false;
        }
    }
    for (let i = 0; i < monster.length; ++i) {
        for (let j = 0; j < monster[i].length; ++j) {
            if (monster[i][j]  == '#') {
                image[h + i][v + j] = 'O';
            }
        }
    }
    return true;
}

function monsterCount(image, monster) {
    let monsterLength = monster[0].length;
    let monsterHeigth = monster.length;
    let monsterCnt = 0;
    for (let i = 0; i < image.length - monsterHeigth; ++i) {
        for (let j = 0; j < image[0].length - monsterLength; ++j) {
            monsterCnt += Number(monsterAt(image, i, j, monster));
        }
    }
    return monsterCnt;
}

function findMonster(image) {
    let monster =  fs.readFileSync("monster.txt",  'utf8');
    monster = monster.split('\n').map(x => x.split('').map(x => x =='#' ? '#' : '.'));
    let result =  rotate(image);
    for (let r = 0; r < 4; r++) {
        let monsterCnt = monsterCount(result, monster);
        if (monsterCnt) {
            return result;
        }
        let flipedX = flipX(result);
        monsterCnt = monsterCount(flipedX, monster);
        if (monsterCnt) {
            return flipedX;
        }
        let flipedY = flipY(result);
        monsterCnt = monsterCount(flipedY, monster);
        if (monsterCnt) {
            return flipedY;
        }
        result = rotate(result);
    }
    console.log("bad");
}
function reconstructImage(file) {
  let tiles =  file.split('\n\n').map(x => parseTile(x));
  let mapping = conrnerMap(tiles);
  let filtered = findNeighbours(tiles,mapping).filter(x => x[1].length == 2);
  let image = reconstruct(filtered[0], Object.fromEntries(tiles), mapping);
  return findMonster(image).flat().filter(x => x == '#').length;
}

function corners(file) {
  let tiles =  file.split('\n\n').map(x => parseTile(x));
  let mapping = conrnerMap(tiles);
  let filtered = findNeighbours(tiles,mapping).filter(x => x[1].length == 2);
  return filtered.reduce((a, x) => a * x[0], 1);
}


fs.readFile("input.txt",  'utf8', (_,data) => console.log(corners(data)));
fs.readFile("input.txt",  'utf8', (_,data) => console.log(reconstructImage(data)));