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
import {WebColor} from './WebColor';

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
    
    //Set main filter
    newSession.rootFilter = new AndFilter();

    //Add color scheme
    //=================================================================
    let colors : WebColor[] = [
                              new WebColor("#54478C"),
                              new WebColor("#2C699A"),
                              new WebColor("#048BA8"),
                              new WebColor("#0DB39E"),
                              new WebColor("#16DB93"),
                              new WebColor("#83E377"),
                              new WebColor("#B9E769"),
                              new WebColor("#EFEA5A"),
                              new WebColor("#F1C453"),
                              new WebColor("#F29E4C")
                          ];  

    newSession.colorManager.addColorScheme("default",colors);

    newSession.colorManager.setDefaultColor(new WebColor("#808080"));

    return { session : newSession};
  }

  async mounted(){


    //Preload data
    //=================================================================

    fetch("dump.json")
      .then(response => response.text())
      .then(json => this.session.PlugIn(new JsonDataMapper(json)))
      .then( () => {
        this.session.colorManager.refresh();
        this.session.Refresh();});

   /* fetch("medieval.json")
      .then(response => response.text())
      .then(json => this.session.PlugIn(new JsonDataMapper(json)))
      .finally( () =>fetch("renaissance.json")
          .then(response => response.text())
          .then(json => this.session.PlugIn(new JsonDataMapper(json)))
          .finally( () => fetch("baroque.json")
            .then(response => response.text())
            .then(json => this.session.PlugIn(new JsonDataMapper(json)))
            .finally( () => this.session.Refresh())));*/

    

    
/*
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
*/

  }
}
</script>
<style scoped src="../src/assets/css/app.css"/>

