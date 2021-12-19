const fs = require('fs')

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split(/\r?\n/);

// ------------ PROBLEM 1 ------------
function problem1() {
    console.time('Problem 1 run time');
    
    let initialArr = toArray(lines[0]);
    let tree = new BinaryTree();
    tree.createTree(initialArr);


    for(let i = 1; i < lines.length+1; i++) {
        tree.reduce()

        if(i < lines.length) {
            tree.add(toArray(lines[i]));
        }
    }

    console.log(`Problem 1 answer: ${tree.getMagnitude()}`)
    console.timeEnd('Problem 1 run time');
}

// ------------ PROBLEM 2 ------------
function problem2() {
    console.time('Problem 2 run time');
    
    let tree = new BinaryTree();
    let max = 0;

    for(let i = 0; i < lines.length; i++) {
        for(let j = i+1; j < lines.length; j++) {
            tree.createTree(toArray(lines[i]));
            tree.reduce();
            tree.add(toArray(lines[j]));
            tree.reduce();

            let magnitude = tree.getMagnitude();
            max = magnitude > max ? magnitude : max;
        }
    }

    console.log(`\nProblem 2 answer: ${max}`)
    console.timeEnd('Problem 2 run time');
}

function toArray(str) {
    const intRegex = /^[0-9]+$/

    let left = '';
    let right = '';
    let bracketCount = 0;
    for(let i = 1; i < str.length-1; i++) {
        if(str[i] == '[') {
            bracketCount++;
        }
        else if(str[i] == ']') {
            bracketCount--;
        }
        else if(str[i] == ',' && bracketCount == 0) {
            left = str.substring(1, i);
            right = str.substring(i+1, str.length-1);
            break;
        }
    }

    if(intRegex.test(left)) {
        left = [parseInt(left, 10)];
    }
    else {
        left = toArray(left);
    }

    if(intRegex.test(right)) {
        right = [parseInt(right, 10)];
    } 
    else {
        right = toArray(right);
    }
    
    return [left, right]
}


class Node
{
    constructor(value = null) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class BinaryTree
{
    constructor() {
        this.root = null;
    }

    createTree(array) {
        this.root = new Node();
        this.addArray(this.root, array);

    }

    add(array) {
        let newRoot = new Node();
        newRoot.left = this.root;

        this.root.parent = newRoot; 
        this.root = newRoot;

        let rightNode = new Node();
        rightNode.parent = this.root;
        this.root.right = rightNode;
        

        this.addArray(rightNode, array);
    }

    addArray(node, array) {
        if(array.length == 1) {
            node.value = array[0];
        }
        else if(array.length == 2) {
            node.left = new Node();
            node.left.parent = node;
            this.addArray(node.left, array[0]);

            node.right = new Node();
            node.right.parent = node;
            this.addArray(node.right, array[1]);
        }
    }

    deepestNode() {
        let result = this.deepestNodeR(this.root, 1);
        if(result.depth > 5) {
            return result.node.parent
        }
        return
    }

    deepestNodeR(node, depth) {
        let result = {node: node, depth: depth}
        if(Number.isInteger(node.value)) {
            return result; 
        }

        let left = this.deepestNodeR(node.left, depth+1);
        let right = this.deepestNodeR(node.right, depth+1);

        result.depth = left.depth >= right.depth ? left.depth : right.depth;
        result.node = left.depth >= right.depth ? left.node : right.node;
        return result;
    }

    getSplitNode() {
        return this.getSplitNodeR(this.root)
    }

    getSplitNodeR(node) {
        if(!node) {
            return
        }

        if(Number.isInteger(node.value)) {
            if(node.value > 9) {
                return node.parent; 
            }
        }

        let left = this.getSplitNodeR(node.left);
        if(left) {
            return left;
        }

        let right = this.getSplitNodeR(node.right);
        if(right) {
            return right
        }

        return null;
    }

    explode(node) {
        let curr = node.parent;
        let prev = node;
        let leftNode = null;
        let rightNode = null;

        // add value to left and right node
        while(curr != null && (leftNode == null || rightNode == null)) {
            if(!leftNode && curr.left != prev) {
                let left = curr.left;
                while(!Number.isInteger(left.value)) {
                    left = left.right
                }
                left.value += node.left.value;
                leftNode = left;
            }
            else if(!rightNode && curr.right != prev) {
                let right = curr.right;
                while(!Number.isInteger(right.value)) {
                    right = right.left
                }
                right.value += node.right.value;
                rightNode = right;
            }
            prev = curr;
            curr = curr.parent;
        }

        // change node to node with value of 0 
        let newNode = new Node(0); 
        let parent = node.parent;
        if(parent.left == node) {
            parent.left = newNode;
            newNode.parent = parent;
        }
        else if (parent.right == node) {
            parent.right = newNode;
            newNode.parent = parent;
        }
        node.parent = null;
    }

    split(node) {
        if (node.left.value < 10 && node.right.value < 10) {
            return
        } 

        let value = 0;
        if(node.left.value >= 10) {
            value = node.left.value;
        }
        else {
            value = node.right.value;
        }

        let newNode = new Node();
        let leftNode = new Node(Math.floor(value/2));
        leftNode.parent = newNode;
        newNode.left = leftNode;
        let rightNode = new Node(Math.ceil(value/2));
        rightNode.parent = newNode;
        newNode.right = rightNode;

        newNode.parent = node;

        if(node.left.value >= 10) {
            node.left = newNode;
        }
        else {
            node.right = newNode;
        }
    }

    toString() {
        return this.toStringR(this.root)
    }

    toStringR(node) {
        if(!node) {
            return null;
        }

        if(Number.isInteger(node.value)) {
            return node.value;
        }
        return `[${this.toStringR(node.left)},${this.toStringR(node.right)}]`;
    }

    getMagnitude() {
        return this.getMagnitudeR(this.root)
    }

    getMagnitudeR(node) {
        if(!node) {
            return null;
        }

        if(Number.isInteger(node.value)) {
            return node.value;
        }

        return 3*this.getMagnitudeR(node.left) + 2*this.getMagnitudeR(node.right);
    }
    
    reduce() {
        let reduce = true;
        while(reduce) {
            let deepNode = this.deepestNode();
            let splitNode = this.getSplitNode();

            if(deepNode) {
                this.explode(deepNode);
            }
            else if(splitNode) {
                this.split(splitNode);
            }
            else {
                reduce = false;
            }
        }
    }
}

problem1();
problem2();