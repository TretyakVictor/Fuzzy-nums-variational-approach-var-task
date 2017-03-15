// Функция динамической генерации полей для ввода значений п1 и п2
function generateFilds(num) {
  $('#filds').empty().html();
  var arr1 = [], arr2 = [];
  arr1 = [0.9, 0.7, 0.5, 0.3, 0.2, 0.1, 0.05, 0, 0, 0];
  arr2 = [1, 0.98, 0.96, 0.9, 0.82, 0.68, 0.57, 0.45, 0.3, 0.1];
  code = '<table class="table table-hover table-striped text-center"><caption>Введите распределения возможностей</caption><tr><th>&pi;1</th><th>&pi;2</th></tr>';
  for (var i = 0; i < num; i++) {
    code += '<tr><td><input type="number" name="pi1fl_'+i+'" value="'+arr1[i]+'"></td>'+
    '<td><input type="number" name="pi1f2_'+i+'" value="'+arr2[i]+'"></td></tr>';
  }
  code += '</table><button type="button" id="bcalculate1">Расчитать</button>';
  $('#filds').append(code);
  $('#filds').fadeIn(400);
}
// Функция расчета при интерпретации вариационного подхода
function calcVal(p1, p2, cd) {
  var pk, w1, w2, r1, r2, x1=0, y1=0, x2=1, y2=1, x3=p2, y3=0, x4=0, y4=p2;
  // Расчет координат точки пересечения
  var x = ((x1*y2-x2*y1)*(x4-x3)-(x3*y4-x4*y3)*(x2-x1))/((y1-y2)*(x4-x3)-(y3-y4)*(x2-x1));
  var y = ((y3-y4)*x-(x3*y4-x4*y3))/(x4-x3);
  // Расчет весов возможностей п1(z0) и п(z0) в точке z0
  w1 = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
  w2 = cd - w1;
  // Нахождение кооэфициентов отношения r1 и r2 к линии равных возможностей
  r1 = w1/cd;
  r2 = w2/cd;
  // Расчет возможности pk
  pk = r1*p1+r2*p2;
  return [r1, r2, w1, w2, pk];
}

var main = function() {
  "use strict";
  var elemnum = 0;
  $("button[name='bgenerate']").on("click", function(event) {
    elemnum = 10;
    $('#sbgenerate').fadeOut(1, generateFilds(elemnum));
    $('#bcalculate1').click();
    // elemnum = $("input[name='numfilds']").val();
    // $('#gen_filds').fadeOut(400, generateFilds(elemnum));
  });
  // $(document).on("click", "#breset", function(event) {
  //   $('#filds').fadeOut(400);
  //   $('#graph1').fadeOut(400);
  //   $('#graph2').fadeOut(400);
  //   $('#results').fadeOut(400);
  //   $('#gen_filds').fadeIn(400);
  // });
  $(document).on("click", "#bcalculate1", function(event) {
    var error = 0, arrpi1 = [], arrpi2 = [];
    // Заполнение массивов arrpi1 и arrpi2 данными п1 и п2 из соответсвующих полей
    for (var i = 0; i < elemnum; i++) {
      var p1 = $("input[name='pi1fl_"+i+"']").val(), p2 = $("input[name='pi1f2_"+i+"']").val();
      arrpi1[i] = p1;
      arrpi2[i] = p2;
    }
    $('#filds').fadeOut(1);
    if (error == 0) {
      // Потроение результирующей таблицы возможностей
      var arrpk = [];
      $('#results').empty().html();
      code = '<br><table class="table table-hover table-striped text-center"><caption>Результаты анализа</caption><tr><th>№ (возраст)</th><th>&pi;1</th><th>&pi;2</th><th>r1</th><th>r2</th><th>w1</th><th>w2</th><th>&pi;k</th></tr>';
      // Нахождение максимумов среди значений п1 и п2. Вычисление cd - длины линии равных возможностей
      var tmp, max1 = Math.max.apply(null, arrpi1), max2 = Math.max.apply(null, arrpi2), cd = Math.sqrt(Math.pow(max1, 2)+Math.pow(max2, 2));
      for (var i = 0; i < elemnum; i++) {
        // Заполнение таблицы
        console.log(arrpi1[i]);
        tmp = calcVal(arrpi1[i], arrpi2[i], cd);
        arrpk[i] = tmp[4];
        code += '<tr><td>'+(i+1)+' ('+(24+i)+')</td><td>'+arrpi1[i]+'</td>'+'<td>'+arrpi2[i]+'</td>'+'<td>'+tmp[0].toFixed(2)+'</td>'+'<td>'+tmp[1].toFixed(2)+
        '</td>'+'<td>'+tmp[2].toFixed(2)+'</td><td>'+tmp[3].toFixed(2)+'</td><td>'+tmp[4].toFixed(2)+'</td></tr>';
      }
      code += '</table>'+'w ~ '+cd.toFixed(3)+'<br><br>';
      $('#results').append(code);

      // Подготовка числовых данных для построния графика расчета весовых коэффициентов
      var max;
      if (max1 >= max2) {
        max = max1;
      }else {
        max = max2;
      }
      var dataall = [];
      for (var i = 0; i < elemnum; i++) {
        dataall[i] = {color: '#9c9c9c', data:[[0,arrpi1[i]],[max2,arrpi1[i]]]};
      }
      for (var i = 0, len = dataall.length; i < elemnum; i++) {
        dataall[len+i] = {color: '#f00', data:[[arrpi2[i],0],[max,max]]};
      }
      for (var i = 0, len = dataall.length; i < elemnum; i++) {
        dataall[len+i] = {color: '#0f0', data:[[arrpi2[i],0],[0,arrpi2[i]]]};
      }
      dataall[dataall.length] = {label: "линия равных возможностей", color: '#00f', data: [[0,0],[max,max]]};
      // Стилевое офорление отрисовки графиков
      var options = {
        grid: {
          backgroundColor: {
            colors: ["#363636", "#282828"]
          }
        },
       series: {
         lines: {
           show: true,
           lineWidth: 2
         }
       },
       yaxis: {
         tickSize: 0.1
       },
       xaxis: {
         tickSize: 0.1
       }
      };

      // Подготовка числовых данных для построния графика распределения возможностей
      var dataall2 = [], gr1 = [], gr2 = [], gr3 = [];
      for (var i = 0; i < elemnum; i++) {
        gr1[i] = [i, arrpi1[i]];
        gr2[i] = [i, arrpi2[i]];
        gr3[i] = [i, arrpk[i]];
      }
      dataall2[0] = {label: "&pi;1", data: gr1};
      dataall2[1] = {label: "&pi;2", data: gr2};
      dataall2[2] = {label: "&pi;k", data: gr3};

      $('#results').fadeIn(400);
      $('#graph1').fadeIn(400);
      $('#graph2').fadeIn(400);
      // Отрисовка и постройка графиков
      $.plot($("#graph1"), dataall, options);
      $.plot($("#graph2"), dataall2, options);

    } else {
      console.log("empty filds");
    }
  });
};

$(document).ready(main);
