import { useToastStore } from "../store/useToastStore.js";

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  const getColors = (type) => {
    switch (type) {
      case "success":
        return "bg-green-900/30 border-green-700/50 text-green-200";
      case "error":
        return "bg-red-900/30 border-red-700/50 text-red-200";
      case "warning":
        return "bg-yellow-900/30 border-yellow-700/50 text-yellow-200";
      case "info":
        return "bg-blue-900/30 border-blue-700/50 text-blue-200";
      default:
        return "bg-slate-800 border-slate-700/50 text-slate-200";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm animate-slideIn ${getColors(toast.type)}`}
          onMouseEnter={() => {
            // Optional: pause auto-remove on hover
          }}
        >
          <span className="text-lg flex-shrink-0">{getIcon(toast.type)}</span>
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-lg hover:opacity-70 transition-opacity flex-shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
