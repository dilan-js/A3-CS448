    //Read the data
    //Clean the code up. 

    d3.csv("data.csv").then( function(data) {
        var circleOne = null;
        var circleTwo = null;
          // Set up size
        var mapWidth = 1000;
        var mapHeight = 750;
    
        var clickCount = 0; 
    
          // function for adjusting the radii 
          let slider1 = d3.select('#circleRadii').append("input");
          let slider2 = d3.select('#circleRadii').append("input");
          slider1
          .attr("type", "range")
          .attr("class", "slider")
          .attr("min", 1)
          .attr("max", 100)
          .attr("id", "adjustRadii1"); 
    
          slider2
          .attr("type", "range")
          .attr("class", "slider")
          .attr("min", 1)
          .attr("max", 100)
          .attr("id", "adjustRadii2"); 
    
          slider1.on("input", (d) => {
              let radius = d3.select("#adjustRadii1").property("value");   
            // console.log(radius); 
              d3.select('#main_circle_1').attr("r", radius); 
          });
    
          slider2.on("input", (d) => {
              let radius = d3.select("#adjustRadii2").property("value"); 
            // console.log(radius); 
              d3.select('#main_circle_2').attr("r", radius); 
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

        //tooltip creation
        var Tooltip = svg
        .append("text")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .attr("fill", "red")
        .attr("background", "white");
        /*
        .style("background-color", "red")
        .style("border", "solid")
        //.style("z-index", 30)
        .text("text", "HELLO")
        .style("border-width", "2px")
        .style("border-radius", "5px"); 
        //.style("padding", "5px");
        */

        var mouseover = function(d) {
            console.log("MOUSE OVER"); 
            Tooltip
            .style("opacity", 1)
            d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
        }
        var mousemove = function(e, i ) {
          var id = d3.select(this).attr("id"); 
          var index = parseInt(id.split('_')[2]);
          console.log(data[index]); 
            Tooltip
            .text(data[index].Name + " Score: " + data[index].Score)
            .attr("x", (event.x - 20 ))
            .attr("y", event.y + 10     )
        }
        var mouseleave = function(d) {
            console.log("MOUSE LeAVE"); 
            Tooltip
            .style("opacity", 0)
            d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
        }
    
        // console.log(data); 
        var pnt = 0; 
        // svg.data(data).append(circle).ente
        data.forEach(item => {
            var projectedLocation = projection([parseFloat(item.Longitude), parseFloat(item.Latitude)]);
            var circle = svg.append('circle')
            .attr("id", "data_circle_" +pnt)
            .attr("class", "dotty")
            .attr('cx', projectedLocation[0])
            .attr('cy', projectedLocation[1])
            .attr('r', 2.3)
            .on("click", (d, event) => {
                if(circleOne == null || clickCount % 2 == 0 ){
                    circleOne = d3.select(d.currentTarget).attr("id")
                }else{
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
    
        const data2 = [
          {"id": 1, "Longitude": "-122.168646", "Latitude": "37.423023", color: "rgba(0, 255, 0, 0.4)"},
          {"id": 2, "Longitude": "-122.166963", "Latitude": "37.427495", color: "rgba(255,0,0, 0.4)"}
        ];
        // console.log({data2});
        var index = 0;
        data2.forEach(item => { 
              
        let drag = d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
    
          var projectedLocation = projection([parseFloat(item.Longitude), parseFloat(item.Latitude)]);
    
          console.log({projectedLocation});
          var circle = svg.append('circle')
            .attr("id", "main_circle_" + item.id)
            .attr('cx', projectedLocation[0])
            .attr('cy', projectedLocation[1])
            .attr('r', 50)
            .style('fill', item.color)
            .call(drag); 
    
          index++;
        });

        function dragstarted(event, d) {
            d3.select(this).raise().attr("stroke", "black");
          }
    
          function dragged(event, d) {
            let start = Date.now(); 
            d3.select(this).attr("cx",event.x).attr("cy", event.y);
            let mainCircle1 = d3.select("#main_circle_1"); 
            let mainCircle2 = d3.select("#main_circle_2"); 
    
            let mainCircle1_CX = parseFloat(mainCircle1.attr("cx")); 
            let mainCircle1_CY = parseFloat(mainCircle1.attr("cy")); 
            let mainCircle2_CX = parseFloat(mainCircle2.attr("cx")); 
            let mainCircle2_CY = parseFloat(mainCircle2.attr("cy")); 
            
            let r1 = parseFloat(mainCircle1.attr("r")); 
            let r2 = parseFloat(mainCircle2.attr("r")); 
    
            for (let i = 0; i < pnt; i++ ){
              let circle = d3.select("#data_circle_" +i); 
              let x2 = parseFloat(circle.attr("cx")); 
              let y2 = parseFloat(circle.attr("cy")); 
              
    
              let highlight1 = isWithinRadius(x2,mainCircle1_CX,  y2,mainCircle1_CY, r1);
              let highlight2 = isWithinRadius(x2,mainCircle2_CX,  y2,mainCircle2_CY, r2);
    
              if(highlight1 && highlight2){
                  circle.style("fill", "blue")
                  .filter(checkFilters(i))
                  .style("fill", "red");
              }else{
                circle.style("fill", "rgba(0,0,0,0.8)");
              }
            }
            let end = Date.now(); 
            console.log("EVENT TOOK MILLISECONDS ", (end-start)); 
          }
    
          function dragended(event, d) {
            d3.select(this).attr("stroke", null);
          }
    
        //distance formula
        function isWithinRadius(x1, x2, y1, y2, r){
          let dist = Math.sqrt(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2));
          return 0 <= dist && dist <= r;
        }
    
        // Parse Adress column for zipcodes and cities, then group by unique ones
        var zipcodes = d3.group(data, d => d.Adress.split(",")[2].slice(4).substring(0,5)); 
        var cities = d3.group(data, d => d.Adress.split(",")[1].toUpperCase());
        var grades = d3.group(data, d => d.Grade);

        /*function filterData(data){
          var filteredData = [];
          d3.selectAll(".chx").each(function(d, i) {
            d3.select(this).property("checked") == true ? filteredData.push(this.value) : null;
            console.log(filteredData.length);
          });
          console.log("Before:");
          d3.selectAll(".dotty").filter(function(d){
            console.log(d);
          })
        }*/

        var filteredzipcodes = new Set();
        var filteredcities = new Set();
        var filteredgrades = new Set();

        function checkFilters(i){
          if (filteredzipcodes.size > 0) {
            if (!filteredzipcodes.has(data[i].Adress.split(",")[2].slice(4).substring(0,5))) {
              return false;
            }
          }
          if (filteredcities.size > 0) {
            if (!filteredcities.has(data[i].Adress.split(",")[1].toUpperCase())) {
              return false;
            }
          }
          if (filteredgrades.size > 0) {
            if (!filteredgrades.has(data[i].Grade)) {
              return false;
            }
          }
          return true;
        }

        var filteredzipcodes = new Set();
        var filteredcities = new Set();
        var filteredgrades = new Set();

        // Everytime a checkbox is changed, its value is added to or removed from set.
        // Called whenever checkbox is clicked through "onclick" attribute
        /*function changeFilter(type, value) {
          (this.checked) ? `filtered${type}`.add(value) : `filtered${type}`.delete(value);
          console.log("Filter changed");
        }*/

        function changeZ(type, value) {
          (this.checked) ? filteredzipcodes.add(value) : filteredzipcodes.delete(value);
          console.log("Z changed");
        }

        function changeC(type, value) {
          (this.checked) ? filteredcities.add(value) : filteredcities.delete(value);
          console.log("C changed");
        }

        function changeG(type, value) {
          (this.checked) ? filteredgrades.add(value) : filteredgrades.delete(value);
          console.log("G changed");
        }

    
        function createCheckboxes(boxData, id){
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
            //.attr("onclick", `changeFilter("${id}", "${d => d}")`);
          checkBoxes.append("label")
            .attr('for', d => d)
            .text(d => d);
          
          let z = d3.selectAll(".zipcodes")
            .attr("onclick", `changeZ("zipcodes", ${d => d})`);

          let c = d3.selectAll(".cities")
            .attr("onclick", `changeC("cities", ${d => d})`);

          let g = d3.selectAll(".grades")
            .attr("onclick", `changeG("grades", ${d => d})`);
        }
            
        createCheckboxes(Array.from(zipcodes.keys()).sort(), "zipcodes");
        createCheckboxes(Array.from(cities.keys()), "cities");
        createCheckboxes(Array.from(grades.keys()), "grades");

    }); 
