import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const useAppStore = defineStore("app", () => {
  const user = ref(),
    tasks = ref(),
    task = ref();

  const getUser = async (username: string, phone: string) => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users?name=${username}&phone=${phone}`
      );

      if (response.status === 200 && !response.data.length) {
        return "no user find";
      }

      user.value = response.data[0];
      return user.value;
    } catch (e) {
      return e;
    }
  };
  const getTodoes = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );

      tasks.value = await response.data;
    } catch (e) {
      return e;
    }
  };

  const createTodo = async (userId: string, title: string) => {
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/todos",
        {
          data: {
            userId,
            title,
          },
        }
      );
      if (response.status == 200 || response.status == 201) {
        tasks.value.push({
          userId: Number.parseInt(userId),
          title,
          completed: false,
          id: tasks.value.length + 1,
        });
      }
    } catch (e) {
      return e;
    }
  };

  return { user, tasks, task, getUser, getTodoes, createTodo };

  // const count = ref(0)
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }

  // return { count, doubleCount, increment }
});
