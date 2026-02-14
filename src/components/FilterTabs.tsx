import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type TabItem = { value: string; label: string };

type FilterTabsProps = {
  items: TabItem[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;   // p.ej. "mt-6"
  size?: "sm" | "md";   // "sm" = compacto
  center?: boolean;     // centrar el bloque
};

export function FilterTabs({
  items,
  defaultValue,
  onValueChange,
  className,
  size = "sm",
  center = true,
}: FilterTabsProps) {
  const initial = defaultValue ?? items[0]?.value ?? "";

  // Tamaños de las pills
  const triggerSize =
    size === "sm"
      ? "h-8 px-3 text-xs"
      : "h-10 px-4 text-sm";

  const handleValueChange = (value: string) => {
    // Emitir evento global
    const event = new CustomEvent('tab-change', { detail: value });
    window.dispatchEvent(event);
    
    // Llamar callback si existe
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <Tabs
      defaultValue={initial}
      onValueChange={handleValueChange}
      className={cn("w-full", className)}
    >
      {/* Capa de centrado */}
      <div className={cn("w-full", center && "flex justify-center")}>
        {/* FRAME con fondo gris que envuelve TODAS las líneas */}
        <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-muted p-1">
          {/* TabsList sin fondo; también con wrap y sin padding extra */}
          <TabsList className="flex flex-wrap gap-1 bg-transparent p-0">
            {items.map((it) => (
              <TabsTrigger
                key={it.value}
                value={it.value}
                className={cn(
                  "rounded-md transition-colors",
                  triggerSize,
                  // Base discreta
                  "text-muted-foreground",
                  // ACTIVO: contraste alto en claro/oscuro
                  "data-[state=active]:bg-background data-[state=active]:text-foreground",
                  // Delineado/sombra sutil para separarse del frame gris
                  "data-[state=active]:ring-1 data-[state=active]:ring-border data-[state=active]:shadow-xs",
                  // Hover/focus accesible
                  "hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
                )}
              >
                {it.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>
    </Tabs>
  );
}
