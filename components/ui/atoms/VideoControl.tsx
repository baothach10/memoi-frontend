export const VideoControls = ({
  isPlaying,
  onToggle,
}: {
  isPlaying: boolean;
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    className="absolute bottom-10 left-20 text-white cursor-pointer w-[50px] h-[50px] flex items-center justify-center transition-all z-20"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    aria-label={isPlaying ? "Pause video" : "Play video"}
  >
    {isPlaying ? (
      // Pause Icon
      <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="3.5" y1="1.5" x2="3.5" y2="13.5" stroke="currentColor" />
        <line x1="9.5" y1="1.5" x2="9.5" y2="13.5" stroke="currentColor" />
      </svg>

    ) : (
      // Play Icon
      <svg width="12" height="15" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 1.74885V16.2512C1.5 16.7616 2.13963 17.0716 2.55636 16.8032L13.4436 9.55436C13.8604 9.28596 13.8604 8.71404 13.4436 8.44564L2.55636 1.19679C2.13963 0.928393 1.5 1.23838 1.5 1.74885Z" stroke="currentColor" />
      </svg>

    )}
  </button>
);
