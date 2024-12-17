// #########################################################################
const requiredModules = ['sharp'];
const missingModules = requiredModules.filter(module => {
  try {
    require.resolve(module);
    return false;
  } catch (error) {
    return true;
  }
});

if (missingModules.length > 0) {
  const { execSync } = require('child_process');
  console.log(`Installing missing modules: ${missingModules.join(', ')}`);
  try {
    execSync(`npm install ${missingModules.join(' ')}`);
    console.log('Modules installed successfully.');
  } catch (error) {
    console.error('Error installing modules:', error.message);
    process.exit(1);
  }
}
// #########################################################################

const fs = require('fs');
const path = require('path');
const {processImage} = require('./utils/processImage');

// Specify the input and output directories
const inputDirectory = process.argv[2];
const outputDirectory = process.argv[3];
const targetSize = (process.argv[5] || 120) * 1024; // Default target size is 120 KB

if (!inputDirectory || !outputDirectory) {
  console.error('Usage: node script.js <inputDirectory> <outputDirectory> [targetSizeInKB]');
  process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

// Get a list of all files in the input directory
const files = fs.readdirSync(inputDirectory);
const imageFiles = files.filter(file =>
  ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
);

// Convert each image to WebP format with compression
(async () => {
  console.log('Conversion process started. Please wait...');
  for (let index = 0; index < imageFiles.length; index++) {
    const file = imageFiles[index];
    const inputFilePath = path.join(inputDirectory, file);
    const outputFilePath = path.join(outputDirectory, file);
    const tempFilePath = path.join(outputDirectory, `temp_${index}_${file}`);

    try {
      await processImage({ inputFilePath, outputFilePath, file, tempFilePath, targetSize });
    } catch (error) {
      console.error(`Failed to process ${file}:`, error.message);
    }
  }
  console.log('Image compression completed.');
})();
