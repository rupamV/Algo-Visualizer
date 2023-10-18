class TreeNode {
    constructor(value, left = null, right = null, index = null) {
        this.value = value;
        this.left = left;
        this.right = right;
        this.nodeBase = null;
        this.index = index;
        this.level = null;
        this.parent = null;
        this.dest = null;
        this.srcLeft = null;
        this.srcRight = null;
    }
}
class Tree {
    constructor() {
        this.root = null;
    }
    insert(value) {
        let newNode = new TreeNode(value);
        let currLevel = 0;
        if (!this.root) {
            this.root = newNode;
            createNewNode(currLevel, value, null, newNode,);
            return this;
        }
        let current = this.root;
        while (true) {
            currLevel++;
            if (value === current.value) return undefined;
            if (value < current.value) {
                if (!current.left) {
                    createNewNode(currLevel, value, current, newNode, "left");
                    current.left = newNode;
                    return this;
                }
                current = current.left;
            }
            else {
                if (!current.right) {
                    createNewNode(currLevel, value, current, newNode, "right");
                    current.right = newNode;
                    return this;
                }
                current = current.right;
            }
        }
    }
}

let nodes = [];
let position = [];
const deleteNodeBtn = document.getElementById("delete-node-btn");
let selectedNode = null;
deleteNodeBtn.addEventListener("click", () => {
    deleteNode(selectedNode);
    handleNodeSelect();
    reStructure();
});
let treeData = {
    x: window.innerWidth / 2,
    y: 100,
    scale: 1,
    nodeRadius: 30,
}
let dragData = {
    isDown: false,
    startX: 0,
    startY: 0,
}
let container = document.getElementById("tree");
let treeParent = document.getElementById("tree-parent");
let tree = new Tree();
let arr = [5, 15, 1, 7, 8, 4, 6, 3, 9, 10, 17, 18, -2, -5, -4, -10, -15, 20, -21, 21, -14];
for (let i of arr) tree.insert(i);

changeTreePosition();
function changeTreePosition() {
    treeParent.style.transform = `scale(${treeData.scale}) translate(${treeData.x / treeData.scale}px, ${treeData.y / treeData.scale}px)`;
}

function createNewNode(level, currValue, parentNode, currNode, direction = null) {
    if (!nodes[level]) addLevel(level);
    let group = createGroup();
    currNode.nodeBase = group;
    currNode.level = level;
    treeParent.appendChild(group);
    currNode.index = parentNode == null ? 0 : parentNode.index * 2 + (direction == "left" ? 0 : 1);
    nodes[level][currNode.index] = currNode;

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.classList.add("node-path");
    if (parentNode != null) {
        currNode.parent = parentNode;
        currNode.dest = path;
        if (direction == "left") parentNode.srcLeft = path;
        else parentNode.srcRight = path;
    }
    treeParent.append(path);


    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", treeData.nodeRadius);
    group.appendChild(circle);


    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("fill", "black");
    text.setAttribute("stroke", "black");
    text.setAttribute("stroke-width", "1");
    text.setAttribute("font-size", "20px");
    text.style.transform = `translate(-5px, 5px)`;
    text.innerHTML = currValue;
    group.appendChild(text);
    reStructure();
}

function createGroup() {
    let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.classList.add("node-base");
    group.addEventListener("mouseover", () => {
        group.style.cursor = "pointer";
    });
    group.addEventListener("click", () => {
        nodes.forEach(level => {
            level.forEach(node => {
                if (node != null) {
                    node.nodeBase.classList.remove("selected");
                }


            })
        })
        group.classList.add("selected");
        handleNodeSelect();
    });
    return group;
}

function handleNodeSelect() {
    let selectedGroup = document.querySelector(".node-base.selected");
    if (selectedGroup == null) {
        selectedNode = null;
        return;
    }
    let node = null;
    nodes.forEach(level => {
        level.forEach(n => {
            if (n != null && n.nodeBase == selectedGroup) node = n;
        })
    });
    selectedNode = node;

}

function deleteNode(node) {
    if (node == null) return;
    deleteNode(node.left);
    deleteNode(node.right);
    if (node.parent != null) {
        if (node.parent.srcLeft == node.dest) {
            node.parent.srcLeft = null;
            node.parent.left = null;
        }
        else {
            node.parent.srcRight = null;
            node.parent.right = null;
        }
    }
    treeParent.removeChild(node.nodeBase);
    if (node.dest != null)
        treeParent.removeChild(node.dest);
    nodes[node.level][node.index] = null;

    // if all the nodes in the level are deleted then delete the level
    let isEmpty = true;
    nodes[node.level].forEach(node => {
        if (node != null) {
            isEmpty = false;
            return;
        }
    });

    if (isEmpty) {
        nodes.pop();
        position.pop();
    }
}

