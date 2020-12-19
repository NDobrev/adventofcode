fs = require('fs');

function parseRules(rules) {
  return Object.fromEntries(rules.split('\"').join('').split('\n').map(x => {
    let [id, patterns] = x.split(": ")
    return [id, patterns.split('|').map(x=> x.split(' ').filter(x => x != ''))]
  }))
}

function match(rules, str) {
  str = str.split('');
  let depth = 0;

  function matchSubRule(rule, current, idx) {
    let next = matchRule(rule[idx], current);
    if (next.length == 0) return [];
    if (idx + 1 >= rule.length) return next;
    return next.map(x => matchSubRule(rule, x, idx+1, [x])).flat();
  }
  
  function matchRule(id, current) {
    let result = undefined;
    if (current > str.length) return [];
    if (str[current] == id) return result = [current + 1];
    if (!rules[id]) return [];
    return rules[id].map(subrule => matchSubRule(subrule, current, 0)).flat();
  }
  return matchRule(0, 0).filter(x => x == str.length).length;
}

function countCorrupted(file) {
  let [rules, image] = file.split("\n\n");
  rules = parseRules(rules);
  return image.split('\n').filter(x => match(rules, x)).length;
}

fs.readFile("input.txt",  'utf8', (_,data) => console.log(countCorrupted(data)))