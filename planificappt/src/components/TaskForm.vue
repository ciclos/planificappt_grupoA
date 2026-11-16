<script setup>
import { ref } from 'vue'

const title = ref('')
const description = ref('')
const dueDate = ref('')
const module = ref('')
const priority = ref('')
const tags = ref('')

const emit = defineEmits(['save', 'cancel'])

const titleError = ref('')

function validateForm(){
    if(title.value === ''){
        titleError.value = "El título es obligatorio."
        return false
    }

    if(title.value.length < 4){
        titleError.value = "El título debe contener al menos 4 caracteres."
        return false
    }

    titleError.value = ''
    return true
}

function submitForm() {
    if(!validateForm()){
        return
    }

    const newTask = {
        title: title.value,
        description: description.value,
        dueDate: dueDate.value,
        module: module.value,
        priority: priority.value,
        tags: tags.value.split(',')
    }

    emit('save', newTask)
}
</script>

<template>
    <form @submit.prevent="submitForm">
        <label for="title">Título</label>
        <input type="text" name="title" id="title" placeholder="Introduce el título" v-model="title">
        <span v-if="titleError">{{ titleError }}</span>

        <label for="description">Descripción</label>
        <textarea name="description" id="description" placeholder="Describe la tarea" v-model="description"></textarea>

        <label for="dueDate">Fecha límite</label>
        <input type="date" name="dueDate" id="dueDate" v-model="dueDate">

        <label for="module">Módulo</label>
        <input type="text" name="module" id="module" placeholder="Ej. DWEC" v-model="module">

        <label for="priority">Prioridad</label>
        <select name="priority" id="priority" v-model="priority">
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
        </select>

        <label for="tags">Etiquetas</label>
        <input type="text" name="tags" id="tags" v-model="tags" placeholder="Práctica, Estudio...">

        <button type="submit">Guardar</button>
        <button type="button" @click="emit('cancel')">Cancelar</button>
    </form>


</template>