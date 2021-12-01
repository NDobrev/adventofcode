fs = require('fs');

function calculator(tokens) {
  let next = 0;
  let match = (c) => {
    if (tokens[next] == c) {next++; return true}
    return false;
  }
  let number = () => {
     if (tokens[next] >= '0' && tokens[next] <= '9') {return Number(tokens[next++])}
    return -1;
  }
  let add = () => {
    let left = expr();
    if (match('+')) return left + add();
    return left;
  }
  let mult = () =>  {
    let left = add();
    if (match('*')) return left * mult();
    return left;
  }
  let expr = () => {
    let n = number();
    if (n != -1) return n;
    if (match('(')) {
      let r = mult();
      if(!match(')')) console.log("Bad ", tokens[next]);
      return r;
    }
  }
  return mult();
}

function homework(file) {
  return file
  .split('\n')
  .map( x => calculator(x
                        .split('')
                        .filter(x => x != ' ')))
  .reduce((a,c) => a + c, 0);  
}

fs.readFile("input.txt",  'utf8', (_,data) => console.log(homework(data)));