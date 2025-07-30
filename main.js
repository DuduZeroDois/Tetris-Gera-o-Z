const canvas = document.getElementById("canva")
const ctx = canvas.getContext("2d")
ctx.scale(20, 20)
const colors = [null,"#FF0D72","#0DC2FF","#0DFF72", "#F538FF", "#FF8E0D", "#FFE138", "#3877FF"]
let pontos = document.getElementById("id")

function CM(width, height){
    const matrix = []
    while(height--) matrix.push(new Array(width).fill(0))
    return matrix
}
function DM(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = colors[value]
                ctx.fillRect(x + offset.x, y + offset.y, 1, 1)
            }
        })
    })
}
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value
            }
        })
    })
}
function collid(arena, player) {
    const m = player.matrix
    const o = player.pos
    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true
            }
        }
    }
    return false
}
function PlayerDrop() {
    player.pos.y++
    if (collid(arena, player)) {
        player.pos.y--
        merge(arena, player)
        playerReset()
        const lines = arenaSweep()
        if (lines > 0) {
            player.score+= lines
            if (player.score %2 === 0 && dropInterval > 200) {
                dropInterval -= 100
            }
            updateScore()
        }
    }
    dropConter = 0
}
function PlayerMove(dir) {
    player.pos.x += dir
    if (collid(arena, player)) {
        player.pos.x -= dir
    }
}
function PlayerRotation() {
    const pos = player.pos.x
    let offset = 1
    rotate(player.matrix)
    while (collid(arena, player)) {
        player.pos.x += offset
        offset = -(offset +(offset > 0 ? 1:-1))
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, true)
            player.pos.x = pos
            return
        }
    }
}
function rotate(matrix, reverse) {
    for (let c = 0; c < matrix.length; c++) {
        for (let l = 0; l < c; l++) {
            [matrix[l][c], matrix[c][l]] = [matrix[c][l], matrix[l][c]]
        }
    }
    if (reverse == true) {
        matrix.forEach((row)=>row.reverse())
    }else{
        matrix.reverse()
    }
}
function arenaSweep() {
    let lineClear = 0
    outer:for (let oc = arena.length -1; oc >= 0; --oc) {
        for (let ol = 0; ol < arena[oc].length; ++ol) {
            if (arena[oc][ol] === 0) {
                continue outer
            }
        }
        const row = arena.splice(oc, 1)[0].fill(0)
        arena.unshift(row)
        lineClear++
    }
    return lineClear
}
function playerReset() {
    const pieces = "ILJOTSZ"
    player.matrix = createPiece(pieces[(pieces.length *Math.random()) |0])
    player.pos.y = 0
    player.pos.x = ((arena[0].length /2) |0) - ((player.matrix[0].length /2) |0)
    if (collid(arena, player)) {
        arena.forEach((row)=> row.fill(0))
        player.score = 0
        dropConter = 1000
        updateScore()
    }
}
function createPiece(type) {
    if (type === "T") {
        return[
            [0,0,0],
            [1,1,1],
            [0,1,0]    
        ]
    }
        if (type === "L") {
        return[
            [0,2,0],
            [0,2,0],
            [0,2,2]
        ]
    }
        if (type === "O") {
        return[
            [3,3],
            [3,3]    
        ]
    }
        if (type === "I") {
        return[
            [0,4,0,0],
            [0,4,0,0],
            [0,4,0,0],
            [0,4,0,0]
        ]
        }
        if (type === "J") {
        return[
            [0,5,0],
            [0,5,0],
            [5,5,0]
        ]
        }
        if (type === "S") {
        return[
            [0,0,6],
            [0,6,6],
            [0,6,0]
        ]
        }
        if (type === "Z") {
        return[
            [7,0,0],
            [7,7,0],
            [0,7,0]
        ]
        }
}
function updateScore() {
    pontos.innerText = "pontos: " + player.score
}
let dropConter = 0
let dropInterval = 1000
let lastTime = 0
function update(time = 0) {
    const deltaTime = time - lastTime
    lastTime = time
    dropConter += deltaTime
    if (dropConter > dropInterval) {
        PlayerDrop()
    }
    Draw()
    requestAnimationFrame(update)
}
function Draw() {
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    DM(arena,{x:0,y:0})
    DM(player.matrix,player.pos)
}
const arena = CM(12, 20)
const player = {
    pos:{x:0, y:0},
    matrix:null,
    score:0
}
document.addEventListener("keydown", (event)=> {
    if (event.key === "ArrowLeft") {
        PlayerMove(-1)
    }
    if (event.key === "ArrowRight") {
        PlayerMove(1)
    }
    if (event.key === "ArrowUp") {
        PlayerRotation()
    }
    if (event.key === "ArrowDown") {
        PlayerDrop()
    }
})

playerReset()
updateScore()
update()