function drawBubble (selector, dispatch, dimension, group) {
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  var onClick;

  var color = d3.scale.category20();

  var bubble = d3.layout.pack()
    .sort(null)
    .size([width, height])
    .padding(1.5);

  var t = d3.transition()
      .duration(750);

  var svg = d3.select(selector),
        g = svg.select('g');

  if (!svg.empty()) {
    svg.select('svg').remove()
  }

  g = svg.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'bubble')
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  var reset = g.append('text')
    .attr('class', 'reset')
    .style('display', 'none')
    .attr('y', 10)
    .attr('x', 20)
    .text('reset')
    .on('click', click)

  function click(d) {

    dimension.filter(d ? d.key : null);
    dispatch.redraw();

    svg.selectAll('circle').classed('active', false)
    if(!d) {
      return reset.style('display', 'none');
    }


    svg.select('.' + btoa(d.key).replace(/=/g, '')).classed('active', true)
    reset.style('display', 'block')
  }

  var node = g.selectAll('.node')
    .data(bubble.nodes({ children: group.all() }).filter(function(d) { return !d.children; }))

  node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')'; });

  node.append('title')
    .text(function(d) { return d.key; });

  node.append('circle')
    .attr('class', function (d) { return btoa(d.key).replace(/=/g, '')})
    .attr('r', function(d) { return d.r; })
    .style('fill', function(d) { return color(d.key); })

  node.append('text')
    .attr('dy', '.3em')
    .attr('class', 'label')
    .style('text-anchor', 'middle')

  dispatch.on('redraw.' + selector, function () {
    var reset = g.selectAll('.reset')

    node = g.selectAll('.node')
      .data(bubble.nodes({ children: group.all() }).filter(function(d) { return !d.children; }))

    node
      .attr('class', 'node')
      .transition(t)
      .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')'; });

    node.select('circle')
      .on('click', click)
      .transition(t)
      .attr('r', function(d) { return d.r; })
      .style('fill', function(d) { return color(d.key); })

    node.select('text')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .text(function(d) { return d.key.substring(0, d.r / 3); })
      .on('click', click)

  })
}

function drawBar (selector, dispatch, dimension, group) {
  var margin = {top: 0, right: 0, bottom: 40, left: 50},
    width = 850 - margin.left - margin.right,
    height = 210 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(10);

  var t = d3.transition()
        .duration(750);

  var svg = d3.select(selector),
        g = svg.select('g');

  function click(d) {
    dimension.filter(d ? d.key : null);
    dispatch.redraw();
    svg.selectAll('rect').classed('active', false)
    if(!d) {
      return reset.style('display', 'none');
    }

    svg.select('.' + btoa(d.key).replace(/=/g, '')).classed('active', true)
    reset.style('display', 'block')
  }

  if (g.empty()) {
    g = svg.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    g.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    g.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Interactions');

    var reset = g.append('text')
      .attr('class', 'reset')
      .attr('y', 10)
      .attr('x', -40)
      .style('display', 'none')
      .text('reset')
      .on('click', click)
  }

  dispatch.on('redraw.' + selector, function () {
    x.domain(group.all().map(function(d) { return d.key; }));
    y.domain([0, d3.max(group.all(), function(d) { return d.value; })]);

    g.select('.y.axis')
      .transition(t)
       .call(yAxis)

    var xAxisDom = g.select('.x.axis')
     .transition(t)
      .call(xAxis)

    var rects = g.selectAll('rect')
        .data(group.all());

    rects.enter().append('rect')
        .on('click', click)
        .attr('class', function (d) { return btoa(d.key).replace(/=/g, '') })

    rects
        .classed('bar', true)
        .classed('bar--negative', function (d) { return d.key == 'female'})
        .classed('bar--positive', function (d) { return d.key == 'male'})
      .transition(t)
        // .attr('class', function(d) { return 'bar bar--' + (d.key == 'female' ? 'negative' : 'positive'); })
        .attr('x', function(d) { return x(d.key); })
        .attr('width', x.rangeBand())
        .attr('y', function(d) { return y(d.value); })
        .attr('height', function(d) { return height - y(d.value); })

    var texts = g.selectAll('.label')
        .data(group.all())

    texts.enter().append('text').attr('class', 'label').on('click', click)

    texts
      .transition(t)
        .attr('text-anchor', 'middle')
        .attr('x', function(d,i) {
            return x(d.key) + (x.rangeBand() / 2);
        })
        .attr('y', function(d,i) {
            return y(d.value) + ((height - y(d.value)) / 2);
        })
        .attr('dy', '.35em')
        .text(function (d) { return d.value })

  })
}

