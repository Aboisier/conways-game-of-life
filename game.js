RECT_SIZE = 10
X = Math.floor(window.innerWidth / 10) - 10
Y = Math.floor(window.innerHeight / 10) - 20
ACTIVE_COLOR = '#a6a6a6'
INACTIVE_COLOR = '#fafafa'


var g = []

isMouseDown      = false
firstClickState  = 0
updateSpeed      = 200
stopUpdate       = false

// Event handlers
handle_mousedown = function(e) {
    isMouseDown = true
    pos = mouseToGrid(e)
    firstClickState = 0 == g[pos.y][pos.x] ? 1 : 0 // Remembers what was the state of the
    g[pos.y][pos.x] = firstClickState
}

handle_mouseup = function(e) { isMouseDown = false; }

handle_move = function(e) {
    if(isMouseDown) {
        pos = mouseToGrid(e)
        g[pos.y][pos.x] = firstClickState
    }
}

// Initialises the grid, the buttons and the event handlers
init = function() {
    // The buttons
    $('#start').click(function() { $('#start').addClass('disabled'); $('#stop').removeClass('disabled'); setTimeout(update, updateSpeed); stopUpdate = false })
    $('#stop').click(function() { $('#stop').addClass('disabled'); $('#start').removeClass('disabled'); stopUpdate = true })

    // The empty grid
    for(i = 0; i < Y; ++i) {
        line = []
        for(j = 0; j < X; ++j) {
            line.push(0)
        }
        g.push(line)
    }

    // The event handlers
    c.onmousedown = handle_mousedown
    c.onmouseup = handle_mouseup
    c.onmousemove = handle_move

    // Starts to draw
    drawIntervalId = setInterval(draw, 1000/50)
}

// Draws the grid to the screen
draw = function() {
    var c = $('#c')[0]
    var ctx = c.getContext("2d")

    ctx.canvas.height = Y * RECT_SIZE
    ctx.canvas.width = X * RECT_SIZE

    ctx.clearRect(0, 0, c.width, c.height)
    ctx.beginPath();
    for(i = 0; i < g[0].length; ++i) {
        for(j = 0; j < g.length; ++j) {

            if(g[j][i] == 1) ctx.fillStyle = ACTIVE_COLOR;
            else ctx.fillStyle = INACTIVE_COLOR;
            ctx.fillRect(i*RECT_SIZE, j*RECT_SIZE, RECT_SIZE, RECT_SIZE)
        }
    }
    ctx.stroke();
}

// Updates the grid following these rules : a cell with 1 neighbor or less or 4
// neighbors or more dies.  A cell with 2 or 3 neighbors lives. An empty cell with
// 3 neighbors spawns an alive cell.
update = function() {
    // Updates the speed interval
    if(!stopUpdate) {
        setTimeout(update, $('#speed').prop('max') - $('#speed').val())
    }

    var updated_g = []
    for(i = 0; i < g.length; ++i) {
        line = []
        for(j = 0; j < g[0].length; ++j) {
            neighbors =  count_neighbors(j, i)
            line.push((neighbors == 2 && g[i][j] == 1) || neighbors == 3 ? 1 : 0)
        }
        updated_g.push(line)
    }
    g = updated_g
}

// Ugly function to count how may neighbors a cell has
function count_neighbors(x, y) {
    sum = 0
    if(x - 1 >= 0) {
        if(y - 1 >= 0) sum += g[y - 1][x - 1]
        sum += g[y][x - 1]
        if(y + 1 < g.length) sum += g[y + 1][x - 1]
    }

    if(x + 1 < g[0].length) {
        if(y - 1 >= 0) sum += g[y - 1][x + 1]
        sum += g[y][x + 1]
        if(y + 1 < g.length) sum += g[y + 1][x + 1]
    }

    if(y - 1 >= 0) sum += g[y - 1][x]
    if(y + 1 < g.length) sum += g[y + 1][x]

    return sum
}

// Projects the mouse position to grid cell
function mouseToGrid(e) {
    var rect = $('#c')[0].getBoundingClientRect();
    x = Math.floor((e.clientX - rect.left) / RECT_SIZE) // TODO : remove code duplication
    y = Math.floor((e.clientY - rect.top) / RECT_SIZE)

    return { x: x, y: y}
}

$(init);
