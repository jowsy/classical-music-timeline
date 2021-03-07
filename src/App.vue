<template>
    <div class="container-fluid">       
        <div class="row">
           <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
             <SideMenu :session="session"/> 
           </nav>
          <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <TimeLine :session="session"/>          
          </main>
        </div>
    </div>
      
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import TimeLine from './components/TimeLine.vue';
import SideMenu from './components/SideMenu.vue';
import {Session} from './core/Session';
import {AndFilter} from './core/AndFilterTest';
import {JsonDataMapper} from './db/JsonDataMapper';
//import { ParamType } from './core/Parameter';

@Options({
  components: {
    TimeLine,
    SideMenu
  },
})
export default class App extends Vue {

  session:Session;

  data() {
    
    // Create a new user workspace/session for the user with all composers shown as default
    var newSession = new Session();
    
    //Plug in adapters
    newSession.rootFilter = new AndFilter();

    return { session : newSession};
  }

  async mounted(){

    // Add parameter for filtering OpenOpus data
    //this.session.addCustomParameter("epoch", ParamType.String, true);
    //this.session.addCustomParameter("portrait", ParamType.String, false);
      
    //Preload json data
    //=================================================================

    fetch("medieval.json")
      .then(response => response.text())
      .then(json => this.session.PlugIn(new JsonDataMapper(json)))
      .finally( () => this.session.Refresh());

    fetch("renaissance.json")
      .then(response => response.text())
      .then(json => this.session.PlugIn(new JsonDataMapper(json)))
      .finally( () => this.session.Refresh());

    fetch("baroque.json")
      .then(response => response.text())
      .then(json => this.session.PlugIn(new JsonDataMapper(json)))
      .finally( () => this.session.Refresh());

    fetch("classical.json")
      .then(response => response.text())
      .then(json => this.session.PlugIn(new JsonDataMapper(json)))
      .finally( () => this.session.Refresh());

    fetch("earlyromantic.json")
      .then(response => response.text())
      .then(json => this.session.PlugIn(new JsonDataMapper(json)))
      .finally( () => this.session.Refresh());

    fetch("romantic.json")
      .then(response => response.text())
      .then(json => this.session.PlugIn(new JsonDataMapper(json)))
      .finally( () => this.session.Refresh());
    
    fetch("lateromantic.json")
      .then(response => response.text())
      .then(json => this.session.PlugIn(new JsonDataMapper(json)))
      .finally( () => this.session.Refresh());


  }
}
</script>
<style scoped src="../src/assets/css/app.css"/>

