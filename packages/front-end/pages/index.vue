<template>
  <div class="container">
    <p>Click on each link to see its note.</p>
    <br />

    <ul>
      <li
        v-for="(note, index) in notes"
        :key="note.SK"
        @click="onItemClicked(index)"
      >
        <div>{{ decodeURIComponent(note.SK.replace("LINK#", "")) }}</div>
      </li>
    </ul>
    <br />
    <br />
    <div v-html="currentNote"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

declare interface Note {
  note: string;
  SK: string;
  PK: string;
}

export default Vue.extend({
  data() {
    return {
      notes: new Array<Note>(),
      currentNote: ""
    };
  },
  methods: {
    onItemClicked(index: number) {
      this.currentNote = this.notes[index].note;
    }
  },
  mounted() {
    var raw = JSON.stringify({ email: "duyphan@orgos.net" });
    var requestOptions = {
      method: "POST",
      body: raw
    };

    fetch(
      "https://skh5jyyse7.execute-api.ap-southeast-1.amazonaws.com/dev/notez",
      requestOptions
    )
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.notes = result;
      })
      .catch(error => console.log("error", error));
  }
});
</script>

<style lang="scss" scoped>
.container {
  width: 80%;
  min-height: 80vh;

  background-color: cadetblue;
}
</style>
