# image-batch-download
[![npm version](https://badge.fury.io/js/image-batch-downloader.svg)](https://badge.fury.io/js/image-batch-downloader)

A simple package for basic image downloading and processing.

Supported formats:
- JPEG
- PNG
- WebP

## Installation

With Yarn:
```bash
yarn add image-batch-downloader
```

Or with NPM:
```bash
npm install image-batch-downloader
```

## How to use

### Single download
The code below will download the 150 pixel image, convert it to WebP at 75% of the original quality, and resize it to 100 size.
```ts
const downloader = getDownloader();
const imageSettings: ImageSettings = {
    imageUrl: 'https://via.placeholder.com/150',
    toFormat: ImageFormat.Webp,
    quality: 75,
    outputPath: './output/my-output-image.webp',
    size: 100
};
await downloader.download(imageSettings);
```

## When to use?
- For web scraping of image-rich sites
- To download hundreds or thousands of remote images without the server identifying the numerous requests as an attack
- To process many images asynchronously and consuming minimal resources

## Why this package?
- Use of streams
- Asynchronous code usage
- Simple and easy to use API
