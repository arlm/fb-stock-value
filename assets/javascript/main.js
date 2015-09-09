var allDataLoaded, drawVisualization, getChartData, googleIsLoaded, googleLoaded, parseData, parsedGraphData, yahooIsLoaded, yahooLoaded;

jQuery(function($) {
  var displayQuote, getQuote;
  displayQuote = function(data) {
    var change, changePercent, current;
    change = data[0].c;
    changePercent = data[0].cp;
    current = data[0].l;
    $("#current div.value span").html(current);
    $("title").html("$" + current + " - Facebook Stock Value");
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
      url: "http://www.google.com/finance/info?client=ig&q=FB",
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
  parsedGraphData.push(["x", "Stock value"]);
  parsedGraphData.push(["2012-05-18 Start", parseFloat("38.00")]);
  if (data.query.results === null) {
    parsedGraphData.push(["2012-05-18", parseFloat("38.23")]);
    parsedGraphData.push(["2012-05-21", parseFloat("34.03")]);
    parsedGraphData.push(["2012-05-22", parseFloat("31.00")]);
    return parsedGraphData.push(["2012-05-23", parseFloat("32.00")]);
  } else {
    if (data.query.results !== null) {
      myResults = data.query.results.quote;
    }
    if (myResults.length > 1) {
      myResults = myResults.reverse();
    }
    return _.each(myResults, function(quote) {
      var myfloat;
      myfloat = parseFloat(quote.Close);
      return parsedGraphData.push([quote.date, myfloat]);
    });
  }
};

getChartData = function() {
  var chartUrl, limitResults, month, now, quoteSymbol, today;
  limitResults = "30";
  quoteSymbol = "FB";
  now = new Date();
  month = now.getMonth() + 1;
  if (month.length = 1) {
    month = "0" + month;
  }
  today = (now.getFullYear()) + "-" + month + "-" + (now.getDate());
  chartUrl = "http://query.yahooapis.com/v1/public/yql?q=select%20date%2C%20Close%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22" + quoteSymbol + "%22%20and%20startDate%20%3D%20%222012-05-17%22%20and%20endDate%20%3D%20%22" + today + "%22%20limit%20" + limitResults + "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
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