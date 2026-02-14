import * as React from "react";
import { cn } from "@/lib/utils";

type TabItem = { value: string; label: string };

type FilterTabsProps = {
  items: TabItem[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  size?: "sm" | "md";
};

export function FilterTabs({
  items,
  defaultValue,
  onValueChange,
  className,
  size = "sm",
}: FilterTabsProps) {
  const [active, setActive] = React.useState(defaultValue ?? items[0]?.value ?? "");

  const handleClick = (value: string) => {
    setActive(value);
    window.dispatchEvent(new CustomEvent("tab-change", { detail: value }));
    onValueChange?.(value);
  };

  const pill = size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm";
  const half = Math.ceil(items.length / 2);

  const TabRow = ({ rowItems }: { rowItems: TabItem[] }) => (
    <div role="tablist" className="flex gap-1 rounded-lg bg-muted p-1">
      {rowItems.map((it) => (
        <button
          key={it.value}
          role="tab"
          aria-selected={active === it.value}
          onClick={() => handleClick(it.value)}
          className={cn(
            "flex-1 rounded-md transition-colors whitespace-nowrap font-medium",
            pill,
            active === it.value
              ? "bg-background text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {it.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className={cn("w-full", className)}>
      {/* Móvil: dos filas */}
      <div className="md:hidden space-y-1">
        <TabRow rowItems={items.slice(0, half)} />
        <TabRow rowItems={items.slice(half)} />
      </div>

      {/* Escritorio: fila única compacta y centrada */}
      <div className="hidden md:flex justify-center">
        <div role="tablist" className="flex gap-1 rounded-lg bg-muted p-1">
          {items.map((it) => (
            <button
              key={it.value}
              role="tab"
              aria-selected={active === it.value}
              onClick={() => handleClick(it.value)}
              className={cn(
                "flex-none rounded-md transition-colors whitespace-nowrap font-medium",
                pill,
                active === it.value
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
