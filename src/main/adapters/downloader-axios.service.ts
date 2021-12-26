import { DownloaderService, ImageProcessor, ImageSettings } from '../../core';
import axios, { AxiosRequestConfig } from 'axios';
import * as fs from 'fs';
import * as util from 'util';
import * as stream from 'stream';

const pipeline = util.promisify(stream.pipeline);

export class DownloaderAxiosService implements DownloaderService {
    readonly requestConfig: AxiosRequestConfig = {
        method: 'get',
        responseType: 'stream'
    };

    constructor(private readonly imageProcessor: ImageProcessor) {}

    async batchDownload(settings: ImageSettings[]): Promise<void[]> {
        const tasks = settings.map((setting) => this.download(setting));
        return await Promise.all(tasks);
    }

    async download(settings: ImageSettings): Promise<void> {
        const response = await axios.get(settings.imageUrl, this.requestConfig);
        const dataStream = (await response.data) as NodeJS.ReadableStream;
        const sharp = await this.imageProcessor.handle(settings);
        return await pipeline(
            dataStream,
            sharp,
            fs.createWriteStream(settings.outputPath)
        );
    }
}
