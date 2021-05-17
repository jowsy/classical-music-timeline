<template>
    <div class="container-fluid">       
        <div class="row">
           <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
             <SideMenu :session="session" @callUpdateTimeLineInParent="updateTimeLine"/> 
           </nav>
          <main class="col-md-9 ms-sm-auto col-lg-10 px-md-0">
            <Properties :composer="session.selectedComposer"/>
            <TimeLine :session="session" ref="timeline"/>        
            <Footer :colorManager="session.colorManager"/>  
          </main>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import TimeLine from './components/TimeLine.vue';
import SideMenu from './components/SideMenu.vue';
import Properties from './components/Properties.vue';
import Footer from './components/Footer.vue';

import {AndFilter} from './core/AndFilterTest';
import {WebColor} from './WebColor';
import {SessionVm} from './viewmodel/SessionVm'
import {ColorGeneratorImpl} from './viewmodel/ColorGeneratorImpl';
import { ShapeGeneratorConfig } from './viewmodel/ShapeGeneratorConfig';
import { SvgDimensions } from './viewmodel/SvgDimensions';
import { OpenOpusDataGateway } from './db/OpenOpus/OpenOpusDataGateway';

@Options({
  components: {
    TimeLine,
    SideMenu,
    Properties,
    Footer
  },
})
export default class App extends Vue {

  session:SessionVm;

  updateTimeLine(){
    (this.$refs as any).timeline.redraw();
  }

  data() {
    
    // Create a new user workspace/session for the user with all composers shown as default
    var newSession = new SessionVm	();
    
    //Set main filter
    newSession.rootFilter = new AndFilter();

    //Set color generator
    newSession.colorManager.colorGenerator = new ColorGeneratorImpl();

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

    //Setup shape generator, set constants
    newSession.shapeGenerator.config = new ShapeGeneratorConfig();

     //Add OpenOpus datasource

     /**
      * The data gateway is the component that handles low-level communication (I/O) with an external data source
      * The data source could be a REST-service, csv-file or a JSON/XML
      * You can add multiple datasets, the loader will load them in the order they are added
      * The data gateway can also act on selection of an item, for example a composer. This enables lazy loading of data. 
      */

    var dataGateway = new OpenOpusDataGateway();
    newSession.addDataSet("OpenOpus Data Dump", "Dump from OpenOpus API", dataGateway);

    var svgConfig = new SvgDimensions();
    svgConfig.marginLeft = 20;
    svgConfig.marginTop = 40;
    
    newSession.shapeGenerator.config.svgDimensions = new SvgDimensions();

    return { session : newSession};
  }

  async mounted(){
    this.session.loadData().then(() => {
      
      console.debug("data loaded");

      this.session.regenerate(); //create shapes
      this.session.refresh(); //update visibility
      this.session.dataChangedTick++; //increment data change counter

    });
  }
}
</script>
<style scoped src="../src/assets/css/app.css"/>