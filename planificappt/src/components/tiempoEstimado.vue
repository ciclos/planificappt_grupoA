<script setup>
import { ref } from 'vue'

//Listado de asignaturas
const asignaturas = ref([
    'Desarrollo Web en Entorno Cliente',
    'Diseño de Interfaces Web',
    'Desarrollo Web en Entorno Servidor',
    'Despliegue de aplicaciones web'
])

//variables reactivas
const asignaturaSeleccionada = ref('')
const cantidadEjercicios = ref(1)

//Array para guardar los registros
const historialTareas = ref([])
</script>

<template>
    <div class="contenedor-principal">
        <!--Tarjeta de configuracion de la tarea-->
        <div class="tarjeta">
            <div class="tarjeta-cuerpo">
                <form @submit.prevent>
                    <label>Asignatura: </label>
                    <select v-model="asignaturaSeleccionada">
                        <option value="" disabled > Selecciona una asignatura </option>
                        <option v-for="subject in asignaturas" :key="subject" :value="subject">{{ subject }}</option>
                    </select>
                    <br>
                    <label>Cantidad de ejercicios</label>
                    <input v-model.number="cantidadEjercicios" type="number">
                </form>
                <hr>
            </div>
            <h3>Comprobación en vivo:</h3>
            <p><strong>Asignatura:</strong> {{ asignaturaSeleccionada || '(Ninguna)' }}</p>
            <p><strong>Ejercicios:</strong> {{ cantidadEjercicios }}</p>
        </div>

    </div>
</template>