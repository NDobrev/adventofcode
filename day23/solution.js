function createNode(value) {
    return {
        next: null,
        value: value,
    }
}

function printList(l) {
    let current = l;
    let arr = []
    do {
        arr.push(current.value);
        current = current.next;
    } while(current != l && current);
    console.log(arr.join());
}

function removeFromList(node, n) {
    let start = node.next;
    let end = node;
    for (let i = 0; i < n; ++i) {
        end = end.next;
    }
    node.next = end.next;
    end.next = 0;
    return [start, end];
}

function addInList(dest, whatStart, whatEnd) {
    whatEnd.next = dest.next;
    dest.next = whatStart;
}

function crabGame(input, steps, count) {
    cups = input.split('').map(x => Number(x));
    let nodeMap = new Array(count);

    let max = Math.max(...cups);
    for (let i = max + 1; i < count +1; ++i) {
        cups.push(i);
    }
    let lableCnt = cups.length + 1;
    let first = createNode(cups[0]);
    let prev = first;
    nodeMap[cups[0]] = first;
    for (let i = 1; i < cups.length; ++i) {
        let current = createNode(cups[i]);
        prev.next = current;
        prev = current;
        nodeMap[cups[i]] = current;
    }
    prev.next = first;
    let current = first;
    for(let i = 0; i < steps; ++i) {
        let [start, end] = removeFromList(current, 3);
        let excluded = [start.value, start.next.value, start.next.next.value];

        let testFor = current.value - 1;
        let destination = null;
        do {
            if (testFor != 0 && excluded.indexOf(testFor) == -1) {
                destination = nodeMap[testFor];
                break;
            }
            testFor = (lableCnt + testFor - 1) % lableCnt;
        } while(true);
        addInList(destination, start, end);
        current = current.next;
    }
    return nodeMap[1].next.value * nodeMap[1].next.next.value;

}


let measure = (f) =>  {
    return (...arguments) => {
    var start = new Date()
    let r = f(...arguments)
    console.info('Execution time: %dms',  new Date() - start)
    return r;
    }
}

let gameMeasured = measure(crabGame);
console.log(gameMeasured("389125467", 100, 9))
console.log(gameMeasured("589174263", 100, 9))
console.log(gameMeasured("389125467", 10000000, 1000000))
console.log(gameMeasured("589174263", 10000000, 1000000))