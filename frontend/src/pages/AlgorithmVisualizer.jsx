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

const CODE_LANGS = ['javascript', 'python', 'cpp', 'java', 'c'];
const LANG_LABELS = { javascript: 'JavaScript', python: 'Python', cpp: 'C++', java: 'Java', c: 'C' };

const CODE_SNIPPETS = {
  bubble: {
    javascript: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap if out of order
        swap(arr, j, j + 1);
      }
    }
  }
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            # Compare adjacent elements
            if arr[j] > arr[j + 1]:
                # Swap if out of order
                arr[j], arr[j+1] = arr[j+1], arr[j]`,
    cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap if out of order
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
    java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap if out of order
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}`
  },
  selection: {
    javascript: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      // Find the minimum element
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    // Swap with the first element
    if (minIdx !== i) swap(arr, i, minIdx);
  }
}`,
    python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            # Find the minimum element
            if arr[j] < arr[min_idx]:
                min_idx = j
        # Swap with the first element
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            // Find the minimum element
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        // Swap with the first element
        if (minIdx != i) swap(arr[i], arr[minIdx]);
    }
}`,
    java: `void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            // Find the minimum element
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        // Swap with the first element
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}`
  },
  insertion: {
    javascript: `function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let j = i;
    // Move elements greater than key
    while (j > 0 && arr[j - 1] > arr[j]) {
      swap(arr, j, j - 1);
      j--;
    }
  }
}`,
    python: `def insertion_sort(arr):
    n = len(arr)
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        # Move elements greater than key
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
    cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        // Move elements greater than key
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    java: `void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        // Move elements greater than key
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
  },
  merge: {
    javascript: `function merge(arr, left, mid, right) {
  let L = arr.slice(left, mid + 1);
  let R = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;
  // Compare elements from L and R
  while (i < L.length && j < R.length) {
    if (L[i] <= R[j]) arr[k++] = L[i++];
    else arr[k++] = R[j++];
  }
  while (i < L.length) arr[k++] = L[i++];
  while (j < R.length) arr[k++] = R[j++];
}`,
    python: `def merge(arr, left, mid, right):
    L = arr[left:mid+1]
    R = arr[mid+1:right+1]
    i = j = 0; k = left
    # Compare elements from L and R
    while i < len(L) and j < len(R):
        if L[i] <= R[j]:
            arr[k] = L[i]; i += 1
        else:
            arr[k] = R[j]; j += 1
        k += 1`,
    cpp: `void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l+i];
    for (int j = 0; j < n2; j++) R[j] = arr[m+1+j];
    int i = 0, j = 0, k = l;
    // Compare elements from L and R
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
}`,
    java: `void merge(int[] arr, int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int[] L = new int[n1], R = new int[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l+i];
    for (int j = 0; j < n2; j++) R[j] = arr[m+1+j];
    int i = 0, j = 0, k = l;
    // Compare elements from L and R
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
}`
  },
  quick: {
    javascript: `function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    // Compare with pivot
    if (arr[j] < pivot) {
      i++;
      swap(arr, i, j);
    }
  }
  swap(arr, i + 1, high);
  return i + 1;
}`,
    python: `def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        # Compare with pivot
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1`,
    cpp: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        // Compare with pivot
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}`,
    java: `int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        // Compare with pivot
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i+1];
    arr[i+1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`
  },
  shell: {
    javascript: `function shellSort(arr) {
  let n = arr.length;
  for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
    for (let i = gap; i < n; i++) {
      let temp = arr[i], j = i;
      // Compare and shift elements
      while (j >= gap && arr[j-gap] > temp) {
        arr[j] = arr[j-gap]; j -= gap;
      }
      arr[j] = temp;
    }
  }
}`,
    python: `def shell_sort(arr):
    n = len(arr)
    gap = n // 2
    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]; j = i
            # Compare and shift elements
            while j >= gap and arr[j-gap] > temp:
                arr[j] = arr[j-gap]; j -= gap
            arr[j] = temp
        gap //= 2`,
    cpp: `void shellSort(int arr[], int n) {
    for (int gap = n/2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i], j = i;
            // Compare and shift elements
            while (j >= gap && arr[j-gap] > temp) {
                arr[j] = arr[j-gap]; j -= gap;
            }
            arr[j] = temp;
        }
    }
}`,
    java: `void shellSort(int[] arr) {
    int n = arr.length;
    for (int gap = n/2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i], j = i;
            // Compare and shift elements
            while (j >= gap && arr[j-gap] > temp) {
                arr[j] = arr[j-gap]; j -= gap;
            }
            arr[j] = temp;
        }
    }
}`
  },
  cocktail: {
    javascript: `function cocktailSort(arr) {
  let swapped = true, start = 0, end = arr.length-1;
  while (swapped) {
    swapped = false;
    // Forward pass
    for (let i = start; i < end; i++)
      if (arr[i] > arr[i+1]) { swap(arr,i,i+1); swapped=true; }
    // Backward pass
    for (let i = end-1; i >= start; i--)
      if (arr[i] > arr[i+1]) { swap(arr,i,i+1); swapped=true; }
    start++;
  }
}`,
    python: `def cocktail_sort(arr):
    swapped = True; start = 0; end = len(arr)-1
    while swapped:
        swapped = False
        # Forward pass
        for i in range(start, end):
            if arr[i] > arr[i+1]:
                arr[i], arr[i+1] = arr[i+1], arr[i]
                swapped = True
        # Backward pass
        for i in range(end-1, start-1, -1):
            if arr[i] > arr[i+1]:
                arr[i], arr[i+1] = arr[i+1], arr[i]
                swapped = True
        start += 1`,
    cpp: `void cocktailSort(int arr[], int n) {
    bool swapped = true; int start = 0, end = n-1;
    while (swapped) {
        swapped = false;
        for (int i = start; i < end; i++)
            if (arr[i] > arr[i+1]) { swap(arr[i],arr[i+1]); swapped=true; }
        for (int i = end-1; i >= start; i--)
            if (arr[i] > arr[i+1]) { swap(arr[i],arr[i+1]); swapped=true; }
        start++;
    }
}`,
    java: `void cocktailSort(int[] arr) {
    boolean swapped = true; int start = 0, end = arr.length-1;
    while (swapped) {
        swapped = false;
        for (int i = start; i < end; i++)
            if (arr[i] > arr[i+1]) { int t=arr[i]; arr[i]=arr[i+1]; arr[i+1]=t; swapped=true; }
        for (int i = end-1; i >= start; i--)
            if (arr[i] > arr[i+1]) { int t=arr[i]; arr[i]=arr[i+1]; arr[i+1]=t; swapped=true; }
        start++;
    }
}`
  },
  gnome: {
    javascript: `function gnomeSort(arr) {
  let index = 0;
  while (index < arr.length) {
    if (index === 0) index++;
    // Compare current with previous
    if (arr[index] >= arr[index-1]) index++;
    else { swap(arr, index, index-1); index--; }
  }
}`,
    python: `def gnome_sort(arr):
    index = 0
    while index < len(arr):
        if index == 0: index += 1
        # Compare current with previous
        if arr[index] >= arr[index-1]: index += 1
        else:
            arr[index], arr[index-1] = arr[index-1], arr[index]
            index -= 1`,
    cpp: `void gnomeSort(int arr[], int n) {
    int index = 0;
    while (index < n) {
        if (index == 0) index++;
        if (arr[index] >= arr[index-1]) index++;
        else { swap(arr[index], arr[index-1]); index--; }
    }
}`,
    java: `void gnomeSort(int[] arr) {
    int index = 0;
    while (index < arr.length) {
        if (index == 0) index++;
        if (arr[index] >= arr[index-1]) index++;
        else { int t=arr[index]; arr[index]=arr[index-1]; arr[index-1]=t; index--; }
    }
}`
  },
  comb: {
    javascript: `function combSort(arr) {
  let gap = arr.length, swapped = true;
  while (gap !== 1 || swapped) {
    gap = Math.floor(gap * 10 / 13);
    if (gap < 1) gap = 1;
    swapped = false;
    // Compare elements with gap
    for (let i = 0; i < arr.length - gap; i++)
      if (arr[i] > arr[i+gap]) { swap(arr,i,i+gap); swapped=true; }
  }
}`,
    python: `def comb_sort(arr):
    gap = len(arr); swapped = True
    while gap != 1 or swapped:
        gap = int(gap * 10 / 13)
        if gap < 1: gap = 1
        swapped = False
        # Compare elements with gap
        for i in range(len(arr) - gap):
            if arr[i] > arr[i+gap]:
                arr[i], arr[i+gap] = arr[i+gap], arr[i]
                swapped = True`,
    cpp: `void combSort(int arr[], int n) {
    int gap = n; bool swapped = true;
    while (gap != 1 || swapped) {
        gap = (gap * 10) / 13;
        if (gap < 1) gap = 1;
        swapped = false;
        for (int i = 0; i < n - gap; i++)
            if (arr[i] > arr[i+gap]) { swap(arr[i],arr[i+gap]); swapped=true; }
    }
}`,
    java: `void combSort(int[] arr) {
    int gap = arr.length; boolean swapped = true;
    while (gap != 1 || swapped) {
        gap = (gap * 10) / 13;
        if (gap < 1) gap = 1;
        swapped = false;
        for (int i = 0; i < arr.length - gap; i++)
            if (arr[i] > arr[i+gap]) { int t=arr[i]; arr[i]=arr[i+gap]; arr[i+gap]=t; swapped=true; }
    }
}`
  },
  heap: {
    javascript: `function heapSort(arr) {
  let n = arr.length;
  // Build max heap
  for (let i = Math.floor(n/2)-1; i >= 0; i--)
    heapify(arr, n, i);
  // Extract elements
  for (let i = n-1; i > 0; i--) {
    swap(arr, 0, i);
    heapify(arr, i, 0);
  }
}`,
    python: `def heap_sort(arr):
    n = len(arr)
    # Build max heap
    for i in range(n//2 - 1, -1, -1):
        heapify(arr, n, i)
    # Extract elements
    for i in range(n-1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)`,
    cpp: `void heapSort(int arr[], int n) {
    // Build max heap
    for (int i = n/2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    // Extract elements
    for (int i = n-1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
    java: `void heapSort(int[] arr) {
    int n = arr.length;
    // Build max heap
    for (int i = n/2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    // Extract elements
    for (int i = n-1; i > 0; i--) {
        int t = arr[0]; arr[0] = arr[i]; arr[i] = t;
        heapify(arr, i, 0);
    }
}`
  },
  cycle: {
    javascript: `function cycleSort(arr) {
  for (let start = 0; start < arr.length-1; start++) {
    let item = arr[start], pos = start;
    // Find position
    for (let i = start+1; i < arr.length; i++)
      if (arr[i] < item) pos++;
    if (pos === start) continue;
    // Place item at correct position
    [arr[pos], item] = [item, arr[pos]];
  }
}`,
    python: `def cycle_sort(arr):
    for start in range(len(arr) - 1):
        item = arr[start]; pos = start
        # Find position
        for i in range(start+1, len(arr)):
            if arr[i] < item: pos += 1
        if pos == start: continue
        # Place item at correct position
        arr[pos], item = item, arr[pos]`,
    cpp: `void cycleSort(int arr[], int n) {
    for (int start = 0; start < n-1; start++) {
        int item = arr[start], pos = start;
        for (int i = start+1; i < n; i++)
            if (arr[i] < item) pos++;
        if (pos == start) continue;
        swap(arr[pos], item);
    }
}`,
    java: `void cycleSort(int[] arr) {
    int n = arr.length;
    for (int start = 0; start < n-1; start++) {
        int item = arr[start], pos = start;
        for (int i = start+1; i < n; i++)
            if (arr[i] < item) pos++;
        if (pos == start) continue;
        int t = arr[pos]; arr[pos] = item; item = t;
    }
}`
  },
  pancake: {
    javascript: `function pancakeSort(arr) {
  for (let size = arr.length; size > 1; size--) {
    // Find max element index
    let maxIdx = 0;
    for (let i = 1; i < size; i++)
      if (arr[i] > arr[maxIdx]) maxIdx = i;
    if (maxIdx !== size - 1) {
      flip(arr, maxIdx);
      flip(arr, size - 1);
    }
  }
}`,
    python: `def pancake_sort(arr):
    for size in range(len(arr), 1, -1):
        # Find max element index
        max_idx = arr.index(max(arr[:size]))
        if max_idx != size - 1:
            flip(arr, max_idx)
            flip(arr, size - 1)`,
    cpp: `void pancakeSort(int arr[], int n) {
    for (int size = n; size > 1; size--) {
        int maxIdx = max_element(arr, arr+size) - arr;
        if (maxIdx != size - 1) {
            flip(arr, maxIdx);
            flip(arr, size - 1);
        }
    }
}`,
    java: `void pancakeSort(int[] arr) {
    for (int size = arr.length; size > 1; size--) {
        int maxIdx = 0;
        for (int i = 1; i < size; i++)
            if (arr[i] > arr[maxIdx]) maxIdx = i;
        if (maxIdx != size - 1) {
            flip(arr, maxIdx);
            flip(arr, size - 1);
        }
    }
}`
  },
  radix: {
    javascript: `function radixSort(arr) {
  let max = Math.max(...arr);
  // Sort by each digit position
  for (let exp = 1; Math.floor(max/exp) > 0; exp *= 10)
    countingSortByDigit(arr, exp);
}`,
    python: `def radix_sort(arr):
    max_val = max(arr)
    exp = 1
    # Sort by each digit position
    while max_val // exp > 0:
        counting_sort_by_digit(arr, exp)
        exp *= 10`,
    cpp: `void radixSort(int arr[], int n) {
    int mx = *max_element(arr, arr + n);
    // Sort by each digit position
    for (int exp = 1; mx/exp > 0; exp *= 10)
        countSortByDigit(arr, n, exp);
}`,
    java: `void radixSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    // Sort by each digit position
    for (int exp = 1; max/exp > 0; exp *= 10)
        countSortByDigit(arr, exp);
}`
  },
  counting: {
    javascript: `function countingSort(arr) {
  let max = Math.max(...arr);
  let count = new Array(max + 1).fill(0);
  // Count occurrences
  for (let x of arr) count[x]++;
  // Rebuild sorted array
  let idx = 0;
  for (let i = 0; i <= max; i++)
    while (count[i]-- > 0) arr[idx++] = i;
}`,
    python: `def counting_sort(arr):
    max_val = max(arr)
    count = [0] * (max_val + 1)
    # Count occurrences
    for x in arr: count[x] += 1
    # Rebuild sorted array
    idx = 0
    for i in range(max_val + 1):
        while count[i] > 0:
            arr[idx] = i; idx += 1; count[i] -= 1`,
    cpp: `void countingSort(int arr[], int n) {
    int mx = *max_element(arr, arr + n);
    int count[mx + 1] = {0};
    // Count occurrences
    for (int i = 0; i < n; i++) count[arr[i]]++;
    // Rebuild sorted array
    int idx = 0;
    for (int i = 0; i <= mx; i++)
        while (count[i]-- > 0) arr[idx++] = i;
}`,
    java: `void countingSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    int[] count = new int[max + 1];
    // Count occurrences
    for (int x : arr) count[x]++;
    // Rebuild sorted array
    int idx = 0;
    for (int i = 0; i <= max; i++)
        while (count[i]-- > 0) arr[idx++] = i;
}`
  },
  oddeven: {
    javascript: `function oddEvenSort(arr) {
  let sorted = false;
  while (!sorted) {
    sorted = true;
    // Odd indexed pairs
    for (let i = 1; i < arr.length-1; i += 2)
      if (arr[i] > arr[i+1]) { swap(arr,i,i+1); sorted=false; }
    // Even indexed pairs
    for (let i = 0; i < arr.length-1; i += 2)
      if (arr[i] > arr[i+1]) { swap(arr,i,i+1); sorted=false; }
  }
}`,
    python: `def odd_even_sort(arr):
    sorted_flag = False
    while not sorted_flag:
        sorted_flag = True
        # Odd indexed pairs
        for i in range(1, len(arr)-1, 2):
            if arr[i] > arr[i+1]:
                arr[i], arr[i+1] = arr[i+1], arr[i]
                sorted_flag = False
        # Even indexed pairs
        for i in range(0, len(arr)-1, 2):
            if arr[i] > arr[i+1]:
                arr[i], arr[i+1] = arr[i+1], arr[i]
                sorted_flag = False`,
    cpp: `void oddEvenSort(int arr[], int n) {
    bool sorted = false;
    while (!sorted) {
        sorted = true;
        for (int i = 1; i < n-1; i += 2)
            if (arr[i] > arr[i+1]) { swap(arr[i],arr[i+1]); sorted=false; }
        for (int i = 0; i < n-1; i += 2)
            if (arr[i] > arr[i+1]) { swap(arr[i],arr[i+1]); sorted=false; }
    }
}`,
    java: `void oddEvenSort(int[] arr) {
    boolean sorted = false;
    while (!sorted) {
        sorted = true;
        for (int i = 1; i < arr.length-1; i += 2)
            if (arr[i] > arr[i+1]) { int t=arr[i]; arr[i]=arr[i+1]; arr[i+1]=t; sorted=false; }
        for (int i = 0; i < arr.length-1; i += 2)
            if (arr[i] > arr[i+1]) { int t=arr[i]; arr[i]=arr[i+1]; arr[i+1]=t; sorted=false; }
    }
}`
  }
};

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
  const [codeLang, setCodeLang] = useState('javascript');
  
  // Track which elements are being compared so we can highlight them
  const [activeIndices, setActiveIndices] = useState([]);
  const [activeLine, setActiveLine] = useState(null);
  
  // Used to stop the animation midway if the user clicks stop
  const abortControllerRef = useRef(null);
  
  // Use a ref for speed so the sorting loop can read the latest value without closure traps
  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Generate a new array whenever the array size changes
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsSorting(false);
    setArray(generateArray(arraySize));
    setActiveIndices([]);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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
  const updateState = async (newArr, active = [], line = null) => {
    setArray([...newArr]);
    setActiveIndices(active);
    setActiveLine(line);
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
        await updateState(arr, [j, j + 1], 5); // Line 5: Compare
        if (arr[j].value > arr[j + 1].value) {
          swap(arr, j, j + 1);
          await updateState(arr, [j, j + 1], 7); // Line 7: Swap
        }
      }
    }
  };

  const selectionSort = async (arr) => {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        await updateState(arr, [minIdx, j], 6); // Line 6: Find min
        if (arr[j].value < arr[minIdx].value) minIdx = j;
      }
      if (minIdx !== i) {
        swap(arr, i, minIdx);
        await updateState(arr, [i, minIdx], 9); // Line 9: Swap
      }
    }
  };

  const insertionSort = async (arr) => {
    let n = arr.length;
    for (let i = 1; i < n; i++) {
      let j = i;
      while (j > 0 && arr[j - 1].value > arr[j].value) {
        await updateState(arr, [j, j - 1], 5); // Line 5: Move elements
        swap(arr, j, j - 1);
        await updateState(arr, [j, j - 1], 6); // Line 6: Swap
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
        await updateState(arr, [left + i, mid + 1 + j, k], 4); // Line 4: Compare
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
        await updateState(arr, [j, high, i + 1], 5); // Line 5: Compare
        if (arr[j].value < pivot) {
          i++;
          swap(arr, i, j);
        }
      }
      swap(arr, i + 1, high);
      await updateState(arr, [i + 1, high], 9); // Line 9: Swap
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
      setActiveLine(null);
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
            style={{ display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 15px rgba(0, 184, 163,0.4)' }}
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
      
      {/* Code Viewer Panel */}
      <div className="vis-code-panel" style={{
        marginTop: '24px',
        padding: '20px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Settings2 size={20} /> Live Execution
          </h3>
          <select
            value={codeLang}
            onChange={(e) => setCodeLang(e.target.value)}
            className="vis-select"
            style={{ width: 'auto', minWidth: '140px' }}
          >
            {CODE_LANGS.map(l => <option key={l} value={l}>{LANG_LABELS[l]}</option>)}
          </select>
        </div>
        <pre style={{
          backgroundColor: '#0B0E14',
          padding: '16px',
          borderRadius: '8px',
          overflowX: 'auto',
          fontSize: '14px',
          lineHeight: '1.6',
          fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--text-primary)'
        }}>
          {(CODE_SNIPPETS[algorithm]?.[codeLang] || CODE_SNIPPETS[algorithm]?.javascript || '// Code snippet is not available yet.').split('\n').map((lineText, idx) => {
            const lineNum = idx + 1;
            const isHighlighted = activeLine === lineNum;
            return (
              <div 
                key={idx}
                style={{
                  backgroundColor: isHighlighted ? 'rgba(0, 229, 255, 0.2)' : 'transparent',
                  borderLeft: isHighlighted ? '3px solid var(--primary)' : '3px solid transparent',
                  paddingLeft: '12px',
                  marginLeft: '-16px',
                  transition: 'background-color 0.1s ease',
                  display: 'flex',
                  gap: '16px'
                }}
              >
                <span style={{ color: 'var(--text-muted)', userSelect: 'none', minWidth: '24px' }}>{lineNum}</span>
                <span style={{ color: isHighlighted ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{lineText}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;
