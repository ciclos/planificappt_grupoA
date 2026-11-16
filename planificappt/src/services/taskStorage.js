export function getTasks() {
    try {
        const savedTasks = localStorage.getItem('planificappt_tasks')
    
        if(!savedTasks){
            return []
        }
    
        const tasks = JSON.parse(savedTasks)
        return tasks
    } catch (error){
        console.log('Error al recuperar las tareas: ', error)
        return []
    }

}

export function saveTasks(tasks){
    try {
        localStorage.setItem('planificappt_tasks', JSON.stringify(tasks))
        return true
    } catch (error) {
        console.log('Error al guardar las tareas: ', error)
        return false
    }
}