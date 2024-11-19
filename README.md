# Compress Image

This repository provides JavaScript utilities for compressing images and converting them to WebP format. It includes multiple scripts to handle various compression scenarios, ensuring high performance and optimized image sizes for web applications.

## Features

- *Image Compression*: Reduce the size of images while maintaining quality.
- *WebP Conversion*: Convert images to WebP format for better performance.
- *Multiple Scripts*:
  - compress_image_to_webp.js
  - compress_img.js
  - compress_img_to_webp.js
  - compress_webp_to_webp_image.js

## Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/Iqbalshah0987/compress_image.git
   cd compress_image
   ```

2. Examples:
  
    1. Single image to webp compress:
       
        ```bash
        node ./compress_img_to_webp.js source destination filename
        ```
    3. multiple images to webp compress:
       
        ```bash
        node ./compress_image_to_webp.js source_dir destination_dir
        ```
    2. sigle images webp to webp compress:
       
        ```bash
        node ./compress_webp_to_webp_image.js source destination filename
        ```
Customize the scripts as needed.

## Requirements
- Node.js installed on your system
- Install sharp
  
    ```bash
    npm install sharp
    ```
- Basic knowledge of JavaScript and file paths.
  
## Contributions
Feel free to fork the repository, raise issues, or submit pull requests for improvements.

## License
This project is open-source and available under the MIT License.
