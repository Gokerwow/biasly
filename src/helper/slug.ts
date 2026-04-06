import slugify from 'slugify';

export const toSlug = (text: string) => {
    return slugify(text, {
        lower: true,      // convert to lower case
        strict: true,     // strip special characters except replacement
        trim: true        // trim leading and trailing replacement chars
    });
};