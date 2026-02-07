// Utility function for deep copying
const deepCopy = (arr) => JSON.parse(JSON.stringify(arr))

// Input validation function
const validateProcesses = (proc) => {
  if (!proc || !Array.isArray(proc) || proc.length === 0) {
    throw new Error('Invalid processes array')
  }
  for (const p of proc) {
    if (!p.id || typeof p.id !== 'string') throw new Error('Process ID must be a non-empty string')
    if (typeof p.arrival !== 'number' || p.arrival < 0) throw new Error('Arrival time must be >= 0')
    if (typeof p.burst !== 'number' || p.burst <= 0) throw new Error('Burst time must be > 0')
  }
}

// First Come First Serve (FCFS)
const simulateFCFS = (proc) => {
  validateProcesses(proc)
  const p = deepCopy(proc).sort((a, b) => a.arrival - b.arrival)
  let time = 0
  let gantt = []
  let metrics = []
  
  p.forEach(pr => {
    if (time < pr.arrival) {
      gantt.push({ id: 'idle', start: time, end: pr.arrival })
      time = pr.arrival
    }
    const start = time
    const end = time + pr.burst
    gantt.push({ id: pr.id, start, end })
    metrics.push({
      id: pr.id,
      waiting: start - pr.arrival,
      turnaround: end - pr.arrival,
      response: start - pr.arrival
    })
    time = end
  })
  return { gantt, metrics }
}

// Shortest Job First (SJF)
const simulateSJF = (proc) => {
  validateProcesses(proc)
  const p = deepCopy(proc)
  let time = 0, completed = 0
  let gantt = [], metrics = []
  let done = Array(p.length).fill(false)
  let maxIterations = 1000000 // Safeguard against infinite loops
  let iterations = 0
  
  while (completed < p.length && iterations < maxIterations) {
    iterations++
    let idx = -1, minBurst = Infinity
    for (let i = 0; i < p.length; i++) {
      if (!done[i] && p[i].arrival <= time && p[i].burst < minBurst) {
        minBurst = p[i].burst
        idx = i
      }
    }
    if (idx === -1) {
      let nextArr = Math.min(...p.filter((_, i) => !done[i]).map(x => x.arrival))
      if (nextArr > time) {
        gantt.push({ id: 'idle', start: time, end: nextArr })
      }
      time = nextArr
      continue
    }
    const pr = p[idx]
    const start = time
    const end = time + pr.burst
    gantt.push({ id: pr.id, start, end })
    metrics.push({
      id: pr.id,
      waiting: start - pr.arrival,
      turnaround: end - pr.arrival,
      response: start - pr.arrival
    })
    time = end
    done[idx] = true
    completed++
  }
  return { gantt, metrics }
}

// Shortest Remaining Time (SRT)
const simulateSRT = (proc) => {
  validateProcesses(proc)
  const p = deepCopy(proc)
  let time = 0, completed = 0
  let gantt = [], metrics = []
  let rem = p.map(x => x.burst)
  let startTimes = Array(p.length).fill(-1)
  let finish = Array(p.length).fill(0)
  let lastId = null, blockStart = 0
  let maxIterations = 1000000
  let iterations = 0
  
  while (completed < p.length && iterations < maxIterations) {
    iterations++
    let idx = -1, minRem = Infinity
    for (let i = 0; i < p.length; i++) {
      if (p[i].arrival <= time && rem[i] > 0 && rem[i] < minRem) {
        minRem = rem[i]
        idx = i
      }
    }
    if (idx === -1) {
      // Jump to next arrival time instead of incrementing by 1
      let nextArr = Math.min(...p.filter((_, i) => rem[i] > 0).map(x => x.arrival))
      if (nextArr > time) {
        if (lastId !== null && lastId !== 'idle') {
          gantt.push({ id: lastId, start: blockStart, end: time })
        }
        gantt.push({ id: 'idle', start: time, end: nextArr })
        blockStart = nextArr
        lastId = 'idle'
        time = nextArr
      } else {
        time++
      }
      continue
    }
    if (lastId !== p[idx].id) {
      if (lastId !== null) gantt.push({ id: lastId, start: blockStart, end: time })
      blockStart = time
      lastId = p[idx].id
    }
    if (startTimes[idx] === -1) startTimes[idx] = time
    rem[idx]--
    time++
    if (rem[idx] === 0) {
      finish[idx] = time
      completed++
    }
  }
  if (lastId !== null) gantt.push({ id: lastId, start: blockStart, end: time })
  
  for (let i = 0; i < p.length; i++) {
    metrics.push({
      id: p[i].id,
      waiting: finish[i] - p[i].arrival - p[i].burst,
      turnaround: finish[i] - p[i].arrival,
      response: startTimes[i] - p[i].arrival
    })
  }
  return { gantt, metrics }
}

