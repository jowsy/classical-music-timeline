<template>
    <div>
        <div id="canvas"></div>
    </div> 
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { Workspace } from '../viewmodel/Workspace';
import * as d3 from 'd3';
// eslint-disable-next-line no-unused-vars
import { WebColor } from '@/WebColor';
// eslint-disable-next-line no-unused-vars
import { IColor } from '@/core/IColor';
import { TimeLineRectangle } from '@/core/TimeLineShapes';
import { Person } from '@/core/Person';
import { ViewportUtils } from "../viewmodel/ViewportUtils";

@Options({
      props: {
    session: Workspace
      }
})
export default class TimeLine extends Vue {

    session : Workspace;

    created(){

       /* this.$watch('session', () => {
            //this.session.setExtents();
            //this.redraw();
        }, {
        deep: true
        });*/
        window.addEventListener("resize", this.redrawFully);

    }
    redrawFully(){
        this.session.shapeGenerator.generatePersonShapes(this.session.composers);
        this.redraw();
    }
    redraw(){
    const config = this.session.viewConfig;
    var session = this.session;

    const maxDate = session.maxDate;
    const minDate = session.minDate;
    const computedWidth =  ViewportUtils.GetViewportWidth(config.svgDimensions);
    const computedHeight = ViewportUtils.GetViewportHeight(config.svgDimensions);
    const gridHeight = computedHeight-config.svgDimensions.topAxisHeight;

    //Filter
    const sortedRects = [...this.session
                .composers].sort((a, b) => {
                    return a.birth > b.birth ? 1 : -1;})
                       .filter(c =>
                       c.shape instanceof TimeLineRectangle &&
                       c.isInsideTimeSpan(this.session.timeExtents.getSelectedMinDate().getFullYear(), 
                       this.session.timeExtents.getSelectedMaxDate().getFullYear()));


    //Preserve zoom

    var oldZoomRect = d3.select<SVGSVGElement, unknown>("#zoomRect");
    var prevZoomTransform;
    var nodeElement = oldZoomRect.node();
    if (nodeElement!=null){
        prevZoomTransform= d3.zoomTransform(nodeElement);
    }

    //if redraw, remove old canvas
    d3.select("#canvas").select("svg").remove();

    //DEFINE MAIN SVG
    //Explicit cast necessary
    //Reference: https://stackoverflow.com/questions/66059904/type-errors-for-d3js-in-angular-latest
    const gMain = d3.select<SVGSVGElement, unknown>("#canvas")
        .append("svg")
        .attr("width", computedWidth)
        .attr("height", computedHeight)
        .append("g")
        .attr("class","zoom_area");

                //This rectangle exists as a zooming area
    const rectangle = gMain
        .append("rect")
        .attr("id","zoomRect")
        .attr("x", 0)
        .attr("y",  config.svgDimensions.topAxisHeight)
        .attr("width", computedWidth)
        .attr("height", gridHeight)
        .style("fill", "transparent");


    //Only show graphics inside a specified rectangle
    var clip = gMain.append("defs").append("SVG:clipPath")
    .attr("id", "clip")
    .append("SVG:rect")
    .attr("width", computedWidth)
    .attr("height", gridHeight)
    .attr("x", 0)
    .attr("y", config.svgDimensions.topAxisHeight);

    var clipPath = gMain.append('g')
    .attr("clip-path", "url(#clip)")

    var canvas = clipPath.append('g');


    //Define time scale
    const scale = d3.scaleTime()
    .domain(
        [minDate, maxDate])
        .range([0, computedWidth]);

    let dateInterval = d3.timeYear.every(config.tickTimeInterval);
    let xAxis = d3.axisTop(scale).ticks(dateInterval); //Date ticks
  
  
    //Create svg groups where we can put rectangle and texts
    var g = canvas.selectAll("rect")
        .data(sortedRects.filter(ts => ts.visible==true))
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate("+d.shape.x+"," + d.shape.y +")";
        });

    //const barHeightWithMargin = barHeight*0.9;
    const selectedColor = "#007bff";
    var selection = this.session.selection;
    //Create rectangles inside groups
    const rectangles = g
        .append("rect")
        .attr("id", d => d.internalId)
        .attr("width", d => (d.shape as TimeLineRectangle).width)
        .attr("height",d => (d.shape as TimeLineRectangle).height)
        .attr("fill", function (c) { 
        if (selection.includes(c.internalId)) return selectedColor;
        var color = c.session.colorManager.getColor(c) as WebColor;
        if (color == null) return "gray";
         return color.toHexString(); } )
        .attr("visibility", function(d) { if (d.visible) return "visible"; else return "collapse"})
        .attr("cursor","pointer");
      


    const texts = g.append("text")
        .attr("dy", ".7em")
        .text(function (d) { return d.displayCaption; })
        .attr("visibility", function(d) { if (d.visible) return "visible"; else return "collapse"})
        .style("fill", function (d) { 
            if (selection.includes(d.internalId)) return TimeLine.textBackgroundColor(new WebColor(selectedColor));
            return TimeLine.textBackgroundColor(
                d.session.colorManager.getColor(d))
            } )
        .style("font", function (d)  {

            return Math.min((d.shape as TimeLineRectangle).width/d.displayCaption.length,(d.shape as TimeLineRectangle).height)+"px times";
        })
        .attr("cursor","pointer");

    rectangles.on("click", (e,c) => select(e,c));
    texts.on("click", (e,c) => select(e,c));

    function select(e:any,c:Person) {       
         //Reset selection, we can only select one item at a time, 
         if (session.selection.length>0){
            var previousId = session.selection[0];
            var node = document.querySelector("[id='"+previousId+"']");
            if (node!=null){
            var previousSelectionComposer = session
                .composers.find(c => c.internalId == previousId)
            if (previousSelectionComposer!=undefined)
                node.setAttribute("fill", (c.session.colorManager.getColor(previousSelectionComposer) as WebColor).toHexString());
            }
         }
         
         session.selection = [c.internalId];
         
         //If selection is text, highlight rectangle in the same group
         if (e.target.tagName=="text"){
               var rectangleNode = document.querySelector("[id='"+c.internalId+"']");
                 if (rectangleNode!=undefined)
                rectangleNode.setAttribute("fill", selectedColor);

         }else{
         e.srcElement.setAttribute("fill", selectedColor);
         }

    }

    const axis = gMain.append("g")
        .attr("class", "grid")
        .attr("transform", "translate("+ 0+","+ config.svgDimensions.topAxisHeight + ")")
        .call(xAxis);
   
    
    const verticalAxis = gMain.append("g")
        .attr("class", "verticalgrid")
        .attr("transform", "translate(" + 0+ "," + computedHeight + ")")
        .call(xAxis.tickSize(gridHeight).tickFormat(() => ""))
        .lower();


    var zoom = d3.zoom<SVGSVGElement, unknown>();
    zoom.extent([[0, 0], [ computedWidth, computedHeight]])
    .scaleExtent([1, 10])
    .translateExtent([[0, 0], [computedWidth, computedHeight]])
    .on('zoom', updateChart);

    const zoom_area =  d3.select<SVGSVGElement, unknown>(".zoom_area");
    zoom(zoom_area);
    //const zoomRect = d3.select<SVGSVGElement, unknown>("#zoomRect").call(zoom);
    
    if (prevZoomTransform!=null)
       zoom_area.call(zoom.transform, prevZoomTransform);

    /*eslint no-unused-vars: 0 */    
    function updateChart(event:any, d:any) {

        var xNewScale = event.transform.rescaleX(scale);
        
        canvas.attr("transform", event.transform);      

        axis.call(d3.axisTop(xNewScale).ticks(dateInterval));
        verticalAxis.call(d3.axisTop(xNewScale).tickSize(gridHeight).ticks(dateInterval).tickFormat(() => ""));
    }


    }  

    private static textBackgroundColor(color:IColor) : string{
       
        var newColor = Math.round(((color.r * 299) + 
                    (color.b * 587) + 
                    (color.g * 114)) / 1000); 
        var textColor = (newColor > 125) ? 'black' : 'white'; 
    
        return textColor;
    }
    

}

/*
function GetHexColorByEpoch(epochName:string) {
    let index : number = Object.keys(epochs).findIndex(x => x == epochName);
    if (index==-1 && colorScheme.values.length-1 < index) return "gray"
    else return colorScheme[index];
}*/


</script>