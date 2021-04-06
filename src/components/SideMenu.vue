<template>
  <div>
    <h5 class="justify-content-between mt-4 mb-1 text-muted">Data</h5>
    <ul class="nav flex-column">
      <li class="nav-item">
        <div class="accordion" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Composers
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <div>
                  <input
                    class="form-control"
                    list="datalistOptions"
                    id="exampleDataList"
                    placeholder="Type to search..."
                    v-model="composerFilterValue"
                  />
                </div>
                <div class="card card-body"  style="margin: 0; padding: 0">
                  <ul class="list-group vertical-scroll">
                    <li
                      class="list-group-item"
                      v-for="object in sortedComposers"
                      :key="object.id"
                      v-bind:class="{ 'active' : isSelected(object.internalId), 'disabled' : object.visibilityOverriden}">
                     <div class="d-flex">
                    <label class="p-1 flex-fill" @click="selectComposer(object.internalId)">{{ object.displayCaption }}</label>
                    <div class="p-1 justify-content-end">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16" @click="showComposer(object.internalId)" v-bind:style="{ 'display':convertToVisibility(object.visibilityOverriden || !object.visible)}">
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                    </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16" @click="hideComposer(object.internalId)" v-bind:style="{ 'display':convertToVisibility(object.visibilityOverriden==false && object.visible)}">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                        </svg>
                    </div>
                    </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li class="nav-item">
        <div>
          <div>
            {{ session.timeExtents.value[0] }} -
            {{ session.timeExtents.value[1] }}
          </div>
          <vue-slider
            :tooltip="'none'"
            v-bind:min="session.timeExtents.min"
            v-bind:max="session.timeExtents.max"
            v-model="session.timeExtents.value"
            @change="redrawTimeLine"
          />
        </div>
      </li>
    </ul>
    <h5 class="justify-content-between mt-4 mb-1 text-muted">Filters</h5>
    <ul class="nav flex-column">
      <li
        class="nav-item"
        v-for="parameter in getFilterableParameterDefinitions()"
        v-bind:key="parameter.id"
      >
        <div class="justify-content-between d-flex">
          <div
            class="form-check form-switch"
            data-bs-toggle="collapse"
            v-bind:href="'#' + parameter.name + 'List'"
            role="button"
            aria-expanded="false"
            v-bind:aria-controls="parameter.name + 'List'"
          >
            <input
              type="checkbox"
              class="form-check-input"
              id="customSwitch1"
              v-on:change="activateFilter($event, parameter.id)"
            />
            <label class="form-check-label" for="customSwitch1">{{
              parameter.name
            }}</label>
          </div>
        </div>

        <div
          class="collapse multi-collapse"
          v-bind:id="parameter.name + 'List'"
        >
          <div class="card card-body">
            <li
              class="list-group-item"
              v-for="str in groupByParameter(parameter)"
              v-bind:key="str"
            >
              <input
                type="checkbox"
                class="form-check-input"
                v-on:change="
                  applyParameterFilter(
                    $event,
                    parameter.id,
                    parameter.name,
                    str
                  )
                "
              />
              {{ str }}
            </li>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { ParameterDefinition } from "@/core/Parameter";
import { ParameterStringFilter } from "@/core/ParameterFilter";
import { OrFilter } from "@/core/OrFilter";
// eslint-disable-next-line no-unused-vars
import { TimeLineBase } from "@/core/TimeLineBase";
import { Options, Vue } from "vue-class-component";
// eslint-disable-next-line no-unused-vars
import { SessionVm } from "../viewmodel/SessionVm";
// eslint-disable-next-line no-unused-vars
import { AndFilter } from "../core/AndFilterTest";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";
//import MultiRangeSlider from './MultiRangeSlider.vue';

@Options({
  props: {
    session: SessionVm,
  },
  components: {
    VueSlider,
  },
  emits: ["callUpdateTimeLineInParent"],
})
export default class SideMenu extends Vue {
  value: Array<number> = [];
  session: SessionVm;
  filterMap: Map<string, string> = new Map<string, string>();
  minValue: number;
  maxValue: number;

  private _composerFilterValue: string = "";
  get composerFilterValue(): string {
    return this._composerFilterValue;
  }
  set composerFilterValue(value: string) {
    this._composerFilterValue = value;
    //this.$forceUpdate();
  }

