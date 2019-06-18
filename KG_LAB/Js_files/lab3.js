jQuery("document").ready(function () {
    "use strict";
    jQuery('#generate_polygon_lines').on('click', function () {
        generate_polygon_lines();
    });
    jQuery('#generate_polygon').on('click', function () {
        generate_polygon();
    });
    jQuery('#exclude').on('click', function () {
        exclude();
    });

    var canvas = document.getElementById('canvas');
    var input = document.getElementsByName('corner');
    var ctx = canvas.getContext('2d');
    var point_mass = [];
    var e = [];
    var len = [];
    ctx.lineWidth = 2;
    var points = [];
    var cPoints = [];
    var centers = [];
    var coeffs = [];
    var pol1, pol2;
    var color = [];
    var click = 0;
    var svet_color = '#000000';
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    class Polygon{
        constructor(points){
            this.points = points;
        }
        shift(dx){
            let points = [];
            this.points.forEach(function (item){
                points.push([item[0]-dx,item[1]])
            });
            this.points = points;
        }
    }

    function generate_polygon_lines() {
        centers.length = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points.length = 0;
        cPoints.length = 0;
        point_mass = [];
        let num = parseInt(input[0].value);
        //console.log(num);
        let degrees = 360 / num;

        for (let i = 0; i < num; i++) {
            let r = getRandom(25, 300);
            let deg = getRandom(degrees * i, degrees * (i + 1)) * (Math.PI / 180);
            let point = new Point(canvas.width/2 + Math.sin(deg) * r, canvas.height/2 + Math.cos(deg) * r);
            point_mass.push(point);
        }
        console.log(point_mass);
        drawPolygonLine();
    }

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    function drawPolygonLine(){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff2f26';
        ctx.beginPath();
        ctx.moveTo(point_mass[0].x, point_mass[0].y);
        let len = point_mass.length;

        for (let i = len - 1; i >= 0; i--) {
            let item = point_mass[i];
            ctx.lineTo(item.x, item.y);
            ctx.lineWidth = 2; // толщина линии
            ctx.strokeStyle = "#16ff1b"; // цвет линии
            ctx.fill();
        }
        ctx.closePath();

    }

    canvas.onclick = function () {
        let x=event.offsetX;
        let y=event.offsetY;
        // c.moveTo(x,y);
        // points.push([x,y]);
        let point = [x,y];
        point_mass.push(point);



        ctx.beginPath();
        ctx.arc(x, y, 0.1, 0, 2*Math.PI, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.lineWidth = 0.1;
        ctx.strokeStyle = 'blue';
        ctx.stroke();
        ctx.closePath();
    };


    function generate_polygon(){
        point_mass.push([point_mass[0][0],point_mass[0][1]]);
        console.log(point_mass);
        pol1 = new Polygon(point_mass);
        var colors;
        colors = 'rgba(22,255,27,0.7)';
        draw_polygon(point_mass,colors);
        color.push(colors);
        // draw_polygon(point_mass,color);
    }

    function draw_polygon(point_mass,color){
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(point_mass[0][0], point_mass[0][1]);
        let len = point_mass.length;
        for(let i = len - 1; i >= 0; i--){
            let item = point_mass[i];
            ctx.lineTo(item[0],item[1]);

        }
        ctx.closePath();
        ctx.lineWidth=0;
        ctx.fill();

    }

    function exclude() {
        point_mass.push([point_mass[0][0],point_mass[0][1]]);
        console.log(point_mass);
        pol1 = new Polygon(point_mass);
        var colors;
        colors = '#deefff';
        draw_exclude(point_mass,colors);
        color.push(colors);
        // draw_polygon(point_mass,color);
        point_mass = [];
    }

    function draw_exclude(point_mass,color){
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(point_mass[0][0], point_mass[0][1]);
        let len = point_mass.length;
        for(let i = len - 1; i >= 0; i--){
            let item = point_mass[i];
            ctx.lineTo(item[0],item[1]);
            ctx.lineWidth = 1; // толщина линии
            ctx.strokeStyle = "#deefff"; // цвет линии
            ctx.stroke();
        }
        ctx.closePath();
        ctx.fill();


    }
});