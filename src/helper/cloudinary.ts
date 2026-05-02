type CloudinaryTransforms = {
    width?: number;
    height?: number;
    crop?: 'thumb' | 'fill' | 'scale';
    gravity?: 'face' | 'auto';
}

export function getOptimizedImageUrl(originalUrl: string | null | undefined, options?: CloudinaryTransforms): string {
    // Always guard against nulls first!
    if (!originalUrl) return '/default-card-image.jpg';
    if (originalUrl.startsWith('blob:') || originalUrl.startsWith('data:')) {
        return originalUrl;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dj30qrjfv';
    const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

    let transforms = 'f_auto,q_auto';
    const finalWidth = options?.width ? Math.ceil(options.width / 200) * 200 : 400;
    transforms += `,w_${finalWidth}`;

    if (options?.crop) transforms += `,c_${options.crop}`;
    if (options?.gravity) transforms += `,g_${options.gravity}`;
    if (options?.height) transforms += `,h_${options.height}`;

    if (originalUrl.includes('cloudinary.com')) {
        return originalUrl.replace('/upload/', `/upload/${transforms}/`);
    }

    // Clean up the path just in case
    let cleanPath = originalUrl.startsWith('/') ? originalUrl.slice(1) : originalUrl;

    // 2. THE EXTENSION SAFETY NET
    // If the database string is missing a file extension, append .jpg
    if (!cleanPath.match(/\.[a-zA-Z0-9]{3,4}$/)) {
        cleanPath += '.jpg';
    }

    return `${baseUrl}/${transforms}/${cleanPath}`;
}