# CPU Scheduling Algorithm Simulator (Vue.js)

A modern web-based simulator for visualizing and comparing CPU scheduling algorithms. Built with Vue.js 3, Vite, and Tailwind CSS for a responsive and interactive experience.

## 🚀 Algorithm

  - First Come First Serve (FCFS)
  - Shortest Job First (SJF)
  - Shortest Remaining Time (SRT)
  - Round Robin (RR)
  - Multilevel Feedback Queue (MLFQ)
  
## 🚀 Features

- **Modern Vue.js Interface**: Reactive components with smooth animations
- **Process Management**: Add, edit, and delete processes with real-time validation and inline editing
- **5 Scheduling Algorithms**:
   - First Come First Serve (FCFS)
   - Shortest Job First (SJF)
   - Shortest Remaining Time (SRT)
   - Round Robin (RR)
   - Multilevel Feedback Queue (MLFQ)
- **Visual Gantt Chart**: Interactive timeline with color-coded process blocks
- **Performance Metrics**: Detailed analysis of waiting, turnaround, and response times
- **Export Results**: Download metrics as CSV
- **Dark Mode**: Toggle light/dark theme
- **Sample Data**: Quick-load test processes for demonstrations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 📦 Setup Instructions

### Installation
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **FontAwesome** - Professional icon library

## 📦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
### Build for Production
1. **Install dependencies:**
### Preview Production Build
   npm install
## 🎯 How to Run Each Scheduler

### 1) Add Processes
Use the **Process Management** section to add each process:
- **Process ID** (e.g., P1)
- **Arrival Time** (>= 0)
- **Burst Time** (> 0)
- **Priority** (optional)

### 2) Choose an Algorithm
Use the **Scheduling Algorithm** dropdown.

### 3) Configure Algorithm Settings

- **FCFS, SJF, SRT**: No additional settings.
- **RR (Round Robin)**: Set **Time Quantum (RR)**.
- **MLFQ**: Configure the following inputs:
   - **Quantum Q0**: Highest priority queue time slice
   - **Quantum Q1**: Middle priority queue time slice
   - **Aging Threshold**: Promote processes that wait too long (prevents starvation)
   - **Q2** is FCFS (no quantum)

### 4) Run and Review
Click **Run Simulation**. Review:
- **Gantt Chart** for execution order
- **Performance Metrics** table for per-process and average metrics

### 5) Export
Click **Export CSV** to download the metrics.

## 🧠 Algorithm Descriptions
   Navigate to `http://localhost:3000`
### First Come First Serve (FCFS)
### Build for Production

### Shortest Job First (SJF)
npm run build
```
### Shortest Remaining Time (SRT)
The built files will be in the `dist/` directory.

### Round Robin (RR)
# CPU Scheduling Algorithm Simulator (Vue.js)

A modern web-based simulator for visualizing and comparing CPU scheduling algorithms. Built with Vue.js 3, Vite, and Tailwind CSS.

## 🚀 Features

- Modern Vue.js Interface: Reactive components with smooth animations
- Process Management: Add, edit, and delete processes with real-time validation and inline editing
- 5 Scheduling Algorithms: FCFS, SJF, SRT, RR, MLFQ
- Visual Gantt Chart: Interactive timeline with color-coded process blocks
- Performance Metrics: Waiting, turnaround, and response times
- Export Results: Download metrics as CSV
- Dark Mode: Toggle light/dark theme
- Sample Data: Quick-load test processes for demonstrations
- Responsive Design: Works on desktop, tablet, and mobile

## 🛠️ Technology Stack

- Vue.js 3 - Progressive JavaScript framework with Composition API
- Vite - Fast build tool and development server
- Tailwind CSS - Utility-first CSS framework
- FontAwesome - Icon library

## 📦 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open your browser at:
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎯 How to Run Each Scheduler

### 1) Add Processes
Use the **Process Management** section to add each process:
- **Process ID** (e.g., P1)
- **Arrival Time** (>= 0)
- **Burst Time** (> 0)
- **Priority** (optional)

### 2) Choose an Algorithm
Use the **Scheduling Algorithm** dropdown.

### 3) Configure Algorithm Settings

- **FCFS, SJF, SRT**: No additional settings.
- **RR (Round Robin)**: Set **Time Quantum (RR)**.
- **MLFQ**: Configure the following inputs:
  - **Quantum Q0**: Highest priority queue time slice
  - **Quantum Q1**: Middle priority queue time slice
  - **Aging Threshold**: Promote processes that wait too long (prevents starvation)
  - **Q2** is FCFS (no quantum)

### 4) Run and Review
Click **Run Simulation**. Review:
- **Gantt Chart** for execution order
- **Performance Metrics** table for per-process and averages

### 5) Export
Click **Export CSV** to download the metrics.

## 🧠 Algorithm Descriptions

### First Come First Serve (FCFS)
Non-preemptive. Executes processes in arrival order. Simple but can cause long waits for short jobs.

### Shortest Job First (SJF)
Non-preemptive. Always selects the shortest burst among available jobs. Minimizes average waiting time but can starve long jobs.

### Shortest Remaining Time (SRT)
Preemptive version of SJF. If a shorter job arrives, it preempts the running process.

### Round Robin (RR)
Preemptive. Each process gets a fixed time quantum in a circular queue. Improves responsiveness; small quantum increases overhead.

### Multilevel Feedback Queue (MLFQ)
3-level queue with different time quanta, demotion/promotion, and aging:
- **Q0**: Highest priority, shortest quantum
- **Q1**: Medium priority, longer quantum
- **Q2**: Lowest priority, FCFS (no quantum)
Rules:
- New processes enter Q0
- If a process uses its full quantum, it is demoted
- If a process waits too long, aging promotes it to a higher queue

## 🔧 Project Structure

```
src/
├── App.vue                 # Main Vue component
├── main.js                 # Vue app entry point
├── input.css               # Tailwind CSS imports and custom styles
└── utils/
    └── schedulingAlgorithms.js  # Algorithm implementations
```

## 📈 Performance Metrics

The simulator calculates and displays:
- **Waiting Time**: Time spent waiting in the ready queue
- **Turnaround Time**: Total time from arrival to completion
- **Response Time**: Time from arrival to first execution
- **Average Values**: Summary statistics for comparison

## 🙏 Acknowledgments

- Vue.js team for the excellent framework
- Tailwind CSS for the utility-first approach
- FontAwesome for the professional icons