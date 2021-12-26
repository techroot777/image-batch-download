import { ImageFormat, ImageProcessor, ImageSettings } from '../../core';
import sharp, { ResizeOptions, Sharp } from 'sharp';

export class ImageProcessorSharp implements ImageProcessor {
    async handle(settings: ImageSettings): Promise<Sharp> {
        let sharpObject = sharp();

        if (settings.quality || settings.lossless || settings.toFormat) {
            const targetFormat = settings.toFormat ?? ImageFormat.Webp;
            sharpObject = sharpObject.clone().toFormat(targetFormat, {
                quality: settings.quality,
                lossless: settings.lossless
            });
        }

        if ('size' in settings && settings.size) {
            return sharpObject
                .clone()
                .resize(this.prepareDimensions(settings.size));
        }

        if ('width' in settings && settings.width) {
            return sharpObject
                .clone()
                .resize(
                    this.prepareDimensions(settings.width, settings.height)
                );
        }

        return sharpObject;
    }

    private prepareDimensions(width: number, height?: number): ResizeOptions {
        return {
            width,
            height: height ?? width,
            fit: 'cover'
        };
    }
}
