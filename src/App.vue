<template>
  <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
    <!-- Dark mode toggle -->
    <div class="fixed top-4 right-4 z-50">
      <button @click="toggleDarkMode" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full p-2 shadow transition-colors border border-gray-300 dark:border-gray-600">
        <i v-if="!isDark" class="fas fa-moon"></i>
        <i v-else class="fas fa-sun"></i>
      </button>
    </div>
    <div class="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-6xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
          <i class="fas fa-microchip text-white text-2xl"></i>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          CPU Scheduling Simulator
        </h1>
        <p class="text-gray-600 text-lg">Visualize and compare different CPU scheduling algorithms</p>
      </div>

      <!-- Process Input Section -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <i class="fas fa-tasks mr-3 text-blue-600"></i>Process Management
          </h2>
          <div class="flex gap-2">
            <button 
              @click="loadSampleData" 
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
              <i class="fas fa-flask mr-2"></i>Sample Data
            </button>
            <button 
              @click="clearAllProcesses" 
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
              <i class="fas fa-trash mr-2"></i>Clear All
            </button>
          </div>
        </div>
        
        <!-- Process Table -->
        <div class="overflow-x-auto mb-4">
          <table class="w-full text-sm sm:text-base min-w-[480px]">
            <thead>
              <tr class="bg-gradient-to-r from-blue-50 to-purple-50">
                <th class="p-3 text-left font-semibold text-gray-700">Process ID</th>
                <th class="p-3 text-left font-semibold text-gray-700">Arrival Time</th>
                <th class="p-3 text-left font-semibold text-gray-700">Burst Time</th>
                <th class="p-3 text-left font-semibold text-gray-700">Priority</th>
                <th class="p-3 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr 
                v-for="(process, index) in processes" 
                :key="process.id"
                class="hover:bg-gray-50 transition-colors">
                <td class="p-3 font-medium text-gray-900">
                  <template v-if="editIndex === index">
                    <input v-model="editProcess.id" type="text" class="w-16 border rounded p-1" />
                  </template>
                  <template v-else>
                    {{ process.id }}
                  </template>
                </td>
                <td class="p-3 text-gray-600">
                  <template v-if="editIndex === index">
                    <input v-model.number="editProcess.arrival" type="number" min="0" class="w-16 border rounded p-1" />
                  </template>
                  <template v-else>
                    {{ process.arrival }}
                  </template>
                </td>
                <td class="p-3 text-gray-600">
                  <template v-if="editIndex === index">
                    <input v-model.number="editProcess.burst" type="number" min="1" class="w-16 border rounded p-1" />
                  </template>
                  <template v-else>
                    {{ process.burst }}
                  </template>
                </td>
                <td class="p-3 text-gray-600">
                  <template v-if="editIndex === index">
                    <input v-model.number="editProcess.priority" type="number" min="1" class="w-16 border rounded p-1" />
                  </template>
                  <template v-else>
                    {{ process.priority ?? '--' }}
                  </template>
                </td>
                <td class="p-3 text-center">
                  <template v-if="editIndex === index">
                    <button @click="saveEdit(index)" class="text-green-600 hover:text-green-800 font-medium mr-2"><i class="fas fa-check"></i> Save</button>
                    <button @click="cancelEdit" class="text-gray-500 hover:text-gray-700 font-medium"><i class="fas fa-times"></i> Cancel</button>
                  </template>
                  <template v-else>
                    <button @click="startEdit(index)" class="text-blue-500 hover:text-blue-700 font-medium mr-2"><i class="fas fa-edit"></i> Edit</button>
                    <button @click="removeProcess(index)" class="text-red-500 hover:text-red-700 font-medium"><i class="fas fa-trash"></i> Delete</button>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="processes.length === 0" class="text-center py-8 text-gray-500">
            <i class="fas fa-inbox text-4xl mb-2"></i>
            <p>No processes added yet. Add your first process below!</p>
          </div>
        </div>
        
        <!-- Add Process Form -->
        <div class="bg-gray-50 rounded-lg p-2 sm:p-4">
          <h3 class="font-semibold text-gray-700 mb-3">Add New Process</h3>
          <form @submit.prevent="addProcess" class="grid grid-cols-1 md:grid-cols-5 gap-2 sm:gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Process ID</label>
              <input 
                v-model="newProcess.id" 
                type="text" 
                placeholder="e.g., P1" 
                required
                :class="['w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent', 
                         errors.id ? 'border-red-500' : 'border-gray-300']">
              <span v-if="errors.id" class="text-red-500 text-xs">{{ errors.id }}</span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Arrival Time</label>
              <input 
                v-model.number="newProcess.arrival" 
                type="number" 
                min="0" 
                step="1"
                placeholder="0" 
                required
                :class="['w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                         errors.arrival ? 'border-red-500' : 'border-gray-300']">
              <span v-if="errors.arrival" class="text-red-500 text-xs">{{ errors.arrival }}</span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Burst Time</label>
              <input 
                v-model.number="newProcess.burst" 
                type="number"
                min="1"
                step="1"
                placeholder="1" 
                required
                :class="['w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                         errors.burst ? 'border-red-500' : 'border-gray-300']">
              <span v-if="errors.burst" class="text-red-500 text-xs">{{ errors.burst }}</span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Priority (Optional)</label>
              <input 
                v-model.number="newProcess.priority" 
                type="number" 
                min="1" 
                step="1"
                placeholder="1" 
                class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div class="flex items-end">
              <button 
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center">
                <i class="fas fa-plus mr-2"></i>Add Process
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Error Display -->
      <transition name="slide-up">
        <div v-if="simulationError" class="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 mb-6 flex items-start gap-4">
          <i class="fas fa-exclamation-circle text-red-600 text-2xl mt-1 flex-shrink-0"></i>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-red-800 mb-1">Simulation Error</h3>
            <p class="text-red-700">{{ simulationError }}</p>
          </div>
          <button @click="simulationError = ''" class="text-red-400 hover:text-red-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
      </transition>

      <!-- Algorithm Configuration -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-cogs mr-3 text-purple-600"></i>Algorithm Configuration
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">Scheduling Algorithm</label>
            <select 
              v-model="selectedAlgorithm" 
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="FCFS">First Come First Serve (FCFS)</option>
              <option value="SJF">Shortest Job First (SJF)</option>
              <option value="SRT">Shortest Remaining Time (SRT)</option>
              <option value="RR">Round Robin (RR)</option>
              <option value="MLFQ">Multilevel Feedback Queue (MLFQ)</option>
            </select>
          </div>
          <div v-show="selectedAlgorithm === 'RR'">
            <label class="block text-sm font-medium text-gray-600 mb-2">Time Quantum (RR)</label>
            <input 
              v-model.number="quantum" 
              type="number" 
              min="1" 
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
          </div>
          <button 
            @click="runSimulation" 
            :disabled="processes.length === 0 || isRunning"
            :class="[
              'px-8 py-3 rounded-lg font-semibold transition-all transform flex items-center justify-center',
              processes.length === 0 || isRunning 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-105'
            ]">
            <i :class="['mr-2', isRunning ? 'fas fa-spinner fa-spin' : 'fas fa-play']"></i>
            {{ isRunning ? 'Running...' : 'Run Simulation' }}
          </button>
        </div>
        <div v-if="selectedAlgorithm === 'MLFQ'" class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">Quantum Q0</label>
            <input 
              v-model.number="mlfqQuantum0" 
              type="number" 
              min="1" 
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">Quantum Q1</label>
            <input 
              v-model.number="mlfqQuantum1" 
              type="number" 
              min="1" 
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">Aging Threshold</label>
            <input 
              v-model.number="mlfqAging" 
              type="number" 
              min="1" 
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
          </div>
          <div class="sm:col-span-3 text-xs text-gray-500">
            Q2 is FCFS (no quantum). Processes are promoted if they wait longer than the aging threshold.
          </div>
        </div>
      </div>

      <!-- Gantt Chart -->
      <transition name="slide-up">
        <div v-if="showResults" class="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i class="fas fa-chart-bar mr-3 text-orange-600"></i>Gantt Chart Timeline
          </h2>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex gap-1 overflow-x-auto py-4 min-h-[60px]">
              <div 
                v-for="(block, index) in ganttData" 
                :key="`${block.id}-${index}`"
                :class="[
                  'relative flex-shrink-0 flex flex-col items-center justify-center px-3 py-2 rounded-lg text-sm font-bold text-white shadow-sm',
                  getBlockColor(block.id)
                ]"
                :style="{ width: getBlockWidth(block) + 'px' }">
                <div class="font-bold">{{ block.id }}</div>
                <div class="text-xs opacity-90">{{ block.end - block.start }} units</div>
                <div class="text-xs opacity-75">{{ block.start }}→{{ block.end }}</div>
              </div>
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-600">
            <i class="fas fa-info-circle mr-1"></i>
            Each block represents process execution time. Scroll horizontally to view the complete timeline.
          </div>
        </div>
      </transition>

      <!-- Results Section -->
      <transition name="slide-up">
        <div v-if="showResults" class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-800 flex items-center">
              <i class="fas fa-table mr-3 text-indigo-600"></i>Performance Metrics
            </h2>
            <button @click="exportCSV" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
              <i class="fas fa-file-csv mr-2"></i>Export CSV
            </button>
          </div>
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-2 sm:p-4 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-600 text-sm font-medium">Avg Waiting Time</p>
                  <p class="text-2xl font-bold text-blue-800">{{ averages.waiting }}</p>
                </div>
                <i class="fas fa-clock text-blue-500 text-2xl"></i>
              </div>
            </div>
            <div class="bg-gradient-to-r from-green-50 to-green-100 p-2 sm:p-4 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-600 text-sm font-medium">Avg Turnaround Time</p>
                  <p class="text-2xl font-bold text-green-800">{{ averages.turnaround }}</p>
                </div>
                <i class="fas fa-stopwatch text-green-500 text-2xl"></i>
              </div>
            </div>
            <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-2 sm:p-4 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-purple-600 text-sm font-medium">Avg Response Time</p>
                  <p class="text-2xl font-bold text-purple-800">{{ averages.response }}</p>
                </div>
                <i class="fas fa-tachometer-alt text-purple-500 text-2xl"></i>
              </div>
            </div>
          </div>
          <!-- Detailed Results Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-sm sm:text-base min-w-[480px]">
              <thead>
                <tr class="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th class="p-3 text-left font-semibold text-gray-700">Process ID</th>
                  <th class="p-3 text-center font-semibold text-gray-700">Waiting Time</th>
                  <th class="p-3 text-center font-semibold text-gray-700">Turnaround Time</th>
                  <th class="p-3 text-center font-semibold text-gray-700">Response Time</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr 
                  v-for="(metric, index) in metricsData" 
                  :key="metric.id"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                  <td class="p-3 font-medium text-gray-900">{{ metric.id }}</td>
                  <td class="p-3 text-center text-gray-600">{{ metric.waiting }}</td>
                  <td class="p-3 text-center text-gray-600">{{ metric.turnaround }}</td>
                  <td class="p-3 text-center text-gray-600">{{ metric.response }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { schedulingAlgorithms } from './utils/schedulingAlgorithms.js'

export default {
  name: 'App',
  setup() {
    // Dark mode state
    const isDark = ref(false)

    // On mount, check prefers-color-scheme or localStorage
    onMounted(() => {
      if (localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark.value = true
        document.documentElement.classList.add('dark')
      }
    })

    const toggleDarkMode = () => {
      isDark.value = !isDark.value
      if (isDark.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
    // Reactive state
    const processes = ref([])
    const ganttData = ref([])
    const metricsData = ref([])
    const showResults = ref(false)
    const isRunning = ref(false)
    const selectedAlgorithm = ref('FCFS')
    const quantum = ref(2)
    const mlfqQuantum0 = ref(2)
    const mlfqQuantum1 = ref(4)
    const mlfqAging = ref(10)
    const simulationError = ref('')
    
    const newProcess = reactive({
      id: '',
      arrival: 0,
      burst: 1,
      priority: null
    })
    
    const errors = reactive({
      id: '',
      arrival: '',
      burst: ''
    })

    // Computed properties
    const averages = computed(() => {
      if (metricsData.value.length === 0) return { waiting: '--', turnaround: '--', response: '--' }
      
      const totals = metricsData.value.reduce((acc, metric) => ({
        waiting: acc.waiting + metric.waiting,
        turnaround: acc.turnaround + metric.turnaround,
        response: acc.response + metric.response
      }), { waiting: 0, turnaround: 0, response: 0 })
      
      const n = metricsData.value.length
      return {
        waiting: (totals.waiting / n).toFixed(2),
        turnaround: (totals.turnaround / n).toFixed(2),
        response: (totals.response / n).toFixed(2)
      }
    })

    // Inline editing state
    const editIndex = ref(null)
    const editProcess = reactive({ id: '', arrival: 0, burst: 1, priority: null })

    // Methods
    const clearErrors = () => {
      errors.id = ''
      errors.arrival = ''
      errors.burst = ''
    }

    const startEdit = (index) => {
      editIndex.value = index
      Object.assign(editProcess, processes.value[index])
    }

    const cancelEdit = () => {
      editIndex.value = null
      Object.assign(editProcess, { id: '', arrival: 0, burst: 1, priority: null })
    }

    const saveEdit = (index) => {
      // Validate
      clearErrors()
      let isValid = true
      if (!editProcess.id.trim()) {
        errors.id = 'Process ID is required'
        isValid = false
      } else if (processes.value.some((p, i) => p.id === editProcess.id.trim() && i !== index)) {
        errors.id = 'Process ID already exists'
        isValid = false
      }
      if (editProcess.arrival < 0) {
        errors.arrival = 'Arrival time must be >= 0'
        isValid = false
      }
      if (editProcess.burst < 1) {
        errors.burst = 'Burst time must be > 0'
        isValid = false
      }
      if (!isValid) return
      processes.value[index] = {
        id: editProcess.id.trim(),
        arrival: editProcess.arrival,
        burst: editProcess.burst,
        priority: editProcess.priority || undefined
      }
      cancelEdit()
      showResults.value = false
    }

    const validateProcess = () => {
      clearErrors()
      let isValid = true
      
      if (!newProcess.id.trim()) {
        errors.id = 'Process ID is required'
        isValid = false
      } else if (processes.value.some(p => p.id === newProcess.id.trim())) {
        errors.id = 'Process ID already exists'
        isValid = false
      }
      
      if (isNaN(newProcess.arrival) || newProcess.arrival < 0) {
        errors.arrival = 'Arrival time must be a number >= 0'
        isValid = false
      }
      
      if (isNaN(newProcess.burst) || newProcess.burst < 1) {
        errors.burst = 'Burst time must be a number > 0'
        isValid = false
      }
      
      return isValid
    }

    const addProcess = () => {
      if (!validateProcess()) return
      
      processes.value.push({
        id: newProcess.id.trim(),
        arrival: newProcess.arrival,
        burst: newProcess.burst,
        priority: newProcess.priority || undefined
      })
      
      // Reset form
      newProcess.id = ''
      newProcess.arrival = 0
      newProcess.burst = 1
      newProcess.priority = null
      
      showResults.value = false
    }

    const removeProcess = (index) => {
      processes.value.splice(index, 1)
      showResults.value = false
    }

    const loadSampleData = () => {
      processes.value = [
        { id: 'P1', arrival: 0, burst: 4, priority: 2 },
        { id: 'P2', arrival: 1, burst: 3, priority: 1 },
        { id: 'P3', arrival: 2, burst: 8, priority: 3 },
        { id: 'P4', arrival: 3, burst: 2, priority: 1 },
        { id: 'P5', arrival: 4, burst: 6, priority: 2 }
      ]
      showResults.value = false
    }

    const clearAllProcesses = () => {
      if (processes.value.length === 0) return
      if (confirm('Are you sure you want to clear all processes?')) {
        processes.value = []
        showResults.value = false
      }
    }

    const runSimulation = async () => {
      if (processes.value.length === 0) return
      
      try {
        simulationError.value = ''
        isRunning.value = true
        
        // Simulate async processing
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const algorithm = schedulingAlgorithms[selectedAlgorithm.value]
        let result
        if (selectedAlgorithm.value === 'RR') {
          result = algorithm(processes.value, quantum.value)
        } else if (selectedAlgorithm.value === 'MLFQ') {
          result = algorithm(processes.value, {
            quantums: [mlfqQuantum0.value, mlfqQuantum1.value, 0],
            aging: mlfqAging.value
          })
        } else {
          result = algorithm(processes.value)
        }
        
        ganttData.value = result.gantt
        metricsData.value = result.metrics
        
        isRunning.value = false
        showResults.value = true
        
        // Scroll to results
        await nextTick()
        document.querySelector('.bg-white.rounded-xl.shadow-lg:nth-last-child(2)')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
      } catch (err) {
        simulationError.value = `Simulation Error: ${err.message}`
        isRunning.value = false
        showResults.value = false
      }
    }

    const getBlockColor = (id) => {
      const colors = [
        'bg-gradient-to-r from-blue-500 to-blue-600',
        'bg-gradient-to-r from-green-500 to-green-600',
        'bg-gradient-to-r from-purple-500 to-purple-600',
        'bg-gradient-to-r from-red-500 to-red-600',
        'bg-gradient-to-r from-yellow-500 to-yellow-600',
        'bg-gradient-to-r from-pink-500 to-pink-600',
        'bg-gradient-to-r from-indigo-500 to-indigo-600',
        'bg-gradient-to-r from-teal-500 to-teal-600'
      ]
      
      if (id === 'idle') return 'bg-gray-400'
      
      const colorIndex = id.charCodeAt(id.length - 1) % colors.length
      return colors[colorIndex]
    }

    const getBlockWidth = (block) => {
      const duration = block.end - block.start
      const minWidth = 60
      return Math.max(minWidth, duration * 20)
    }

    // Export results as CSV
    const exportCSV = () => {
      if (!metricsData.value.length) return
      const header = ['Process ID', 'Waiting Time', 'Turnaround Time', 'Response Time']
      const rows = metricsData.value.map(m => [m.id, m.waiting, m.turnaround, m.response])
      const csv = [header, ...rows].map(r => r.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'cpu_scheduling_results.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    return {
      processes,
      ganttData,
      metricsData,
      showResults,
      isRunning,
      selectedAlgorithm,
      quantum,
      mlfqQuantum0,
      mlfqQuantum1,
      mlfqAging,
      newProcess,
      errors,
      averages,
      addProcess,
      removeProcess,
      loadSampleData,
      clearAllProcesses,
      runSimulation,
      getBlockColor,
      getBlockWidth,
      isDark,
      toggleDarkMode,
      exportCSV,
      editIndex,
      editProcess,
      startEdit,
      cancelEdit,
      saveEdit,
      simulationError
    }
  }
}
</script>