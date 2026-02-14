import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  placeholder?: string;
}

export function SearchBar({ 
  className = "", 
  size = "md",
  placeholder = "Buscar..." 
}: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Emitir evento personalizado
    const event = new CustomEvent('search-change', { detail: newValue });
    window.dispatchEvent(event);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        type="text"
        inputMode="search"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        className={`pl-10 ${
          size === "sm" ? "h-8" : size === "lg" ? "h-12 text-lg" : "h-10"
        }`}
      />
    </div>
  );
}
