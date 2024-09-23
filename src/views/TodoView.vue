<template>
  <v-sheet class="d-flex pa-6 align-start ga-9">
    <div class="d-flex flex-column ga-4">
      <v-sheet
        class="pa-4 d-flex flex-column"
        elevation="2"
        rounded="lg"
        width="280"
      >
        <div>
          <p>Name: {{ user?.name }}</p>
          <p>Username: {{ user?.username }}</p>
          <p>Email: {{ user?.email }}</p>
          <p>
            Website
            <a :href="user?.website" target="_blank">{{ user?.website }}</a>
          </p>
        </div>

        <v-btn class="mt-2" color="primary" @click="logoutHandler"
          >logout</v-btn
        >
      </v-sheet>

      <v-sheet
        class="pa-4 d-flex flex-column"
        elevation="2"
        rounded="lg"
        width="280"
      >
        <v-form
          class="d-flex flex-column"
          @submit.prevent="createTodoHandler"
          v-model="form"
        >
          <v-text-field
            label="User id"
            :rules="todoRules"
            v-model="userId"
            required
          ></v-text-field>
          <v-text-field
            label="Title"
            :rules="todoRules"
            v-model="title"
            required
          ></v-text-field>
          <v-btn color="success" type="submit">Create todo</v-btn>
        </v-form>
      </v-sheet>
    </div>
    <div>
      <v-sheet
        class="pa-4 mb-4 d-flex ga-2"
        elevation="2"
        rounded="lg"
        min-width="660"
      >
        <v-text-field
          label="Search"
          prepend-icon="mdi-magnify"
          v-model="searchInput"
          hide-details
        ></v-text-field>
        <v-select
          label="Sort by status"
          :items="statuses"
          variant="filled"
          v-model="currentStatus"
          hide-details
        ></v-select>
        <v-select
          label="Sort by id"
          :items="usersIds"
          variant="filled"
          v-model="currentId"
          hide-details
          clearable
        ></v-select>
      </v-sheet>
      <v-sheet class="pa-4" elevation="2" rounded="lg">
        <ul v-if="filteredTasks?.length" class="d-flex ga-2 flex-column">
          <Todo
            v-for="task in filteredTasks"
            :key="task.id"
            :id="task.id"
            :user-id="task.userId"
            :title="task.title"
            :completed="task.completed"
            @addToFavorite="toFavoriteHandler"
            :isFavorite="favorites.includes(task.id)"
          />
        </ul>
        <p v-else>Nothing to display...</p>
      </v-sheet>
    </div>
  </v-sheet>
</template>
<script setup lang="ts">
import router from "@/router";
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import Todo from "@/components/Todo.vue";

const appStore = useAppStore(),
  { user, tasks } = storeToRefs(appStore),
  { getUser, getTodoes, createTodo } = appStore,
  statuses = ["All", "Completed", "Uncompleted", "Favorites"],
  usersIds = ref([]),
  currentStatus = ref("All"),
  currentId = ref(),
  searchInput = ref(),
  filteredTasks = ref(),
  todoRules = [
    (value: any) => {
      if (value) return true;
      return "Required field";
    },
  ],
  form = ref(false),
  userId = ref(""),
  title = ref(""),
  favorites = ref();

onMounted(async () => {
  if (localStorage.getItem("currentUser")) {
    const storedUserData = JSON.parse(
      localStorage.getItem("currentUser") as string
    );
    await getUser(storedUserData.name, storedUserData.phone);
    await getTodoes();

    usersIds.value = [
      ...new Set(tasks.value.map((item: any) => item.userId)),
    ] as [];

    filterTasks(undefined, "All", undefined);
  } else {
    localStorage.setItem("isAuth", "false");
  }
});

watch([currentId, currentStatus, searchInput], ([id, status, title]) => {
  filterTasks(id, status, title);
});

const logoutHandler = () => {
  localStorage.setItem("isAuth", "false");
  localStorage.removeItem("currentUser");
  router.push("/");
};

const filterTasks = (
    id: string | undefined,
    status: string | undefined,
    title: string | undefined
  ) => {
    favorites.value =
      JSON.parse(localStorage.getItem("favorites") as string) || [];

    filteredTasks.value = tasks.value
      .filter((task: any) => {
        if (id && task.userId !== id) return false;

        switch (status) {
          case "Completed":
            if (!task.completed) return false;
            break;
          case "Uncompleted":
            if (task.completed) return false;
            break;
          case "Favorites":
            if (!favorites.value.includes(task.id)) return false;
            break;
          case "All":
          default:
            break;
        }

        if (title && !task.title.toLowerCase().includes(title.toLowerCase())) {
          return false;
        }

        return true;
      })
      .slice()
      .reverse();
  },
  createTodoHandler = async () => {
    if (!form.value) return;

    await createTodo(userId.value, title.value);

    filterTasks(currentId.value, currentStatus.value, searchInput.value);
  },
  toFavoriteHandler = (id: number) => {
    favorites.value =
      JSON.parse(localStorage.getItem("favorites") as string) || [];

    if (favorites.value.includes(id)) {
      favorites.value = favorites.value.filter((item: any) => item != id);
      localStorage.setItem("favorites", JSON.stringify(favorites.value));
    } else {
      favorites.value.push(id);
      localStorage.setItem("favorites", JSON.stringify(favorites.value));
    }
  };
</script>
