<script setup>
import { computed, ref } from 'vue'
import TaskForm from './components/TaskForm.vue'
import {
  getTasks, saveTasks
} from './services/taskStorage.js'

//recuperar las tareas guardadas
const tasks = ref(getTasks())

const showForm = ref(true)
const storageError = ref(false)

//guardar los cambios
function persistTasks() {
  storageError.value = !saveTasks(tasks.value)
}

//añadir tarea
function addTask(taskData) {
  const newTask = {
    title: taskData.title,
    description: taskData.description,
    dueDate: taskData.dueDate,
    module: taskData.module,
    priority: taskData.priority,
    tags: taskData.tags,
    completed: false,
    id: Date.now().toString()
  }

  tasks.value.unshift(newTask)

  persistTasks()

  showForm.value = false

}

//eliminar tarea
function deleteTask(taskId) {
  tasks.value = tasks.value.filter(task => task.id !== taskId)
  persistTasks()
}

//calcular total tareas
const totalTasks = computed(() => { return tasks.value.length })
//calcular tareas pendientes
const pendingTasks = computed(() => { return tasks.value.filter(task => !task.completed).length })


</script>

<template>
  <TaskForm v-if="showForm" @save="addTask" @cancel="showForm = false" />
  <div v-if="!showForm">
    <button @click="showForm = true">Añadir otra tarea</button>
  </div>
  <p v-if="storageError">Error al guardar las tareas</p>

  <section>
    <h2>Mis tareas</h2>
    <div v-if="tasks.length === 0">
      <p>Todavía no tienes tareas.</p>
    </div>

    <div v-else>
      <p>Total tareas: {{ totalTasks }}</p>
      <p>Tareas pendientes: {{ pendingTasks }}</p>
      <article v-for="task in tasks" :key="task.id">
        <h3>{{ task.title }}</h3>
        <p v-if="task.description">{{ task.description }}</p>
        <p>Módulo: {{ task.module }}</p>
        <p>Prioridad: {{ task.priority }}</p>
        <p v-if="task.tags.length > 0">Etiquetas: {{ task.tags }}</p>
        <button @click="deleteTask(task.id)">Eliminar tarea</button>
      </article>
    </div>
  </section>
</template>
