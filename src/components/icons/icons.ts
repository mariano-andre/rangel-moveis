import {
    ChartColumnBig,
    FolderKanban,
    Users,
    Package,
    Settings,
    PencilIcon,
    Check,
    X,
    Save,
    Eye,
    MoveRight,
    CirclePlus,
    Bell
} from "lucide-react";

export const AppIcons = {
  financial: ChartColumnBig,
  projects: FolderKanban,
  employees: Users,
  inventory: Package,
  settings: Settings,
  edit: PencilIcon,
  apply: Check,
  cancel: X,
  save: Save,
  details: Eye,
  next: MoveRight,
  new: CirclePlus,
  notification: Bell
} as const;

export type IconName = keyof typeof AppIcons;