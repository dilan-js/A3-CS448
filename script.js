//Read the data
//Clean the code up. 

d3.csv("data.csv").then(function (data) {
  var filteredzipcodes = [];
  var filteredcities = [];
  var filteredgrades = [];
  var circleOne = null;
  var circleTwo = null;

  // Set up size
  var mapWidth = 1000;
  var mapHeight = 750;
  var clickCount = 0;

  // function for adjusting the radii 
  let slider1 = d3.select('#slider1').append("input");
  let slider2 = d3.select('#slider2').append("input");
  slider1
    .attr("type", "range")
    .attr("class", "slider")
    .attr("min", 1)
    .attr("max", 5)
    .attr("id", "adjustRadii1");

  slider2
    .attr("type", "range")
    .attr("class", "slider")
    .attr("min", 1)
    .attr("max", 5)
    .attr("id", "adjustRadii2");

  slider1.on("input", (d) => {
    let radius = d3.select("#adjustRadii1").property("value");
    // console.log("THIS ISMILES: " , radius/0.016555289026426286); 
    d3.select('#main_circle_1').attr("r", radius / 0.016555289026426286);
  });

  slider2.on("input", (d) => {
    let radius = d3.select("#adjustRadii2").property("value");
    // console.log(radius); 
    d3.select('#main_circle_2').attr("r", radius / 0.016555289026426286);
    var circle2 = d3.select
  });


  // This is the mapping between <longitude, latitude> position to <x, y> pixel position on the map
  // projection is a function and it has an inverse:
  // projection([lon, lat]) returns [x, y]
  // projection.invert([x, y]) returns [lon, lat]

  // Add an SVG element to the DOM
  var svg = d3.select('body').append('svg')
    .attr('width', mapWidth)
    .attr('height', mapHeight);

  // Add SVG map at correct size, assuming map is saved in a subdirectory called `data`
  svg.append('image')
    .attr('width', mapWidth)
    .attr('height', mapHeight)
    .attr("z-index", -1)
    .attr('xlink:href', './map.svg');

  // Set up projection that the map is using
  var scale = 190000;
  var projection = d3.geoMercator()
    .center([-122.061578, 37.385532])
    .scale(scale)
    .translate([mapWidth / 2, mapHeight / 2]);

  // Set up tooltip
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", 1000)
    .style("background-color", "white")
    .style("opacity", 0);


  // Make tooltip appear on mouseover
  var mouseover = function (d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function (e, i) {
    var id = d3.select(this).attr("id");
    var index = parseInt(id.split('_')[2]);
    tooltip
      .html(`<div>${data[index].Name} <br/> Score: ${data[index].Score}</div>`)
      .style("left", event.pageX + 10)
      .style("top", event.pageY - 50)
      .style("padding", 5)
      .style("font-size", 14)
      .style("font-weight", 700)
      .style("border", "1px solid black");

  }
  var mouseleave = function (d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // Starting positions of circles
  const data2 = [
    { "id": 1, "Longitude": "-122.02975", "Latitude": "37.37678", color: "rgba(0, 255, 0, 0.4)" },
    { "id": 2, "Longitude": "-122.166963", "Latitude": "37.427495", color: "rgba(255,0,0, 0.4)" }
  ];
  var index = 0;
  data2.forEach(item => {

    let drag = d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);

    var projectedLocation = projection([parseFloat(item.Longitude), parseFloat(item.Latitude)]);

    // console.log({projectedLocation});
    var circle = svg.append('circle')
      .attr("id", "main_circle_" + item.id)
      .attr('cx', projectedLocation[0])
      .attr('cy', projectedLocation[1])
      .attr('r', 5 / 0.016555289026426286)
      .style("z-index", -1)
      .style('fill', item.color)
      .call(drag);

    index++;
  });


  // console.log(data); 
  var pnt = 0;
  // svg.data(data).append(circle).ente
  var group = svg.append("g");
  data.forEach(item => {
    var projectedLocation = projection([parseFloat(item.Longitude), parseFloat(item.Latitude)]);
    // console.log("this is circle: " + item.Name + " " + projectedLocation);
    var circle = group.append('circle')
      .attr("id", "data_circle_" + pnt)
      .attr("class", "dotty")
      .style("z-index", 400)
      .attr('cx', projectedLocation[0])
      .attr('cy', projectedLocation[1])
      .attr('r', 2.3)
      .on("click", (d, event) => {
        if (circleOne == null || clickCount % 2 == 0) {
          circleOne = d3.select(d.currentTarget).attr("id")
        } else {
          circleTwo = d3.select(d.currentTarget).attr("id")
        }
        // console.log("You selected this circle " , d3.select(d.currentTarget).attr("id")); 
        // console.log(clickCount); 
        clickCount++;
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    pnt++;

  });



  function dragstarted(event, d) {
    d3.select(this).raise().attr("stroke", "black");
  }

  function dragged(event, d) {
    // let start = Date.now(); 
    d3.select(this).attr("cx", event.x).attr("cy", event.y);
    let mainCircle1 = d3.select("#main_circle_1").style("z-index", -1);
    let mainCircle2 = d3.select("#main_circle_2");

    let mainCircle1_CX = parseFloat(mainCircle1.attr("cx"));
    let mainCircle1_CY = parseFloat(mainCircle1.attr("cy"));
    let mainCircle2_CX = parseFloat(mainCircle2.attr("cx"));
    let mainCircle2_CY = parseFloat(mainCircle2.attr("cy"));

    let r1 = parseFloat(mainCircle1.attr("r"));
    let r2 = parseFloat(mainCircle2.attr("r"));

    for (let i = 0; i < pnt; i++) {
      let circle = d3.select("#data_circle_" + i);
      let x2 = parseFloat(circle.attr("cx"));
      let y2 = parseFloat(circle.attr("cy"));

      let highlight1 = isWithinRadius(x2, mainCircle1_CX, y2, mainCircle1_CY, r1);
      let highlight2 = isWithinRadius(x2, mainCircle2_CX, y2, mainCircle2_CY, r2);

      circle.style("fill", "rgba(0,0,0,0.8)").style("z-index", 400);
      if (highlight1 && highlight2) {
        //circle.style("fill", "blue"); // test intersection
        circle.filter(function () { return checkFilters(i) })
          .style("fill", "red");
      }
      // let end = Date.now(); 
      // console.log("EVENT TOOK MILLISECONDS ", (end-start)); 
    }
  }

  function dragended(event, d) {
    d3.select(this).attr("stroke", null);
    let save = this.parentNode.firstChild;
    this.parentNode.insertBefore(this, this.parentNode.firstChild);
    save.parentNode.insertBefore(save, save.parentNode.firstChild);
  }

  //distance formula
  function isWithinRadius(x1, x2, y1, y2, r) {
    let dist = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    return 0 <= dist && dist <= r;
  }

  // Parse Adress column for zipcodes and cities, then group by unique ones
  var zipcodes = d3.group(data, d => d.Adress.split(",")[2].slice(4).substring(0, 5));
  var cities = d3.group(data, d => d.Adress.split(",")[1].toUpperCase());
  var grades = d3.group(data, d => d.Grade);

  function checkFilters(i) {
    if (filteredzipcodes.length > 0) {
      if (!filteredzipcodes.includes(data[i].Adress.split(",")[2].slice(4).substring(0, 5))) {
        return false;
      }
    }
    if (filteredcities.length > 0) {
      if (!filteredcities.includes(data[i].Adress.split(",")[1].toUpperCase())) {
        return false;
      }
    }
    if (filteredgrades.length > 0) {
      if (!filteredgrades.includes(data[i].Grade)) {
        return false;
      }
    }
    return true;
  }

  function createCheckboxes(boxData, id) {
    var checkBoxes = d3.select("#" + id)
      .selectAll("div")
      .data(boxData)
      .enter()
      .append("div")
      .attr("class", "checkbox-inline");
    checkBoxes.append("input")
      .attr("type", "checkbox")
      .attr("class", id)
      .attr("value", d => d)
      .attr("id", d => d);
    checkBoxes.append("label")
      .attr('for', d => d)
      .text(d => d);

    var cboxes = document.querySelectorAll("." + id);
    if (id == "zipcodes") {
      // Use Array.forEach to add an event listener to each checkbox.
      cboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
          filteredzipcodes =
            Array.from(cboxes) // Convert checkboxes to an array to use filter and map.
              .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
              .map(i => i.value); // Use Array.map to extract only the checkbox values from the array of objects.

        })
      });
    } else if (id == "cities") {
      cboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
          filteredcities =
            Array.from(cboxes) // Convert checkboxes to an array to use filter and map.
              .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
              .map(i => i.value); // Use Array.map to extract only the checkbox values from the array of objects.

        })
      });
    } else if (id == "grades") {
      cboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
          filteredgrades =
            Array.from(cboxes) // Convert checkboxes to an array to use filter and map.
              .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
              .map(i => i.value); // Use Array.map to extract only the checkbox values from the array of objects.

        })
      });
    }
  }

  createCheckboxes(Array.from(zipcodes.keys()).sort(), "zipcodes");
  createCheckboxes(Array.from(cities.keys()), "cities");
  createCheckboxes(Array.from(grades.keys()), "grades");

}); 