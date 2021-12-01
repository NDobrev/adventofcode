fs = require('fs');

function answerCount(file) {
  let anwsers = (batch) => batch.match(/[a-z]/g).reduce((a, c) => {a[c]= (a[c] || 0)  + 1;return a;}, {});
  let count = (batch) => Object.values(anwsers(batch)).filter(v => v == batch.split('\n').length).length;
  return file.split("\n\n").reduce((c, b) => c + count(b), 0)
}


fs.readFile("input.txt",  'utf8', (_,data) => console.log(answerCount(data)))
