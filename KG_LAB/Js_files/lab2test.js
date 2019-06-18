jQuery("document").ready(function () {
    "use strict";
    jQuery('#radius').on('change', function () {
        var radius = jQuery('#radius').val();
        jQuery("#smoothPolygonLineNormal").on('click', function () {
            smoothPolygonLineNormal(radius);
        });
        jQuery("#smoothPolygonLineRandom").on('click', function () {
            smoothPolygonLineRandom();
        });
        jQuery("#smoothPolygonLineCoeffs").on('click', function () {
            var coeff = jQuery('#coeff').val();
            smoothPolygonLineCoeffs(radius, coeff);
        });
    });

    jQuery("#generate_polygon_lines").on('click', function () {
        generate_polygon_lines();
    });



    jQuery("#showCircles").on('click', function () {
        showCircles();
    });
    jQuery("#drawLines1").on('click', function () {
        drawLines('black');
    });
    jQuery("#drawLines2").on('click', function () {
        drawLines('#16ff1b');
    });

    jQuery("#drawPolygonLine").on('click', function () {
        drawPolygonLine();
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

    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    function showCircles(){
        ctx.lineWidth=1;
        for(var i=0; i< centers.length; i++){
            ctx.beginPath();
            ctx.strokeStyle = "#99160d";
            ctx.arc(centers[i][0].x, centers[i][0].y, centers[i][1], 0, 2*Math.PI);
            ctx.stroke();
        }
    }

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    function generate_polygon_lines() {
        centers.length = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points.length = 0;
        cPoints.length = 0;
        point_mass = [];
        let num = parseInt(input[0].value);
        num += 2;
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

    function drawPolygonLine(){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffaaaa';
        ctx.beginPath();
        ctx.moveTo(point_mass[0].x, point_mass[0].y);
        let len = point_mass.length;

        for (let i = len - 1; i >= 1; i--) {
            let item = point_mass[i];
            ctx.lineTo(item.x, item.y);
            ctx.lineWidth = 2; // толщина линии
            ctx.strokeStyle = "#16ff1b"; // цвет линии
            ctx.stroke();
        }
        ctx.closePath();

    }
    function get_center(point1, point2) {
        var lx = (point2.x - point1.x) / 2;
        var ly = (point2.y - point1.y) / 2;
        var point = new Point(point1.x + lx, point1.y + ly);
        len.push(Math.hypot(lx, ly));
        return point;
    }

    function getSameSide(far, center, length) {
        var lx = (far.x - center.x);
        var ly = (far.y - center.y);
        var coeff = length / Math.hypot(lx, ly);
        lx *= coeff;
        ly *= coeff;
        console.log(far, center, coeff, lx, ly);
        return new Point(center.x + lx, center.y + ly);

    }
    function smoothPolygonLineNormal(radius){
        coeffs.length=0;
        for(var i=0; i<point_mass.length;i++){
            coeffs.push(1);
        }
        smoothPolygon(radius);
    }
    function smoothPolygonLineRandom(){
        coeffs.length=0;
        for(var i=0; i<point_mass.length;i++){
            coeffs.push(Math.random());
        }
        smoothPolygon();
    }
    function smoothPolygonLineCoeffs(radius, coeff){
        coeffs.length=0;
        for(var i=0; i<point_mass.length;i++){
            coeffs.push(coeff);
        }
        smoothPolygon(radius);
    }

    function smoothPolygon(radius) {
        centers.length = 0;
        points.length = 0;
        cPoints = point_mass.slice();
        cPoints.push(point_mass[0], point_mass[1]);
        console.log('cPoints=', cPoints);


        for (let i = 1; i < cPoints.length-3; i++) {
            len.length = 0;
            var antiClockwise = false;
            var point1 = cPoints[i];
            var point2 = cPoints[i + 1];
            var point3 = cPoints[i + 2];
            var center12 = get_center(point1, point2);
            //center12 = get_center(center12, point2);
            var center23 = get_center(point2, point3);
            //center23 = get_center(point2, center23);
            var point;
            var lastPoint;
            var minLength;
            if (len[0] > len[1]) { //3 point closer to 2
                point = getSameSide(point1, point2, len[1]*coeffs[i]);
                //lastPoint = center23;
                lastPoint = getSameSide(point3, point2, len[1]*coeffs[i]);
                minLength = len[1]*coeffs[i];
                points.push(point);
                points.push(lastPoint);

            } else { //1 point closer to 2
                point = getSameSide(point3, point2, len[0]*coeffs[i]);
                //lastPoint = center12;
                lastPoint = getSameSide(point1, point2, len[0]*coeffs[i]);
                minLength = len[0]*coeffs[i];
                points.push(lastPoint);
                points.push(point);
            }
//                drawPoint(point.x, point.y, 2);
//                drawPoint(point2.x, point2.y, 2);
//                drawPoint(lastPoint.x, lastPoint.y, 2);

            getBisecCenter(point, point2, lastPoint, minLength);

        }

    }

    function drawLines(color){
        console.log(points);
        ctx.strokeStyle=color;
        ctx.lineWidth=2;
        for(var i=0;i<point_mass.length-1;i++){
            console.log(2*i+1, 2*i+2);
            ctx.beginPath();
            ctx.moveTo(points[2*i+1].x, points[2*i+1].y);
            ctx.lineTo(points[2*i+2].x, points[2*i+2].y);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(points[point_mass.length*2-1].x, points[point_mass.length*2-1].y);
        ctx.lineTo(points[0].x, points[0].y);
        ctx.stroke();


    }

    function getBisecCenter(p1, center, p2, sideLength) {
        var antiClockwise = false;
        var angle1 = Math.atan2(p1.y - center.y, p1.x - center.x);
        var angle2 = Math.atan2(p2.y - center.y, p2.x - center.x);
        var angleArray = [angle1, angle2];
        angleArray.sort(function(a, b) {
            return a - b
        });
//                angleArray[0]+=Math.PI*2;
//                angleArray[1]+=Math.PI*2;
        var diff = 0, mid = 0;
        var angleArray2 = angleArray.slice();
        var centerAngle = 0;
        var angle2Y = angleArray[1]-angleArray[0];
        console.log('Point one  = ', p1,', Center Point = ', center,', Point Two = ', p2);
        console.log('One angle2  = ', angleArray2[0],' Two Angle2 = ', angleArray2[1]);
        console.log('One angle  = ', angleArray[0],' Two Angle = ', angleArray[1]);
        console.log('Diff =   = ', diff,' angle Y  = ', mid);
        console.log('centerAngle =   = ', centerAngle);
        console.log('angle2Y =   = ', angle2Y);
        centerAngle = angleArray2[0]+angle2Y/2;
        console.log('centerAngle =   = ', centerAngle);
        if (angle2Y>Math.PI)
        {
            centerAngle+=Math.PI;
            antiClockwise = true;
        }
        console.log('centerAngle =   = ', centerAngle);
        var length = Math.abs(sideLength/Math.cos(angle2Y/2));
        console.log('sideLength = ',sideLength, ' length =   = ', length);

        var centerPoint = new Point(center.x+length*Math.cos(centerAngle),
            center.y+length*Math.sin(centerAngle));

        var radius = Math.abs(sideLength * Math.tan(angle2Y/2));

        angle1 = Math.atan2(p1.y - centerPoint.y, p1.x - centerPoint.x);
        angle2 = Math.atan2(p2.y - centerPoint.y, p2.x - centerPoint.x);
        var minAngle = 0;
        var maxAngle = 0;
        antiClockwise = false;
        if(angle1 < angle2)
        {
            minAngle = angle1;
            maxAngle = angle2;
            console.log('Min angle = angle1');
        }
        else{
            minAngle = angle2;
            maxAngle = angle1;
            console.log('Min angle = angle2');
        }
        console.log('Min angle = ', minAngle,', Max angle = ', maxAngle,', antiClockwise' +  antiClockwise);
        if(maxAngle-minAngle>Math.PI){
            minAngle+=2*Math.PI;
            var tmp = minAngle;
            minAngle = maxAngle;
            maxAngle = tmp;
        }
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2.5;
        console.log('Min angle = ', minAngle,', Max angle = ', maxAngle,', antiClockwise' + antiClockwise,'\n\n\n\n');
        console.log('_________ Отношение длины дуги к радиусу = ', (maxAngle-minAngle)/Math.PI);
        ctx.arc(centerPoint.x, centerPoint.y, radius, minAngle, maxAngle, antiClockwise);
        centers.push([centerPoint, radius]);
        ctx.stroke();
    }
});