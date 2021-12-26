import { Writable } from 'stream';

export enum ImageFormat {
    Jpeg = 'jpeg',
    Png = 'png',
    Webp = 'webp',
    Avif = 'avif'
}

export interface ImageBasicConfig {
    // Target format to convert the image
    toFormat?: ImageFormat | undefined;

    // Quality, integer 1-100 (optional, default 80)
    quality?: number | undefined;

    // Use lossless compression mode (optional, default false)
    lossless?: boolean | undefined;

    // Path where the output image will be saved
    outputPath: string;

    // Url to remote image
    imageUrl: string;
}

export interface ImageRectConfig extends ImageBasicConfig {
    width: number;
    height: number;
}

export interface ImageSquareConfig extends ImageBasicConfig {
    size: number;
}

export type ImageSettings = ImageSquareConfig | ImageRectConfig;

export interface ImageProcessor {
    handle(settings: ImageSettings): Promise<Writable>;
}
