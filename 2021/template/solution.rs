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

fn solve_hard(path: &str) {
    let lines: Vec<String> = read_lines(path);

    println!("Lines:\n{:?}", lines);
}

fn solve_easy(path: &str) {
    let lines: Vec<String> = read_lines(path);

    println!("Lines:\n{:?}", lines);
}

fn main() {
    solve_easy("input_short.txt");
    solve_hard("input_short.txt");
    //solve_easy("input.txt");
    //solve_hard("input.txt");
}