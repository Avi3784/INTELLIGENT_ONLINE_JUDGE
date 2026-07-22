import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw, Activity, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../Visualizer.css';

const ALGORITHMS = [
  { id: 'bubble', name: 'Bubble Sort', time: 'O(n²)' },
  { id: 'selection', name: 'Selection Sort', time: 'O(n²)' },
  { id: 'insertion', name: 'Insertion Sort', time: 'O(n²)' },
  { id: 'shell', name: 'Shell Sort', time: 'O(n log n)' },
  { id: 'cocktail', name: 'Cocktail Shaker', time: 'O(n²)' },
  { id: 'gnome', name: 'Gnome Sort', time: 'O(n²)' },
  { id: 'comb', name: 'Comb Sort', time: 'O(n²)' },
  { id: 'merge', name: 'Merge Sort', time: 'O(n log n)' },
  { id: 'quick', name: 'Quick Sort', time: 'O(n log n)' },
  { id: 'heap', name: 'Heap Sort', time: 'O(n log n)' },
  { id: 'cycle', name: 'Cycle Sort', time: 'O(n²)' },
  { id: 'pancake', name: 'Pancake Sort', time: 'O(n²)' },
  { id: 'radix', name: 'Radix Sort', time: 'O(nk)' },
  { id: 'counting', name: 'Counting Sort', time: 'O(n+k)' },
  { id: 'oddeven', name: 'Odd-Even Sort', time: 'O(n²)' }
];

// Helper function to create a random array of numbers for the visualizer
const generateArray = (size) => Array.from({ length: size }, (_, i) => ({
  id: `pt-${i}-${Math.random().toString(36).substr(2, 9)}`,
  value: Math.floor(Math.random() * 90) + 10,
  idx: i
}));

