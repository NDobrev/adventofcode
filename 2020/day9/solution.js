fs = require('fs');

function findSum(start, end, array, target) {
    let map = {};
    for (let i = start; i < end; ++i) {
      map[array[i]] = 1;
    }

    for (let i = start; i < end; ++i) {
      if (map[target - array[i]])
        return true;
    }
    return false;
}

function findFirstWrong(numbers, k) {
  for (let i = k; i < numbers.length; ++i) {
    if (!findSum(i - k, i, numbers, numbers[i]))
      return numbers[i];
  }
}

function findContiguousSet(file) {
  let numbers = file.split('\n').map(x => Number(x));
  let target = findFirstWrong(numbers, 25);
  
  for(let i = 0; i < numbers.length; ++i) {
    let sum = 0;
    for(let j = i; j < numbers.length; ++j) {
      sum += numbers[j];
      if (sum == target) {
        let suba = numbers.splice(i, j - i);
        let min = Math.min(...suba);
        let max = Math.max(...suba);
        return min + max;
      }
    }
  }
  
}

fs.readFile("input.txt",  'utf8', (_,data) => console.log(findContiguousSet(data)));
