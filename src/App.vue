<template>
    <div class="container-fluid">       
        <div class="row">
           <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
             <SideMenu :session="session" @callUpdateTimeLineInParent="updateTimeLine"/> 
           </nav>
          <main class="col-md-9 ms-sm-auto col-lg-10 px-md-0">
            <Properties :composer="session.selected"/>
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
import {Workspace} from './viewmodel/Workspace'
import {ColorGeneratorImpl} from './viewmodel/ColorGeneratorImpl';
import { ShapeGeneratorConfig } from './viewmodel/ShapeGeneratorConfig';
import { SvgDimensions } from './viewmodel/SvgDimensions';
import { OpenOpusDataGateway } from './db/OpenOpus/OpenOpusDataGateway';
import { ShapeGeneratorImpl } from './viewmodel/ShapeGeneratorImpl';

@Options({
  components: {
    TimeLine,
    SideMenu,
    Properties,
    Footer
  },
})
export default class App extends Vue {

  session:Workspace;

  updateTimeLine(){
    (this.$refs as any).timeline.redraw();
  }

  data() {
    
    // Create a new user workspace/session for the user with all composers shown as default
    var workspace = new Workspace();
    
    //Set main filter
    workspace.rootFilter = new AndFilter();

    //Set color generator
    workspace.colorManager.colorGenerator = new ColorGeneratorImpl();

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

    workspace.colorManager.addColorScheme("default",colors);
    workspace.colorManager.setDefaultColor(new WebColor("#808080"));

     //Add OpenOpus datasource
     /**
      * The data gateway is the component that handles low-level communication (I/O) with an external data source
      * The data source could be a REST-service, csv-file or a JSON/XML
      * You can add multiple datasets, the loader will load them in the order they are added
      * The data gateway can also act on selection of an item, for example a composer. This enables lazy loading of data. 
      */

    var dataGateway = new OpenOpusDataGateway();
    workspace.addDataSet("OpenOpus Data Dump", "Dump from OpenOpus API", dataGateway);
  
    return { session : workspace};
  }

  async mounted(){

    this.session.loadData().then(() => {
      
      console.debug("data loaded");

      this.session.setExtents();

      //When extents have been set, create Shape Generator
      //=================================================
      var shapeGenConfig = new ShapeGeneratorConfig();
          
      var svgConfig = new SvgDimensions();
      svgConfig.marginLeft = 20;
      svgConfig.marginTop = 40;

      shapeGenConfig.svgDimensions = svgConfig;
      this.session.viewConfig = shapeGenConfig;
      var shapeGenImpl= new ShapeGeneratorImpl(shapeGenConfig);

      shapeGenImpl.minDate = this.session.minDate;
      shapeGenImpl.maxDate = this.session.maxDate;
      
      this.session.shapeGenerator =  shapeGenImpl;
      //===================================================

      this.session.regenerate(); //generate shapes

      this.session.refresh(); //update visibility
      
      this.session.dataChangedTick++; //increment data change counter

      this.updateTimeLine();

    });
  }
}
</script>
<style scoped src="../src/assets/css/app.css"/>