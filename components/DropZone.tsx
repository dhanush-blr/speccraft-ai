"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, ImageIcon, X, AlertCircle } from "lucide-react";

interface DropZoneProps {
  /** Full data URI ready for use in <img src>, e.g. "data:image/svg+xml;base64,..." */
  currentImageSrc: string | null;
  onImageLoaded: (base64: string, mimeType: string) => void;
  onClear: () => void;
  onError?: (message: string) => void;
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export default function DropZone({
  currentImageSrc,
  onImageLoaded,
  onClear,
  onError,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);
      setImgError(false);

      if (!ALLOWED_TYPES.includes(file.type)) {
        const errorMsg = "Please upload a valid screenshot (PNG, JPG, or WebP).";
        setError(errorMsg);
        if (inputRef.current) inputRef.current.value = "";
        onError?.(errorMsg);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        const errorMsg = "File exceeds 4MB limit. Please upload a smaller screenshot (PNG, JPG, or WebP).";
        setError(errorMsg);
        if (inputRef.current) inputRef.current.value = "";
        onError?.(errorMsg);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const [header, base64] = dataUrl.split(",");
        const mimeType = header.match(/:(.*?);/)?.[1] || "image/png";
        onImageLoaded(base64, mimeType);
      };
      reader.readAsDataURL(file);
    },
    [onImageLoaded, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  // Show preview if we have a valid, non-empty data URI and it hasn't errored
  const hasValidImage =
    typeof currentImageSrc === "string" &&
    currentImageSrc.trim().length > 0 &&
    !imgError;

  if (hasValidImage) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden border border-[rgba(99,136,254,0.3)] group bg-[#060a14]">
        {/* eslint-disable-next-line @next/next/no-img-element -- base64 data URI cannot use next/image */}
        <img
          src={currentImageSrc!}
          alt="Uploaded bug screenshot"
          className="w-full max-h-56 object-contain"
          onError={() => setImgError(true)}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={onClear}
            aria-label="Remove image"
            className="flex items-center gap-2 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-500 transition-colors"
          >
            <X size={14} />
            Remove Image
          </button>
        </div>
        {/* Always-visible close button */}
        <button
          onClick={onClear}
          aria-label="Remove image"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[rgba(0,0,0,0.6)] hover:bg-red-500 border border-white/20 flex items-center justify-center transition-colors"
        >
          <X size={12} className="text-white" />
        </button>
      </div>
    );
  }

  // Empty / upload state
  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload screenshot: click or drag and drop an image"
        className={`relative w-full min-h-[160px] flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer select-none
          ${isDragging
            ? "border-[#6388fe] bg-[rgba(99,136,254,0.1)] shadow-[0_0_30px_rgba(99,136,254,0.2)]"
            : "border-[rgba(99,136,254,0.25)] bg-[rgba(99,136,254,0.02)] hover:border-[rgba(99,136,254,0.5)] hover:bg-[rgba(99,136,254,0.06)]"
          }`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragging
              ? "bg-[rgba(99,136,254,0.25)] scale-110"
              : "bg-[rgba(99,136,254,0.08)]"
          }`}
        >
          {isDragging ? (
            <ImageIcon size={24} className="text-[#6388fe]" />
          ) : (
            <Upload size={24} className="text-[#6388fe] opacity-70" />
          )}
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-[#94a3b8] text-sm font-medium">
            {isDragging ? "Drop your screenshot here" : "Drag & drop a screenshot"}
          </p>
          <p className="text-[#475569] text-xs mt-1">
            or{" "}
            <span className="text-[#6388fe] underline underline-offset-2">
              browse files
            </span>{" "}
            · Supports PNG, JPG, WebP (Max 4MB)
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-red-400 text-xs flex items-center gap-1.5 animate-fade-in" role="alert">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileInput}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