var xf = crossfilter(data)

var gender = xf.dimension(function (d) { return d.gender; }),
    genders = gender.group().reduceSum(function (d) { return d.positiveInteractions; }),
    topic = xf.dimension(function (d) { return d.topic }),
    topics = topic.group().reduceSum(function (d) { return d.positiveInteractions; }),
    age = xf.dimension(function (d) { return d.age; }),
    ages = age.group().reduce(
      function (p, v) {
        if (v.gender == 'female')
          p.negative += v.interactions;
        else if (v.gender == 'male')
          p.positive += v.interactions;
        return p;
      },
      function (p, v) {
        if (v.gender == 'female')
          p.negative -= v.interactions;
        else if (v.gender == 'male')
          p.positive -= v.interactions;
        return p;
      },
      function () {
        return { positive: 0, negative: 0 }
      }
    ),
    newTopic = xf.dimension(function (d) { return d.topic }),
    topicGroup = newTopic.group().reduce(
      function (p, v) {
        if (v.gender == 'female')
          p.negative += v.interactions;
        else if (v.gender == 'male')
          p.positive += v.interactions;
        return p;
      },
      function (p, v) {
        if (v.gender == 'female')
          p.negative -= v.interactions;
        else if (v.gender == 'male')
          p.positive -= v.interactions;
        return p;
      },
      function () {
        return { positive: 0, negative: 0 }
      }
    );

var dispatch = d3.dispatch('redraw');
drawBar('#bar-chart', dispatch, gender, genders);
drawBubble('#bubble-chart', dispatch, topic, topics);
dispatch.redraw();

d3.select(self.frameElement).style("height", "738px");

var margin = {top: 20, right: 20, bottom: 40, left: 20},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

d3.csv("data.csv", function(error, data) {
  var categories = d3.keys(d3.nest().key(function(d) { return d.category; }).map(data));
  var color = d3.scale.ordinal().range(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854"]);
  var fontSize = d3.scale.pow().exponent(5).domain([0,1]).range([10,80]);

  var layout = d3.layout.cloud()
      .timeInterval(10)
      .size([width, height])
      .words(data)
      .rotate(function(d) { return 0; })
      .font('monospace')
      .fontSize(function(d,i) { return fontSize(Math.random()); })
      .text(function(d) { return d.password; })
      .spiral("archimedean")
      .on("end", draw)
      .start();

  var svg = d3.select('#tornado-chart').append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var wordcloud = svg.append("g")
      .attr('class','wordcloud')
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1)
      .domain(categories);

  var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll('text')
      .style('font-size','20px')
      .style('fill',function(d) { return color(d); })
      .style('font','sans-serif');

  function draw(words) {
    wordcloud.selectAll("text")
        .data(words)
      .enter().append("text")
        .attr('class','word')
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", function(d) { return d.font; })
        .style("fill", function(d) { 
            var paringObject = data.filter(function(obj) { return obj.password === d.text});
            return color(paringObject[0].category); 
        })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
        .text(function(d) { return d.text; });
  };
});

