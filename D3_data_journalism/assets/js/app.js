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

  return row;
}

function createChart(data) {
    console.table(data,["id","state",'abbr','poverty','povertyMoe','age','ageMoe','income','incomeMoe',
                        'healthcare','healthcareLow','healthcareHigh','obesity',
                        'obesityLow','obesityHigh','smokes','smokesLow','smokesHigh']);

    let yScale = d3
        .scaleLinear()
        .domain(d3.extent(data,(d)=>d.healthcare))
        .range([chartHeight,0]);

    let xScale = d3
        .scaleLinear()
        .domain(d3.extent(data,(d)=>d.poverty))
        .range([0,chartWidth]);


    /******************** Chart Labels  **********************/
    // X-axis label for Poverty
    chartGroup
        .append('text')
        .text('In Poverty (%)')
        .attr('x',chartWidth/2)
        .attr('y',chartHeight + chartMargin.top + 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")

    // X-axis label for Age
    chartGroup
        .append('text')
        .text('Age (Median)')
        .attr('x',chartWidth/2)
        .attr('y',chartHeight + chartMargin.top + 35)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")

    // X-axis label for Household Income
    chartGroup
        .append('text')
        .text('Household Income (Median)')
        .attr('x',chartWidth/2)
        .attr('y',chartHeight + chartMargin.top + 60)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")

    // Y-axis label for Healthcare
    chartGroup
        .append('text')
        .attr('transform','rotate(-90)')
        .text('Lacks Healthcare (%)')
        .attr('y',0-chartMargin.left+65)
        .attr('x',0-(chartHeight/2))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")

    
    chartGroup
        .append('text')
        .attr('transform','rotate(-90)')
        .text('Smokes (%)')
        .attr('y',0-chartMargin.left+40)
        .attr('x',0-(chartHeight/2))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")

    chartGroup
        .append('text')
        .attr('transform','rotate(-90)')
        .text('Obese (%)')
        .attr('y',0-chartMargin.left+20)
        .attr('x',0-(chartHeight/2))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
    /************** Creating Axes ************/
    let bottomAxis = d3.axisBottom(xScale);
    let leftAxis = d3.axisLeft(yScale);

    //Appending bottom axis
    chartGroup
        .append("g")
        .call(bottomAxis)
        .attr('transform',`translate(0,${chartHeight})`)
        .classed("axis",true)

    //Appending left axis
    chartGroup
        .append('g')
        .call(leftAxis)
        .classed("axis",true)
        .attr('font-size',"14px");

    /*********** Adding data points ***********/
    chartGroup
        .selectAll(".stateCircle") //select all of the class
        .data(data) //bind data
        .enter() //grab any extra data
        .append("circle") //append a circle for those extras
        .classed("stateCircle", true)
        .attr("cx", (d)=> xScale(d.poverty))
        .attr("cy", (d)=> yScale(d.healthcare))
        .attr("r", 10);

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
        .attr("font-size","9px")

    /******************** Tooltips ************************/
    let toolTip = d3
        .select("body")
        .append("div")
        .attr("class", "d3-tip")
        .attr('style', 'position: absolute;');;
    
    d3.selectAll('circle')
      .on("mouseover", showToolTip)
      .on("mouseout", hidetooltip)

      function hidetooltip() 
      {
        toolTip.style("display", "none"); 
        // w/o this function the box will display
        // until another tooltip is activated
      }

      function showToolTip(event,d) {
        let circle = d3.select(this);

        let classname = circle.attr("class");
        console.log(classname);

        toolTip.style("background",'black').style("color",'white').style('display','block');

        let html = `<strong>${d.state}</strong> <br> Poverty :<strong> ${d.poverty}</strong> <br>
        Healthcare: <strong>  ${d.healthcare} </strong> `;

        toolTip
            .html(html)
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px");
      }

    /*********************************************/


    


}