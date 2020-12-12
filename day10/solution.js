fs = require('fs');

function countArrangements(numbers, c = 0, memoization = []) {
  return numbers.length - 1 == c || memoization[c] ||  (memoization[c] = [...numbers].splice(c + 1,3).reduce((s, a, i) => s + (a - numbers[c] <= 3) *  countArrangements(numbers, c + i + 1, memoization), 0));
}

function count1and3(numbers) {
  let diffs = [0, 0, 0, 0]
  for (let i = 0; i < numbers.length - 1; ++i) {
    ++diffs[numbers[i + 1] - numbers[i]]
  }
  return diffs[1] * diffs[3];
}

function jolts(file) {
  let numbers = file.split('\n').map(x => Number(x)).sort((a,b) => a-b);
  numbers = [0, ...numbers, numbers[numbers.length - 1] + 3];
  console.log("Part 1:", count1and3(numbers));
  console.log("Part 2:", countArrangements(numbers));
}

fs.readFile("input.txt",  'utf8', (_,data) => console.log(jolts(data)));