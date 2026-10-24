"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";

import { CameraIcon, RefreshIcon, UploadIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { fileToDataUrl, videoFrameToDataUrl } from "@/lib/image";

type Status = "idle" | "requesting" | "live" | "denied" | "unsupported" | "error";

/**
 * Live camera viewfinder. Calling `getUserMedia` is what triggers the browser's camera
 * permission prompt, so the prompt appears the moment the user taps "Open camera".
 * Always offers an upload fallback (also the path on desktops without a webcam).
 */
export function CameraCapture({
  onCapture,
  autoStart = false,
  facingMode = "environment",
  helper,
}: {
  onCapture: (dataUrl: string) => void;
  autoStart?: boolean;
  facingMode?: "environment" | "user";
  helper?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [busy, setBusy] = useState(false);
  const [facing, setFacing] = useState(facingMode);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const start = useCallback(
    async (mode: "environment" | "user" = facing) => {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setStatus("unsupported");
        return;
      }
      stop();
      setStatus("requesting");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
        setStatus("live");
      } catch (err) {
        const name = err instanceof DOMException ? err.name : "";
        if (name === "NotAllowedError" || name === "SecurityError") setStatus("denied");
        else if (name === "NotFoundError" || name === "OverconstrainedError") setStatus("unsupported");
        else setStatus("error");
      }
    },
    [facing, stop],
  );

  useEffect(() => {
    if (autoStart) void start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video || status !== "live") return;
    setBusy(true);
    try {
      const dataUrl = videoFrameToDataUrl(video);
      stop();
      setStatus("idle");
      onCapture(dataUrl);
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      stop();
      setStatus("idle");
      onCapture(dataUrl);
    } catch {
      setStatus("error");
    } finally {
      setBusy(false);
    }
  };

  const flip = () => {
    const next = facing === "environment" ? "user" : "environment";
    setFacing(next);
    void start(next);
  };

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-stone-900 shadow-inner">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`h-full w-full object-cover transition-opacity ${status === "live" ? "opacity-100" : "opacity-0"}`}
        />

        {status === "live" && (
          <>
            <Corners />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Upload a photo instead"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
              >
                <UploadIcon />
              </button>
              <button
                type="button"
                onClick={capture}
                disabled={busy}
                aria-label="Take photo"
                className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white/90 bg-white/20 backdrop-blur transition active:scale-95"
              >
                <span className="h-14 w-14 rounded-full bg-white shadow" />
              </button>
              <button
                type="button"
                onClick={flip}
                aria-label="Switch camera"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
              >
                <RefreshIcon />
              </button>
            </div>
          </>
        )}

        {status !== "live" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <CameraIcon size={30} />
            </div>
            {status === "idle" && (
              <>
                <p className="max-w-xs text-sm text-stone-300">{helper ?? "Your browser will ask for camera access."}</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button variant="primary" size="lg" leftIcon={<CameraIcon />} onClick={() => void start()}>
                    Open camera
                  </Button>
                  <Button variant="outline" size="lg" leftIcon={<UploadIcon />} onClick={() => fileRef.current?.click()} className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                    Upload photo
                  </Button>
                </div>
              </>
            )}
            {status === "requesting" && <p className="text-sm text-stone-300">Waiting for camera permission…</p>}
            {status === "denied" && (
              <>
                <p className="font-semibold">Camera access was blocked</p>
                <p className="max-w-xs text-sm text-stone-300">
                  Allow the camera in your browser&apos;s site settings, or upload a photo instead.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button variant="primary" size="lg" onClick={() => void start()} leftIcon={<RefreshIcon />}>
                    Try again
                  </Button>
                  <Button variant="outline" size="lg" leftIcon={<UploadIcon />} onClick={() => fileRef.current?.click()} className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                    Upload photo
                  </Button>
                </div>
              </>
            )}
            {(status === "unsupported" || status === "error") && (
              <>
                <p className="font-semibold">{status === "unsupported" ? "No camera found" : "Couldn't start the camera"}</p>
                <p className="max-w-xs text-sm text-stone-300">Upload a photo from your device instead.</p>
                <Button variant="primary" size="lg" leftIcon={<UploadIcon />} onClick={() => fileRef.current?.click()}>
                  Upload photo
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </div>
  );
}

function Corners() {
  const c = "absolute h-7 w-7 border-white/90";
  return (
    <div className="pointer-events-none absolute inset-6" aria-hidden="true">
      <span className={`${c} left-0 top-0 rounded-tl-xl border-l-[3px] border-t-[3px]`} />
      <span className={`${c} right-0 top-0 rounded-tr-xl border-r-[3px] border-t-[3px]`} />
      <span className={`${c} bottom-0 left-0 rounded-bl-xl border-b-[3px] border-l-[3px]`} />
      <span className={`${c} bottom-0 right-0 rounded-br-xl border-b-[3px] border-r-[3px]`} />
    </div>
  );
}
