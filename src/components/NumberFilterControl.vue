<template>
    <div class="card card-body" v-if="value!=undefined">
        <div class="container-flex">
           <div class="row">
           <input v-model="startValue" class="col col-lg-5">
           <span class="col col-lg-2 text-center">-</span>
           <input v-model="endValue" class="col col-lg-5">
           </div>
        </div>
           <vue-slider
            :tooltip="'none'"
            v-bind:min="min"
            v-bind:max="max"
            v-model="value"
          />
    </div>
</template>
<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { AndFilter, OrFilter, Parameter, ParameterDefinition, ParameterNumberRangeFilter, TimeLineBase } from "@/core";
import { SessionVm } from "@/viewmodel/SessionVm";
import { Options, Vue } from "vue-class-component";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

@Options({
      props: {
        parameterDefinition: ParameterDefinition,
        session: SessionVm
      },
      components: {
        VueSlider
      },
      emits: ["callUpdateTimeLineInParent"],
})
export default class NumberFilterControl extends Vue {
    session:SessionVm;
    parameterDefinition:ParameterDefinition;
    min:number;
    max:number;
    private filterValue:number[]=[];
    get value (){
      return this.filterValue;
    }
    set value(value:number[]){
      this.filterValue = value;
      this.updateFilter();
    }
    
    get startValue() {
      return this.value[0];
    } 
    set startValue(value:number){
       var valueCopy = [value,this.value[1]];
      this.value = valueCopy;
      this.updateFilter();
    }

     get endValue() {
      return this.value[1];
    } 
    set endValue(value:number){
      var valueCopy = [this.value[0],value];
      this.value = valueCopy;
      this.updateFilter();
    }

    mounted(){
   
      if (this.session.composers!=undefined) {  
        var result = this.session.composers.map(c => 
          c.getParameterByDefinition(this.parameterDefinition).asNumber())
          .filter(c => c!=undefined);
        if (result.length>0){
          this.max=Math.max(...result);
          this.min=Math.min(...result);
          this.value = [this.min,this.max];
          this.updateFilter();
        }
    
      }
    }

    updateFilter() {
      console.log("hej");
      let rootFilter: AndFilter = this.session.rootFilter as AndFilter;
      var filter = rootFilter.getFilter("f_"+this.parameterDefinition.id) as OrFilter;

      if (filter == undefined) return;

      var rangeFilter = filter.getFilter("1") as ParameterNumberRangeFilter;
      if (rangeFilter==undefined){
        var newFilter = new ParameterNumberRangeFilter(this.parameterDefinition, this.min, this.max);
        newFilter.id = "1";
        filter.addFilter(newFilter);
        newFilter.Activate();
      }else{
        rangeFilter.min = this.value[0];
        rangeFilter.max = this.value[1];
        rangeFilter.Activate();
      }
      rootFilter.Activate();
     
      this.session.Refresh();
       this.$emit("callUpdateTimeLineInParent");
    }
  
}




</script>