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

### Batch download
Scenario similar to the previous one but with PNG format and limit of 10 simultaneous downloads.
```ts
const downloader = getDownloader();
const urls = [
  'https://path-to-image-1.jpeg',
  'https://path-to-image-2.png',
  'https://path-to-image-3.webp'
];
const format = ImageFormat.Png;
const settings: ImageSettings[] = urls.map((url, index) => ({
    imageUrl: url,
    toFormat: format,
    quality: 75,
    outputPath: `./output/image-${index}.${format}`,
    size: 100
}));
downloader.batchDownload(settings, 10).subscrible();
```

## When to use?
- For web scraping of image-rich sites
- To download hundreds or thousands of remote images without the server identifying the numerous requests as an attack
- To process many images asynchronously and consuming minimal resources

## Why this package?
- Use of streams
- Use of observables to emit the progress of batch downloads
- Asynchronous code usage
- Simple and easy to use API
