<template>
    <div>
        <h5 class="justify-content-between mt-4 mb-1 text-muted">Data</h5>
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link justify-content-between d-flex" data-bs-toggle="collapse" href="#composerList" role="button" aria-expanded="false" aria-controls="composerList"> 
                Composers <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down pull-right" viewBox="0 0 16 16">
                    <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659l4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"/>
                </svg> 
                </a>
                <div class="collapse multi-collapse" id="composerList">
                    <div class="card card-body">
                        <ul class="list-group vertical-scroll">
                                <li class="list-group-item" v-for="object in session.timeSpans" :key="object.id">
                                    <input type="checkbox" v-model="object.visible" v-bind:disabled="object.visibilityOverriden"> {{ object.displayCaption }}
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
        </ul>
        <h5 class="justify-content-between mt-4 mb-1 text-muted">Filters</h5>
        <ul class="nav flex-column">
            <li class="nav-item" v-for="parameter in getFilterableParameterDefinitions()" v-bind:key="parameter.id">
            <div class="justify-content-between d-flex">
                <div class="form-check form-switch" data-bs-toggle="collapse" v-bind:href="'#'+parameter.name+'List'" role="button" aria-expanded="false" v-bind:aria-controls="parameter.name + 'List'">         
                    <input type="checkbox" class="form-check-input" id="customSwitch1" v-on:change="activateFilter($event, parameter.id)"/>
                    <label class="form-check-label" for="customSwitch1">{{parameter.name}}</label>
                </div>
                
            </div>
                    
                <div class="collapse multi-collapse" v-bind:id="parameter.name+'List'">
                    <div class="card card-body">
                            <li class="list-group-item" v-for="str in groupByParameter(parameter)" v-bind:key="str">
                                    <input type="checkbox" v-on:change="applyParameterFilter($event, parameter.id, parameter.name, str)"> {{str}}
                            </li>
                    </div>
                </div>
            </li>
        </ul>  
    </div>     
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { ParamDefinition } from '@/core/Parameter';
import { ParameterStringFilter } from '@/core/ParameterFilter';
import { OrFilter } from '@/core/OrFilter';
// eslint-disable-next-line no-unused-vars
import { TimeLineBase } from '@/core/TimeLineBase';
import { Options, Vue } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import {Session} from '../core/Session';
// eslint-disable-next-line no-unused-vars
import {AndFilter} from '../core/AndFilterTest';

@Options({
  props: {
    session: Session
  }
})
export default class SideMenu extends Vue {

   session : Session;

   filterMap : Map<string,string> = new Map<string,string>();
   //We don't want all parameters to be filterable in the UI
getFilterableParameterDefinitions() {
   return this.session.parameterDefs.filter(pDef => pDef.filterable==true);
}

groupByParameter(definition: ParamDefinition) : Array<string>{
     
let groups : Record<string,TimeLineBase[]> = this.session.timeSpans.groupBy(tSpan => tSpan.getParameterByDefinition(definition).asString());
return Object.keys(groups);
}

applyParameterFilter(checkBoxCtrl:any, paramDefinitionId:string, paramName:string, value:string){

    let filterId : string = this.filterMap.get(paramDefinitionId) as string;
    let rootFilter : AndFilter = this.session.rootFilter as AndFilter;
    
    var checked= checkBoxCtrl.target.checked;
    var filter = rootFilter.getFilter(filterId) as OrFilter;
    //console.log("applyParameterFilter, filterId: "+filter.id);
    if (checked){
        var newFilter = new ParameterStringFilter(paramName, value);
        newFilter.id = value;
        newFilter.Activate(); 
        filter.addFilter(newFilter);
      //  console.log("is active:"+newFilter.isActive);
        rootFilter.Activate();
    }
    else
    {
        filter.removeFilter(value);
        rootFilter.Deactivate();
    }
    
    //console.log("Count in OrFilter: "+filter.getCount());
    this.session.Refresh();
}

activateFilter(checkBoxCtrl:any, parameterDefId:string){

    var checked= checkBoxCtrl.target.checked;
    let rootFilter : AndFilter = this.session.rootFilter as AndFilter;
    
    if (checked){
        var filter = new OrFilter();
        this.filterMap.set(parameterDefId, filter.id)  
        rootFilter.addFilter(filter);
      //  console.log("Add OrFilter, id: "+filter.id);
        filter.Activate();
        rootFilter.Activate();
    }else{
        var filterId = this.filterMap.get(parameterDefId) as string;
        rootFilter.removeFilter(filterId);
        this.filterMap.delete(filterId);
        rootFilter.Deactivate();
    // console.log("Delete filter, id: "+parameterDefId);
    }
    //var checked= checkBoxCtrl.target.checked;
    this.session.Refresh();
}
    
}

declare global {
    interface Array<T> {
        groupBy<T, K extends keyof any>(this:T[], getKey: (item: T) => K): Record<K, T[]>;
    }
}

Array.prototype.groupBy = function<T, K extends keyof any>(this:T[], getKey: (item:T) => K){

    return this.reduce( (prev, current) => {
        const group = getKey(current);
        if (!prev[group]) prev[group] = [];
        prev[group].push(current);
        return prev;
    }, {} as Record<K,T[]>);
};

</script>

<style scoped src="../assets/css/app.css"/>