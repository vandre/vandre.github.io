function renderLabels(cfg) {
    var grid_size = cfg.gridSize;
    var x_axis_distance_grid_lines = 1;
    var y_axis_distance_grid_lines = 8; //9 positve lines and 9 negative
    var x_axis_starting_point = { number: 5, suffix: '%' };
    var canvas = document.getElementById(cfg.id);
    var ctx = canvas.getContext("2d");
    var canvas_width = canvas.width;
    var num_lines_y = Math.floor(canvas_width / grid_size);

    // Translate to the new origin. Now Y-axis of the canvas is opposite to the Y-axis of the graph. So the y-coordinate of each element will be negative of the actual
    ctx.translate(y_axis_distance_grid_lines * grid_size, x_axis_distance_grid_lines * grid_size);
    ctx.lineWidth = 1;
    ctx.font = '1.1em Arial';
    ctx.textAlign = 'center';
    // text  along the positive X-axis
    for (i = 0; i < (num_lines_y - y_axis_distance_grid_lines); i++) {
        ctx.fillText(x_axis_starting_point.number * i + x_axis_starting_point.suffix, grid_size * i + 2, 5);
    }

    // Text along the negative X-axis
    for (i = 1; i < y_axis_distance_grid_lines; i++) {
        ctx.fillText(-x_axis_starting_point.number * i + x_axis_starting_point.suffix, -grid_size * i + 2, 5);
    }

}
function renderChart(cfg) {
    var grid_size = cfg.gridSize;
    var x_axis_distance_grid_lines = 1;
    var y_axis_distance_grid_lines = 8; //9 positve lines and 9 negative
    var x_axis_starting_point = { number: 5, suffix: '%' };
    var canvas = document.getElementById(cfg.id);
    var ctx = canvas.getContext("2d");
    var canvas_width = canvas.width;
    var canvas_height = canvas.height;
    var num_lines_y = Math.floor(canvas_width / grid_size);

    //AxisLine
    //ctx.strokeStyle = "red";
    //var axisLine = canvas_height / 2 + 0.5;
    //ctx.moveTo(0, axisLine);
    //ctx.lineTo(canvas_width, axisLine);
    //ctx.stroke();

    // Draw grid lines along Y-axis
    for (i = 0; i <= num_lines_y; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;

        // If line represents X-axis draw in different color
        if (i == y_axis_distance_grid_lines) {
            ctx.strokeStyle = "#575757";
            ctx.lineWidth = 2.5;
        }
        else {
            ctx.strokeStyle = "#9D9D9D";
        }

        if (i == num_lines_y) {
            ctx.moveTo(grid_size * i, 0);
            ctx.lineTo(grid_size * i, canvas_height);
        }
        else {
            ctx.moveTo(grid_size * i + 0.5, 0);
            ctx.lineTo(grid_size * i + 0.5, canvas_height);
        }
        ctx.stroke();
    }

    var scale = x_axis_starting_point.number;
    plotRange(cfg.buffer, cfg.cap, grid_size, scale, ctx, canvas_width, canvas_height)
    plotBuffer(cfg.buffer, grid_size, scale, ctx, canvas_width, canvas_height);
    plotCap(cfg.cap, grid_size, scale, ctx, canvas_width, canvas_height);
    plotFundReturn(cfg.fundReturn, grid_size, scale, ctx, canvas_width, canvas_height);
    plotIndexReturn(cfg.indexReturn, grid_size, scale, ctx, canvas_width, canvas_height);
    renderTooltips(canvas, cfg.buffer, cfg.cap, cfg.indexReturn, cfg.fundReturn, grid_size, scale);
}

function plotRange(buffer, cap, gridSize, scale, context, canvasWidth, canvasHeight) {
    var width = (cap - buffer) * gridSize / scale + 0.5;
    var height = 8;
    var value = buffer
    var pos_x = canvasWidth / 2 + value * gridSize / scale + 0.5;
    var pos_y = canvasHeight / 2;
    context.fillStyle = "#002D3840";
    var cx = pos_x;
    var cy = pos_y - height / 2;
    context.fillRect(cx, cy, width, height);
}

