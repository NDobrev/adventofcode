fs = require('fs');

function parseFile(file) {
  let lines = file.split("\n").filter(line => !line.includes("other")).map(line => line.split("contain"));
  let parseSingleContent = s => {
  let [_1 ,count, pattern, color] = s.split(" ");
  return [pattern + color, count]
  }
  let bags = {};
  let containedBy  = {};
  for (line of lines)
  {
    [pattern, color] = line[0].split(' ');
    let currentBagName = pattern + color
    let content = line[1].split(',').map(parseSingleContent);
    content.forEach(([d, _]) => containedBy[d] = [...(containedBy[d] || []), currentBagName])
    bags[currentBagName] = content;
  }
  return [bags, containedBy];
}

function bagsPart1(file) {

  [_, containedBy] = parseFile(file)
  visit = (s) => {
    if(!containedBy[s]) return [s];
    return [s, ...containedBy[s], ...containedBy[s].map(x =>  visit(x)).flat()];
  }
  return [...new Set(visit("shinygold"))].length
}

function bagsPart2(file) {

  [bags, _] = parseFile(file)
  let bagsCount = (name) => {
    if (!bags[name]) return 0;
    let cnt = bags[name].map(([name, cnt]) => (bagsCount(name) + 1) * Number(cnt) ).reduce((a,c) => a + c, 0);
    return cnt;
  }
  return bagsCount("shinygold");
}

fs.readFile("input.txt",  'utf8', (_,data) => console.log(bagsPart1(data)));
fs.readFile("input.txt",  'utf8', (_,data) => console.log(bagsPart2(data)));