import { DownloaderService, ImageProcessor, ImageSettings } from '../../core';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import * as fs from 'fs';
import * as util from 'util';
import * as stream from 'stream';
import { constants } from 'http2';
import { delayPromise } from '../util';

const pipeline = util.promisify(stream.pipeline);

export class DownloaderAxiosService implements DownloaderService {
    readonly requestConfig: AxiosRequestConfig = {
        method: 'get',
        responseType: 'stream'
    };

    constructor(private readonly imageProcessor: ImageProcessor) {}

    async batchDownload(
        settings: ImageSettings[],
        delay: number = 15
    ): Promise<void[]> {
        const tasks = settings.map(async (setting, index) => {
            const delayTime = Math.max(delay ?? 15, 0) * index;
            await delayPromise(delayTime);
            return await this.download(setting);
        });
        return await Promise.all(tasks);
    }

    async download(settings: ImageSettings): Promise<void> {
        try {
            const getResponse = await axios.get(
                new URL(settings.imageUrl).toString(),
                this.requestConfig
            );
            const dataStream =
                (await getResponse.data) as NodeJS.ReadableStream;
            const imageProcessor = await this.imageProcessor.handle(settings);
            return await pipeline(
                dataStream,
                imageProcessor,
                fs.createWriteStream(settings.outputPath)
            );
        } catch (error) {
            const errorStatus = (error as AxiosError)?.response?.status;
            if (errorStatus === constants.HTTP_STATUS_NOT_FOUND) {
                return;
            }
            throw error;
        }
    }
}
