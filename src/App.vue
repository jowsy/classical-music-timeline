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
import {Session} from './core/Session'
import {OpenOpusDataMapper} from './db/OpenOpusDataMapper'

@Options({
  components: {
    TimeLine,
    SideMenu
  },
})
export default class App extends Vue {

  data() {
    
    // Create a new user workspace/session for the user with all composers shown as default
    var newSession = Session.Create(new OpenOpusDataMapper()); //plug-in datamapper for OpenOpus
    return { session : newSession};
  }
}





</script>

<style>

</style>
