// Generated by CoffeeScript 1.3.1
(function(){jQuery(function(a){var b,c,d,e;c=function(b){var c,d,e;c=b[0].c;d=b[0].cp;e=b[0].l;return a("#current span").html(e)};e=function(){return a.ajax({url:"http://www.google.com/finance/info?client=ig&q=FB",success:function(b){c(b);return a("#current").addClass("show")},error:function(){console.log("Retrieving quote data didn't work");return a("#current").addClass("error")},dataType:"jsonp"})};b=function(a){console.log("displayChart");return console.log(a)};d=function(){var c,d,e,f,g,h;d="30";g="AAPL";f=new Date;e=f.getMonth()+1;if(e.length=1)e="0"+e;h=""+f.getFullYear()+"-"+e+"-"+f.getDate();console.log(h+" "+g);c="http://query.yahooapis.com/v1/public/yql?q=select%20date%2C%20Close%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22"+g+"%22%20and%20startDate%20%3D%20%222012-05-17%22%20and%20endDate%20%3D%20%22"+h+"%22%20limit%20"+d+"&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";return a.ajax({url:c,success:function(a){return b(a)},error:function(){return console.log("Retrieving chart data didn't work")},dataType:"jsonp"})};e();setInterval(e,5e3);return d()})}).call(this);