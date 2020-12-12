fs = require('fs');

function solve(instructions, pc = 0, _visited = [], hasChanges = false) {
  if (pc == instructions.length) return instructions.length;
  if (_visited.find(x => x == pc)) return 0;
  let [inst, arg] = instructions[pc];
  if (inst == "jmp")
  {
    if (s = solve(instructions, pc + Number(arg), [..._visited, pc], hasChanges))
      return s;
    if (!hasChanges && solve(instructions, pc + 1, [..._visited, pc], true))
      return pc;
    return 0;
  }
  return solve(instructions, pc + 1, [..._visited, pc], hasChanges);
}

function interpreter(file) {
  let state = {acc: 0, pc: 0, s: [], v:[]};
  let asm = {
    nop: (s, arg) => s.pc++,
    acc: (s, arg) => { s.acc += arg; s.pc++},
    jmp: (s, arg) => s.pc += arg,
  };
  let instructions = file.split('\n').map(i => i.split(" "));
  instructions[solve(instructions)][0] = "nop";
  while (state.pc < instructions.length) {
    let [inst, arg] = instructions[state.pc];
    asm[inst](state, Number(arg));
  }
 return state.acc;
}

fs.readFile("input.txt",  'utf8', (_,data) => console.log(interpreter(data)));