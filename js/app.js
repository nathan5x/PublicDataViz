
var myLineChart;
$(document).ready(function(){

  var dummyData = [];
  var pollingTimer = window.setInterval( getWeatherData, 45000);
  var globalData = [];
  var initialized = false;
  var $lineChart;

  Highcharts.theme = {
    colors: ["#f05f40", "#2b908f", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
    "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
    chart: {
      backgroundColor: {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
        stops: [
          [0, '#222222'],
          [1, '#222222']
        ]
      },
      style: {
        fontFamily: "'Unica One', sans-serif"
      },
      plotBorderColor: '#606063'
    },
    xAxis: {
      gridLineColor: '#707073',
      labels: {
        style: {
          color: '#E0E0E3'
        }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
        style: {
          color: '#A0A0A3'

        }
      }
    },
    yAxis: {
      gridLineColor: '#707073',
      labels: {
        style: {
          color: '#E0E0E3'
        }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
        style: {
          color: '#f05f40'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
        color: '#F0F0F0'
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          color: '#B0B0B3'
        },
        marker: {
          lineColor: '#333'
        }
      },
      boxplot: {
        fillColor: '#505053'
      },
      candlestick: {
        lineColor: 'white'
      },
      errorbar: {
        color: 'white'
      }
    },
    legend: {
      itemStyle: {
        color: '#E0E0E3'
      },
      itemHoverStyle: {
        color: '#FFF'
      },
      itemHiddenStyle: {
        color: '#606063'
      }
    },
    credits: {
      style: {
        color: '#666'
      }
    },
    labels: {
      style: {
        color: '#707073'
      }
    },

    drilldown: {
      activeAxisLabelStyle: {
        color: '#F0F0F3'
      },
      activeDataLabelStyle: {
        color: '#F0F0F3'
      }
    },

    navigation: {
      buttonOptions: {
        symbolStroke: '#DDDDDD',
        theme: {
          fill: '#505053'
        }
      }
    }
  };

  // Apply the theme
  Highcharts.setOptions(Highcharts.theme);

  function getWeatherData() {
    $.ajax({
      url: "https://data.sparkfun.com/output/dZ4EVmE8yGCRGx5XRX1W.json",
      dataType: "jsonp",
      data: {page: 1},
      success: function( response ) {
        globalData.push.apply(globalData, response);
        console.log(globalData);
        if(!initialized) {
          renderData();
        }
      }
    });
  }

  var chartOptions = {};

  function renderData() {
    initialized = true;
    var humidData = [];
    var tempData =[];
    var labelsData =[];

    var len = globalData.length;

    if(!$lineChart) {
      for(var i=25; i>=0; i--) {
        var data = globalData[i];
        labelsData.push( data.measurementTime );
        tempData.push( parseFloat(data.tempf) );
        humidData.push( parseFloat(data.humidity) );
      }
      chartOptions = {
        title: {
          text: '',
          y: 20 //center
        },
        subtitle: {
          text: '',
          y: 40
        },
        xAxis: {
          categories: labelsData
        },
        yAxis:[{ //first axis
          title: {
            text: 'Temperature',
            style: {
              color: '#f05f40'
            }
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: Highcharts.getOptions().colors[0]
          }],
          labels: {
            format: '{value}°C'
          },
        }, { //second axis
          title: {
            text: 'Humidity',
            style: {
              color: '#2b908f'
            }
          },
          labels: {
            format: '{value}%'
          },
          plotLines: [{
            value: 1,
            width: 1,
            color: Highcharts.getOptions().colors[1]
          }],
          opposite:true
        }],
        tooltip: {
          valueSuffix: '°C'
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        },
        series: [{
          name: 'Temperature',
          data: tempData
        }, {
          name: 'Humidity',
          data: humidData
        }]
      };

      $lineChart =  $('#cLevelChartContainer').highcharts(chartOptions);
      $lineChart2 =  $('#bLevelChartContainer').highcharts(chartOptions);
    }

    var offset = 2;
    var pointer = 2;
    var highTemp = 0;
    var highHumidity = 0;
    window.setInterval( function(){
      for(var j=pointer-2; j>=pointer-offset; j--) {
        var nData = globalData[j];
        var $lineChart = $('#cLevelChartContainer').highcharts();
        if(highTemp < nData.tempf) {
            highTemp = nData.tempf;
            $('#highTempText').html(highTemp +'&#176;C');
            updateClock(nData.measurementTime, 'Temp');
            $('#tempTimeText').html(nData.measurementTime);
        }

        if(highHumidity < nData.humidity) {
            highHumidity = nData.humidity;
            $('#highHumidText').html(highHumidity +'%');
            updateClock(nData.measurementTime, 'Humid');
            $('#humidTimeText').html(nData.measurementTime);
        }

        $lineChart.series[0].addPoint({
          y: parseFloat(nData.tempf),
          name: nData.measurementTime}, true, true);

          $lineChart.series[1].addPoint({
            y: parseFloat(nData.humidity),
            name: nData.measurementTime}, true, true);

            var $lineChartB = $('#bLevelChartContainer').highcharts();
            $lineChartB.series[0].addPoint({
              y: parseFloat(nData.tempf),
              name: nData.measurementTime}, true, true);

              $lineChartB.series[1].addPoint({
                y: parseFloat(nData.humidity),
                name: nData.measurementTime}, true, true);
              }
              pointer += 2;
            }, 1000);
          }

          getWeatherData();

        function updateClock(time, dest) {
          var valueArray = time.split(':');
          var hrValue = parseFloat(valueArray[0]) / 12 * 1.0;
          var minValue = parseFloat(valueArray[1]) / 60 * 1.0;
          var secValue = parseFloat(valueArray[2].substring(0, 2)) / 60 * 1.0;

          $('#bLevel'+dest+'Clock_H').circleProgress({
               value: hrValue,
               size: 30,
               startAngle: 80,
               thickness: 6,
               fill: {
                   gradient: ["#f05f40", "#ff0000"]
               },
               emptyFill: "rgba(255, 0, 0, .1)"
           });

           $('#bLevel'+dest+'Clock_M').circleProgress({
              value: minValue,
              size: 60,
              startAngle: 80,
              thickness: 6,
              fill: {
                  gradient: ["#f2f2f2", "#ffffff"]
              }
          });

          $('#bLevel'+dest+'Clock_S').circleProgress({
             value: secValue,
             size: 90,
             startAngle: 80,
             thickness: 6,
             fill: {
                 gradient: ["#cecece", "#f05f40"]
             }
         });
        }

});
