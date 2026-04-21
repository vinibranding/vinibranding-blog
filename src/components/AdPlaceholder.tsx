export default function AdPlaceholder({ className = "", label = "Google AdSense" }: { className?: string; label?: string }) {
  return (
    <div className={`flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-400 text-sm font-medium ${className}`}>
      {label}
    </div>
  );
}
