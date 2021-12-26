import { DownloaderService } from '../core';
import { DownloaderAxiosService, ImageProcessorSharp } from './adapters';

export { ImageProcessorSharp, DownloaderAxiosService } from './adapters';

export function getDownloader(): DownloaderService {
    const imageProcessor = new ImageProcessorSharp();
    return new DownloaderAxiosService(imageProcessor);
}
