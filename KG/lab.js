let canvas = document.getElementById('canvas');
let c = canvas.getContext('2d');
let rad;
jQuery("#drawPolygonLine").on('click', function () {
    drawPolygonLine();
});
function setupUI() {    
    let randomButton = $('#randomButton');
    let clearButton = $('#clearButton');
    let polyButton = $('#polyButton');
    let allButton = $('#allButton');
    let convexButton = $('#convexButton');
    let concaveButton = $('#concaveButton');
    let pointNumber = $('#pointsNumber');
    rad = +pointNumber.prop('value');
    //c.fillRect(10, 10, 55, 50);
    //let canvas = document.getElementById('canvas');
    //var canvas = document.getElementById('canvas');
    //var c = canvas.getContext('2d');
    let poly = [];
    polyButton.on('click', function() {
        poly = generate_polygon();
    });
    
    allButton.on('click', function() {
        rad = +pointNumber.prop('value');
        smooth_polygon(poly);
    });
    
    convexButton.on('click', function() {
        rad = +pointNumber.prop('value');
        convexProcess(poly);
    });
    
    concaveButton.on('click', function() {
        rad = +pointNumber.prop('value');
        concaveProcess(poly);
    });
        
    clearButton.on('click', function() {
        c.clearRect(0, 0, canvas.width, canvas.height);
    });
    
    pointNumber.on('change', function(e) {
        const max = 100;
        const min = 3;
        let value = e.target.value;
        
        if (value > max) value = max;
        if (value < min) value = min;
        
        e.target.value = value;
    });
        
}

function getRandom(min, max) {
      return Math.random() * (max - min) + min;
      
}

function generate_polygon(){
    //let canvas = document.getElementById('canvas');
    let num = 9;
    //let c = canvas.getContext('2d');
    c.clearRect(0, 0, canvas.width, canvas.height);
    let point_mass = [];
    let degrees = 360/num;
    for(let i = 0;i < num;i++){
        let r = getRandom(25, 200);
        let deg = getRandom(degrees*i, degrees*(i+1)) * (Math.PI/180);
        let point = [400+Math.sin(deg)*r,200+Math.cos(deg)*r];
        point_mass.push(point);
    }
    //console.log(point_mass);
    c.fillStyle = 'skyblue';
    //c.save();
    c.beginPath();
    c.moveTo(point_mass[0][0], point_mass[0][1]);
    let len = point_mass.length;
    for(let i = len - 1; i >= 1; i--){
        let item = point_mass[i];
        c.lineTo(item[0],item[1]);
        c.lineWidth = 1; // толщина линии
        c.strokeStyle = "red"; // цвет линии
        c.stroke();
    }
    c.closePath();
    //c.restore();

    return point_mass;

}
function getAngle(pt1, pt2, pt3)
{
    let dx1 = pt1[0] - pt2[0];
    let dy1 = pt1[1] - pt2[1];
    let dx2 = pt3[0] - pt2[0];
    let dy2 = pt3[1] - pt2[1];
    let det = dx1*dy2 - dx2*dy1;
    let dot = dx1*dx2 + dy1*dy2;
    let vec1Abs = Math.sqrt(dx1*dx1 + dy1*dy1);
    let vec2Abs = Math.sqrt(dx2*dx2 + dy2*dy2);
    let myCos = dot / vec1Abs;
    myCos = myCos / vec2Abs;
    let result = Math.acos(myCos);
    //if (det < 0) result = (-1) * result;
    return result;
}

function get_center(x1,y1,x2,y2){
    let lx = (x2-x1)/2;
    let ly = (y2-y1)/2;
    let point = [x1+lx, y1+ly];
    return point;
}

function get_nf2(ax,ay,bx,by,px,py){
    let x1 = px - ax;
    let y1 = py - ay;
    let x2 = bx - ax;
    let y2 = by - ay;
    let det = x1*y2 - y1*x2;
    return det;
}
function drawLine(p1,p2,color){
    c.beginPath();
    c.moveTo(p1[0],p1[1]);
    c.lineTo(p2[0],p2[1]);
    c.lineWidth = 1; // толщина линии
    c.strokeStyle = color; // цвет линии
    c.stroke();
}

function getVec(pt1,pt2,pt3) {
    let dx1 = pt1[0] - pt2[0];
    let dy1 = pt1[1] - pt2[1];
    let dx2 = pt3[0] - pt2[0];
    let dy2 = pt3[1] - pt2[1];
    let dx3 = pt1[0] - pt2[0];
    let dy3 = pt1[1] - pt2[1];
    //let det = dx1*dy2 - dx2*dy1;
    //let dot = dx1*dx2 + dy1*dy2;
    let vec1Abs = Math.sqrt(dx1*dx1 + dy1*dy1);
    let vec2Abs = Math.sqrt(dx2*dx2 + dy2*dy2);
    //let det = vecAbs-vec2Abs;
    return[[dx1/vec1Abs,dy1/vec1Abs],[dx2/vec2Abs,dy2/vec2Abs],vec1Abs,vec2Abs];
}

