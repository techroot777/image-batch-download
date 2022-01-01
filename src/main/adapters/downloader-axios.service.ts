import {
    DownloaderService,
    DownloadProgress,
    ImageProcessor,
    ImageSettings
} from '../../core';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import * as fs from 'fs';
import * as util from 'util';
import * as stream from 'stream';
import { constants } from 'http2';
import { from, map, mergeMap, Observable, tap } from 'rxjs';

const pipeline = util.promisify(stream.pipeline);
const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_PARALLEL_REQUESTS = 8;

export class DownloaderAxiosService implements DownloaderService {
    readonly requestConfig: AxiosRequestConfig = {
        method: 'get',
        responseType: 'stream',
        timeout: DEFAULT_TIMEOUT_MS
    };

    constructor(private readonly imageProcessor: ImageProcessor) {}

    batchDownload(
        settings: ImageSettings[],
        maxParallelRequests: number = DEFAULT_PARALLEL_REQUESTS
    ): Observable<DownloadProgress> {
        const total = settings.length;
        const maxParallelOrDefault =
            maxParallelRequests ?? DEFAULT_PARALLEL_REQUESTS;
        let currentIndex = 0;

        const downloadImageAndUpdateCounter = (setting: ImageSettings) =>
            from(this.download(setting)).pipe(
                tap(() => ++currentIndex),
                map(() => setting),
                map((setting) => ({
                    lastDownloaded: {
                        url: setting.imageUrl,
                        path: setting.outputPath
                    },
                    total,
                    completed: currentIndex,
                    pending: total - currentIndex
                }))
            );

        return from(settings).pipe(
            mergeMap(
                (setting) => downloadImageAndUpdateCounter(setting),
                maxParallelOrDefault
            )
        );
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
