const xlsx = require('xlsx');

const workbook = xlsx.readFile('scripts/data/AI_Tools_in_Toolstaq_Enriched.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

console.log("HEADERS:", Object.keys(data[0]));
console.log("\nSAMPLE ROW:");
console.log(JSON.stringify(data[0], null, 2));
