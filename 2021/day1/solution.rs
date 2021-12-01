use std::fs;

fn read_lines(path: &str) -> Vec<String>{
    let contents = fs::read_to_string(path)
    .expect("Something went wrong reading the file");
    return contents
    .split('\n')
    .map(str::to_string)
    .into_iter()
    .collect();
}

fn calc_3_sums(numbers: &Vec<i64>) -> Vec<i64> {
    let mut sums =  Vec::new();
    for i in 0..(numbers.len() - 2) {
        sums.push(numbers[i] + numbers[i + 1] + numbers[i + 2]);
    }
    return sums;
 }

 fn calc_diff(numbers: &Vec<i64>) -> Vec<i64> {
    let mut diff =  Vec::new();
    for idx in 1..(numbers.len()) {
        diff.push(numbers[idx] - numbers[idx - 1]);
    }
    return diff;
 }

 fn count_increases(numbers: &Vec<i64>) -> i32 {
    let mut cnt = 0;
    numbers.iter().for_each(|x| cnt += (x > &0i64) as i32);
    return cnt;
 }

fn solve_hard() {
    let numbers: Vec<i64> = read_lines("input.txt")
    .iter()
    .map(|x| x.parse::<i64>().unwrap())
    .collect();

    let sums = calc_3_sums(&numbers);
    let diff = calc_diff(&sums);
    let cnt = count_increases(&diff);

    println!("Count:\n{:?}", cnt);
}

fn solve_easy() {
    let numbers: Vec<i64> = read_lines("input.txt")
    .iter()
    .map(|x| x.parse::<i64>().unwrap())
    .collect();

    let diff = calc_diff(&numbers);
    let cnt = count_increases(&diff);
    println!("Count:\n{:?}", cnt);
}

fn main() {
    solve_easy();
    solve_hard();
}