var drawNetGraph = function(selector, dispatch, data) {
    function createNetwork(edgelist) {
        var nodeHash = {};
        var nodes = [];
        var edges = [];

        edgelist.forEach(function(edge) {
                source = edge.source;
                target = edge.target;
                weight = edge.weight;
            if (!nodeHash[source]) {
                nodeHash[source] = {
                    id: source,
                    label: source
                };
                nodes.push(nodeHash[source]);
            }
            if (!nodeHash[target]) {
                nodeHash[target] = {
                    id: target,
                    label: target
                };
                nodes.push(nodeHash[target]);
            }
            if (weight >= 5) {
                edges.push({
                    source: nodeHash[source],
                    target: nodeHash[target],
                    weight: weight
                });
            }
        });
        createForceNetwork(nodes, edges);
    }

    function createForceNetwork(nodes, edges) {

        //create a network from an edgelist
        var margin = {
                top: 20,
                right: 20,
                bottom: 40,
                left: 20
            },
//            width = 720 - margin.left - margin.right,
//            height = 500 - margin.top - margin.bottom;
            width = 2000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        //  var selector = "#tornado-chart2";
        var force = d3.layout.force().nodes(nodes).links(edges)
            .size([500, 500])
            .charge(function(d) {
                return Math.min(-100, d.weight * -50)
            })
            .on("tick", updateNetwork);

        var svg = d3.select(selector);
        if (!svg.empty()) {
            svg.select('svg').remove()
        }

        svg = svg.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var wordnetwork = svg.append("g");

        wordnetwork.selectAll("line")
            .data(edges)
            .enter()
            .append("line")
            .style("stroke-width", "1px")
            .style("stroke", "#996666");

        var nodeEnter = wordnetwork.selectAll("g.node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .on("click", nodeClick)
            .on("dblclick", nodeDoubleClick)
            .on("mouseover", nodeOver)
            .on("mouseout", nodeOut)
            .call(force.drag());

        nodeEnter.append("circle")
            .attr("r", 5)
            .style("fill", "#CC9999")
            .style("stroke", "black")
            .style("stroke-width", "1px")

        nodeEnter.append("text")
            .style("text-anchor", "middle")
            .attr("y", 2)
            .style("stroke-width", "1px")
            .style("stroke-opacity", 0.75)
            .style("stroke", "white")
            .style("font-size", "8px")
            .text(function(d) {
                return d.id
            })
            .style("pointer-events", "none")

        nodeEnter.append("text")
            .style("text-anchor", "middle")
            .attr("y", 2)
            .style("font-size", "8px")
            .text(function(d) {
                return d.id
            })
            .style("pointer-events", "none")

        force.start();

        function nodeClick(d) {
            d.fixed = true;
        }

        function nodeDoubleClick(d) {
            d.fixed = false;
        }

        function nodeOver(d) {
            force.stop();
            highlightEgoNetwork(d);
        }

        function nodeOut() {
            force.start();
            wordnetwork.selectAll("g.node > circle")
                .style("fill", "#CC9999");

            wordnetwork.selectAll("line")
                .style("stroke", "#996666")
                .style("stroke-width", "1px");
        }

        function highlightEgoNetwork(d) {
            var egoIDs = [];
            var filteredEdges = edges.filter(function(p) {
                return p.source == d || p.target == d
            });

            filteredEdges
                .forEach(function(p) {
                    if (p.source == d) {
                        egoIDs.push(p.target.id)
                    } else {
                        egoIDs.push(p.source.id)
                    }
                });

            wordnetwork.selectAll("line").filter(function(p) {
                    return filteredEdges.indexOf(p) > -1
                })
                .style("stroke", "#66CCCC")
                .style("stroke-width", "2px");

            wordnetwork.selectAll("circle").filter(function(p) {
                    return egoIDs.indexOf(p.id) > -1
                })
                .style("fill", "#66CCCC");
        }

        function updateNetwork() {
            wordnetwork.selectAll("line")
                .attr("x1", function(d) {
                    return d.source.x
                })
                .attr("y1", function(d) {
                    return d.source.y
                })
                .attr("x2", function(d) {
                    return d.target.x
                })
                .attr("y2", function(d) {
                    return d.target.y
                });

            wordnetwork.selectAll("g.node")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")"
                });

            wordnetwork.selectAll("g.node > circle")
                .attr("r", function(d) {
                    return d.weight
                });
        }
    }

    createNetwork(data)
}
d3.csv("firm.csv",function(error,data) {
drawNetGraph("#tornado-chart2", dispatch, data);
});

