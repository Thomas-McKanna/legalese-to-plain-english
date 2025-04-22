interface ModelLoaderProps {
  loadingStatus: string;
  modelLoaded: boolean;
}

export function ModelLoader({ loadingStatus, modelLoaded }: ModelLoaderProps) {
  if (modelLoaded) return null;
  
  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-[0_25px_80px_rgba(124,58,237,0.5)] border-2 border-[--color-accent-purple]">
      <div className="text-xl text-[--text-primary] text-center font-medium mb-4">
        {loadingStatus}
      </div>
      <div className="w-full max-w-md h-3 bg-[--bg-secondary] rounded-full overflow-hidden">
        <div
          className={`h-full bg-[var(--color-accent-purple)] rounded-full ${
            !loadingStatus.includes("%") ? "animate-pulse" : ""
          }`}
          style={{
            width: loadingStatus.includes("%")
              ? loadingStatus.match(/\d+/)?.[0] + "%"
              : "100%",
            opacity: loadingStatus.includes("%") ? 1 : 0.7,
          }}
        ></div>
      </div>
    </div>
  );
}
