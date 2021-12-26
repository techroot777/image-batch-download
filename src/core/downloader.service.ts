import { ImageSettings } from './image-processor.service';

export interface DownloaderService {
    batchDownload(settings: ImageSettings[]): Promise<void[]>;

    download(settings: ImageSettings): Promise<void>;
}
