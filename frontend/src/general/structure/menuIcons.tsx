import {
  AppWindow,
  Brain,
  HardHat,
  Info,
  List,
  LogIn,
  Bell,
  Settings,
  Star,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SectionName } from "./Constant";

export type MenuIconComponent = LucideIcon;

const SECTION_MENU_ICONS: Partial<Record<string, MenuIconComponent>> = {
  [SectionName.ACTIVITY]: List,
  [SectionName.ABOUT]: Info,
  [SectionName.POINTS]: Trophy,
  [SectionName.LOG_USER_POINT]: Trophy,
  [SectionName.OPERATIVE]: HardHat,
  [SectionName.FAMILY]: Users,
  [SectionName.NOTIFICATION]: Bell,
  [SectionName.SETTINGS]: Settings,
  [SectionName.GAMIFICATION]: Star,
  [SectionName.HOME]: LogIn,
  [SectionName.REGISTER]: AppWindow,
  [SectionName.PERSONALITY]: Brain,
  [SectionName.POLICY]: Brain,
};

export const getSectionMenuIcon = (path: string | undefined): MenuIconComponent | undefined => {
  if (path == null || path === "") {
    return undefined;
  }
  return SECTION_MENU_ICONS[path];
};
