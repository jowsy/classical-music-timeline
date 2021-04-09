<template>
      <nav  id="main-footer" class="navbar fixed-bottom navbar-light bg-light">
        <div>
            <ul class="list-group list-group-horizontal" v-if="getColorMap()!=undefined">
                <li class="list-group-item"  v-for="item in getColorMap()" v-bind:key="item">
                <svg width="20" height="10" ><rect width="20" height="10" v-bind:style="{ 'fill': 'rgb('+item[1].r+' , '+item[1].g+' ,'+item[1].b+')'}"/></svg>
                {{item[0]}}
                </li>
            </ul>
        </div>
    </nav>
</template>

<script lang="ts">
import { ColorManager } from "@/core";
import { Options, Vue } from "vue-class-component";

@Options({
      props: {
    colorManager: ColorManager
      }
})
export default class Footer extends Vue {
    colorManager: ColorManager;
    getColorMap(){
        return this.colorManager?.getCurrentColorMap();
    }
}
</script>
