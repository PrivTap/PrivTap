<template>
  <div>
    <h2>Publish a new Service</h2>
    <p>
      <input type="text" placeholder="Name" v-model="state.name" />
      <span > {{ v$.name }} </span>
    </p>
    <p>
      <input
        type="text"
        placeholder="Description"
        v-model="state.description"
      />
    </p>
    <p>
      <input type="text" placeholder="Endpoint" v-model="state.authURL" />
    </p>
    <p>
      <input type="text" placeholder="Client ID" v-model="state.clientID" />
    </p>
    <p>
      <input type="text" placeholder="Client Secret" v-model="clientSecret" />
    </p>
    <button @click="submitForm">Submit</button>
  </div>
</template>

<script lang="ts">
import useValidate from "@vuelidate/core";
import { computed, reactive } from "vue";
import { required, email, minLength, sameAs } from "@vuelidate/validators";

export default {
  setup() {
    const state = reactive({
      name: "",
      description: "",
      authURL: "",
      clientID: "",
      clientSecret: "",
    });
    const rules = computed(() => {
      return {
        name: { required, email },
        description: { required, minLength: minLength(6) },
        authURL: { required },
        clientID: { required },
        clientSecret: { required },
      };
    });
    const v$ = useValidate(rules, state);
    return { state, v$ };
  },
  data() {
    return {
      v$: useValidate(),
      name: "",
      description: "",
      authURL: "",
      clientID: "",
      clientSecret: "",
    };
  },
  methods: {
    submitForm() {
      this.v$.$validate()
      const data = {
        name: this.name,
        description: this.description,
        authURL: this.authURL,
        clientID: this.clientID,
        clientSecret: this.clientSecret,
      };
      console.log(data);
    },
  },
  validation: {
    name: { required },
    description: { required },
    authURL: { required },
    clientID: { required },
    clientSecret: { required },
  },
};
</script>

<style scoped></style>
