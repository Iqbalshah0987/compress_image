const requiredModules = ['fs', 'path', 'sharp'];

// Check if required modules are installed
const missingModules = requiredModules.filter(module => {
  try {
    require.resolve(module);
    return false;
  } catch (error) {
    return true;
  }
});

// Install missing modules using npm if any
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

// Continue with the rest of the script
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Specify the input and output directories
const inputDirectory = process.argv[2];
const outputDirectory = process.argv[3];

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

// Get a list of all files in the input directory
const files = fs.readdirSync(inputDirectory);

// Filter out only the image files (you might want to adjust this based on your specific use case)
const imageFiles = files.filter(file =>
  ['.webp'].includes(path.extname(file).toLowerCase())
);

// Convert each image to WebP format with compression
imageFiles.forEach(async file => {
    const inputPath = path.join(inputDirectory, file);
    const outputFileName = path.parse(file).name + '.webp';
    const outputPath = path.join(outputDirectory, outputFileName);
    const tempOutputPath = path.join(outputDirectory, `temp_${outputFileName}`);
  
    try {
        const inputFileSize = fs.statSync(inputPath).size;
        let compressionQuality = 100;
    
        if (inputFileSize > 100 * 1024) {
            // Calculate the compression quality to achieve a file size close to 100KB
            compressionQuality = Math.floor((100 * 1024) / inputFileSize * 100);
        }

        // Convert to WebP and save to a temporary output file
        await sharp(inputPath)
        .webp({ quality: compressionQuality })
        .toFile(tempOutputPath);

        // If the WebP file already exists, delete it
        if (fs.existsSync(outputPath)) {
            try {
                fs.unlinkSync(outputPath);
            } catch (error) {
                console.error(`Error deleting existing file ${outputPath}: ${error.message}`);
                // return false;
            }
        }
    
        // Rename the temporary file to the final output file
        try{
            fs.renameSync(tempOutputPath, outputPath);
        } catch (error){
            console.error(`Error rename temp file ${tempOutputPath}: ${error.message}`);
            // return false;
        }
  
        console.log(`Converted ${file} to ${outputFileName} with quality ${compressionQuality}`);
    } catch (error) {
        console.error(`Error converting ${file}: ${error.message}`);
    }
});

console.log('Conversion process started. Please wait...');