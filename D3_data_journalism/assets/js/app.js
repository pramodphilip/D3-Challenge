/*********************************************************/

const datafile = "../../data.csv";

/*********************************************************/

// Define width and height of SVG area
const svgWidth = 1060;
const svgHeight = 860;

/********************************************************/
// Define the chart's margins as an object
const chartMargin = 
{
  top: 30,
  right: 40,
  bottom: 100,
  left: 100,
};

/********************************************************/
// Define dimensions of the chart area
const chartWidth = svgWidth - chartMargin.left - chartMargin.right;
const chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
const svg = d3
  .select("body")
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Set graph element area
const chartGroup = svg
.append("g")
.attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

/********** Functions for Plotting **********/
d3.csv(datafile,rowUpdate)
    .then(createChart)
    .catch(function (error) 
    {
      console.log(error);
    });

// Function rowUpdate
function rowUpdate(row) //convert CSVtext into appropriate formats 
{
  row.id = +row.id; //convert the text value to int
  row.poverty = +(row.poverty); //convert the text value to float
  row.povertyMoe = +(row.povertyMoe); //convert the text value to float
  row.age = +(row.age); //convert the text value to float
  row.ageMoe = +(row.ageMoe); //convert the text value to float
  row.income = +row.income; //convert the text value to int
  row.incomeMoe = +row.incomeMoe; //convert the text value to int
  row.healthcare = +(row.healthcare); //convert the text value to float
  row.healthcareLow = +(row.healthcareLow); //convert the text value to float
  row.healthcareHigh = +(row.healthcareHigh); //convert the text value to float
  row.obesity = +(row.obesity); //convert the text value to float
  row.obesityLow = +(row.obesityLow); //convert the text value to float
  row.obesityHigh = +(row.obesityHigh); //convert the text value to float
  row.smokes = +(row.smokes); //convert the text value to float
  row.smokesLow = +(row.smokesLow); //convert the text value to float
  row.smokesHigh = +(row.smokesHigh); //convert the text value to float

  // Return updated row
  return row;
}