// Round Robin (RR)
const simulateRR = (proc, quantum = 2) => {
  validateProcesses(proc)
  if (quantum <= 0) throw new Error('Time quantum must be > 0')
  const p = deepCopy(proc)
  let time = 0, completed = 0
  let gantt = [], metrics = []
  let rem = p.map(x => x.burst)
  let startTimes = Array(p.length).fill(-1)
  let finish = Array(p.length).fill(0)
  let queue = []
  let lastId = null, blockStart = 0
  let arrived = Array(p.length).fill(false)
  let maxIterations = 1000000
  let iterations = 0
  
  while (completed < p.length && iterations < maxIterations) {
    iterations++
    for (let i = 0; i < p.length; i++) {
      if (!arrived[i] && p[i].arrival <= time) {
        queue.push(i)
        arrived[i] = true
      }
    }
    if (queue.length === 0) {
      // Jump to next arrival time instead of incrementing by 1
      let nextArr = Math.min(...p.filter((_, i) => !arrived[i]).map(x => x.arrival))
      if (nextArr > time) {
        if (lastId !== null && lastId !== 'idle') {
          gantt.push({ id: lastId, start: blockStart, end: time })
        }
        gantt.push({ id: 'idle', start: time, end: nextArr })
        blockStart = nextArr
        lastId = 'idle'
        time = nextArr
      } else {
        time++
      }
      continue
    }
    const idx = queue.shift()
    if (startTimes[idx] === -1) startTimes[idx] = time
    const run = Math.min(quantum, rem[idx])
    if (lastId !== p[idx].id) {
      if (lastId !== null) gantt.push({ id: lastId, start: blockStart, end: time })
      blockStart = time
      lastId = p[idx].id
    }
    rem[idx] -= run
    time += run
    for (let i = 0; i < p.length; i++) {
      if (!arrived[i] && p[i].arrival <= time) {
        queue.push(i)
        arrived[i] = true
      }
    }
    if (rem[idx] > 0) queue.push(idx)
    else {
      finish[idx] = time
      completed++
    }
  }
  if (lastId !== null) gantt.push({ id: lastId, start: blockStart, end: time })
  
  for (let i = 0; i < p.length; i++) {
    metrics.push({
      id: p[i].id,
      waiting: finish[i] - p[i].arrival - p[i].burst,
      turnaround: finish[i] - p[i].arrival,
      response: startTimes[i] - p[i].arrival
    })
  }
  return { gantt, metrics }
}

