
import * as d3 from 'd3';
import {Composer, Request, RootObject} from "./openopusapi";
import * as jsonData from "../public/data.json";
import Utils from "./utils";

//------------- PUT THIS INTO A CONFIGURATION -------------------------
let tickTimeInterval : number = 20; //in year
var barHeight = 20;
var margin = 1;
let colorScheme : Array<string> = [
    "#54478C",
    "#2C699A",
    "#048BA8",
    "#0DB39E",
    "#16DB93",
    "#83E377",
    "#B9E769",
    "#EFEA5A",
    "#F1C453",
    "#F29E4C"
];

//-----------------------------------------------------------------



let composers: Array<Composer> = new Array<Composer>();
jsonData.composers.forEach(c => composers.push(Object.assign(new Composer(), c)));

let epochs : Record<string,Composer[]> = composers.groupBy(c => c.epoch);

function GetHexColorByEpoch(epochName:string) {
    let index : number = Object.keys(epochs).findIndex(x => x == epochName);
    if (index==-1 && colorScheme.values.length-1 < index) return "gray"
    else return colorScheme[index];
}
//composers.forEach(c => console.log(c.complete_name + ', ' + c.birth + ', ' + c.death));
Object.keys(epochs).forEach(f =>  console.log(f));

class rect {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
}

let	svgRect = new rect();
svgRect.top = 30;
svgRect.right = 20;
svgRect.bottom = 30;
svgRect.left = 5;

svgRect.width = 2000 - svgRect.left - svgRect.right,
svgRect.height = barHeight*composers.length; //- svgRect.top - svgRect.bottom;

let minDate: Date = d3.min(composers.map(f => f.getBirthDate()));
let maxDate: Date = d3.max(composers.map(f => f.getDeathDate()));

var	svg = d3.select("#timelinecanvas")
	.append("svg")
		.attr("width", svgRect.width + svgRect.left + svgRect.right)
        .attr("height", svgRect.height + svgRect.top + svgRect.bottom);
        

var scale = d3.scaleTime()
.domain(
    [minDate, 
    maxDate])
    .range([svgRect.left, svgRect.width]);


let dateInterval: d3.AxisTimeInterval = d3.timeYear.every(tickTimeInterval);

let xAxis = d3.axisBottom(scale).ticks(dateInterval); //Date ticks
let yAxis = d3.axisLeft(scale).ticks(dateInterval); //Vertical grid lines

var g = svg.selectAll("g")
    .data(composers.sort(Utils.compareDate))
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
        return "translate("+svgRect.left+"," + i * barHeight + ")";
    });

g.append("rect")
    .attr("x", function (d) { return (scale(d.getBirthDate())); })
    .attr("width", function (d) {
        return scale(d.getDeathDate())-scale(d.getBirthDate());
    })
    .attr("fill", function (c) { return GetHexColorByEpoch(c.epoch) })
    .attr("height", barHeight - margin);    

 g.append("text")
    .attr("x", function (d) { return (scale(new Date(d.birth))); })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function (d) { return d.complete_name; })
    .style("fill", function (d) { return Utils.getTextColorByBackgroundColor(GetHexColorByEpoch(d.epoch))} ); 

svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(" + svgRect.left + "," + svgRect.height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(" + svgRect.left + "," + svgRect.height + ")")
    .call(xAxis.tickSize(-svgRect.height).tickFormat(function(d) { return "" }))
    .lower();
