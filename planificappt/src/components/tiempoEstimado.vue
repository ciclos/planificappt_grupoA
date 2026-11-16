<script setup>
import { ref, computed } from 'vue'

const asignaturasInfo = {
    'Desarrollo Web en Entorno Cliente': { icon: '⚡', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' },
    'Diseño de Interfaces Web': { icon: '🎨', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
    'Desarrollo Web en Entorno Servidor': { icon: '🖥️', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
    'Inglés Técnico': { icon: '🌍', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' }
}

const tareasAsignadas = ref([
    {
        id: 101,
        titulo: 'Práctica 3: Componentes y Reactividad en Vue 3',
        asignatura: 'Desarrollo Web en Entorno Cliente',
        ejercicios: 4,
        horaProgramada: '17:00 - 18:30',
        fecha: 'Hoy, 11 Noviembre',
        descripcion: 'Resolver los ejercicios de comunicación entre componentes, props y emits.',
        completada: false
    },
    {
        id: 102,
        titulo: 'Maquetación Responsive con CSS Grid',
        asignatura: 'Diseño de Interfaces Web',
        ejercicios: 3,
        horaProgramada: '18:45 - 19:45',
        fecha: 'Hoy, 11 Noviembre',
        descripcion: 'Adaptar la vista de tarjetas a móvil, tablet y escritorio.',
        completada: false
    },
    {
        id: 103,
        titulo: 'Controladores y Rutas REST en Laravel',
        asignatura: 'Desarrollo Web en Entorno Servidor',
        ejercicios: 5,
        horaProgramada: '10:00 - 12:00',
        fecha: 'Mañana, 12 Noviembre',
        descripcion: 'Implementar endpoints CRUD con validación de formularios.',
        completada: false
    },
    {
        id: 104,
        titulo: 'Technical Documentation Reading',
        asignatura: 'Inglés Técnico',
        ejercicios: 2,
        horaProgramada: '12:30 - 13:15',
        fecha: 'Mañana, 12 Noviembre',
        descripcion: 'Leer la documentación oficial y responder al cuestionario.',
        completada: false
    }
])

const tareaSeleccionadaId = ref(101)
const vistaActiva = ref('sesion')

const tareaActual = computed(() => {
    return tareasAsignadas.value.find(t => t.id === tareaSeleccionadaId.value) || tareasAsignadas.value[0]
})

function cambiarTarea(nuevoId) {
    if (enCurso.value) return
    tareaSeleccionadaId.value = Number(nuevoId)
    reiniciarDatosSesion()
}

//SUBTAREA 2
const enCurso = ref(false)
const horaInicio = ref(null)
const horaInicioTexto = ref('')
const ejerciciosHechos = ref(0)

// Calcula el porcentaje para la barra de progreso
const porcentajeProgreso = computed(() => {
    if (tareaActual.value.ejercicios === 0) return 0
    return Math.round((ejerciciosHechos.value / tareaActual.value.ejercicios) * 100)
})

function iniciarTarea() {
    const ahora = new Date()
    horaInicio.value = ahora
    horaInicioTexto.value = ahora.toLocaleTimeString() // Ej: "17:05:12"
    ejerciciosHechos.value = 0
    enCurso.value = true
}

function reiniciarDatosSesion() {
    enCurso.value = false
    horaInicio.value = null
    horaInicioTexto.value = ''
    ejerciciosHechos.value = 0
    notasSesion.value = ''
}

function cancelarSesion() {
    if (confirm('¿Deseas cancelar la medición actual?')) {
        reiniciarDatosSesion()
    }
}

function sumarEjercicio() {
    if (ejerciciosHechos.value < tareaActual.value.ejercicios) {
        ejerciciosHechos.value++
    }
}

function restarEjercicio() {
    if (ejerciciosHechos.value > 0) {
        ejerciciosHechos.value--
    }
}

//SUBTAREA 3
const notasSesion = ref('')
const dificultad = ref('normal')
const mostrarModal = ref(false)
const ultimaTareaGuardada = ref(null)

function finalizarTarea() {
    if (!horaInicio.value) return

    const horaFin = new Date()
    const horaFinTexto = horaFin.toLocaleTimeString()

    // Diferencia en milisegundos dividida entre 1000 para tener segundos
    // Usamos Math.max(1, ...) por si se prueba en menos de 1 segundo
    const segundosTotales = Math.max(1, Math.round((horaFin - horaInicio.value) / 1000))

    // Formateamos a minutos y segundos legibles
    const min = Math.floor(segundosTotales / 60)
    const seg = segundosTotales % 60
    const tiempoLegible = min > 0 ? `${min}m ${seg}s` : `${seg}s`

    // Media por ejercicio
    const mediaSeg = (segundosTotales / tareaActual.value.ejercicios).toFixed(1)
    const mediaMin = (mediaSeg / 60).toFixed(2)

    tareaActual.value.completada = true
    enCurso.value = false

    const registro = {
        id: Date.now(),
        tareaOriginalId: tareaActual.value.id,
        titulo: tareaActual.value.titulo,
        asignatura: tareaActual.value.asignatura,
        ejercicios: tareaActual.value.ejercicios,
        tramoHorario: `${horaInicioTexto.value} - ${horaFinTexto}`,
        tiempoTotalSegundos: segundosTotales,
        tiempoTotalFormateado: tiempoLegible,
        mediaSeg: mediaSeg,
        mediaMin: mediaMin,
        notas: notasSesion.value,
        dificultad: dificultad.value,
        fechaCorta: tareaActual.value.fecha
    }

    historialTareas.value.unshift(registro)
    ultimaTareaGuardada.value = registro
    mostrarModal.value = true
}

function cerrarModal() {
    mostrarModal.value = false
    reiniciarDatosSesion()

    // Pasa automáticamente a la siguiente tarea pendiente
    const siguiente = tareasAsignadas.value.find(t => !t.completada)
    if (siguiente) {
        tareaSeleccionadaId.value = siguiente.id
    }
}

//SUBTAREA 4
const historialTareas = ref([])

//SUBTAREA 5
const estimacionAsignatura = computed(() => {
    let totalSeg = 0
    let totalEjer = 0

    for (const item of historialTareas.value) {
        if (item.asignatura === tareaActual.value.asignatura) {
            totalSeg += item.tiempoTotalSegundos
            totalEjer += item.ejercicios
        }
    }

    if (totalEjer === 0) return null

    const mediaSeg = Math.round(totalSeg / totalEjer)
    const estimacionMin = Math.round((mediaSeg * tareaActual.value.ejercicios) / 60)
    return {
        mediaTexto: `${mediaSeg}s`,
        estimacionMin: estimacionMin
    }
})

const resumenMetricas = computed(() => {
    if (historialTareas.value.length === 0) return null

    let segTotales = 0
    let ejerTotales = 0

    for (const item of historialTareas.value) {
        segTotales += item.tiempoTotalSegundos
        ejerTotales += item.ejercicios
    }

    const minTotales = Math.floor(segTotales / 60)
    const mediaGlobalMin = ejerTotales > 0 ? (segTotales / ejerTotales / 60).toFixed(1) : 0

    return {
        totalTareas: historialTareas.value.length,
        ejerciciosTotales: ejerTotales,
        tiempoTexto: minTotales > 0 ? `${minTotales}m` : `${segTotales}s`,
        mediaGlobalMin: mediaGlobalMin
    }
})

function obtenerDatosAsignatura(nombreAsignatura) {
    let hechas = 0
    let seg = 0
    let ejer = 0

    for (const item of historialTareas.value) {
        if (item.asignatura === nombreAsignatura) {
            hechas++
            seg += item.tiempoTotalSegundos
            ejer += item.ejercicios
        }
    }

    const mediaMin = ejer > 0 ? (seg / ejer / 60).toFixed(1) : 0
    return { hechas, mediaMin }
}
</script>

<template>
    <div class="calendar-task-window">
        <!-- CABECERA Y PESTAÑAS -->
        <header class="window-header">
            <div class="header-left">
                <div class="calendar-pill">
                    <span> Tareas Asignadas </span>
                    <span class="live-dot" :class="{ active: enCurso }"></span>
                </div>

                <span class="scheduled-time-badge">
                    {{ tareaActual.fecha }} · {{ tareaActual.horaProgramada }}
                </span>
            </div>

            <div class="header-actions">
                <div class="view-tabs">
                    <button class="tab-btn" :class="{ active: vistaActiva === 'sesion' }"
                        @click="vistaActiva = 'sesion'">
                        Tarea Actual
                    </button>
                    <button class="tab-btn" :class="{ active: vistaActiva === 'historial' }"
                        @click="vistaActiva = 'historial'">
                        Completadas ({{ historialTareas.length }}/{{ tareasAsignadas.length }})
                    </button>
                    <button class="tab-btn" :class="{ active: vistaActiva === 'estadisticas' }"
                        @click="vistaActiva = 'estadisticas'">
                        Métricas
                    </button>
                </div>
            </div>
        </header>

        <main v-if="vistaActiva === 'sesion'" class="window-body">

            <!-- SUBTAREA 1: Selector y Ficha de la Tarea -->
            <div class="task-selector-bar">
                <label class="selector-label">Seleccionar tarea programada:</label>
                <select :value="tareaSeleccionadaId" class="modern-select" :disabled="enCurso"
                    @change="cambiarTarea($event.target.value)">
                    <option v-for="t in tareasAsignadas" :key="t.id" :value="t.id">
                        {{ t.completada ? ' [HECHA]' : '[PENDIENTE]' }} {{ t.titulo }} ({{ t.asignatura }})
                    </option>
                </select>
            </div>

            <section class="task-info-card">
                <div class="task-info-main">
                    <div class="subject-row">
                        <div class="subject-badge" :style="{
                            backgroundColor: asignaturasInfo[tareaActual.asignatura]?.bg,
                            color: asignaturasInfo[tareaActual.asignatura]?.color
                        }">
                            <span>{{ asignaturasInfo[tareaActual.asignatura]?.icon }}</span>
                            <span>{{ tareaActual.asignatura }}</span>
                        </div>

                        <div class="badges-group">
                            <span class="task-state-pill" :class="tareaActual.completada ? 'done' : 'pending'">
                                {{ tareaActual.completada ? 'Tarea Hecha' : 'Pendiente de entrega' }}
                            </span>

                            <span class="status-indicator-badge" :class="{ running: enCurso }">
                                <span class="pulse-indicator"></span>
                                {{ enCurso ? 'Sesión iniciada' : 'Sin iniciar' }}
                            </span>
                        </div>
                    </div>

                    <h2 class="readonly-task-title">{{ tareaActual.titulo }}</h2>
                    <p class="task-description-hint">{{ tareaActual.descripcion }}</p>
                </div>

                <div class="readonly-meta-strip">
                    <div class="meta-pill">
                        <span>Ejercicios asignados:</span>
                        <strong>{{ tareaActual.ejercicios }}</strong>
                    </div>
                    <div class="meta-pill">
                        <span>Franja prevista:</span>
                        <strong>{{ tareaActual.horaProgramada }}</strong>
                    </div>
                </div>

                <!-- Banner conectado a SUBTAREA 5 (Estimación previa) -->
                <div v-if="estimacionAsignatura" class="estimation-hint-banner">
                    <div>
                        <strong>Estimación según tu ritmo previo:</strong> En <em>{{ tareaActual.asignatura }}</em>
                        sueles tardar <strong>{{ estimacionAsignatura.mediaTexto }}/ejercicio</strong>.
                        Tiempo estimado para esta tarea: <strong>~{{ estimacionAsignatura.estimacionMin }}
                            minutos</strong>.
                    </div>
                </div>
            </section>

            <section class="timer-card" :class="{ 'timer-running': enCurso }">
                <div class="timer-top-status">
                    <span class="timer-sublabel">CONTROL DE HORA INICIO — FIN</span>
                    <span v-if="enCurso" class="live-pace-badge">
                        En curso desde las {{ horaInicioTexto }}
                    </span>
                </div>

                <div class="time-range-display">
                    <div class="time-box">
                        <span class="time-box-label">HORA DE INICIO</span>
                        <span class="time-box-value">{{ horaInicioTexto || '--:--:--' }}</span>
                    </div>

                    <div class="time-arrow">→</div>

                    <div class="time-box">
                        <span class="time-box-label">HORA DE FIN</span>
                        <span class="time-box-value">{{ enCurso ? 'En progreso...' : '--:--:--' }}</span>
                    </div>
                </div>

                <div class="exercise-progress-box">
                    <div class="progress-info-row">
                        <span>Seguimiento de ejercicios:</span>
                        <span>
                            <strong>{{ ejerciciosHechos }}</strong> de <strong>{{ tareaActual.ejercicios }}</strong>
                            completados ({{ porcentajeProgreso }}%)
                        </span>
                    </div>

                    <div class="progress-track">
                        <div class="progress-fill" :style="{ width: porcentajeProgreso + '%' }"></div>
                    </div>

                    <div class="exercise-step-controls">
                        <button type="button" class="step-btn secondary" :disabled="ejerciciosHechos === 0 || !enCurso"
                            @click="restarEjercicio">
                            Deshacer (-1)
                        </button>
                        <button type="button" class="step-btn primary"
                            :disabled="ejerciciosHechos >= tareaActual.ejercicios || !enCurso" @click="sumarEjercicio">
                            +1 Ejercicio Hecho
                        </button>
                    </div>
                </div>

                <div class="timer-controls">
                    <button v-if="!enCurso" class="control-btn btn-start" @click="iniciarTarea">
                        <span>{{ tareaActual.completada ? 'Registrar Nuevo Intento' : 'Empezar Tarea (Marcar Inicio)'
                            }}</span>
                    </button>

                    <button v-if="enCurso" class="control-btn btn-finish" @click="finalizarTarea">
                        <span>Finalizar Tarea (Marcar Fin y Guardar)</span>
                    </button>

                    <button v-if="enCurso" class="control-btn btn-reset" title="Cancelar medición"
                        @click="cancelarSesion">
                        <span>✖ Cancelar</span>
                    </button>
                </div>
            </section>

            <section class="task-notes-section">
                <div class="notes-header">
                    <label class="notes-label">Observaciones al realizar la tarea:</label>
                    <div class="difficulty-picker">
                        <span class="difficulty-caption">Dificultad percibida:</span>
                        <button type="button" class="diff-pill" :class="{ active: dificultad === 'facil' }"
                            @click="dificultad = 'facil'">
                            Fácil
                        </button>
                        <button type="button" class="diff-pill" :class="{ active: dificultad === 'normal' }"
                            @click="dificultad = 'normal'">
                            Normal
                        </button>
                        <button type="button" class="diff-pill" :class="{ active: dificultad === 'dificil' }"
                            @click="dificultad = 'dificil'">
                            Exigente
                        </button>
                    </div>
                </div>
                <textarea v-model="notasSesion" rows="2" class="notes-textarea"
                    placeholder="Anota si algún ejercicio te llevó más tiempo de lo normal o si quedó alguna duda..."></textarea>
            </section>
        </main>

        <main v-else-if="vistaActiva === 'historial'" class="window-body">
            <div class="history-view-card">
                <div class="history-toolbar">
                    <div>
                        <h3 class="view-heading">Registro de Tareas Completadas</h3>
                        <p class="view-subheading">Tiempos calculados (Inicio - Fin) y media por ejercicio.</p>
                    </div>
                </div>

                <div v-if="historialTareas.length === 0" class="empty-state">
                    <h4>Aún no has completado ninguna tarea</h4>
                    <p>Selecciona una tarea pendiente y pulsa "Empezar Tarea" para registrar la hora de inicio.</p>
                    <button class="btn-primary-sm" @click="vistaActiva = 'sesion'">Ir a Tarea Actual</button>
                </div>

                <div v-else class="table-container">
                    <table class="modern-table">
                        <thead>
                            <tr>
                                <th>Tramo Real</th>
                                <th>Tarea / Asignatura</th>
                                <th>Ejercicios</th>
                                <th>Tiempo Total</th>
                                <th>Media / Ejercicio</th>
                                <th>Notas</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in historialTareas" :key="item.id">
                                <td>{{ item.tramoHorario }}</td>
                                <td>
                                    <div class="table-task-cell">
                                        <strong>{{ item.titulo }}</strong>
                                        <span class="mini-subject-pill" :style="{
                                            backgroundColor: asignaturasInfo[item.asignatura]?.bg,
                                            color: asignaturasInfo[item.asignatura]?.color
                                        }">
                                            {{ item.asignatura }}
                                        </span>
                                    </div>
                                </td>
                                <td><strong>{{ item.ejercicios }}</strong></td>
                                <td>{{ item.tiempoTotalFormateado }}</td>
                                <td>
                                    <div class="media-highlight">
                                        <strong>{{ item.mediaMin }} min</strong>
                                        <span class="media-sec">({{ item.mediaSeg }} seg)</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="notes-preview-cell">
                                        <span class="diff-tag" :class="item.dificultad">{{ item.dificultad }}</span>
                                        <span class="notes-text">{{ item.notas || '—' }}</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>

        <main v-else-if="vistaActiva === 'estadisticas'" class="window-body">
            <div class="metrics-container">
                <h3 class="view-heading">Resumen de Tiempos y Estimaciones</h3>
                <p class="view-subheading">Datos acumulados a partir de tus tareas realizadas.</p>

                <div v-if="resumenMetricas" class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-content">
                            <span class="stat-value">{{ resumenMetricas.tiempoTexto }}</span>
                            <span class="stat-label">Tiempo Invertido</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <span class="stat-icon">✅</span>
                        <div class="stat-content">
                            <span class="stat-value">{{ resumenMetricas.totalTareas }} / {{ tareasAsignadas.length
                                }}</span>
                            <span class="stat-label">Tareas Hechas</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-content">
                            <span class="stat-value">{{ resumenMetricas.ejerciciosTotales }}</span>
                            <span class="stat-label">Ejercicios Resueltos</span>
                        </div>
                    </div>

                    <div class="stat-card highlight">
                        <div class="stat-content">
                            <span class="stat-value">{{ resumenMetricas.mediaGlobalMin }} min</span>
                            <span class="stat-label">Media Global / Ejercicio</span>
                        </div>
                    </div>
                </div>

                <div class="subject-breakdown-card">
                    <h4>Ritmo Medio por Asignatura</h4>
                    <div class="breakdown-list">
                        <div v-for="(info, nombreAsig) in asignaturasInfo" :key="nombreAsig" class="breakdown-row">
                            <div class="asig-info">
                                <span>{{ info.icon }}</span>
                                <span>{{ nombreAsig }}</span>
                            </div>
                            <div class="asig-metric">
                                <template v-if="obtenerDatosAsignatura(nombreAsig).hechas > 0">
                                    <span class="badge-count">{{ obtenerDatosAsignatura(nombreAsig).hechas }}
                                        hechas</span>
                                    <span class="badge-avg">{{ obtenerDatosAsignatura(nombreAsig).mediaMin }} min /
                                        ejercicio</span>
                                </template>
                                <span v-else class="text-muted">Sin mediciones aún</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <div v-if="mostrarModal && ultimaTareaGuardada" class="modal-backdrop">
            <div class="completion-dialog">
                <div class="dialog-badge">TAREA MARCADA COMO HECHA</div>
                <h2 class="dialog-title">{{ ultimaTareaGuardada.titulo }}</h2>
                <p class="dialog-subtitle">
                    Tramo registrado: <strong>{{ ultimaTareaGuardada.tramoHorario }}</strong>
                </p>

                <div class="results-grid">
                    <div class="result-tile">
                        <span class="tile-label">TIEMPO TOTAL (FIN - INICIO)</span>
                        <span class="tile-val highlight-time">{{ ultimaTareaGuardada.tiempoTotalFormateado }}</span>
                    </div>

                    <div class="result-tile">
                        <span class="tile-label">EJERCICIOS</span>
                        <span class="tile-val">{{ ultimaTareaGuardada.ejercicios }} completados</span>
                    </div>

                    <div class="result-tile full-width">
                        <span class="tile-label">MEDIA POR EJERCICIO CALCULADA</span>
                        <span class="tile-val">
                            {{ ultimaTareaGuardada.mediaMin }} min
                            <small>({{ ultimaTareaGuardada.mediaSeg }} s/ejercicio)</small>
                        </span>
                    </div>
                </div>

                <div v-if="ultimaTareaGuardada.notas" class="dialog-notes">
                    <strong>Observaciones:</strong> {{ ultimaTareaGuardada.notas }}
                </div>

                <div class="dialog-actions">
                    <button class="btn-primary" @click="cerrarModal">
                        <span>Siguiente Tarea Pendiente →</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.calendar-task-window {
    background: var(--surface, #ffffff);
    border-radius: var(--radius-xl, 20px);
    box-shadow: var(--shadow-modal, 0 10px 30px rgba(0, 0, 0, 0.08));
    border: 1px solid var(--border-color, #e2e8f0);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
}

.window-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background: var(--surface-subtle, #f8fafc);
    border-bottom: 1px solid var(--border-color, #e2e8f0);
    gap: 16px;
    flex-wrap: wrap;
}

.header-left,
.header-actions,
.badges-group {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.calendar-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    background: var(--primary-light, #eef2ff);
    color: var(--primary, #4f46e5);
    border: 1px solid var(--primary-border, #c7d2fe);
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
}

.live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #94a3b8;
}

.live-dot.active {
    background: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.scheduled-time-badge {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary, #475569);
}

.view-tabs {
    display: flex;
    background: var(--surface, #ffffff);
    padding: 4px;
    border-radius: 999px;
    border: 1px solid var(--border-color, #e2e8f0);
}

.tab-btn {
    border: none;
    background: transparent;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary, #475569);
    border-radius: 999px;
    cursor: pointer;
}

.tab-btn.active {
    background: var(--primary, #4f46e5);
    color: #ffffff;
}

.window-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.task-selector-bar {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.selector-label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-muted, #64748b);
}

.modern-select {
    width: 100%;
    padding: 10px 14px;
    background: var(--surface, #ffffff);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary, #0f172a);
    cursor: pointer;
}

.task-info-card {
    background: var(--surface-subtle, #f8fafc);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 16px;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.subject-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
}

.subject-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
}

.task-state-pill {
    font-size: 12px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 999px;
}

.task-state-pill.done {
    background: #dcfce7;
    color: #16a34a;
}

.task-state-pill.pending {
    background: #fef3c7;
    color: #d97706;
}

.status-indicator-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    background: #ffffff;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid #e2e8f0;
}

.status-indicator-badge .pulse-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #94a3b8;
}

.status-indicator-badge.running {
    color: #10b981;
    border-color: #a7f3d0;
}

.status-indicator-badge.running .pulse-indicator {
    background: #10b981;
}

.readonly-task-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary, #0f172a);
    margin: 4px 0;
}

.task-description-hint {
    font-size: 14px;
    color: var(--text-secondary, #475569);
}

.readonly-meta-strip {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    padding-top: 10px;
    border-top: 1px solid var(--border-color, #e2e8f0);
}

.meta-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--text-secondary, #475569);
    background: var(--surface, #ffffff);
    padding: 6px 12px;
    border-radius: 10px;
    border: 1px solid var(--border-color, #e2e8f0);
}

.estimation-hint-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #eef2ff;
    border: 1px dashed #c7d2fe;
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 13px;
    color: #475569;
}

.timer-card {
    background: var(--surface, #ffffff);
    border: 2px solid var(--border-color, #e2e8f0);
    border-radius: 16px;
    padding: 28px 24px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.timer-card.timer-running {
    border-color: #10b981;
    box-shadow: 0 0 25px rgba(16, 185, 129, 0.15);
}

.timer-top-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.timer-sublabel {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1px;
    color: #64748b;
}

.live-pace-badge {
    background: #dcfce7;
    color: #16a34a;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
}

/* Diseño visual de Hora Inicio - Hora Fin */
.time-range-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
}

.time-box {
    background: var(--surface-subtle, #f8fafc);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 14px;
    padding: 16px 28px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 180px;
}

.time-box-label {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.8px;
    color: #64748b;
}

.time-box-value {
    font-family: monospace;
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary, #0f172a);
}

.time-arrow {
    font-size: 24px;
    font-weight: 700;
    color: #94a3b8;
}

.exercise-progress-box {
    background: var(--surface-subtle, #f8fafc);
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.progress-info-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #475569;
}

.progress-track {
    height: 8px;
    background: #e2e8f0;
    border-radius: 999px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4f46e5 0%, #10b981 100%);
    transition: width 0.3s ease;
}

.exercise-step-controls {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.step-btn {
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    border: 1px solid transparent;
    cursor: pointer;
}

.step-btn.primary {
    background: #10b981;
    color: #ffffff;
}

.step-btn.secondary {
    background: #ffffff;
    border-color: #e2e8f0;
    color: #475569;
}

.step-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.timer-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
}

.control-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 999px;
    font-size: 15px;
    font-weight: 700;
    border: none;
    cursor: pointer;
}

.btn-start {
    background: #10b981;
    color: #ffffff;
}

.btn-finish {
    background: #0f172a;
    color: #ffffff;
}

.btn-reset {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
    padding: 14px 20px;
}

.task-notes-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.notes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
}

.notes-label {
    font-size: 13px;
    font-weight: 700;
    color: #475569;
}

.difficulty-picker {
    display: flex;
    align-items: center;
    gap: 6px;
}

.difficulty-caption {
    font-size: 12px;
    color: #64748b;
}

.diff-pill {
    border: 1px solid #e2e8f0;
    background: #ffffff;
    color: #475569;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}

.diff-pill.active {
    background: #eef2ff;
    color: #4f46e5;
    border-color: #4f46e5;
}

.notes-textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 14px;
    color: #0f172a;
}

.history-view-card,
.metrics-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.history-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

.view-heading {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
}

.view-subheading {
    font-size: 13px;
    color: #475569;
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
    background: #f8fafc;
    border-radius: 16px;
    border: 1px dashed #e2e8f0;
    color: #0f172a;
}

.empty-icon {
    font-size: 36px;
    display: block;
    margin-bottom: 8px;
}

.btn-primary-sm {
    margin-top: 12px;
    padding: 8px 18px;
    background: #4f46e5;
    color: #fff;
    border: none;
    border-radius: 999px;
    font-weight: 600;
    cursor: pointer;
}

.table-container {
    overflow-x: auto;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
}

.modern-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 13px;
    color: #0f172a;
}

.modern-table th {
    background: #f8fafc;
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
}

.modern-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
}

.table-task-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.mini-subject-pill {
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 999px;
    width: fit-content;
}

.media-highlight {
    display: flex;
    flex-direction: column;
}

.media-sec {
    font-size: 11px;
    color: #64748b;
}

.notes-preview-cell {
    display: flex;
    align-items: center;
    gap: 6px;
    max-width: 200px;
}

.notes-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
}

.diff-tag {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: capitalize;
}

.diff-tag.facil {
    background: #dcfce7;
    color: #16a34a;
}

.diff-tag.normal {
    background: #eef2ff;
    color: #4f46e5;
}

.diff-tag.dificil {
    background: #fef3c7;
    color: #d97706;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
}

.stat-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    color: #0f172a;
}

.stat-card.highlight {
    background: #eef2ff;
    border-color: #c7d2fe;
}

.stat-content {
    display: flex;
    flex-direction: column;
}

.stat-value {
    font-size: 22px;
    font-weight: 800;
}

.stat-label {
    font-size: 12px;
    color: #475569;
}

.subject-breakdown-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    color: #0f172a;
}

.breakdown-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 12px;
}

.breakdown-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
}

.asig-info,
.asig-metric {
    display: flex;
    align-items: center;
    gap: 8px;
}

.badge-count {
    font-size: 12px;
    background: #f1f5f9;
    padding: 2px 8px;
    border-radius: 999px;
}

.badge-avg {
    font-size: 13px;
    font-weight: 700;
    color: #4f46e5;
}

.text-muted {
    color: #64748b;
    font-size: 13px;
}

.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 9999;
}

.completion-dialog {
    background: #ffffff;
    color: #0f172a;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    max-width: 540px;
    width: 100%;
    padding: 32px 28px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.dialog-badge {
    align-self: center;
    padding: 6px 16px;
    background: #dcfce7;
    color: #16a34a;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
}

.results-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.result-tile {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
}

.result-tile.full-width {
    grid-column: span 2;
    background: #eef2ff;
}

.tile-label {
    font-size: 11px;
    font-weight: 800;
    color: #64748b;
}

.tile-val {
    font-size: 18px;
    font-weight: 700;
}

.tile-val.highlight-time {
    font-family: monospace;
    font-size: 24px;
    color: #10b981;
}

.dialog-actions {
    display: flex;
    gap: 12px;
}

.dialog-actions button {
    flex: 1;
    padding: 12px 18px;
    border-radius: 999px;
    font-weight: 700;
    cursor: pointer;
    border: none;
}

.btn-primary {
    background: #4f46e5;
    color: #fff;
}
</style>