const AlgorithmVisualizer = () => {
  // Application settings and data
  const [arraySize, setArraySize] = useState(50);
  const [array, setArray] = useState([]);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState(50);
  
  // Track which elements are being compared so we can highlight them
  const [activeIndices, setActiveIndices] = useState([]);
  
  // Used to stop the animation midway if the user clicks stop
  const abortControllerRef = useRef(null);
  
  // Use a ref for speed so the sorting loop can read the latest value without closure traps
  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Generate a new array whenever the array size changes
  useEffect(() => {
    resetArray();
    return () => stopSorting();
  }, [arraySize]);

  const resetArray = () => {
    stopSorting();
    setArray(generateArray(arraySize));
    setActiveIndices([]);
  };

  const stopSorting = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsSorting(false);
    setActiveIndices([]);
  };

  // Helper function to pause execution for animations
  const sleep = (ms) => {
    return new Promise((resolve, reject) => {
      if (abortControllerRef.current?.signal.aborted) {
        return reject(new Error('Aborted'));
      }
      
      let timeout;
      const abortHandler = () => {
        clearTimeout(timeout);
        reject(new Error('Aborted'));
      };
      
      if (abortControllerRef.current) {
        abortControllerRef.current.signal.addEventListener('abort', abortHandler);
      }
      
      timeout = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.signal.removeEventListener('abort', abortHandler);
        }
        resolve();
      }, ms);
    });
  };

  // Updates the screen with the new array state and highlights active items
  const updateState = async (newArr, active = []) => {
    setArray([...newArr]);
    setActiveIndices(active);
    await sleep(210 - speedRef.current); // Use ref to get live speed updates
  };

  // --- Sorting Algorithms ---

  // Swap two elements in the array
  const swap = (arr, i, j) => {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    arr[i].idx = i;
    arr[j].idx = j;
  };

  const bubbleSort = async (arr) => {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        await updateState(arr, [j, j + 1]);
        if (arr[j].value > arr[j + 1].value) {
          swap(arr, j, j + 1);
          await updateState(arr, [j, j + 1]);
        }
      }
    }
  };

  const selectionSort = async (arr) => {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        await updateState(arr, [minIdx, j]);
        if (arr[j].value < arr[minIdx].value) minIdx = j;
      }
      if (minIdx !== i) {
        swap(arr, i, minIdx);
        await updateState(arr, [i, minIdx]);
      }
    }
  };

  const insertionSort = async (arr) => {
    let n = arr.length;
    for (let i = 1; i < n; i++) {
      let j = i;
      while (j > 0 && arr[j - 1].value > arr[j].value) {
        await updateState(arr, [j, j - 1]);
        swap(arr, j, j - 1);
        await updateState(arr, [j, j - 1]);
        j--;
      }
    }
  };

  const shellSort = async (arr) => {
    let n = arr.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i++) {
        let temp = arr[i];
        let j;
        for (j = i; j >= gap && arr[j - gap].value > temp.value; j -= gap) {
          await updateState(arr, [j, j - gap]);
          arr[j] = arr[j - gap];
          arr[j].idx = j;
        }
        arr[j] = temp;
        arr[j].idx = j;
        await updateState(arr, [j]);
      }
    }
  };

  const cocktailSort = async (arr) => {
    let n = arr.length;
    let swapped = true;
    let start = 0;
    let end = n - 1;
    while (swapped) {
      swapped = false;
      for (let i = start; i < end; ++i) {
        await updateState(arr, [i, i + 1]);
        if (arr[i].value > arr[i + 1].value) {
          swap(arr, i, i + 1);
          swapped = true;
        }
      }
      if (!swapped) break;
      swapped = false;
      end = end - 1;
      for (let i = end - 1; i >= start; --i) {
        await updateState(arr, [i, i + 1]);
        if (arr[i].value > arr[i + 1].value) {
          swap(arr, i, i + 1);
          swapped = true;
        }
      }
      start = start + 1;
    }
  };

  const gnomeSort = async (arr) => {
    let index = 0;
    while (index < arr.length) {
      await updateState(arr, [index, index - 1]);
      if (index === 0 || arr[index].value >= arr[index - 1].value) {
        index++;
      } else {
        swap(arr, index, index - 1);
        index--;
      }
    }
  };

  const combSort = async (arr) => {
    let n = arr.length;
    let gap = n;
    let swapped = true;
    while (gap !== 1 || swapped) {
      gap = Math.floor((gap * 10) / 13);
      if (gap < 1) gap = 1;
      swapped = false;
      for (let i = 0; i < n - gap; i++) {
        await updateState(arr, [i, i + gap]);
        if (arr[i].value > arr[i + gap].value) {
          swap(arr, i, i + gap);
          swapped = true;
        }
      }
    }
  };

  const mergeSort = async (arr) => {
    const merge = async (left, mid, right) => {
      let n1 = mid - left + 1;
      let n2 = right - mid;
      let L = [], R = [];
      for (let i = 0; i < n1; i++) L.push(arr[left + i]);
      for (let j = 0; j < n2; j++) R.push(arr[mid + 1 + j]);
      let i = 0, j = 0, k = left;
      while (i < n1 && j < n2) {
        await updateState(arr, [left + i, mid + 1 + j, k]);
        if (L[i].value <= R[j].value) {
          arr[k] = L[i]; i++;
        } else {
          arr[k] = R[j]; j++;
        }
        arr[k].idx = k;
        k++;
      }
      while (i < n1) {
        await updateState(arr, [k]);
        arr[k] = L[i]; arr[k].idx = k; i++; k++;
      }
      while (j < n2) {
        await updateState(arr, [k]);
        arr[k] = R[j]; arr[k].idx = k; j++; k++;
      }
    };
    const sort = async (l, r) => {
      if (l >= r) return;
      let m = l + Math.floor((r - l) / 2);
      await sort(l, m);
      await sort(m + 1, r);
      await merge(l, m, r);
    };
    await sort(0, arr.length - 1);
  };

  const quickSort = async (arr) => {
    const partition = async (low, high) => {
      let pivot = arr[high].value;
      let i = low - 1;
      for (let j = low; j < high; j++) {
        await updateState(arr, [j, high, i + 1]);
        if (arr[j].value < pivot) {
          i++;
          swap(arr, i, j);
        }
      }
      swap(arr, i + 1, high);
      await updateState(arr, [i + 1, high]);
      return i + 1;
    };
    const sort = async (low, high) => {
      if (low < high) {
        let pi = await partition(low, high);
        await sort(low, pi - 1);
        await sort(pi + 1, high);
      }
    };
    await sort(0, arr.length - 1);
  };

  const heapSort = async (arr) => {
    let n = arr.length;
    const heapify = async (n, i) => {
      let largest = i;
      let l = 2 * i + 1;
      let r = 2 * i + 2;
      if (l < n && arr[l].value > arr[largest].value) largest = l;
      if (r < n && arr[r].value > arr[largest].value) largest = r;
      if (largest !== i) {
        await updateState(arr, [i, largest]);
        swap(arr, i, largest);
        await heapify(n, largest);
      }
    };
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(n, i);
    }
    for (let i = n - 1; i > 0; i--) {
      await updateState(arr, [0, i]);
      swap(arr, 0, i);
      await heapify(i, 0);
    }
  };

  const cycleSort = async (arr) => {
    let n = arr.length;
    for (let cycleStart = 0; cycleStart <= n - 2; cycleStart++) {
      let item = arr[cycleStart];
      let pos = cycleStart;
      for (let i = cycleStart + 1; i < n; i++) {
        await updateState(arr, [i, pos]);
        if (arr[i].value < item.value) pos++;
      }
      if (pos === cycleStart) continue;
      while (pos < n && item.value === arr[pos].value) pos += 1;
      if (pos < n && pos !== cycleStart) {
        let temp = item;
        item = arr[pos];
        arr[pos] = temp;
        arr[pos].idx = pos;
        await updateState(arr, [pos]);
      }
      while (pos !== cycleStart) {
        pos = cycleStart;
        for (let i = cycleStart + 1; i < n; i++) {
          await updateState(arr, [i, pos]);
          if (arr[i].value < item.value) pos += 1;
        }
        while (pos < n && item.value === arr[pos].value) pos += 1;
        if (pos < n && item.value !== arr[pos].value) {
          let temp = item;
          item = arr[pos];
          arr[pos] = temp;
          arr[pos].idx = pos;
          await updateState(arr, [pos]);
        }
      }
    }
  };

  const pancakeSort = async (arr) => {
    const flip = async (i) => {
      let temp, start = 0;
      while (start < i) {
        await updateState(arr, [start, i]);
        swap(arr, start, i);
        start++;
        i--;
      }
    };
    const findMax = (n) => {
      let mi = 0;
      for (let i = 0; i < n; ++i) if (arr[i].value > arr[mi].value) mi = i;
      return mi;
    };
    for (let currSize = arr.length; currSize > 1; --currSize) {
      let mi = findMax(currSize);
      if (mi !== currSize - 1) {
        await flip(mi);
        await flip(currSize - 1);
      }
    }
  };

  const radixSort = async (arr) => {
    const getMax = () => {
      let mx = arr[0].value;
      for (let i = 1; i < arr.length; i++) if (arr[i].value > mx) mx = arr[i].value;
      return mx;
    };
    const countSort = async (exp) => {
      let output = new Array(arr.length);
      let i, count = new Array(10).fill(0);
      for (i = 0; i < arr.length; i++) count[Math.floor(arr[i].value / exp) % 10]++;
      for (i = 1; i < 10; i++) count[i] += count[i - 1];
      for (i = arr.length - 1; i >= 0; i--) {
        await updateState(arr, [i]);
        output[count[Math.floor(arr[i].value / exp) % 10] - 1] = arr[i];
        count[Math.floor(arr[i].value / exp) % 10]--;
      }
      for (i = 0; i < arr.length; i++) {
        arr[i] = output[i];
        arr[i].idx = i;
        await updateState(arr, [i]);
      }
    };
    let m = getMax();
    for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10) {
      await countSort(exp);
    }
  };

  const countingSort = async (arr) => {
    let max = arr[0].value;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].value > max) max = arr[i].value;
    }
    let count = new Array(max + 1).fill(0);
    let output = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
      await updateState(arr, [i]);
      count[arr[i].value]++;
    }
    for (let i = 1; i <= max; i++) {
      count[i] += count[i - 1];
    }
    for (let i = arr.length - 1; i >= 0; i--) {
      output[count[arr[i].value] - 1] = arr[i];
      count[arr[i].value]--;
    }
    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
      arr[i].idx = i;
      await updateState(arr, [i]);
    }
  };

  const oddEvenSort = async (arr) => {
    let isSorted = false;
    let n = arr.length;
    while (!isSorted) {
      isSorted = true;
      for (let i = 1; i <= n - 2; i += 2) {
        await updateState(arr, [i, i + 1]);
        if (arr[i].value > arr[i + 1].value) {
          swap(arr, i, i + 1);
          isSorted = false;
        }
      }
      for (let i = 0; i <= n - 2; i += 2) {
        await updateState(arr, [i, i + 1]);
        if (arr[i].value > arr[i + 1].value) {
          swap(arr, i, i + 1);
          isSorted = false;
        }
      }
    }
  };

  // Function to run the selected algorithm
  const handleRun = async () => {
    if (isSorting) return;
    setIsSorting(true);
    abortControllerRef.current = new AbortController();
    const arrCopy = [...array];
    try {
      switch (algorithm) {
        case 'bubble': await bubbleSort(arrCopy); break;
        case 'selection': await selectionSort(arrCopy); break;
        case 'insertion': await insertionSort(arrCopy); break;
        case 'shell': await shellSort(arrCopy); break;
        case 'cocktail': await cocktailSort(arrCopy); break;
        case 'gnome': await gnomeSort(arrCopy); break;
        case 'comb': await combSort(arrCopy); break;
        case 'merge': await mergeSort(arrCopy); break;
        case 'quick': await quickSort(arrCopy); break;
        case 'heap': await heapSort(arrCopy); break;
        case 'cycle': await cycleSort(arrCopy); break;
        case 'pancake': await pancakeSort(arrCopy); break;
        case 'radix': await radixSort(arrCopy); break;
        case 'counting': await countingSort(arrCopy); break;
        case 'oddeven': await oddEvenSort(arrCopy); break;
      }
      
      // Completion sweep
      for (let i = 0; i < arrCopy.length; i++) {
        if (abortControllerRef.current?.signal.aborted) break;
        setActiveIndices([i]);
        await new Promise(r => setTimeout(r, 10)); // Quick sweep
      }
    } catch (err) {
      if (err.message !== 'Aborted') {
        console.error('Sorting error:', err);
      }
    } finally {
      setActiveIndices([]);
      setIsSorting(false);
    }
  };

  return (
    <div className="vis-container fadeIn">
      {/* Header */}
      <div className="vis-header">
        <h1 className="vis-title">
          <Activity style={{ color: 'var(--primary)' }} size={32} /> Algorithm Visualizer
        </h1>
        <p className="vis-subtitle">
          Watch exactly how different sorting algorithms structure data over time via Histogram visualization.
        </p>
      </div>

      {/* Control Panel */}
      <div className="vis-controls">
        <div className="vis-control-group">
          <div className="vis-control-item">
            <label className="vis-label">Algorithm</label>
            <select 
              disabled={isSorting}
              className="vis-select"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              {ALGORITHMS.map(a => <option key={a.id} value={a.id}>{a.name} ({a.time})</option>)}
            </select>
          </div>

          <div className="vis-control-item">
            <label className="vis-label">Array Size ({arraySize})</label>
            <input 
              type="range" 
              min="10" max="150" 
              disabled={isSorting}
              value={arraySize} 
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              className="vis-range"
            />
          </div>

          <div className="vis-control-item">
            <label className="vis-label">Speed</label>
            <input 
              type="range" 
              min="10" max="200" 
              value={speed} 
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="vis-range"
            />
          </div>
        </div>

        <div className="vis-actions">
          <button 
            onClick={isSorting ? stopSorting : resetArray} 
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isSorting ? <><Square size={16} /> Stop</> : <><RotateCcw size={16} /> Randomize</>}
          </button>
          <button 
            disabled={isSorting}
            onClick={handleRun} 
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 15px rgba(99,102,241,0.4)' }}
          >
            <Play size={16} fill="currentColor" /> Visualize
          </button>
        </div>
      </div>

      {/* Visualization Canvas (Histogram Graph) */}
      <div className="vis-canvas">
        <div className="vis-grid"></div>
        
        <div className="vis-stage" style={{ padding: 0 }}>
          {array.map((item, index) => {
            const isActive = activeIndices.includes(index);
            // Width and left position calculated based on array size
            const widthPercent = 100 / array.length;
            const leftPercent = index * widthPercent;
            
            return (
              <motion.div
                key={item.id}
                animate={{
                  left: `${leftPercent}%`,
                  height: `${item.value}%`
                }}
                transition={speed > 160 ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: `${widthPercent}%`,
                  padding: '0 1px', // Small gap between bars
                  zIndex: isActive ? 10 : 1
                }}
              >
                <div 
                  className={`vis-bar ${isActive ? 'active' : 'inactive'}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: isActive ? (isSorting ? '#ef4444' : '#10b981') : 'var(--primary-light)',
                    borderRadius: '4px 4px 0 0',
                    boxShadow: isActive ? (isSorting ? '0 0 12px rgba(239, 68, 68, 0.8)' : '0 0 12px rgba(16, 185, 129, 0.8)') : 'none',
                    transition: 'background-color 0.15s ease'
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;