  convertToVisibility(value:boolean){
      return value ? "block" : "none";
  }
  get sortedComposers() {
    return [...this.session.composers]
      .filter((c) =>
        this._composerFilterValue == ""
          ? true
          : c.fullName
              .toLowerCase()
              .includes(this._composerFilterValue.toLowerCase())
      )
      .sort((a, b) => (a.displayCaption > b.displayCaption ? 1 : -1));
  }

    isSelected(id:number){
        return this.session.selection.includes(id);
    }

    selectComposer(e:number){
        this.session.selection = [e];
        this.redrawTimeLine();
    }

    showComposer(e:number){
        var composer = this.session.composers.find(c => c.internalId == e);
        if (composer == undefined || composer.visibilityOverriden) return;
        composer.visible = true;
        //this.$forceUpdate();
        this.redrawTimeLine();
    }

    
    hideComposer(e:number){
        var composer = this.session.composers.find(c => c.internalId == e);
        if (composer == undefined) return;
        composer.visible = false;
        this.$forceUpdate();
        this.redrawTimeLine();
    }

  //We don't want all parameters to be filterable in the UI
  getFilterableParameterDefinitions() {
    return this.session.configuration.parameterDefinitions.filter(
      (pDef) => pDef.filterable == true
    );
  }

  groupByParameter(definition: ParameterDefinition): Array<string> {
    let groups: Record<string, TimeLineBase[]> = [...this.session.composers]
      .sort((a, b) => {
        return a.birth > b.birth ? 1 : -1;
      })
      .groupBy((tSpan) =>
        tSpan.getParameterByDefinition(definition).asString()
      );
    return Object.keys(groups);
  }

  applyParameterFilter(
    checkBoxCtrl: any,
    ParameterDefinitionId: string,
    paramName: string,
    value: string
  ) {
    let filterId: string = this.filterMap.get(ParameterDefinitionId) as string;
    let rootFilter: AndFilter = this.session.rootFilter as AndFilter;

    var checked = checkBoxCtrl.target.checked;
    var filter = rootFilter.getFilter(filterId) as OrFilter;
    //console.log("applyParameterFilter, filterId: "+filter.id);
    if (checked) {
      var newFilter = new ParameterStringFilter(paramName, value);
      newFilter.id = value;
      newFilter.Activate();
      filter.addFilter(newFilter);
      //  console.log("is active:"+newFilter.isActive);
      rootFilter.Activate();
    } else {
      filter.removeFilter(value);
      rootFilter.Deactivate();
    }

    //console.log("Count in OrFilter: "+filter.getCount());
    this.session.Refresh();
    this.redrawTimeLine();
  }
  redrawTimeLine() {
    this.$emit("callUpdateTimeLineInParent");
  }
  activateFilter(checkBoxCtrl: any, parameterDefId: string) {
    var checked = checkBoxCtrl.target.checked;
    let rootFilter: AndFilter = this.session.rootFilter as AndFilter;

    if (checked) {
      var filter = new OrFilter();
      this.filterMap.set(parameterDefId, filter.id);
      rootFilter.addFilter(filter);
      //  console.log("Add OrFilter, id: "+filter.id);
      filter.Activate();
      rootFilter.Activate();
    } else {
      var filterId = this.filterMap.get(parameterDefId) as string;
      rootFilter.removeFilter(filterId);
      this.filterMap.delete(filterId);
      rootFilter.Deactivate();
      // console.log("Delete filter, id: "+parameterDefId);
    }
    //var checked= checkBoxCtrl.target.checked;
    this.session.Refresh();
    this.redrawTimeLine();
  }
}

declare global {
  interface Array<T> {
    groupBy<T, K extends keyof any>(
      this: T[],
      getKey: (item: T) => K
    ): Record<K, T[]>;
  }
}

Array.prototype.groupBy = function <T, K extends keyof any>(
  this: T[],
  getKey: (item: T) => K
) {
  return this.reduce((prev, current) => {
    const group = getKey(current);
    if (!prev[group]) prev[group] = [];
    prev[group].push(current);
    return prev;
  }, {} as Record<K, T[]>);
};
</script>

<style scoped>
@import "../assets/css/app.css";
</style>