function drawAngle(pt3, pt2, pt1) {
    //let canvas = $('#canvas');
    let dx1 = pt1[0] - pt2[0];
    let dy1 = pt1[1] - pt2[1];
    let dx2 = pt3[0] - pt2[0];
    let dy2 = pt3[1] - pt2[1];
    let a2 = Math.atan2(dy1, dx1);
    let a1 = Math.atan2(dy2, dx2);
    let a = parseInt((a2 - a1) * 180 / Math.PI + 360) % 360;
    //c.arc(pt2[0], pt2[1], 20, a1, a2);
    //return a;
    c.save();
    c.beginPath();
    c.moveTo(pt2[0], pt2[1]);
    c.arc(pt2[0], pt2[1], 20, a1, a2);
    c.closePath();
    c.fillStyle = "green";
    c.globalAlpha = 0.25;
    c.fill();
    c.restore();
    c.fillStyle = "black";
    c.fillText(a, pt2[0] + 15, pt2[1]);

}
function smooth_polygon(point_mass){
    for (let i = 1; i < point_mass.length-1; i++) {
        if (i == point_mass.length - 2){
            let a = getAngle(point_mass[i],point_mass[i+1],point_mass[0]);
            let vw = getVec(point_mass[i],point_mass[i+1],point_mass[0]);
            let r = rad;
            let r1 =0.5*vw[2];
            let r2 =0.5*vw[3];
            let d;
            if (r1 < r){
                d = r1;
            }else if(r2 < r){
                d = r2;
            }else{
                d = r;
            }
            let gx =  point_mass[i+1][0] + d * vw[0][0];
            let gy =  point_mass[i+1][1] + d * vw[0][1];
            let hx =  point_mass[i+1][0] + d * vw[1][0];
            let hy =  point_mass[i+1][1] + d * vw[1][1];
            c.beginPath();
            c.moveTo(gx,gy);
            c.quadraticCurveTo(point_mass[i+1][0], point_mass[i+1][1], hx,hy);
            c.lineWidth = 2;
            c.strokeStyle = "black";
            c.stroke();
        }
        else if(i == point_mass.length-1){
            let a = getAngle(point_mass[i],point_mass[0],point_mass[1]);
            let vw = getVec(point_mass[i],point_mass[0],point_mass[1]);
            let r = rad;
            let r1 =0.5*vw[2];
            let r2 =0.5*vw[3];
            let d;
            if (r1 < r){
                d = r1;
            }else if(r2 < r){
                d = r2;
            }else{
                d = r;
            }
            let gx =  point_mass[0][0] + d * vw[0][0];
            let gy =  point_mass[0][1] + d * vw[0][1];
            let hx =  point_mass[0][0] + d * vw[1][0];
            let hy =  point_mass[0][1] + d * vw[1][1];
            c.beginPath();
            c.moveTo(gx,gy);
            c.quadraticCurveTo(point_mass[0][0], point_mass[0][1], hx,hy);
            c.lineWidth = 2;
            c.strokeStyle = "black";
            c.stroke();
        }
        else{
            let a = getAngle(point_mass[i],point_mass[i+1],point_mass[i+2]);
            let vw = getVec(point_mass[i],point_mass[i+1],point_mass[i+2]);
            let r = rad;
            let r1 =0.5*vw[2];
            let r2 =0.5*vw[3];
            let d;
            if (r1 < r){
                d = r1;
            }else if(r2 < r){
                d = r2;
            }else{
                d = r;
            }
            let gx =  point_mass[i+1][0] + d * vw[0][0];
            let gy =  point_mass[i+1][1] + d * vw[0][1];
            let hx =  point_mass[i+1][0] + d * vw[1][0];
            let hy =  point_mass[i+1][1] + d * vw[1][1];
            c.beginPath();
            c.moveTo(gx,gy);
            c.quadraticCurveTo(point_mass[i+1][0], point_mass[i+1][1], hx,hy);
            c.lineWidth = 2;
            c.strokeStyle = "black";
            c.stroke();
        }

    }

}


/*function smooth_polygon(point_mass){
    let e = [];
    let concave = [];
    let convex = [];
    let s = 0;
    let f = 0;
    for(let i = 0;i < point_mass.length; i++){
        if(i==point_mass.length - 1){
            e.push(get_center(point_mass[i][0],point_mass[i][1],point_mass[0][0],point_mass[0][1]));
        } else{
            e.push(get_center(point_mass[i][0],point_mass[i][1],point_mass[i+1][0],point_mass[i+1][1]));
        }
    }
    c.beginPath();
    for(let i = 0;i < e.length;i++){
        if(i==e.length - 1){
            c.moveTo(e[i][0], e[i][1]);
            c.quadraticCurveTo(point_mass[0][0], point_mass[0][1], e[0][0], e[0][1]);
        }else{
            c.moveTo(e[i][0], e[i][1]);
            c.quadraticCurveTo(point_mass[i+1][0], point_mass[i+1][1], e[i+1][0], e[i+1][1]);
        }
        c.lineWidth = 2;
        // // line color
        c.strokeStyle = "Indigo";
        c.stroke();   
    }
}*/




setupUI();