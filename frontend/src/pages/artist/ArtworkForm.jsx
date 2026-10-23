import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Upload,
  ImagePlus,
  X,
  CheckCircle2,
  FileImage,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  ARTWORKS as DEMO,
  Card,
  PAGE,
  btnGhost,
  btnPrimary,
  inputCls,
} from "./shared";

const STORE_KEY = "artnest_artist_artworks";

const CATEGORIES = [
  ["paintings", "Paintings"],
  ["sculptures", "Sculptures"],
  ["ceramics", "Ceramics & Pottery"],
  ["photography", "Photography"],
  ["digital", "Digital & New Media"],
  ["textile", "Textile & Fiber Art"],
  ["printmaking", "Printmaking & Monotype"],
];

const EMPTY = {
  title: "",
  category: "paintings",
  medium: "",
  dims: "",
  price: "",
  description: "",
  status: "Published",
  location: "",
  tag: "",
  images: [],
};

const readStored = () => {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch {
    return [];
  }
};

export default function ArtworkForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const stored = readStored().find((a) => String(a.id) === id);
  const demo = !stored ? DEMO.find((a) => String(a.id) === id) : null;
  const existing = stored || demo;

  const [form, setForm] = useState(() => {
    if (stored) {
      const existingImages =
        Array.isArray(stored.images) && stored.images.length
          ? stored.images
          : stored.img
            ? [stored.img]
            : [];

      return {
        ...EMPTY,
        ...stored,
        price: stored.value ?? stored.price ?? "",
        images: existingImages,
      };
    }

    if (demo) {
      return {
        ...EMPTY,
        title: demo.title,
        category: demo.category || "paintings",
        medium: demo.medium,
        dims: demo.size || demo.dims || "",
        price: demo.price ?? demo.value ?? "",
        description: demo.description,
        status: demo.status,
        location: demo.location || "",
        tag: demo.tag || "",
        images: demo.img ? [demo.img] : [],
      };
    }

    return EMPTY;
  });

  const [saveError, setSaveError] = useState("");
  const [imageError, setImageError] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const pageRef = useRef(null);
  const pageEntered = useInView(pageRef, { once: true, amount: 0.08 });

  const set = (key) => (e) =>
    setForm((current) => ({
      ...current,
      [key]: e.target.value,
    }));

  const valid =
    form.title.trim() &&
    Number(form.price) > 0 &&
    form.images.length >= 1 &&
    form.location.trim() &&
    form.medium.trim() &&
    form.dims.trim() &&
    form.tag.trim();

  const compressImage = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const im = new Image();

        im.onload = () => {
          const scale = Math.min(
            1,
            1200 / Math.max(im.width, im.height)
          );

          const canvas = document.createElement("canvas");

          canvas.width = Math.round(im.width * scale);
          canvas.height = Math.round(im.height * scale);

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Could not process image."));
            return;
          }

          ctx.drawImage(
            im,
            0,
            0,
            canvas.width,
            canvas.height
          );

          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };

        im.onerror = () => reject(new Error("Invalid image."));
        im.src = reader.result;
      };

      reader.onerror = () =>
        reject(new Error("Could not read image."));

      reader.readAsDataURL(file);
    });

  const onFiles = async (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setImageError("");

    const remainingSlots = 3 - form.images.length;

    if (remainingSlots <= 0) {
      setImageError("You can upload a maximum of 3 images.");
      e.target.value = "";
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      setImageError(
        `Only ${remainingSlots} more image${remainingSlots > 1 ? "s" : ""
        } can be added. Maximum is 3 images.`
      );
    }

    try {
      const newImages = await Promise.all(
        selectedFiles.map((file) => compressImage(file))
      );

      setForm((current) => ({
        ...current,
        images: [...current.images, ...newImages].slice(0, 3),
      }));
    } catch {
      setImageError("One or more images could not be uploaded.");
    }

    e.target.value = "";
  };

  const removeImage = (index) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, i) => i !== index),
    }));

    setImageError("");
  };

  const submit = (e) => {
    e.preventDefault();

    if (!valid) return;

    const record = {
      id: stored?.id ?? `a-${Date.now()}`,
      demoId: stored?.demoId ?? demo?.id,
      title: form.title.trim(),
      artist: user?.name || "Artist",
      location: form.location.trim(),
      category: form.category,
      medium: form.medium.trim(),
      dims: form.dims.trim(),
      value: Number(form.price),

      // New multi-image structure
      images: form.images,

      // Keep first image in img for compatibility
      img: form.images[0],

      tag: form.tag.trim(),
      description: form.description.trim(),
      status: form.status,
      createdAt: stored?.createdAt ?? Date.now(),
    };

    try {
      const rest = readStored().filter(
        (a) => a.id !== record.id
      );

      localStorage.setItem(
        STORE_KEY,
        JSON.stringify([record, ...rest])
      );
    } catch {
      setSaveError("Could not save. Try smaller images.");
      return;
    }

    navigate("/artist/artworks");
  };

  const label = (text) => (
    <span className="mb-1.5 block text-[12px] font-medium text-[#8F7B6E]">
      {text}
    </span>
  );

  return (
    <motion.form
  ref={pageRef}
  onSubmit={submit}
  className={PAGE}
  initial={{ opacity: 0 }}
  animate={pageEntered ? { opacity: 1 } : { opacity: 0 }}
  transition={{ duration: 0.45, ease: "easeOut" }}
>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT — IMAGE UPLOAD */}
        <motion.div
  className="lg:col-span-1"
  initial={{ opacity: 0, y: 22 }}
  animate={
    pageEntered
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 22 }
  }
  transition={{
    duration: 0.55,
    delay: 0.08,
    ease: "easeOut",
  }}
