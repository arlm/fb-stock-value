var allDataLoaded, drawVisualization, getChartData, googleIsLoaded, googleLoaded, parseData, parsedGraphData, yahooIsLoaded, yahooLoaded;

jQuery(function($) {
  var displayQuote, getQuote;
  displayQuote = function(data) {
    var change, changePercent, current;
    change = data[0].c;
    changePercent = data[0].cp;
    current = data[0].l;
    $("#current div.value span").html(current);
    $("title").html("$" + current + " - Brazilian Reais verus US Dollars");
    if (change.indexOf("+") >= 0) {
      $(".change").addClass("up");
      $(".change").removeClass("down");
    } else {
      if (change === "0.00") {
        $(".change").removeClass("down");
        $(".change").removeClass("up");
      } else {
        $(".change").addClass("down");
        $(".change").removeClass("up");
      }
    }
    $("#changeStock").html(change);
    return $("#changePercent").html(changePercent + "%");
  };
  getQuote = function() {
    return $.ajax({
      url: "http://www.google.com/finance/info?client=ig&q=CURRENCY:USDBRL",
      success: function(data) {
        displayQuote(data);
        return $('#current').addClass('show');
      },
      error: function() {
        console.log("Retrieving quote data didn't work");
        return $('#current').addClass('error');
      },
      dataType: "jsonp"
    });
  };
  getQuote();
  setInterval(getQuote, 5000);
  return getChartData();
});

yahooIsLoaded = false;

googleIsLoaded = false;

parsedGraphData = [];

yahooLoaded = function(data) {
  parseData(data);
  yahooIsLoaded = true;
  return allDataLoaded();
};

googleLoaded = function() {
  googleIsLoaded = true;
  return allDataLoaded();
};

allDataLoaded = function() {
  if (yahooIsLoaded && googleIsLoaded) {
    return drawVisualization();
  }
};

parseData = function(data) {
  var myResults;
  parsedGraphData.push(["x", "BRL value"]);
  if (data.query.results === null) {
	parsedGraphData.push(["2015-01-01 Start", parseFloat("2.6563")]);
    parsedGraphData.push(["2015-01-02", parseFloat("2.6967")]);
    parsedGraphData.push(["2015-01-05", parseFloat("2.7284")]);
    parsedGraphData.push(["2015-01-06", parseFloat("2.7013")]);
    return parsedGraphData.push(["2015-01-07", parseFloat("2.7000")]);
  } else {
    if (data.query.results !== null) {
      myResults = data.query.results.row;
    }
    if (myResults.length > 1) {
      myResults = myResults.reverse();
    }
    return _.each(myResults, function(quote) {
      var myfloat;
      myfloat = parseFloat(quote.col1);
      var d = quote.col0.split('/');   
	  var dateYyyyMmDd = d[2] + '-' + d[1] + '-' + d[0];
      return parsedGraphData.push([dateYyyyMmDd, myfloat]);
    });
  }
};

getChartData = function() {
  var chartUrl, limitResults, month, now, quoteSymbol, today;
  limitResults = "40";
  quoteSymbol = "USDBRL";
  now = new Date();
  month = now.getMonth() + 1;
  if (month.length = 1) {
    month = "0" + month;
  }
  today = (now.getFullYear()) + "-" + month + "-" + (now.getDate());
  chartUrl = "http://query.yahooapis.com/v1/public/yql?q=select%20col0%2Ccol1%20from%20csv%20where%20url%3D'http%3A%2F%2Fwww.ipeadata.gov.br%2FExibeSerie.aspx%3Fmodule%3DM%26serid%3D38590%26oper%3DexportCSVUS'%20%7C%20tail(count%3D" + limitResults + ")%20%7C%20reverse()&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
  return $.ajax({
    url: chartUrl,
    success: yahooLoaded,
    error: function() {
      return console.log("Retrieving chart data didn't work");
    },
    dataType: "jsonp"
  });
};

drawVisualization = function() {
  var data;
  data = google.visualization.arrayToDataTable(parsedGraphData);
  return new google.visualization.LineChart(document.getElementById("chart")).draw(data, {
    curveType: "function",
    width: 740,
    height: 200,
    backgroundColor: "#3b5998",
    pointSize: 9,
    axisTitlesPosition: "none",
    lineWidth: 3,
    smoothLine: true,
    interpolateNulls: true,
    colors: ["#7385b0"],
    legend: {
      position: "none"
    },
    chartArea: {
      width: "740"
    },
    animation: {
      duration: 1,
      easing: "inAndOut"
    },
    vAxis: {
      gridlines: {
        color: "#3b5998"
      },
      textPosition: "none",
      baselineColor: "none"
    },
    hAxis: {
      textPosition: "none"
    }
  });
};

google.load("visualization", "1", {
  packages: ["corechart"]
});

google.setOnLoadCallback(googleLoaded);