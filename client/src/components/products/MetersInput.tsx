import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MetersInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  className?: string;
  size?: "sm" | "default";
}

export function MetersInput({
  value,
  onChange,
  min = 0.5,
  step = 0.5,
  className = "",
  size = "default",
}: MetersInputProps) {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(Number(newValue.toFixed(1)));
  };

  const handleIncrement = () => {
    const newValue = value + step;
    onChange(Number(newValue.toFixed(1)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= min) {
      onChange(Number(val.toFixed(1)));
    }
  };

  const buttonSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const inputHeight = size === "sm" ? "h-8" : "h-10";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={buttonSize}
        onClick={handleDecrement}
        disabled={value <= min}
        data-testid="button-meters-decrement"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        step={step}
        className={`w-20 text-center ${inputHeight}`}
        data-testid="input-meters"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={buttonSize}
        onClick={handleIncrement}
        data-testid="button-meters-increment"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground">متر</span>
    </div>
  );
}
