<template>
    <div class="card card-body">
            <li
              class="list-group-item"
              v-for="str in groupByParameter(parameter)"
              v-bind:key="str">
              <input
                type="checkbox"
                class="form-check-input"
                v-on:change="
                  applyParameterFilter(
                    $event,
                    parameter.id,
                    parameter.name,
                    str)"/>
              {{ str }}
            </li>
    </div>
</template>
<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { AndFilter, OrFilter, Parameter, ParameterDefinition, ParameterStringFilter, TimeLineBase } from "@/core";
import { SessionVm } from "@/viewmodel/SessionVm";
import { Options, Vue } from "vue-class-component";

@Options({
      props: {
        parameter: Parameter,
        session: SessionVm
      },
      emits: ["callUpdateTimeLineInParent"],
})
export default class ListFilterControl extends Vue {
    session:SessionVm;
    parameter:Parameter;
    filterMap: Map<string, string> = new Map<string, string>();
    
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
    
    let rootFilter: AndFilter = this.session.rootFilter as AndFilter;

    var checked = checkBoxCtrl.target.checked;
    var filter = rootFilter.getFilter("f_"+ParameterDefinitionId) as OrFilter;

    if (checked) {
      var newFilter = new ParameterStringFilter(paramName, value);
      newFilter.id = value;
      newFilter.Activate();
      filter.addFilter(newFilter);
      rootFilter.Activate();
    } else {
      filter.removeFilter(value);
      rootFilter.Deactivate();
    }

    this.session.Refresh();
    this.$emit("callUpdateTimeLineInParent");
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