import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'xlsx';

// Define the paths
const toolsJsonPath = path.join(__dirname, '../public/data/tools.json');
const excelPath = path.join(__dirname, 'data/AI_Tools_in_Toolstaq_Enriched.xlsx');

// 1. Read existing tools.json
console.log('Reading tools.json...');
const toolsData = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));
const tools = toolsData.tools;

// 2. Read Excel file
console.log('Reading Excel file...');
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const enrichedRows = xlsx.utils.sheet_to_json(sheet) as any[];

console.log(`Found ${enrichedRows.length} rows in the Excel file.`);

// Function to normalize URLs for matching
function normalizeUrl(url: string | undefined): string {
  if (!url) return '';
  return url.replace(/\/$/, '').toLowerCase().trim();
}

// 3. Map rows by URL
const enrichedMap = new Map<string, any>();
for (const row of enrichedRows) {
  if (row.url) {
    enrichedMap.set(normalizeUrl(row.url), row);
  }
}

// 4. Update tools
let updateCount = 0;
for (const tool of tools) {
  const normalizedToolUrl = normalizeUrl(tool.url);
  const enrichedRow = enrichedMap.get(normalizedToolUrl);
  
  if (enrichedRow) {
    if (enrichedRow['Focus Area']) tool.focus_area = enrichedRow['Focus Area'];
    if (enrichedRow['Core Features & Capabilities']) tool.core_features_rich = enrichedRow['Core Features & Capabilities'];
    if (enrichedRow['Technical Architecture & Security']) tool.technical_architecture = enrichedRow['Technical Architecture & Security'];
    if (enrichedRow['Pricing Details']) tool.pricing_details = enrichedRow['Pricing Details'];
    
    updateCount++;
  }
}

console.log(`Updated ${updateCount} tools out of ${tools.length}.`);

// 5. Write back to tools.json
console.log('Writing back to tools.json...');
fs.writeFileSync(toolsJsonPath, JSON.stringify(toolsData, null, 2), 'utf8');
console.log('Done!');
