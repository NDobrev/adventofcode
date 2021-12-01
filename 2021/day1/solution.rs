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
    numbers.windows(3).map(|x| x[0] + x[1] + x[2]).collect()
 }

 fn calc_diff(numbers: &Vec<i64>) -> Vec<i64> {
    numbers.windows(2).map(|x| x[1] - x[0]).collect()
 }

 fn count_increases(numbers: &Vec<i64>) -> usize {
    numbers.iter().filter(|x| x > &&0i64).count()
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