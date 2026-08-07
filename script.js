
const snippets = require('./snippets.js');
for (const algo in snippets) {
    console.log('\n--- ' + algo + ' ---');
    for (const lang of ['javascript', 'python', 'cpp', 'java']) {
        if (!snippets[algo][lang]) continue;
        const lines = snippets[algo][lang].split('\n');
        console.log(lang + ': ' + lines.length + ' lines');
    }
}

