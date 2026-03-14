import { AlertCircle } from "lucide-react";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: any;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-left text-[16px] font-regular max-mobile:text-sm">
        {label}
      </label>

      {children}

      {/* Reserved space for error */}
      {error && (
        <div className="pt-3">
          <div className="flex items-start gap-1 text-red-600 text-xs">
            <AlertCircle size={12} className="mt-px max-tablet:mt-px" />
            <span>{error.message || "This field is required"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
export default Field;
