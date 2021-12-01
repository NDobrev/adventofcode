fs = require('fs');

function validatePassports(file)
{
  let validators = [
  /byr:(19[2-9][0-9]|200[0-2]+)+/,
  /iyr:(201[0-9]+|2020+)+/,
  /eyr:(202[0-9]+|2030+)+/,
  /hgt:(1[5-8]+[0-9]cm|19[0-3]cm|6[0-9]+in|7[0-6]+in|59in+)+/,
  /hcl:(#[0-9a-f]{3,6})+/i, 
  /ecl:(amb|blu|brn|gry|grn|hzl|oth)+/,
  /pid:(\d{9}( |\n|$))+/, 
  ]
  return file.split('\n\n').reduce((cnt, p) => {
    return cnt + validators.every((t) => t.exec(p));
  }, 0);
}

fs.readFile("input.txt",  'utf8', (_,data) => console.log(validatePassports(data)))