import { useRef, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Film,
    ImagePlus,
    Link2,
    Loader2,
    Play,
    Trash2,
    TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import FormSection from "./FormSection";
import { inputClasses } from "../../constants/productForm";
import { uploadMedia } from "../../services/mediaApi";
import {
    MAX_IMAGE_MB,
    MAX_MEDIA_ITEMS,
    MAX_VIDEO_MB,
    MEDIA_ACCEPT,
    mediaKey,
    youtubeId,
    youtubeThumbnail,
} from "../../utils/media";


/**
 * Photos and videos for one product (one option of a variable product):
 * uploads from this device go to cloud storage, or add a photo / YouTube link.
 * The first photo is the main image. "All options" shows an item for every
 * option in the product's website listing.
 */
function ProductMediaFields({
                                media,
                                onChange,
                            }) {

    const fileInput = useRef(null);
    const [linkOpen, setLinkOpen] = useState(false);
    const [link, setLink] = useState("");

    // Functional updates: uploads finish in any order.
    const update = (key, changes) =>
        onChange(items => items.map(m => (m.key === key ? { ...m, ...changes } : m)));

    const remove = (key) =>
        onChange(items => items.filter(m => m.key !== key));

    const move = (key, step) =>
        onChange(items => {
            const from = items.findIndex(m => m.key === key);
            const to = from + step;
            if (from < 0 || to < 0 || to >= items.length) return items;
            const next = [...items];
            [next[from], next[to]] = [next[to], next[from]];
            return next;
        });


    function handleFiles(fileList) {

        const files = Array.from(fileList ?? []);
        if (fileInput.current) fileInput.current.value = "";

        const room = MAX_MEDIA_ITEMS - media.length;
        if (files.length > room) {
            toast.error(`A product can have up to ${MAX_MEDIA_ITEMS} photos and videos.`);
        }

        for (const file of files.slice(0, Math.max(0, room))) {

            const isVideo = file.type.startsWith("video/");
            const limit = (isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB) * 1024 * 1024;

            if (file.size > limit) {
                toast.error(
                    isVideo
                        ? `${file.name}: videos can be up to ${MAX_VIDEO_MB} MB. Use a YouTube link for longer ones.`
                        : `${file.name}: photos can be up to ${MAX_IMAGE_MB} MB.`
                );
                continue;
            }

            const key = mediaKey();
            onChange(items => [...items, {
                key,
                type: isVideo ? "VIDEO" : "IMAGE",
                storageKey: null,
                url: URL.createObjectURL(file),
                youtubeId: null,
                altText: "",
                shared: false,
                uploading: true,
                progress: 0,
                name: file.name,
            }]);

            uploadMedia(file, (progress) => update(key, { progress }))
                .then(uploaded => update(key, {
                    type: uploaded.type,
                    storageKey: uploaded.storageKey,
                    url: uploaded.url,
                    uploading: false,
                }))
                .catch(error => {
                    console.error(error);
                    update(key, {
                        uploading: false,
                        error: error.response?.data?.message ?? "Upload failed.",
                    });
                });
        }
    }


    function addLink() {

        const value = link.trim();
        const id = youtubeId(value);

        if (!id && !/^https:\/\/\S+$/i.test(value)) {
            toast.error("Paste a photo link starting with https://, or a YouTube link.");
            return;
        }

        if (media.length >= MAX_MEDIA_ITEMS) {
            toast.error(`A product can have up to ${MAX_MEDIA_ITEMS} photos and videos.`);
            return;
        }

        onChange(items => [...items, {
            key: mediaKey(),
            type: id ? "YOUTUBE" : "IMAGE",
            storageKey: null,
            url: value,
            youtubeId: id,
            altText: "",
            shared: false,
        }]);

        setLink("");
        setLinkOpen(false);
    }


    const firstImageKey = media.find(m => m.type === "IMAGE" && !m.error)?.key;


    return (

        <FormSection
            icon={ImagePlus}
            title="Photos & Videos"
            description="Upload from this device or add a link. The first photo is the main image."
            action={
                <div className="flex shrink-0 gap-2">
                    <button
                        type="button"
                        onClick={() => setLinkOpen(open => !open)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <Link2 size={15} />
                        Add link
                    </button>

                    <button
                        type="button"
                        onClick={() => fileInput.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        <ImagePlus size={15} />
                        Upload
                    </button>

                    <input
                        ref={fileInput}
                        type="file"
                        multiple
                        accept={MEDIA_ACCEPT}
                        onChange={(e) => handleFiles(e.target.files)}
                        className="hidden"
                    />
                </div>
            }
        >

            {linkOpen && (
                <div className="mb-5 flex flex-col gap-2 sm:flex-row">
                    <input
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())}
                        placeholder="https://… photo link, or a YouTube video link"
                        autoFocus
                        className={inputClasses}
                    />
                    <button
                        type="button"
                        onClick={addLink}
                        className="h-11 shrink-0 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Add
                    </button>
                </div>
            )}


            {media.length === 0 ? (
                <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleFiles(e.dataTransfer.files);
                    }}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-6 py-10 text-sm text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                >
                    <ImagePlus size={24} className="text-slate-400" />
                    Drop photos or videos here, or click to choose
                    <span className="text-xs text-slate-400">
                        Photos up to {MAX_IMAGE_MB} MB · Videos up to {MAX_VIDEO_MB} MB (MP4, MOV, WebM)
                    </span>
                </button>
            ) : (
                <ul
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleFiles(e.dataTransfer.files);
                    }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {media.map((item, index) => (
                        <MediaTile
                            key={item.key}
                            item={item}
                            isMain={item.key === firstImageKey}
                            isFirst={index === 0}
                            isLast={index === media.length - 1}
                            onMove={(step) => move(item.key, step)}
                            onRemove={() => remove(item.key)}
                            onChange={(changes) => update(item.key, changes)}
                        />
                    ))}
                </ul>
            )}

        </FormSection>
    );
}


