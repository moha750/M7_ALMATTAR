import {
  Palette,
  Film,
  Sparkles,
  Code,
  Mic,
  type LucideIcon,
} from "lucide-react";

// خريطة أسماء الأيقونات (المخزّنة نصًّا في categories.icon) إلى مكوّنات lucide.
const ICONS: Record<string, LucideIcon> = {
  Palette,
  Film,
  Sparkles,
  Code,
  Mic,
};

export function resolveIcon(name?: string | null): LucideIcon {
  return (name && ICONS[name]) || Sparkles;
}
