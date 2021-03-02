<template>
    <div>
        <h5 class="justify-content-between mt-4 mb-1 text-muted">Filters</h5>
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
                                         <input type="checkbox" v-model="object.show"> {{ object.displayCaption }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item" v-for="parameter in getFilterableParameterDefinitions()" :key="parameter.id">
                        <a class="nav-link justify-content-between d-flex" data-bs-toggle="collapse" v-bind:href="parameter.name+'List'" role="button" aria-expanded="false" v-bind:aria-controls="parameter.name + 'List'"> 
                        {{parameter.name}} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down pull-right" viewBox="0 0 16 16">
                            <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659l4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"/>
                        </svg> 
                        </a>
                        <div class="collapse multi-collapse" v-bind:id="parameter.name+'List'">
                            <div class="card card-body">
                                <ul class="list-group vertical-scroll">
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>  
    </div>     
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import {Session} from '../core/Session';

@Options({
  props: {
    session: Session
  }
})
export default class SideMenu extends Vue {

   session : Session;

   //We don't want all parameters to be filterable in the UI
getFilterableParameterDefinitions() {
   return this.session.parameterDefs.filter(pDef => pDef.filterable==true);
}
    
}
</script>

<style scoped src="../assets/css/app.css"/>