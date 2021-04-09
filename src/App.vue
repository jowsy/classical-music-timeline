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
import {CsvMapper, CsvMapperConfig} from './db/CsvMapper';
import {OpenOpusJsonMapper} from './db/OpenOpus/OpenOpusJsonMapper';
import {WebColor} from './WebColor';
import {SessionVm} from './viewmodel/SessionVm'
import {ParamType } from './core/Parameter';
import {ColorGeneratorImpl} from './viewmodel/ColorGeneratorImpl';
import { ShapeGeneratorConfig } from './viewmodel/ShapeGeneratorConfig';
import { SvgDimensions } from './viewmodel/SvgDimensions';

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

    var svgConfig = new SvgDimensions();
    svgConfig.marginLeft = 20;
    svgConfig.marginTop = 40;
    
    newSession.shapeGenerator.config.svgDimensions = new SvgDimensions();

    

    return { session : newSession};
  }

  async mounted(){

    //Define data transformer for CSV file
    //=================================================================
    const imdbDestParameterName = "ImdbSoundtrackCredits";
        
      const csvMapperConfig = Object.assign({
            destFieldNameToMatch:"displayCaption",
            csvFieldNameToMatch:"Name",
            destFieldNameToSet:imdbDestParameterName,
            destFieldNameToSetType: ParamType.Number,
            csvFieldNameToRetrieve:"SoundtrackCredits",
            delimiterString: ";"
        }, new CsvMapperConfig());


    //Create custom parameters
    //=================================================================
    this.session.configuration.addParameter(imdbDestParameterName, 
                                            ParamType.Number,
                                            true); //for IMDB soundtrack credits, see csv-mapper above

    //Load data source - OpenOpus
    //=================================================================
    fetch("dump.json")
      .then(response => response.text())
      .then(json => this.session.PlugIn(new OpenOpusJsonMapper(json)))
      .finally( () => {
         fetch("IMDBSoundtrackCredits.csv")
          .then(response => response.text())
          .then(csv => {
              const csvTransformer=new CsvMapper(csv, csvMapperConfig);
              csvTransformer.transform(this.session.elements);
              
             // const parameterDef = this.session.configuration.getParameterByName(imdbDestParameterName);

              //Color in timeline using a gradient
            /* if (parameterDef!=undefined)
                this.session.colorManager.mapColorsByNumberParameter(parameterDef,
                                                                     100, 
                                                                      new WebColor("#e5f5f9"), 
                                                                      new WebColor("#2ca25f"));*/
              
              this.session.regenerate(); //generate geometry
              this.session.Refresh();
              this.updateTimeLine();
            });
        });

  }
}
</script>
<style scoped src="../src/assets/css/app.css"/>

