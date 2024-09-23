<template>
  <v-sheet
    :color="completed ? 'success' : 'info'"
    class="pa-2 d-flex justify-space-between align-center"
    rounded
  >
    <li class="d-flex ga-2">
      <p>{{ props.id }}</p>
      <h4>{{ props.title }}</h4>
    </li>

    <v-icon
      icon="mdi-heart"
      :color="isFavorite ? 'orange-darken-2' : ''"
      v-tooltip="'Add to favorite'"
      @click="$emit('addToFavorite', id)"
    ></v-icon>
  </v-sheet>
</template>
<script setup lang="ts">
const props = defineProps<{
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  isFavorite: boolean;
}>();
</script>
