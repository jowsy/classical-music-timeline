<template>
    <div>
        <div id="timelinecanvas"></div>
        <span>Extents: {{ session.minDate }} -> {{ session.maxDate }}</span> 
    </div>  
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { Session } from '../core/Session';
import * as d3 from 'd3';
// eslint-disable-next-line no-unused-vars
//import TimeLineColorUtils from '../TimeLineColorUtils';
// eslint-disable-next-line no-unused-vars
//import {Composer} from '../Composer';

//------------- PUT THIS INTO A CONFIGURATION -------------------------
let tickTimeInterval : number = 20; //in year
var barHeight = 20;
var margin = 1;
//----------------------------------------------------------------

@Options({
      props: {
    session: Session
      }
})
export default class TimeLine extends Vue {

    session : Session;

    created(){

        this.$watch('session', () => {
            //this.session.setExtents();
            this.redraw();
        }, {
        deep: true
        });

    }
    redraw(){

console.log("watch!");
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
    svgRect.height = barHeight*this.session.timeSpans.length; //- svgRect.top - svgRect.bottom;
  

   var	timeLineCanvas = d3.select("#timelinecanvas");

        timeLineCanvas.select("svg").remove(); 
    var svg = timeLineCanvas.append("svg")
            .attr("width", svgRect.width + svgRect.left + svgRect.right)
            .attr("height", svgRect.height + svgRect.top + svgRect.bottom);
            

    var scale = d3.scaleTime()
    .domain(
        [this.session.minDate, 
        this.session.maxDate])
        .range([svgRect.left, svgRect.width]);


    let dateInterval = d3.timeYear.every(tickTimeInterval);

    let xAxis = d3.axisBottom(scale).ticks(dateInterval); //Date ticks
    //let yAxis = d3.axisLeft(scale).ticks(dateInterval); //Vertical grid lines

    var g = svg.selectAll("g")
        .data(this.session.timeSpans.filter(ts => ts.show==true))
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate("+svgRect.left+"," + i * barHeight + ")";
        });

    g.append("rect")
        .attr("x", function (d) { return (scale(d.startDate)); })
        .attr("width", function (d) {
            return scale(d.endDate)-scale(d.startDate);
        })
        //.attr("fill", function (c) { return GetHexColorByEpoch(c.epoch) })
        .attr("height", barHeight - margin)
        .attr("visibility", function(d) { if (d.show) return "visible"; else return "collapse"});

                
        g.append("text")
            .attr("x", function (d) { return (scale(new Date(d.startDate))); })
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .text(function (d) { return d.displayCaption; })
            .style("fill", "white" ) 
            .attr("visibility", function(d) { if (d.show) return "visible"; else return "collapse"});
            //.style("fill", function (d) { return Utils.getTextColorByBackgroundColor(GetHexColorByEpoch(d.epoch))} ); 

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + svgRect.left + "," + svgRect.height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + svgRect.left + "," + svgRect.height + ")")
            .call(xAxis.tickSize(-svgRect.height).tickFormat(() => ""))
            .lower();
    }  

}

/*
function GetHexColorByEpoch(epochName:string) {
    let index : number = Object.keys(epochs).findIndex(x => x == epochName);
    if (index==-1 && colorScheme.values.length-1 < index) return "gray"
    else return colorScheme[index];
}*/


</script>