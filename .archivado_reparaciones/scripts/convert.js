const fs = require('fs');
const content = fs.readFileSync('tsc_errors_current.txt', 'utf16le');
fs.writeFileSync('tsc_errors_utf8.txt', content, 'utf8');
console.log('Converted tsc_errors_current.txt to tsc_errors_utf8.txt');