function MediaTile({
                       item,
                       isMain,
                       isFirst,
                       isLast,
                       onMove,
                       onRemove,
                       onChange,
                   }) {

    const label =
        item.type === "VIDEO" ? "Video"
            : item.type === "YOUTUBE" ? "YouTube"
                : isMain ? "Main photo" : "Photo";

    return (

        <li className="overflow-hidden rounded-xl border border-slate-200 bg-white">

            <div className="relative aspect-[4/3] bg-slate-100">

                {item.type === "IMAGE" && (
                    <img
                        src={item.url}
                        alt={item.altText || ""}
                        className="h-full w-full object-contain"
                        onError={(e) => (e.currentTarget.style.opacity = "0.2")}
                    />
                )}

                {item.type === "VIDEO" && (
                    <video
                        src={item.url}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-contain"
                    />
                )}

                {item.type === "YOUTUBE" && (
                    <>
                        <img
                            src={youtubeThumbnail(item.youtubeId)}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                        <span className="absolute inset-0 flex items-center justify-center">
                            <span className="rounded-full bg-black/60 p-3 text-white">
                                <Play size={18} />
                            </span>
                        </span>
                    </>
                )}

                <span className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    isMain ? "bg-emerald-600 text-white" : "bg-white/90 text-slate-700"
                }`}>
                    {item.type === "VIDEO" && <Film size={11} />}
                    {label}
                </span>

                {item.uploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80 text-sm font-medium text-slate-700">
                        <Loader2 size={20} className="animate-spin" />
                        Uploading {item.progress ?? 0}%
                        <div className="h-1.5 w-2/3 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full bg-emerald-600 transition-all" style={{ width: `${item.progress ?? 0}%` }} />
                        </div>
                    </div>
                )}

                {item.error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-red-50/95 p-3 text-center text-xs text-red-700">
                        <TriangleAlert size={18} />
                        {item.name ? `${item.name}: ` : ""}{item.error}
                        <span className="text-red-500">Remove it and try again.</span>
                    </div>
                )}

            </div>

            <div className="space-y-3 p-3">

                {item.type === "IMAGE" && (
                    <input
                        value={item.altText}
                        onChange={(e) => onChange({ altText: e.target.value })}
                        maxLength={160}
                        placeholder="Describe the photo (for Google)"
                        aria-label="Photo description"
                        className={`${inputClasses} h-9 text-xs`}
                    />
                )}

                <div className="flex items-center justify-between gap-2">

                    <label
                        className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600"
                        title="Show on every option of this product on the website (e.g. a size chart)"
                    >
                        <input
                            type="checkbox"
                            checked={item.shared}
                            onChange={(e) => onChange({ shared: e.target.checked })}
                            className="h-4 w-4 accent-emerald-600"
                        />
                        All options
                    </label>

                    <div className="flex items-center gap-1">
                        <IconButton label="Move earlier" disabled={isFirst} onClick={() => onMove(-1)}>
                            <ArrowLeft size={15} />
                        </IconButton>
                        <IconButton label="Move later" disabled={isLast} onClick={() => onMove(1)}>
                            <ArrowRight size={15} />
                        </IconButton>
                        <IconButton label="Remove" danger onClick={onRemove}>
                            <Trash2 size={15} />
                        </IconButton>
                    </div>

                </div>

            </div>

        </li>
    );
}


function IconButton({
                        label,
                        danger,
                        disabled,
                        onClick,
                        children,
                    }) {

    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition disabled:opacity-30 ${
                danger ? "text-red-600 hover:bg-red-50" : "text-slate-600 hover:bg-slate-100"
            }`}
        >
            {children}
        </button>
    );
}

export default ProductMediaFields;
