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
const file = process.argv[4];

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

// Check if the file is an image
const isImage = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    return metadata.format !== undefined;
  } catch (error) {
    return false;
  }
};
console.log(path.join(inputDirectory, file));
// Process the file if it's an image
const processImage = async () => {
  if (await isImage(path.join(inputDirectory, file))) {
    const inputPath = path.join(inputDirectory, file);
    const outputFileName = path.parse(file).name + '.webp';
    const outputPath = path.join(outputDirectory, outputFileName);

    try {
      const inputFileSize = fs.statSync(inputPath).size;
      let compressionQuality = 95;  // Start with high quality
      const targetSize = 120 * 1024;  // Target 100 KB file size

      // Adjust quality in small steps until the file size is close to target
      let outputFileSize;
      do {
        await sharp(inputPath)
          .webp({ quality: compressionQuality })
          .toFile(outputPath);

        outputFileSize = fs.statSync(outputPath).size;
        if (outputFileSize > targetSize) {
          compressionQuality = Math.max(compressionQuality - 2, 70);  // Don't go below 70 to preserve quality
        }
      } while (outputFileSize > targetSize && compressionQuality > 70);
      
        console.log(`Image Compressed`);

    } catch (error) {
      console.error(`Error processing ${file}: ${error.message}`);
      fs.copyFile(path.join(inputDirectory, file), path.join(outputDirectory, file), (err) => {
        if (err) {
          console.error(`Error copying file on file - ${file} : err`);
          return;
        }
        console.log('File copied. Image Compressed');
      });
    }
  } else {
    console.log("File is not an image, skipping compression and conversion.");
     fs.copyFile(path.join(inputDirectory, file), path.join(outputDirectory, file), (err) => {
        if (err) {
          console.error(`Error copying file on file - ${file} : err`);
          return;
        }
        console.log('File copied. Image Compressed');
      });
  }
};

processImage();