function addLevel(level) {
    nodes[level] = [];
    position[level] = [];
    if (level === 0) {
        nodes[level].push(null);
        position[level].push({ x: 0, y: 0 });
    } else {
        for (let i = 0; i < Math.pow(2, level); i++) {
            nodes[level].push(null);
            position[level].push({ x: 0, y: 0 });
        }
    }
}

function reStructure() {
    let max = Math.pow(2, nodes.length - 1) - 1;
    let gaps = [0, 200, 200, 100, 60, 60, 40, 3.125, 1.5625]
    let gap = gaps[nodes.length - 1];
    if (nodes.length > 5) {
        treeData.nodeRadius = 20;
        nodes.forEach(level => {
            level.forEach(node => {
                if (node != null) {
                    node.nodeBase.children[0].setAttribute("r", treeData.nodeRadius);
                }
            })
        });
    } else {
        treeData.nodeRadius = 30;
        nodes.forEach(level => {
            level.forEach(node => {
                if (node != null) {
                    node.nodeBase.children[0].setAttribute("r", treeData.nodeRadius);
                }
            })
        });
    }
    for (let i = position.length - 1; i >= 0; i--) {
        for (let j = 0; j < position[i].length; j++) {
            if (i == position.length - 1) {
                position[i][j].x = -(max / 2 - j) * gap;
                position[i][j].y = 100 * i;
            } else {
                let left = position[i + 1][j * 2];
                let right = position[i + 1][j * 2 + 1];
                position[i][j].x = (left.x + right.x) / 2;
                position[i][j].y = 100 * i;
            }
        }
    }
    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes[i].length; j++) {
            if (nodes[i][j] == null) continue;
            nodes[i][j].nodeBase.style.transform = `translate(${position[i][j].x}px, ${position[i][j].y}px)`;
            if (nodes[i][j].srcLeft != null) {
                let xLeft = position[i][j].x - position[i + 1][j * 2].x;
                let yLeft = position[i][j].y - position[i + 1][j * 2].y;
                let angleLeft = Math.atan2(yLeft, xLeft);
                let xLeftEdge = position[i][j].x - treeData.nodeRadius * Math.cos(angleLeft);
                let yLeftEdge = position[i][j].y - treeData.nodeRadius * Math.sin(angleLeft);
                let destX = position[i + 1][j * 2].x + treeData.nodeRadius * Math.cos(angleLeft);
                let destY = position[i + 1][j * 2 + 1].y + treeData.nodeRadius * Math.sin(angleLeft);
                nodes[i][j].srcLeft?.setAttribute("d", `M ${xLeftEdge} ${yLeftEdge} L ${destX} ${destY}`);

            }

            if (nodes[i][j].srcRight != null) {
                let xRight = position[i][j].x - position[i + 1][j * 2 + 1].x;
                let yRight = position[i][j].y - position[i + 1][j * 2 + 1].y;
                let angleRight = Math.atan2(yRight, xRight);

                let xRightEdge = position[i][j].x - treeData.nodeRadius * Math.cos(angleRight);
                let yRightEdge = position[i][j].y - treeData.nodeRadius * Math.sin(angleRight);
                let destX = position[i + 1][j * 2 + 1].x + treeData.nodeRadius * Math.cos(angleRight);
                let destY = position[i + 1][j * 2 + 1].y + treeData.nodeRadius * Math.sin(angleRight);
                nodes[i][j].srcRight?.setAttribute("d", `M ${xRightEdge} ${yRightEdge} L ${destX} ${destY}`);
            }
        }
    }
}

container.addEventListener("wheel", (e) => {
    if (e.deltaY < 0) {
        if (treeData.scale >= 1) return;
        treeData.scale += 0.05;
    }
    else {
        if (treeData.scale <= 0.25) return;
        treeData.scale -= 0.05;
    }


    changeTreePosition();
})
container.addEventListener('mousedown', (e) => {
    if (dragData.isDown) return;
    dragData.isDown = true;
    dragData.startX = e.clientX;
    dragData.startY = e.clientY;
    container.style.cursor = 'grabbing';
});

container.addEventListener('mouseleave', () => {
    dragData.isDown = false;
    container.style.cursor = 'grab';
}
);

container.addEventListener('mouseup', () => {
    dragData.isDown = false;
    container.style.cursor = 'grab';
}
);

container.addEventListener('mousemove', (e) => {
    if (!dragData.isDown) return;
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;
    const walkX = (x - dragData.startX);
    const walkY = (y - dragData.startY);
    treeData.x += walkX;
    treeData.y += walkY;
    dragData.startX = x;
    dragData.startY = y;
    changeTreePosition();
}
);



