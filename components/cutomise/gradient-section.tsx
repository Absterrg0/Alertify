import { Label } from "@/components/ui/label";
import type { AlertState } from "@/types/alert";

interface GradientSectionProps {
  alertState: AlertState;
  updateAlertState: (updates: Partial<AlertState>) => void;
}

const directions = [
  { label: "1", value: "to right" },
  { label: "2", value: "to left" },
  { label: "3", value: "45deg" },
  { label: "4", value: "-45deg" },
];

export const GradientSection = ({ alertState, updateAlertState }: GradientSectionProps) => {
  return (
    <div className="bg-white dark:bg-zinc-800/50 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-8">Gradient Direction</h3>
      <div className="flex  justify-around gap-4">
        {directions.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => updateAlertState({ gradientDirection: value })}
            className={`h-20 w-32 flex items-center justify-center rounded-xl border-4 font-bold text-xl text-white shadow-md transition-all duration-200 ${
              alertState.gradientDirection === value ? "border-blue-500 scale-110" : "border-gray-300 hover:scale-105"
            }`}
            style={{
              background: `linear-gradient(${value}, ${alertState.startColor}, ${alertState.endColor})`,
            }}
          >
            <span className="drop-shadow-md">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
