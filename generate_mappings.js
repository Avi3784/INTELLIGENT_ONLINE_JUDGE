const fs = require('fs');
const content = fs.readFileSync('frontend/src/pages/AlgorithmVisualizer.jsx', 'utf8');
const match = content.match(/const CODE_SNIPPETS = (\{[\s\S]+?\n\});\n/);
let snippets = {};
eval('snippets = ' + match[1]);

const getLine = (algo, lang, regex) => {
    if (!snippets[algo] || !snippets[algo][lang]) return 'null';
    const lines = snippets[algo][lang].split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (regex.test(lines[i])) return i + 1;
    }
    return 'null';
};

const getLineMap = (algo, regex) => {
    return `{ javascript: ${getLine(algo, 'javascript', regex)}, python: ${getLine(algo, 'python', regex)}, cpp: ${getLine(algo, 'cpp', regex)}, java: ${getLine(algo, 'java', regex)} }`;
};

console.log('bubble_compare:', getLineMap('bubble', /Compare/i));
console.log('bubble_swap:', getLineMap('bubble', /Swap if/i));

console.log('selection_find:', getLineMap('selection', /Find/i));
console.log('selection_swap:', getLineMap('selection', /Swap with/i));

console.log('insertion_move:', getLineMap('insertion', /Move/i));
console.log('insertion_swap:', getLineMap('insertion', /swap\(|arr\[j \+ 1\] = arr\[j\]/i));

console.log('shell_compare:', getLineMap('shell', /Compare and shift/i));
console.log('shell_shift:', getLineMap('shell', /arr\[j\] = arr\[j-gap\]/i));
console.log('shell_place:', getLineMap('shell', /arr\[j\] = temp/i));

console.log('cocktail_forward_compare:', getLineMap('cocktail', /Forward pass/i));
console.log('cocktail_backward_compare:', getLineMap('cocktail', /Backward pass/i));

console.log('gnome_compare:', getLineMap('gnome', /Compare current/i));
console.log('gnome_swap:', getLineMap('gnome', /swap|arr\[index\], arr\[index-1\]/i));

console.log('comb_compare:', getLineMap('comb', /Compare elements with gap/i));
console.log('comb_swap:', getLineMap('comb', /swap|arr\[i\], arr\[i\+gap\]/i));

console.log('heap_heapify:', getLineMap('heap', /if \(largest !== i|if largest != i/i));
console.log('heap_build:', getLineMap('heap', /Build max heap/i));
console.log('heap_extract:', getLineMap('heap', /Extract elements/i));

console.log('cycle_compare:', getLineMap('cycle', /Find position/i));
console.log('cycle_place:', getLineMap('cycle', /Place item/i));

console.log('pancake_compare:', getLineMap('pancake', /Find max element/i));
console.log('pancake_flip:', getLineMap('pancake', /flip\(arr, max/i));

console.log('radix_sort:', getLineMap('radix', /Sort by each digit/i));
console.log('radix_update:', getLineMap('radix', /countingSortByDigit/i));

console.log('counting_count:', getLineMap('counting', /Count occurrences/i));
console.log('counting_rebuild:', getLineMap('counting', /Rebuild sorted array/i));

console.log('oddeven_odd:', getLineMap('oddeven', /Odd indexed/i));
console.log('oddeven_even:', getLineMap('oddeven', /Even indexed/i));

console.log('merge_compare:', getLineMap('merge', /Compare elements from L and R/i));
console.log('quick_compare:', getLineMap('quick', /Compare with pivot/i));
console.log('quick_swap:', getLineMap('quick', /i\+\+;/i));
console.log('quick_place:', getLineMap('quick', /arr\[i\+1\], arr\[high\]|swap\(arr, i \+ 1, high\)|swap\(arr\[i \+ 1\], arr\[high\]\)|int temp = arr\[i\+1\]/i));

