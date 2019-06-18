jQuery("document").ready(function () {
   "use strict";
    var p1_x, p1_y, p2_x, p2_y, p3_x, p3_y, p4_x, p4_y;
    var q_x, q_y;

    jQuery('#give_value').on('click', function () {
        var radio = jQuery('input[name=figure]:checked').val();
        p1_x = jQuery('#coord_figure_x1').val();
        p1_y = jQuery('#coord_figure_y1').val();
        p2_x = jQuery('#coord_figure_x2').val();
        p2_y = jQuery('#coord_figure_y2').val();
        p3_x = jQuery('#coord_figure_x3').val();
        p3_y = jQuery('#coord_figure_y3').val();
        p4_x = p3_x - (p2_x - p1_x);
        p4_y = p1_y - (p2_y - p3_y);

        q_x = jQuery('#coord_point_x').val();
        q_y = jQuery('#coord_point_y').val();
        paint(p1_x, p1_y, p2_x, p2_y, p3_x, p3_y, p4_x, p4_y, q_x, q_y, radio);
        locate_point(p1_x, p1_y, p2_x, p2_y, p3_x, p3_y, q_x, q_y, radio);
    });

    jQuery('#random_point').on('click', function () {
       q_x = getRandomInt(0, 600);
       q_y = getRandomInt(0, 600);
       jQuery('#coord_point_x').val(q_x);
       jQuery('#coord_point_y').val(q_y);

    });
    function paint(p1_x, p1_y, p2_x, p2_y, p3_x, p3_y, p4_x, p4_y, q_x, q_y, radio) {
        var canvas = document.getElementById('canvas');
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.moveTo(p1_x, p1_y);
            ctx.lineTo(p2_x, p2_y);
            ctx.lineTo(p3_x, p3_y);
            if (radio == 2) {
                ctx.lineTo(p4_x, p4_y);
            }
            ctx.lineTo(p1_x, p1_y);
            ctx.fill();
            ctx.closePath();
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(q_x, q_y, 4, 0, 2*Math.PI);
            ctx.fill();
            ctx.closePath();

        }
    }


    function locate_point(p1_x, p1_y, p2_x, p2_y, p3_x, p3_y, q_x, q_y, radio) {
        var V = [p2_x - p1_x, p2_y - p1_y];
        var W = [p3_x - p2_x, p3_y - p2_y];
        var Q_O = [q_x - p1_x, q_y - p1_y];

        var eps = Math.pow(10, -9);
        var matrix = [V, W];
        matrix = InverseMatrix(matrix);
        var t_tau = [matrix[0][0]*Q_O[0] + matrix[1][0]*Q_O[1], matrix[0][1]*Q_O[0]+matrix[1][1]*Q_O[1]];
        if (radio == 2) {
            if ((t_tau[0] > eps && t_tau[0] < (1-eps)) && (t_tau[1] > eps && t_tau[1] < (1-eps))) {
                jQuery('#result').html('RESULT: Точка внутри');
            } else if ((t_tau[0] >= (-eps) && t_tau[0] <= (1+eps)) && (t_tau[1] >= (-eps) && t_tau[1] <= (1 + eps))) {
                jQuery('#result').html('RESULT: Точка на границе')
            } else {
                jQuery('#result').html('RESULT: Точка снаружи')
            }
        } else if (radio == 1){
            if (t_tau[1] > eps && t_tau[0] > t_tau[1] && t_tau[0] < (1 - eps)) {
                jQuery('#result').html('RESULT: Точка внутри')
            } else if (t_tau[1] >= (-eps) && t_tau[0] >= t_tau[1] && t_tau[0] <= 1+eps) {
                jQuery('#result').html('RESULT: Точка на границе')
            } else {
                jQuery('#result').html('RESULT: Точка снаружи')
            }
        }
    }

    function InverseMatrix(A)   // A - двумерный квадратный массив
    {
        var det = Determinant(A);                // Функцию Determinant см. выше
        if (det == 0) return false;
        var N = A.length, A = AdjugateMatrix(A); // Функцию AdjugateMatrix см. выше
        for (var i = 0; i < N; i++)
        { for (var j = 0; j < N; j++) A[i][j] /= det; }
        return A;
    }

    function AdjugateMatrix(A)   // A - двумерный квадратный массив
    {
        var N = A.length, adjA = [];
        for (var i = 0; i < N; i++)
        { adjA[i] = [];
            for (var j = 0; j < N; j++)
            { var B = [], sign = ((i+j)%2==0) ? 1 : -1;
                for (var m = 0; m < j; m++)
                { B[m] = [];
                    for (var n = 0; n < i; n++)   B[m][n] = A[m][n];
                    for (var n = i+1; n < N; n++) B[m][n-1] = A[m][n];
                }
                for (var m = j+1; m < N; m++)
                { B[m-1] = [];
                    for (var n = 0; n < i; n++)   B[m-1][n] = A[m][n];
                    for (var n = i+1; n < N; n++) B[m-1][n-1] = A[m][n];
                }
                adjA[i][j] = sign*Determinant(B);   // Функцию Determinant см. выше
            }
        }
        return adjA;
    }

    function Determinant(A)   // Используется алгоритм Барейса, сложность O(n^3)
    {
        var N = A.length, B = [], denom = 1, exchanges = 0;
        for (var i = 0; i < N; ++i)
        { B[i] = [];
            for (var j = 0; j < N; ++j) B[i][j] = A[i][j];
        }
        for (var i = 0; i < N-1; ++i)
        { var maxN = i, maxValue = Math.abs(B[i][i]);
            for (var j = i+1; j < N; ++j)
            { var value = Math.abs(B[j][i]);
                if (value > maxValue){ maxN = j; maxValue = value; }
            }
            if (maxN > i)
            { var temp = B[i]; B[i] = B[maxN]; B[maxN] = temp;
                ++exchanges;
            }
            else { if (maxValue == 0) return maxValue; }
            var value1 = B[i][i];
            for (var j = i+1; j < N; ++j)
            { var value2 = B[j][i];
                B[j][i] = 0;
                for (var k = i+1; k < N; ++k) B[j][k] = (B[j][k]*value1-B[i][k]*value2)/denom;
            }
            denom = value1;
        }
        if (exchanges%2) return -B[N-1][N-1];
        else return B[N-1][N-1];
    }

    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


});