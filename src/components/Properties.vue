<template>
<div id="property-menu">
  <div  v-if="composer!=undefined" class="collapse" id="navbarToggleExternalContent">
    <div class="bg-dark p-4">
      <h5 class="text-white h4">{{composer.fullName}}</h5>
      <span class="text-muted">{{composer.birth.toLocaleDateString('en-US')}}</span><span class="text-muted"> - </span><span v-if="composer.death!=undefined" class="text-muted">{{composer.death.toLocaleDateString('en-US')}}</span>
    </div>
  </div>
  <nav class="navbar navbar-dark bg-dark">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarToggleExternalContent"
        aria-controls="navbarToggleExternalContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>
  </div>
</template>

<script lang="ts">
import { Person } from "@/core/Person";
import { Options, Vue } from "vue-class-component";

@Options({
      props: {
    composer: Person
      }
})
export default class Properties extends Vue {
    
}
</script>
