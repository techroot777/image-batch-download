import { ImageSettings } from './image-processor.service';

export interface DownloaderService {
    /***
     * Download and save multiple remote images simultaneously
     * @param settings Conversion settings and storage path
     * @param delay Interval (in milliseconds) between the request of one image and the next (so that the server does not identify it as an attack)[Default: 25ms]
     */
    batchDownload(settings: ImageSettings[], delay?: number): Promise<void[]>;

    /***
     * Download and save a remote image
     * @param settings Conversion settings and storage path
     */
    download(settings: ImageSettings): Promise<void>;
}
