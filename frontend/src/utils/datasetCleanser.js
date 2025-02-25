import { readFile, writeFile } from 'fs';

// Load the JavaScript file
const filePath = 'turfDataset.js';

readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    return;
  }

  try {
    // Remove export statement
    data = data.replace(/export\s+const\s+\w+\s*=\s*/, '');

    // Remove JavaScript-style comments (both inline and multi-line)
    data = data.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

    // Remove trailing commas before closing brackets or braces
    data = data.replace(/,\s*([\]}])/g, '$1');

    // Convert JavaScript object syntax to valid JSON
    data = data.replace(/(\w+):/g, '"$1":');  // Convert keys without quotes
    data = data.replace(/'/g, '"');           // Convert single quotes to double quotes

    // Ensure JSON is valid
    const jsonData = JSON.parse(data);
    console.log('✅ JSON is valid!');

    // Save cleaned data
    writeFile('turfDataset_cleaned.json', JSON.stringify(jsonData, null, 4), (err) => {
      if (err) {
        console.error(`❌ Error writing file: ${err}`);
        return;
      }
      console.log('✅ Cleaned JSON saved as turfDataset_cleaned.json');
    });
  } catch (e) {
    console.error(`❌ Error in JSON format: ${e.message}`);
  }
});
