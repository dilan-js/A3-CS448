

    //Read the data
    d3.csv("data.csv").then( function(data) {
        var circleOne = null;
        var circleTwo = null;
          // Set up size
        var mapWidth = 1000;
        var mapHeight = 750;
    
        var clickCount = 0; 
    
          // function for adjusting the radii 
          let slider1 = d3.select('body').append("input");
          let slider2 = d3.select('body').append("input");
          slider1
          .attr("type", "range")
          .attr("class", "slider")
          .attr("min", 1)
          .attr("max", 50)
          //.attr("value", 25)
          .attr("id", "adjustRadii1"); 
    
          slider2
          .attr("type", "range")
          .attr("class", "slider")
          .attr("min", 1)
          .attr("max", 50)
          //.attr("value", 25)
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
        
        //.style("background-color", "red")
        .style("border", "solid")
        .style("z-index", 30)
        .text("text", "HELLO")
        .style("border-width", "2px")
        .style("border-radius", "5px"); 
        //.style("padding", "5px");

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
            .text("The exact value of<br>this cell is: "+ id )
            .attr("x", (event.x - 30 ))
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
        data.forEach(item => {
            var projectedLocation = projection([parseFloat(item.Longitude), parseFloat(item.Latitude)]);
            var circle = svg.append('circle')
            .attr("id", "data_circle_" +pnt)
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
                  circle.style("fill", "yellow");
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
        // Processing filters
        d3.selectAll('#ScoreRange')
        .on("change", function() {
          let score = this.value;
          console.log(score);
        });
    
        // Find unique zipcodes using the slice javascript method to parse the "Adress" data for zip codes
        var zipData = d3.group(data, d => d.Adress.slice(d.Adress.length - 5)); 
        //console.log(zipData)
    
        // Use the unique zipcodes to instantiate checkboxes
        /*var checkBoxes = d3.select("#checkboxFilters")
            .selectAll("div")
            .data(zipData)
            .enter()
            .append("div")
            .attr("class", "checkbox");
    
          checkBoxes.append("input")
            .attr("type", "checkbox")
            .attr("id", d => d[0])
            .attr("value", d => d[0]);
          checkBoxes.append("label")
            .attr('for', d => d[0])
            .text(d => d[0]);
            
        });*/ 
          
          
    
        /*
        FILTERS:
        - when a filter is activated, that becomes a requirement
        - have a function that checks against every single filter and returns yes or no
    
    
        d3.selectAll(".checkbox")
        .on("change", function() {
          let score = this.id;
          console.log(score);
        });
    
        function fitsFilters(circle){
          
        }
        */
    
    
          // Find unique zipcodes using the slice javascript method to parse the "Adress" data for zip codes
        var zipcodes = d3.group(data, d => d.Adress.split(",")[2].slice(4).substring(0,5)); 
        var cities = d3.group(data, d => d.Adress.split(",")[1].toUpperCase());
        var grades = d3.group(data, d => d.Grade);
    
function createCheckboxes(boxData, id){
var checkBoxes = d3.select(id)
    .selectAll("div")
    .data(boxData)
    .enter()
    .append("div")
    .attr("class", "checkbox-inline");
checkBoxes.append("input")
    .attr("type", "checkbox")
    .attr("id", d => d[0])
    .attr("value", d => d[0]);
checkBoxes.append("label")
    .attr('for', d => d[0])
    .text(d => d[0]);
}
    
createCheckboxes(zipcodes, "#zipcodes");
createCheckboxes(cities, "#cities");
createCheckboxes(grades, "#grades");

    }); 