>
  <Card
    title="Artwork images"
  >
          <div className="space-y-4">
            {/* Upload area */}
            <label
              className={`
                group
                relative
                flex
                min-h-[230px]
                cursor-pointer
                flex-col
                items-center
                justify-center
                overflow-hidden
                rounded-[18px]
                border
                border-dashed
                bg-[linear-gradient(145deg,#FFFCF9_0%,#F8EEE7_100%)]
                px-5
                text-center
                transition-all
                duration-300
                ease-out
                ${form.images.length >= 3
                  ? "cursor-not-allowed border-[#E8DDD5] opacity-70"
                  : "border-[#DCCDC2] hover:-translate-y-0.5 hover:border-[#B96B4A] hover:bg-[#FFF9F5] hover:shadow-[0_8px_22px_rgba(65,43,31,0.07)]"
                }
              `}
            >
              <div
                className="
                  grid h-12 w-12 place-items-center
                  rounded-[15px]
                  border border-[#E7D7CC]
                  bg-white
                  text-[#9F5639]
                  shadow-[0_5px_14px_rgba(65,43,31,0.06)]
                  transition-transform duration-300
                  group-hover:scale-105
                "
              >
                <ImagePlus size={21} strokeWidth={1.8} />
              </div>

              <p className="mt-4 text-[13.5px] font-medium text-[#4E4037]">
                {form.images.length >= 3
                  ? "Maximum images added"
                  : "Click to upload images"}
              </p>

              <p className="mt-1 text-[11.5px] leading-relaxed text-[#A28F7D]">
                JPG, PNG or WEBP
                <br />
                Upload up to 3 images
              </p>

              <div className="mt-4 rounded-full border border-[#E7D8CE] bg-white/80 px-3 py-1">
                <span className="text-[10.5px] font-medium text-[#8F7B6E]">
                  {form.images.length}/3 images
                </span>
              </div>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={onFiles}
                disabled={form.images.length >= 3}
                className="hidden"
              />
            </label>

            {/* Uploaded images */}
            {form.images.length > 0 && (
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[#A28F7D]">
                    Uploaded images
                  </p>

                  <span className="text-[11px] text-[#B09C8D]">
                    {form.images.length} of 3
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {form.images.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="
                        group
                        relative
                        aspect-square
                        overflow-hidden
                        rounded-[13px]
                        border border-[#E5D9D1]
                        bg-[#F5EEE9]
                        shadow-[0_3px_10px_rgba(65,43,31,0.05)]
                      "
                    >
                      <img
                        src={image}
                        alt={`Artwork preview ${index + 1}`}
                        className="
                          h-full w-full object-cover
                          transition-transform duration-500
                          group-hover:scale-105
                        "
                      />

                      {/* Image number */}
                      <span
                        className="
                          absolute left-2 top-2
                          grid h-6 w-6 place-items-center
                          rounded-full
                          border border-white/50
                          bg-[#362F26]/65
                          text-[10px]
                          font-semibold
                          text-white
                          backdrop-blur-sm
                        "
                      >
                        {index + 1}
                      </span>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label={`Remove image ${index + 1}`}
                        className="
                          absolute right-2 top-2
                          grid h-6 w-6 place-items-center
                          cursor-pointer
                          rounded-full
                          border border-white/50
                          bg-white/90
                          text-[#6F5B4E]
                          opacity-0
                          shadow-[0_3px_8px_rgba(65,43,31,0.12)]
                          transition-all duration-200
                          group-hover:opacity-100
                          hover:bg-[#9F5639]
                          hover:text-white
                        "
                      >
                        <X size={13} strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {imageError && (
              <p className="rounded-xl border border-[#EBCFC9] bg-[#FFF5F2] px-3 py-2.5 text-[11.5px] leading-relaxed text-[#9B3B2E]">
                {imageError}
              </p>
            )}

            {/* Image requirement */}
            <div
              className="
                flex items-start gap-2.5
                rounded-[13px]
                border border-[#E7DDD6]
                bg-[#FCF8F4]
                px-3.5 py-3
              "
            >
              <FileImage
                size={15}
                className="mt-0.5 shrink-0 text-[#9F5639]"
              />

              <p className="text-[11.5px] leading-relaxed text-[#8F7B6E]">
                Add at least one image. You can upload up to three
                images to showcase the artwork from different views.
              </p>
            </div>
          </div>
        </Card>
        </motion.div>

        {/* RIGHT — DETAILS */}
        <motion.div
  className="lg:col-span-2"
  initial={{ opacity: 0, y: 22 }}
  animate={
    pageEntered
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 22 }
  }
  transition={{
    duration: 0.55,
    delay: 0.16,
    ease: "easeOut",
  }}
>
  <Card
    title={existing ? "Edit details" : "Artwork details"}
  >
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Title */}
            <label className="block sm:col-span-2">
              {label("Title")}

              <input
                value={form.title}
                onChange={set("title")}
                className={inputCls}
                placeholder="e.g. Golden Silence"
              />
            </label>

            {/* Category */}
            <label className="block">
              {label("Category")}

              <div className="relative">
                {/* Selected category */}
                <button
                  type="button"
                  onClick={() => setCategoryOpen((prev) => !prev)}
                  className={`
        flex h-11 w-full
        cursor-pointer
        items-center justify-between
        rounded-xl
        border
        bg-[linear-gradient(135deg,#FFFFFF_0%,#FFFDFC_100%)]
        px-3
        text-left
        text-[14px]
        text-[#362F26]
        shadow-[0_3px_10px_rgba(65,43,31,0.025)]
        outline-none
        transition-all duration-200 ease-out
        ${categoryOpen
                      ? "border-[#B96B4A] shadow-[0_0_0_3px_rgba(159,86,57,0.08),0_5px_14px_rgba(65,43,31,0.05)]"
                      : "border-[#E8E1DB] hover:border-[#D9C5B8] hover:shadow-[0_5px_14px_rgba(65,43,31,0.04)]"
                    }
      `}
                >
                  <span>
                    {CATEGORIES.find(([value]) => value === form.category)?.[1] ||
                      "Select category"}
                  </span>

                  <svg
                    className={`
          h-4 w-4
          text-[#9F5639]
          transition-transform duration-200 ease-out
          ${categoryOpen ? "rotate-180" : ""}
        `}
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="m5 7.5 5 5 5-5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Category dropdown */}
                {categoryOpen && (
                  <div
                    className="
          absolute left-0 top-[calc(100%+8px)] z-40
          w-full
          overflow-hidden
          rounded-[16px]
          border border-[#E7DDD6]
          bg-[linear-gradient(145deg,#FFFFFF_0%,#FFF9F5_100%)]
          p-1.5
          shadow-[0_14px_35px_rgba(65,43,31,0.14)]
        "
                  >
                    {CATEGORIES.map(([value, text]) => {
                      const isSelected = form.category === value;

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setForm((current) => ({
                              ...current,
                              category: value,
                            }));
                            setCategoryOpen(false);
                          }}
                          className={`
                flex w-full
                cursor-pointer
                items-center
                rounded-[11px]
                px-3
                py-2.5
                text-left
                text-[13px]
                transition-all duration-150 ease-out
                ${isSelected
                              ? "bg-[#F3E2D7] font-medium text-[#9F5639]"
                              : "text-[#5F4D42] hover:bg-[#FAF1EB] hover:text-[#9F5639]"
                            }
              `}
                        >
                          {text}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </label>

            {/* Price */}
            <label className="block">
              {label("Price (₹)")}

              <input
                type="number"
                min="0"
                value={form.price}
                onChange={set("price")}
                className={inputCls}
                placeholder="e.g. 25000"
              />
            </label>

            {/* Medium */}
            <label className="block">
              {label("Medium")}

              <input
                value={form.medium}
                onChange={set("medium")}
                className={inputCls}
                placeholder="Oil on Heavy Canvas"
              />
            </label>

            {/* Size */}
            <label className="block">
              {label("Size")}

              <input
                value={form.dims}
                onChange={set("dims")}
                className={inputCls}
                placeholder="120 x 90 cm"
              />
            </label>

            {/* Location */}
            <label className="block">
              {label("Location")}

              <input
                value={form.location}
                onChange={set("location")}
                className={inputCls}
                placeholder="Jaipur, India"
              />
            </label>

            {/* Tag */}
            <label className="block">
              {label("Tag")}

              <input
                value={form.tag}
                onChange={set("tag")}
                className={inputCls}
                placeholder="Original Oil"
              />
            </label>

            {/* Description */}
            <label className="block sm:col-span-2">
              {label("Description")}

              <textarea
                rows={5}
                value={form.description}
                onChange={set("description")}
                placeholder="Describe the artwork, inspiration, technique or story behind it..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border border-[#E8E1DB]
                  bg-white
                  px-3.5 py-3
                  text-[13.5px]
                  leading-relaxed
                  text-[#362F26]
                  outline-none
                  placeholder:text-[#A28F7D]
                  transition-all duration-200
                  hover:border-[#D9C5B8]
                  focus:border-[#9F5639]
                  focus:shadow-[0_0_0_3px_rgba(159,86,57,0.07)]
                "
              />
            </label>

            {/* Status */}
            <label className="block">
              {label("Status")}

              <select
                value={form.status}
                onChange={set("status")}
                className={`
                  ${inputCls}
                  cursor-pointer
                  appearance-none
                `}
              >
                <option>Draft</option>
                <option>Published</option>
              </select>
            </label>
          </div>

          {/* Validation */}
          {!valid && (
            <div
              className="
                mt-6
                rounded-[14px]
                border border-[#E9DDD5]
                bg-[#FCF8F4]
                px-4 py-3
              "
            >
              <div className="flex items-start gap-2.5">
                <CheckCircle2
                  size={15}
                  className="mt-0.5 shrink-0 text-[#B8955A]"
                />

                <p className="text-[11.5px] leading-relaxed text-[#8F7B6E]">
                  Image, title, price, medium, size, location and
                  tag are required. These details are displayed in
                  your artwork collection.
                </p>
              </div>
            </div>
          )}

          {saveError && (
            <p className="mt-3 rounded-xl border border-[#EBCFC9] bg-[#FFF5F2] px-3 py-2.5 text-[12px] text-[#9B3B2E]">
              {saveError}
            </p>
          )}

          {/* Actions */}
          <div className="mt-7 flex flex-col gap-3 border-t border-[#E8E1DB] pt-5 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={!valid}
              className="
                inline-flex
                h-11
                cursor-pointer
                items-center
                justify-center
                rounded-full
                bg-[linear-gradient(135deg,#B96B4A,#9F5639)]
                px-6
                text-[13.5px]
                font-semibold
                text-white
                shadow-[0_7px_18px_rgba(159,86,57,0.16)]
                transition-all duration-300 ease-out
                hover:-translate-y-0.5
                hover:shadow-[0_11px_24px_rgba(159,86,57,0.23)]
                active:scale-[0.97]
                disabled:cursor-not-allowed
                disabled:opacity-45
                disabled:hover:translate-y-0
              "
            >
              {existing ? "Save changes" : "Create artwork"}
            </button>

            <Link
              to="/artist/artworks"
              className="
                inline-flex
                h-11
                items-center
                justify-center
                rounded-full
                border border-[#DED0C7]
                bg-white/80
                px-6
                text-[13.5px]
                font-medium
                text-[#6F5B4E]
                transition-all duration-200 ease-out
                hover:-translate-y-0.5
                hover:border-[#CBB4A5]
                hover:bg-white
                hover:text-[#9F5639]
                active:scale-[0.97]
              "
            >
              Cancel
            </Link>
          </div>
        </Card>
        </motion.div>
      </div>
    </motion.form>
  );
}