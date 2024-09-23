<template>
  <v-sheet class="wrapper">
    <form @submit.prevent="submit" class="form">
      <v-sheet
        class="pa-4 text-center mx-auto"
        elevation="12"
        max-width="600"
        rounded="lg"
        width="100%"
      >
        <v-sheet color="grey-lighten-3 py-3 mb-4 rounded-t">
          <h3>Registration</h3>
        </v-sheet>
        <v-text-field
          v-model="name.value.value"
          :error-messages="name.errorMessage.value"
          label="Name"
        ></v-text-field>

        <v-text-field
          v-model="phone.value.value"
          :error-messages="phone.errorMessage.value"
          label="Phone Number"
        ></v-text-field>

        <v-btn
          class="me-4"
          type="submit"
          variant="tonal"
          block
          :color="Object.keys(errors).length ? 'error' : 'success'"
          size="large"
          :disabled="!!Object.keys(errors).length"
        >
          register
        </v-btn>
      </v-sheet>
    </form>
  </v-sheet>
</template>
<script lang="ts" setup>
import { useField, useForm } from "vee-validate";
import { useAppStore } from "@/stores/app";
import router from "@/router";


const { handleSubmit, errors, setErrors } = useForm({
  validationSchema: {
    name(value: string) {
      if (!value) return "required";
      if (nameRegexp.test(value)) {
        return true;
      } else {
        return "Only letters";
      }
    },
    phone(value: string) {
      if (!value) return "required";
      if (phoneRegexp.test(value)) {
        return true;
      } else {
        return "Only digits and symbols";
      }
    },
  },
});
const name = useField("name"),
  phone = useField("phone"),
  phoneRegexp = /^[\d+#().*-]+$/,
  nameRegexp = /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ ]+$/,
  appStore = useAppStore(),
  { getUser } = appStore;

const submit = handleSubmit(async ({ name, phone }) => {
  const tmpUser = {
    name: "Clementine Bauch",
    phone: "1-463-123-4447",
  };

  const currentUser = await getUser(name, phone);
  if (typeof currentUser == "string") {
    setErrors({ name: "User didn't find" });
    return;
  }

  await localStorage.setItem("isAuth", "true");

  router.push("/todo");
});
</script>
<style scoped>
.wrapper {
  height: 100vh;
  width: 100%;
  display: flex !important;
  align-items: center;
  justify-content: center;
}
.form {
  width: 460px;
}
</style>
