"use client";

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ErrorModal({ open, onClose }: ErrorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-[900px] max-w-[90%] bg-[#fbf8f3] px-8 py-10 text-center shadow-lg  max-tablet:max-w-[494px] max-mobile:p-4">
        <h2 className="text-lg font-medium mb-4">
          Sorry, something went wrong
        </h2>

        <p className="text-sm text-black/70 leading-relaxed mb-8">
          Make sure you&apos;ve entered the verification code correctly. You can
          request it again by clicking{" "}
          <span className="font-medium">&quot;request new code&quot;</span>.
        </p>

        <button
          onClick={onClose}
          className="w-full border border-black py-3 text-sm hover:bg-black hover:text-white transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}
