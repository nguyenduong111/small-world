// --------------------------------------------------------------------------
// var N = 0; // tối thiểu 4 node
// var m = 0; // số đg liên kết (chiều đồng hồ)
// var p = 0; // xác suất "tua lại"
// var M = 0; // số node dị biệt
// var arr = [];

function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let khoiTao = (arr, N) => {
    for (let i = 0; i < N; i++) {
        arr.push({
            id: i,
            connect: [],
            pos: {
                x: 0,
                y: 0,
            },
            colorRandom: getRandomColor(),
        });
    }
    return [...arr];
};

const regularModel = (arr, m, N) => {
    arr.forEach((element, index) => {
        for (let i = 1; i <= m; i++) {
            let param = arr[index + i];
            if (param != null) {
                element.connect.push(param);
            }
        }
    });

    for (let i = 0; i < m; i++) {
        for (let j = m - i - 1; j >= 0; j--) {
            arr[N - 1 - i].connect.push(arr[j]);
        }
    }

    return [...arr];
};

// lựa chọn ngẫu nhiên M liên kết trong (N * m) liên kết
const Random = (M, m , N) => {
    let arr = [];
    for (let i = 0; i < M; i++) {
        let nodeStart = Math.floor(Math.random() * N);
        let connect = Math.floor(Math.random() * m);
        let nodeEnd = Math.floor(Math.random() * N);
        while (nodeStart === nodeEnd) {
            nodeEnd = Math.floor(Math.random() * N);
        }
        arr.push({
            nodeStart: nodeStart,
            connect: connect,
            nodeEnd: nodeEnd,
        });
    }
    return [...arr];
};

const smallWord = (arr, match) => {
    match.forEach((elem) => {
        let { nodeStart, connect, nodeEnd } = elem;
        arr[nodeStart].connect[connect] = arr[nodeEnd];
    });

    return [...arr];
};

// console.log(arrRegular);

// console.log(match);

// console.log(arrSW);

// ----------------------------------------------------------------------

const widthOfCanvas = 500;
const heightOfCanvas = 500;
const radiusOfNode = 10;
const radius = (widthOfCanvas - 2 * radiusOfNode) / 2;
const xO = widthOfCanvas / 2;
const yO = heightOfCanvas / 2;

function findDoChia(x) {
    let i = 1;
    while (x > i * 4) {
        ++i;
    }
    return i;
}

// console.log("-----------------", findDoChia(N));

// I và IV, II và III
function findNode(xO, yO, alpha, radius) {
    if (alpha > 0 && alpha <= Math.PI / 2) {
        return {
            x: xO + Math.sin(alpha) * radius,
            y: yO - Math.cos(alpha) * radius,
        };
    } else if (alpha > Math.PI / 2 && alpha <= Math.PI) {
        return {
            x: xO + Math.cos(alpha - Math.PI / 2) * radius,
            y: yO + Math.sin(alpha - Math.PI / 2) * radius,
        };
    } else if (alpha > Math.PI && alpha <= (Math.PI * 3) / 2) {
        return {
            x: xO - Math.sin(alpha - Math.PI) * radius,
            y: yO + Math.cos(alpha - Math.PI) * radius,
        };
    } else {
        return {
            x: xO - Math.sin(Math.PI * 2 - alpha) * radius,
            y: yO - Math.cos(Math.PI * 2 - alpha) * radius,
        };
    }
}

// hàm tìm toạ độ các node
function findPos(arr, xO, yO, radius, N) {
    const sizeArr = arr.length;

    // arr[0].pos = {
    //     x: xO,
    //     y: yO - radius,
    // };
    arr[0].pos.x = xO;
    arr[0].pos.y = yO - radius;

    const alpha = (Math.PI * 2) / N;

    for (let i = 1; i < sizeArr; i++) {
        let temp = findNode(xO, yO, i * alpha, radius);
        arr[i].pos.x = temp.x;
        arr[i].pos.y = temp.y;
    }

    return [...arr];
}

// console.log(arr);

//-------------------

function onSubmit() {
    var N = 0; // tối thiểu 4 node
    var m = 0; // số đg liên kết (chiều đồng hồ)
    var p = 0; // xác suất "tua lại"
    var M = 0; // số node dị biệt
    var arr = [];

    // e.preventDefault();

    let Node = document.getElementById("Nut").value;
    let lk = document.getElementById("lienKet").value;
    let xs = document.getElementById("xacSuat").value;

    console.log(document.getElementById("Nut"));

    N = parseInt(Node);
    m = parseInt(lk);
    p = parseFloat(xs);

    // console.log(N, typeof N);
    // console.log(m, typeof m);
    // console.log(p, typeof p);

    if (N < 4) {
        alert("kiểm tra lại nút");
    }
    if (m < 1) {
        alert("kiểm tra lại liên kết ban đầu");
    }
    if (p < 0 || p > 1.0) {
        alert("kiểm tra lại xác suất");
    }

    M = (N * m * p).toFixed(0);

    arr = khoiTao(arr, N);

    var arrRegular = regularModel(arr, m, N);

    const match = Random(M, m, N);

    var arrSW = smallWord(arrRegular, match);

    arrSW = findPos(arrSW, xO, yO, radius, N);

    // console.log(arrRegular);

    // console.log(match);

    // console.log(arrSW);

    var c = document.getElementById("myCanvas");

    // const widthOfCanvas = 500;
    // const heightOfCanvas = 500;

    c.width = widthOfCanvas;
    c.height = heightOfCanvas;

    // c.width = window.innerWidth;
    // c.height = window.innerHeight;

    var ctx = c.getContext("2d");

    for (let i = 0; i < arrSW.length; i++) {
        ctx.beginPath();
        ctx.arc(
            arrSW[i].pos.x,
            arrSW[i].pos.y,
            radiusOfNode,
            0,
            2 * Math.PI,
            true
        );
        ctx.fillStyle = arrSW[i].colorRandom; // vẽ hình tròn
        ctx.fill();
        ctx.closePath();

        arrSW[i].connect.forEach((elem, index) => {
            ctx.beginPath();
            ctx.moveTo(arrSW[i].pos.x, arrSW[i].pos.y);
            ctx.lineTo(elem.pos.x, elem.pos.y);
            ctx.strokeStyle = arrSW[i].colorRandom; // css cho line (nhận vào mã màu), css cho viền
            ctx.stroke();
            ctx.closePath();
        });
    }

    // document.getElementById("Nut").value = "";
    // document.getElementById("lienKet").value = "";
    // document.getElementById("xacSuat").value = "";
}