// Function for creating chart
function createChart(data) {
    // Prints table data along with table headers
    console.table(data,["id","state",'abbr','poverty','povertyMoe','age','ageMoe','income','incomeMoe',
                        'healthcare','healthcareLow','healthcareHigh','obesity',
                        'obesityLow','obesityHigh','smokes','smokesLow','smokesHigh']);

    /********** Setting Default Chart **********/
    // Sets default y scale
    let yScale = d3
        .scaleLinear()
        .domain(d3.extent(data,(d)=>d.healthcare))
        .range([chartHeight,0]);

    // Sets default x scale
    let xScale = d3
        .scaleLinear()
        .domain(d3.extent(data,(d)=>d.poverty))
        .range([0,chartWidth]);


    /******************** Chart Labels  **********************/
    // X-axis label for Poverty
    var poverty = chartGroup
        .append('text')
        .text('In Poverty (%)')
        .classed('active activeX',true)
        .attr('x',chartWidth/2)
        .attr('y',chartHeight + chartMargin.top + 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")

    // X-axis label for Age
    var age = chartGroup
        .append('text')
        .text('Age (Median)')
        .classed('inactive',true)
        .attr('x',chartWidth/2)
        .attr('y',chartHeight + chartMargin.top + 35)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")

    // // X-axis label for Household Income
    // var income = chartGroup
    //     .append('text')
    //     .text('Household Income (Median)')
    //     .classed('inactive',true)
    //     .attr('x',chartWidth/2)
    //     .attr('y',chartHeight + chartMargin.top + 60)
    //     .attr("text-anchor", "middle")
    //     .attr("font-size", "16px")

    // Y-axis label for Healthcare
    var health = chartGroup
        .append('text')
        .attr('transform','rotate(-90)')
        .text('Lacks Healthcare (%)')
        .classed('active activeY',true)
        .attr('y',0-chartMargin.left+65)
        .attr('x',0-(chartHeight/2))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")

    // // Y-axis label for Smokes
    var smokes = chartGroup
        .append('text')
        .attr('transform','rotate(-90)')
        .text('Smokes (%)')
        .classed('inactive',true)
        .attr('y',0-chartMargin.left+40)
        .attr('x',0-(chartHeight/2))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")

    // // Y-axis label for Obesity
    // var obese = chartGroup
    //     .append('text')
    //     .attr('transform','rotate(-90)')
    //     .text('Obese (%)')
    //     .classed('inactive',true)
    //     .attr('y',0-chartMargin.left+20)
    //     .attr('x',0-(chartHeight/2))
    //     .attr("text-anchor", "middle")
    //     .attr("font-size", "16px")

    /************** Creating Axes ************/
    let bottomAxis = d3.axisBottom(xScale);
    let leftAxis = d3.axisLeft(yScale);

    //Appending bottom axis
    chartGroup
        .append("g")
        .call(bottomAxis)
        .attr('transform',`translate(0,${chartHeight})`)
        .classed("axis x-axis",true)
        // .attr("class","x axis")

    //Appending left axis
    chartGroup
        .append('g')
        .call(leftAxis)
        .classed("axis y-axis",true)
        // .attr("class","y axis")
        .attr('font-size',"14px");

    /*********** Adding data points ***********/
    // Adding circle points to chart
    chartGroup
        .selectAll(".stateCircle") //select all of the class
        .data(data) //bind data
        .enter() //grab any extra data
        .append("circle") //append a circle for those extras
        .classed("stateCircle", true)
        .attr("cx", (d)=> xScale(d.poverty))
        .attr("cy", (d)=> yScale(d.healthcare))
        .attr("r", 12);

    // Adding circle point texts to circles on chart
    chartGroup
        .selectAll(".stateText")
        .data(data)
        .enter()
        .append("text")
        .classed("stateText",true)
        .text(function(d) {
            console.log(d.abbr)
            return d.abbr
        })
        .attr('x',(d) => xScale(d.poverty))
        .attr('y',function(d) {
            return 5+yScale(d.healthcare)
        })
        .attr("font-size","10px")

    /******************** Tooltips ************************/
    // Selects HTML tag for tooltip
    let toolTip = d3
        .select("body")
        .append("div")
        .attr("class", "d3-tip")
        .attr('style', 'position: absolute;');;
    
    // Establishes mouseover and mouseout for hovering over circle data point
    d3.selectAll('circle')
      .on("mouseover", showToolTip)
      .on("mouseout", hidetooltip)

    // Function for hiding tool tip after mouse cursor is 
    // removed from circle
    function hidetooltip() {
        toolTip.style("display", "none"); 
        // w/o this function the box will display
        // until another tooltip is activated
        }

    // Function for showing tool tip when
    // mouse cursor hovers over selected circle 
    function showToolTip(event,d) {
        // Selects circle currently hovered over
        let circle = d3.select(this);

        // Sets background color and text color for tool tip
        toolTip.style("background",'black').style("color",'white').style('display','block');

        // Creates html line for text to be inserted into tool tip
        let html = `<strong>${d.state}</strong> <br> Poverty :<strong> ${d.poverty}</strong> <br>
        Healthcare: <strong>  ${d.healthcare} </strong> `;

        // Attaches html line above to specific tool tip,
        // Dependent on where cursor is placed
        toolTip
            .html(html)
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px");
    }

    // /******** Activation of Labels *******/
    function handleChange(event) {

        // Grabs axis label click
        var input = $(event.target).text();
        
        // Checks if axis label click equals "Age (Median)"
        if (input == 'Age (Median)') {
            // Makes Age x-axis label active 
            age.classed('inactive',false).classed('active activeX',true);
            // Makes Poverty x-axis label inactive
            poverty.classed('active activeX',false).classed('inactive',true);

            // Creates new x scale based on age
            let xScale = d3
            .scaleLinear()
            .domain(d3.extent(data,(d)=>d.age))
            .range([0,chartWidth]);

            // Creates new bottom axis using new x scale
            let bottomAxis = d3.axisBottom(xScale);

            // Attaches new bottom axis to chart
            // Transition between old and new bottom axis included
            chartGroup
                .selectAll("g .axis.x-axis")
                .transition()
                .call(bottomAxis)
                .attr('transform',`translate(0,${chartHeight})`)
                
            // Shifts state circles to new x coordinates 
            // based on age
            chartGroup
                .selectAll(".stateCircle") //select all of the class
                .transition()
                .attr("cx", (d)=> xScale(d.age))

            // Shifts state circle texts to new x coordinates
            // based on age
            chartGroup
                .selectAll(".stateText")
                .transition()
                .text(function(d) {
                    return d.abbr
                })
                .attr('x',(d) => xScale(d.age))
         
            // Function for showing tool tip when
            // mouse cursor hovers over selected circle 
            d3.selectAll('circle')
              .on("mouseover", showToolTip)
              .on("mouseout", hidetooltip)

            // Function for hiding tool tip after mouse cursor is 
            // removed from circle
            function hidetooltip() 
            {
                toolTip.style("display", "none"); 
                // w/o this function the box will display
                // until another tooltip is activated
            }

            // Function for showing tool tip when
            // mouse cursor hovers over selected circle 
            function showToolTip(event,d) {

                // Selects circle currently hovered over
                let circle = d3.select(this);
                // Selects active axis label with activeY class
                let activeY = d3.select(".active.activeY").text();

                // Initializes Y data and Y label
                var Y = 0;
                var nameY = "";

                // Checks if selected active axis label
                // is "Lacks Healthcare (%)"
                if (activeY == 'Lacks Healthcare (%)') {
                    // Sets nameY to "Healthcare"
                    nameY = "Heathcare";
                    // Sets Y to d.healthcare
                    Y = d.healthcare;
                }

                // Checks if selected active axis label
                // is "Smokes (%)"
                else if (activeY = 'Smokes (%)') {
                    // Sets nameY to "Smokes"
                    nameY = "Smokes";
                    // Sets Y to d.smokes
                    Y = d.smokes;
                }

                // Sets background color and text color for tool tip
                toolTip.style("background",'black').style("color",'white').style('display','block');

                // Creates html line for text to be inserted into tool tip
                let html = `<strong>${d.state}</strong> <br> Age :<strong> ${d.age}</strong> <br>
                ${nameY}: <strong>  ${Y}% </strong> `;

                // Attaches html line above to specific tool tip,
                // Dependent on where cursor is placed
                toolTip
                    .html(html)
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px");
            }
        }
        
        // Checks if axis label click equals "In Poverty (%)"
        else if (input == "In Poverty (%)") {
            
            // Makes Poverty x-axis label active
            poverty.classed('inactive',false).classed('active activeX',true);
            // Makes Age x-axis label inactive
            age.classed('active activeX',false).classed('inactive',true);

            // Creates new x scale based on poverty
            let xScale = d3
                .scaleLinear()
                .domain(d3.extent(data,(d)=>d.poverty))
                .range([0,chartWidth]);
    
            // Creates new bottom axis using new x scale
            let bottomAxis = d3.axisBottom(xScale);
    
            // Attaches new bottom axis to chart
            // Transition between old and new bottom axis included
            chartGroup
                .selectAll("g .axis.x-axis")
                .transition()
                .call(bottomAxis)
                .attr('transform',`translate(0,${chartHeight})`)
                .transition();

            // Shifts state circles to new x coordinates 
            // based on age
            chartGroup
                .selectAll(".stateCircle") //select all of the class
                .transition()
                .attr("cx", (d)=> xScale(d.poverty))

            // Shifts state circle texts to new x coordinates
            // based on age
            chartGroup
                .selectAll(".stateText")
                .transition()
                .text(function(d) {
                    return d.abbr
                })
                .attr('x',(d) => xScale(d.poverty))

            // Function for showing tool tip when
            // mouse cursor hovers over selected circle 
            d3.selectAll('circle')
                .on("mouseover", showToolTip)
                .on("mouseout", hidetooltip)
      
            // Function for hiding tool tip after mouse cursor is 
            // removed from circle
            function hidetooltip() 
                {
                    toolTip.style("display", "none"); 
                    // w/o this function the box will display
                    // until another tooltip is activated
                }
    
            // Function for showing tool tip when
            // mouse cursor hovers over selected circle 
            function showToolTip(event,d) {

                // Selects circle currently hovered over
                let circle = d3.select(this);
                // Selects active axis label with activeY class
                let activeY = d3.select(".active.activeY").text();

                // Initializes Y data and Y label
                var Y = 0;
                var nameY = "";

                // Checks if selected active axis label
                // is "Lacks Healthcare (%)"
                if (activeY == 'Lacks Healthcare (%)') {
                    // Sets nameY to "Healthcare"
                    nameY = "Healthcare";
                    // Sets Y to d.healthcare
                    Y = d.healthcare;
                }

                // Checks if selected active axis label
                // is "Smokes (%)"
                else if (activeY == 'Smokes (%)') {
                    // Sets nameY to "Smokes"
                    nameY = "Smokes";
                    // Sets Y to d.smokes
                    Y = d.smokes;
                }

                // Sets background color and text color for tool tip
                toolTip.style("background",'black').style("color",'white').style('display','block');

                // Creates html line for text to be inserted into tool tip
                let html = `<strong>${d.state}</strong> <br> Poverty :<strong> ${d.poverty}%</strong> <br>
                ${nameY}: <strong>  ${Y}% </strong> `;

                // Attaches html line above to specific tool tip,
                // Dependent on where cursor is placed
                toolTip
                    .html(html)
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px");
            }
        }

        // Checks if axis label click equals "Lacks Healthcare (%)"
        else if (input == "Lacks Healthcare (%)") {

            // Makes Healthcare y-axis label active
            health.classed('inactive',false).classed('active activeY',true);
            // Makes Smokes y-axis label inactive
            smokes.classed('active activeY',false).classed('inactive',true);
    
            // Creates new y scale based on healthcare
            let yScale = d3
                .scaleLinear()
                .domain(d3.extent(data,(d)=>d.healthcare))
                .range([chartHeight,0]);
    
            // Creates new left axis using new y scale
            let leftAxis = d3.axisLeft(yScale);
    
            // Attaches new left axis to chart
            // Transition between old and new left axis included
            chartGroup
                .selectAll("g .axis.y-axis")
                .transition()
                .call(leftAxis)
                .transition();

            // Shifts state circles to new y coordinates 
            // based on healthcare
            chartGroup
                .selectAll(".stateCircle") //select all of the class
                .transition()
                .attr("cy", (d)=> yScale(d.healthcare))

            // Shifts state circle texts to new y coordinates
            // based on healthcare
            chartGroup
                .selectAll(".stateText")
                .transition()
                .text(function(d) {
                    return d.abbr
                })
                .attr('y',(d) => yScale(d.healthcare))

            // Function for showing tool tip when
            // mouse cursor hovers over selected circle 
            d3.selectAll('circle')
                .on("mouseover", showToolTip)
                .on("mouseout", hidetooltip)
    
            // Function for hiding tool tip after mouse cursor is 
            // removed from circle
            function hidetooltip() {

                toolTip.style("display", "none"); 
                // w/o this function the box will display
                // until another tooltip is activated

                }
    
            // Function for showing tool tip when
            // mouse cursor hovers over selected circle 
            function showToolTip(event,d) {

                // Selects circle currently hovered over
                let circle = d3.select(this);
                // Selects active axis label with activeX class
                let activeX = d3.select(".active.activeX").text();

                // Initializes X data and X label
                var X = 0;
                var nameX = "";

                // Checks if selected active axis label
                // is "In Poverty (%)"
                if (activeX == 'In Poverty (%)') {
                    // Sets nameX to "Poverty"
                    nameX = "Poverty";
                    // Sets X to d.poverty
                    X = d.poverty + "%";
                }

                // Checks if selected active axis label
                // is "Age (Median)"
                else if (activeX == 'Age (Median)') {
                    // Sets nameX to "Age"
                    nameX = "Age";
                    // Sets X to d.age
                    X = d.age;
                }

                // Sets background color and text color for tool tip
                toolTip.style("background",'black').style("color",'white').style('display','block');

                // Creates html line for text to be inserted into tool tip
                let html = `<strong>${d.state}</strong> <br> ${nameX} :<strong> ${X}</strong> <br>
                Healthcare: <strong>  ${d.healthcare}% </strong> `;

                // Attaches html line above to specific tool tip,
                // Dependent on where cursor is placed
                toolTip
                    .html(html)
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px");
            }
        }

        // Assumes axis label click equals "Smokes (%)"
        else {

            // Makes Smokes y-axis label active
            smokes.classed('inactive',false).classed('active activeY',true);
            // Makes Healthcare y-axis label active
            health.classed('active activeY',false).classed('inactive',true);

            // Creates new y scale based on smoking percentage
            let yScale = d3
                .scaleLinear()
                .domain(d3.extent(data,(d)=>d.smokes))
                .range([chartHeight,0]);

            // Creates new left axis using new y scale
            let leftAxis = d3.axisLeft(yScale);

            // Attaches new left axis to chart
            // Transition between old and new left axis included
            chartGroup
                .selectAll("g .axis.y-axis")
                .transition()
                .call(leftAxis)
                .transition();

            // Shifts state circles to new y coordinates 
            // based on healthcare
            chartGroup
                .selectAll(".stateCircle") //select all of the class
                .transition()
                .attr("cy", (d)=> yScale(d.smokes));

            // Shifts state circle texts to new y coordinates
            // based on healthcare
            chartGroup
                .selectAll(".stateText")
                .transition()
                .text(function(d) {
                    return d.abbr
                })
                .attr('y',(d) => yScale(d.smokes));

            // Function for showing tool tip when
            // mouse cursor hovers over selected circle 
            d3.selectAll('circle')
                .on("mouseover", showToolTip)
                .on("mouseout", hidetooltip)
    
            // Function for hiding tool tip after mouse cursor is 
            // removed from circle
            function hidetooltip() {

                    toolTip.style("display", "none"); 
                    // w/o this function the box will display
                    // until another tooltip is activated
                    
                }
    
            // Function for showing tool tip when
            // mouse cursor hovers over selected circle 
            function showToolTip(event,d) {

                // Selects circle currently hovered over
                let circle = d3.select(this);
                // Selects active axis label with activeX class
                let activeX = d3.select(".active.activeX").text();

                // Initializes X data and X label
                var X = 0;
                var nameX = "";
                
                // Checks if selected active axis label
                // is "In Poverty (%)"
                if (activeX == 'In Poverty (%)') {
                    // Sets nameX to "Poverty"
                    nameX = "Poverty";
                    // Sets X to d.poverty
                    X = d.poverty + "%";
                }

                // Checks if selected active axis label
                // is "Age (Median)"
                else if (activeX == 'Age (Median)') {
                    // Sets nameX to "Age"
                    nameX = "Age";
                    // Sets X to d.age
                    X = d.age;
                }

                // Sets background color and text color for tool tip
                toolTip.style("background",'black').style("color",'white').style('display','block');

                // Creates html line for text to be inserted into tool tip
                let html = `<strong>${d.state}</strong> <br> ${nameX} :<strong> ${X}</strong> <br>
                Smokes: <strong>  ${d.smokes}% </strong> `;

                // Attaches html line above to specific tool tip,
                // Dependent on where cursor is placed
                toolTip
                    .html(html)
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px");
            }
        }

        
    }
    
    // Activation for Age, Poverty, Healthcare, and Smokes axes labels
    age.on('click',handleChange);
    poverty.on('click',handleChange);
    health.on('click',handleChange);
    smokes.on('click',handleChange);

}