function plotBuffer(value, gridSize, scale, context, canvasWidth, canvasHeight) {
    var width = 4;
    var height = 16;
    var stroke = "transparent";
    var fill = "#002D38";
    var pos_x = canvasWidth / 2 + value * gridSize / scale + 0.5;
    var pos_y = canvasHeight / 2;
    drawRectangle(context, stroke, fill, pos_x, pos_y, width, height)
}

function plotCap(value, gridSize, scale, context, canvasWidth, canvasHeight) {
    var width = 4;
    var height = 16;
    var stroke = "transparent";
    var fill = "#256B71";
    var pos_x = canvasWidth / 2 + value * gridSize / scale + 0.5;
    var pos_y = canvasHeight / 2;
    drawRectangle(context, stroke, fill, pos_x, pos_y, width, height)
}

function plotIndexReturn(value, gridSize, scale, context, canvasWidth, canvasHeight) {
    var triangle_width = 14;
    var pos_x = canvasWidth / 2 + value * gridSize / scale + 0.5;
    var pos_y = canvasHeight / 2;
    drawTriangle(context, triangle_width, pos_x, pos_y);
}

function plotFundReturn(value, gridSize, scale, context, canvasWidth, canvasHeight) {
    var width = 10;
    var height = 10;
    var stroke = "#002D38";
    var fill = "#ECED90";
    var pos_x = canvasWidth / 2 + value * gridSize / scale + 0.5;
    var pos_y = canvasHeight / 2;
    drawRectangle(context, stroke, fill, pos_x, pos_y, width, height)

}

function drawRectangle(ctx, stroke, fill, x, y, width, height) {
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
    var cx = x - width / 2;
    var cy = y - height / 2;
    ctx.strokeRect(cx, cy, width, height);
    ctx.fillRect(cx, cy, width, height);

}

function drawTriangle(ctx, side, cx, cy) {
    var h = side * (Math.sqrt(3) / 2);
    ctx.strokeStyle = "#002D38";
    ctx.fillStyle = "#85D1DA";
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(-side / 2, h / 2);
    ctx.lineTo(side / 2, h / 2);
    ctx.lineTo(0, -h / 2);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.save();
}

function renderTooltips(canvasEl, buffer, cap, indexReturn, fundReturn, gridSize, scale) {
    var canvas_width = canvasEl.width;
    var buffer_width = 4;
    var cap_width = 4;
    var fund_width = 11;
    var index_width = 11;

    var buffer_height = 14;
    var cap_height = 14;
    var fund_height = 14;
    var index_height = 14;

    var td = canvasEl.parentElement
    var ttDiv = document.createElement('div');

    var bDiv = document.createElement('div');
    var iDiv = document.createElement('div');
    var fDiv = document.createElement('div');
    var cDiv = document.createElement('div');

    bDiv.className = 'b';
    bDiv.setAttribute("data-tooltip", "Buffer: " + buffer + "%");
    var bufferPos = canvas_width / 2 + buffer * gridSize / scale;
    bDiv.style.width = buffer_width;
    bDiv.style.height = buffer_height;
    bDiv.style.left = bufferPos - buffer_width / 2;

    cDiv.className = 'c';
    cDiv.setAttribute("data-tooltip", "Cap: " + cap + "%");
    var capPos = canvas_width / 2 + cap * gridSize / scale;
    cDiv.style.width = cap_width;
    cDiv.style.height = cap_height;
    cDiv.style.left = capPos - cap_width / 2;

    iDiv.className = 'i';
    iDiv.setAttribute("data-tooltip", "Index Return: " + indexReturn + "%");
    var indexPos = canvas_width / 2 + indexReturn * gridSize / scale;
    iDiv.style.width = index_width;
    iDiv.style.height = index_height;
    iDiv.style.left = indexPos - index_width / 2;

    fDiv.className = 'f';
    fDiv.setAttribute("data-tooltip", "Fund Return: " + fundReturn + "%");
    var fundPos = canvas_width / 2 + fundReturn * gridSize / scale;
    fDiv.style.width = fund_width;
    fDiv.style.height = fund_height;
    fDiv.style.left = fundPos - fund_width / 2;

    ttDiv.className = 'tooltips';
    ttDiv.style.width = canvas_width;

    ttDiv.appendChild(bDiv);
    ttDiv.appendChild(cDiv);
    ttDiv.appendChild(iDiv);
    ttDiv.appendChild(fDiv);
    td.prepend(ttDiv);
}


