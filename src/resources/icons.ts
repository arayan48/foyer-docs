import { IconType } from "react-icons";

import {
  HiMiniMinus,
  HiOutlineGlobeAlt,
  HiOutlineServerStack,
  HiOutlineCpuChip,
  HiOutlineArrowDownTray,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiMiniPlus,
  HiOutlineMagnifyingGlass,
  HiCalendar,
  HiOutlineLink,
  HiArrowUpRight,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineBars3BottomLeft,
  HiOutlineHome,
  HiOutlineAcademicCap,
  HiOutlineQueueList,
  HiOutlineRocketLaunch,
  HiOutlineIdentification,
  HiOutlinePhoto,
  HiOutlineMap,
  HiOutlineClock,
  HiOutlineLightBulb,
  HiOutlineAdjustmentsHorizontal,
  HiOutlinePaintBrush,
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentText,
  HiOutlineSquare3Stack3D,
  HiOutlineLanguage,
  HiOutlineCube,
  HiOutlineBars3,
  HiOutlineKey,
} from "react-icons/hi2";

import { RiVisaLine } from "react-icons/ri";

import { FaDiscord, FaGithub, FaGoogle, FaLinkedin, FaMailchimp, FaThreads } from "react-icons/fa6";

export const iconLibrary: Record<string, IconType> = {
  // Navigation
  home: HiOutlineHome,
  sidebar: HiOutlineBars3,
  openLink: HiOutlineLink,
  arrowUpRight: HiArrowUpRight,
  search: HiOutlineMagnifyingGlass,

  // Actions
  minus: HiMiniMinus,
  plus: HiMiniPlus,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  password: HiOutlineKey,

  // Content
  document: HiOutlineBars3BottomLeft,
  page: HiOutlineDocumentText,
  pages: HiOutlineDocumentDuplicate,
  article: HiOutlineQueueList,
  queue: HiOutlineQueueList,
  image: HiOutlinePhoto,
  language: HiOutlineLanguage,

  // Project
  project: HiOutlineSquare3Stack3D,
  components: HiOutlineCube,
  rocket: HiOutlineRocketLaunch,
  globe: HiOutlineGlobeAlt,
  server: HiOutlineServerStack,
  cpu: HiOutlineCpuChip,
  download: HiOutlineArrowDownTray,
  roadmap: HiOutlineMap,
  changelog: HiOutlineClock,

  // Customization
  style: HiOutlinePaintBrush,
  config: HiOutlineAdjustmentsHorizontal,

  // Learning
  scholar: HiOutlineAcademicCap,
  learn: HiOutlineAcademicCap,
  lightbulb: HiOutlineLightBulb,

  // Misc
  calendar: HiCalendar,
  card: HiOutlineIdentification,
  security: HiOutlineShieldCheck,
  sparkle: HiOutlineSparkles,

  // Social
  discord: FaDiscord,
  github: FaGithub,
  google: FaGoogle,
  linkedin: FaLinkedin,
  threads: FaThreads,
  mailchimp: FaMailchimp,

  // Payment
  visa: RiVisaLine,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;