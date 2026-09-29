/** Photo and video limits (the server checks these too). */
export const MAX_IMAGE_MB = 10;
export const MAX_VIDEO_MB = 50;
export const MAX_MEDIA_ITEMS = 30;

export const MEDIA_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/quicktime,video/webm";

const YOUTUBE =
    /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&#/].*)?$/;

/** The 11-character YouTube id in a link, or null. */
export function youtubeId(url) {
    return url?.trim().match(YOUTUBE)?.[1] ?? null;
}

export const youtubeThumbnail = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

let nextKey = 0;
/** Client-side id for list rendering and reordering. */
export const mediaKey = () => `media-${++nextKey}`;

/** A product's saved media as editable items. */
export function toMediaItems(media) {
    return (media ?? []).map((m) => ({
        key: mediaKey(),
        type: m.type,
        storageKey: m.storageKey ?? null,
        url: m.url ?? "",
        youtubeId: m.youtubeId ?? null,
        altText: m.altText ?? "",
        shared: Boolean(m.shared),
    }));
}

/** Items ready to save (finished uploads and links only). */
export function toMediaPayload(items) {
    return items
        .filter((m) => !m.uploading && !m.error)
        .map((m) => ({
            type: m.type,
            storageKey: m.storageKey || null,
            url: m.storageKey ? null : m.url || null,
            altText: m.altText.trim() || null,
            shared: m.shared,
        }));
}
