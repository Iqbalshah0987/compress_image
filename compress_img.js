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

// Process the file if it's an image
const processImage = async () => {
  if (await isImage(path.join(inputDirectory, file))) {
    const inputPath = path.join(inputDirectory, file);
    const outputFileName = path.parse(file).name + path.extname(file); // Preserve original file extension
    const outputPath = path.join(outputDirectory, outputFileName);

    try {
      const inputFileSize = fs.statSync(inputPath).size;

        let compressionQuality = 100;

        if (inputFileSize > 100 * 1024) {
          // Calculate the compression quality to achieve a file size close to 100KB
          compressionQuality = Math.max(Math.min(Math.floor((100 * 1024) / inputFileSize * 100), 100), 1);
        }

      // Detect image format and apply compression accordingly
      const image = sharp(inputPath);
      const metadata = await image.metadata();
      const format = metadata.format;
      // await image.toFormat(format, { quality: compressionQuality }).toFile(outputPath);

      // Compress the image with calculated quality
      const compressedBuffer = await sharp(inputPath).toFormat(format, { quality: compressionQuality }).toBuffer();
      fs.unlinkSync(outputPath);
      fs.writeFileSync(outputPath, compressedBuffer);

      // fs.renameSync(outputPath, inputPath);
      
      console.log(`Image Compressed Successfully!`);

    } catch (error) {
    //   console.error(`Error processing ${file}: ${error.message}`);
      fs.copyFile(path.join(inputDirectory, file), path.join(outputDirectory, file), (err) => {
        if (err) {
          console.error(`Error copying file on file - ${file} : err`);
          return;
        }
        console.log('File copied successfully!');
      });
    }
  } else {
    // console.log("File is not an image, skipping compression and conversion.");
     fs.copyFile(path.join(inputDirectory, file), path.join(outputDirectory, file), (err) => {
        if (err) {
          console.error(`Error copying file on file - ${file} : err`);
          return;
        }
        console.log('File copied successfully!');
      });
  }
};

processImage();
