import { ImageSettings } from './image-processor.service';
import { Observable } from 'rxjs';

export interface DownloaderService {
    /***
     * Download and save multiple remote images simultaneously
     * @param settings Conversion settings and storage path
     * @param maxParallelRequests Max downloads simultaneous
     */
    batchDownload(
        settings: ImageSettings[],
        maxParallelRequests?: number
    ): Observable<DownloadProgress>;

    /***
     * Download and save a remote image
     * @param settings Conversion settings and storage path
     */
    download(settings: ImageSettings): Promise<void>;
}

export interface DownloadProgress {
    lastDownloaded: {
        path: string;
        url: string;
    };
    pending: number;
    completed: number;
    total: number;
}