// Multilevel Feedback Queue (MLFQ)
// 3-level queue with different quantums, demotion, promotion, and aging
const simulateMLFQ = (proc, config = { quantums: [2, 4, 0], aging: 10 }) => {
  validateProcesses(proc)

  let quantums = [2, 4, 0]
  let agingThreshold = 10

  if (typeof config === 'number') {
    if (config <= 0) throw new Error('Time quantum must be positive')
    quantums = [config, config * 2, 0]
  } else if (Array.isArray(config)) {
    quantums = config.slice()
  } else if (config && typeof config === 'object') {
    if (Array.isArray(config.quantums)) quantums = config.quantums.slice()
    if (typeof config.aging === 'number') agingThreshold = config.aging
  } else {
    throw new Error('MLFQ config must be a number, array, or object')
  }

  if (quantums.length < 2) throw new Error('MLFQ requires at least two quantums')
  if (quantums.length === 2) quantums = [quantums[0], quantums[1], 0]

  if (quantums[0] <= 0 || quantums[1] <= 0 || quantums[2] < 0) {
    throw new Error('Time quantums must be positive (Q2 can be 0 for FCFS)')
  }
  if (!Number.isFinite(agingThreshold) || agingThreshold < 1) {
    throw new Error('Aging threshold must be >= 1')
  }

  const p = deepCopy(proc)
  const n = p.length
  let time = 0, completed = 0
  let gantt = [], metrics = []
  let rem = p.map(x => x.burst)
  let startTimes = Array(n).fill(-1)
  let finish = Array(n).fill(0)
  let arrived = Array(n).fill(false)
  let queues = [[], [], []]
  let level = Array(n).fill(0)
  let waitAge = Array(n).fill(0)
  let lastId = null, blockStart = 0
  let maxIterations = 1000000
  let iterations = 0

  const enqueue = (idx, lvl, resetWait = true) => {
    level[idx] = lvl
    queues[lvl].push(idx)
    if (resetWait) waitAge[idx] = 0
  }

  const applyAging = (delta) => {
    if (delta <= 0) return
    for (let lvl = 0; lvl < queues.length; lvl++) {
      for (const idx of queues[lvl]) {
        waitAge[idx] += delta
      }
    }
    for (let lvl = 2; lvl > 0; lvl--) {
      const keep = []
      for (const idx of queues[lvl]) {
        if (waitAge[idx] >= agingThreshold) {
          waitAge[idx] = 0
          enqueue(idx, lvl - 1, false)
        } else {
          keep.push(idx)
        }
      }
      queues[lvl] = keep
    }
  }

  while (completed < n && iterations < maxIterations) {
    iterations++

    for (let i = 0; i < n; i++) {
      if (!arrived[i] && p[i].arrival <= time) {
        enqueue(i, 0)
        arrived[i] = true
      }
    }

    let qIdx = queues.findIndex(q => q.length > 0)
    if (qIdx === -1) {
      let nextArr = Math.min(...p.filter((_, i) => !arrived[i]).map(x => x.arrival))
      if (nextArr > time) {
        if (lastId !== null && lastId !== 'idle') {
          gantt.push({ id: lastId, start: blockStart, end: time })
        }
        gantt.push({ id: 'idle', start: time, end: nextArr })
        blockStart = nextArr
        lastId = 'idle'
        time = nextArr
      }
      continue
    }

    const idx = queues[qIdx].shift()
    if (startTimes[idx] === -1) startTimes[idx] = time

    let run = rem[idx]
    if (qIdx === 0) run = Math.min(quantums[0], rem[idx])
    else if (qIdx === 1) run = Math.min(quantums[1], rem[idx])

    if (qIdx > 0) {
      const futureArrivals = p.filter((_, i) => !arrived[i]).map(x => x.arrival)
      if (futureArrivals.length > 0) {
        const nextArr = Math.min(...futureArrivals)
        if (nextArr > time && nextArr < time + run) {
          run = nextArr - time
        }
      }
    }

    if (lastId !== p[idx].id) {
      if (lastId !== null) gantt.push({ id: lastId, start: blockStart, end: time })
      blockStart = time
      lastId = p[idx].id
    }

    rem[idx] -= run
    time += run
    applyAging(run)

    for (let i = 0; i < n; i++) {
      if (!arrived[i] && p[i].arrival <= time) {
        enqueue(i, 0)
        arrived[i] = true
      }
    }

    if (rem[idx] > 0) {
      const usedFullQuantum = qIdx < 2 && run === quantums[qIdx]
      if (qIdx < 2 && usedFullQuantum) enqueue(idx, qIdx + 1)
      else enqueue(idx, qIdx)
    } else {
      finish[idx] = time
      completed++
    }
  }

  if (lastId !== null) gantt.push({ id: lastId, start: blockStart, end: time })

  for (let i = 0; i < n; i++) {
    metrics.push({
      id: p[i].id,
      waiting: finish[i] - p[i].arrival - p[i].burst,
      turnaround: finish[i] - p[i].arrival,
      response: startTimes[i] - p[i].arrival
    })
  }
  return { gantt, metrics }
}

export const schedulingAlgorithms = {
  FCFS: simulateFCFS,
  SJF: simulateSJF,
  SRT: simulateSRT,
  RR: simulateRR,
  MLFQ: simulateMLFQ
}