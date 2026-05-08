// Utilities
export { cn } from './utils/cn';

// Layout
export { SidebarNav } from './components/layout/sidebar-nav';
export type { SidebarNavItem, SidebarNavUser, SidebarNavProps } from './components/layout/sidebar-nav';
export { PortalMobileHeader } from './components/layout/portal-mobile-header';
export type { PortalMobileHeaderProps } from './components/layout/portal-mobile-header';
export { PortalMobileNavDrawer } from './components/layout/portal-mobile-nav-drawer';
export type { PortalMobileNavDrawerProps } from './components/layout/portal-mobile-nav-drawer';
export { PortalFooter } from './components/layout/portal-footer';
export type { PortalFooterLink, PortalFooterProps } from './components/layout/portal-footer';

// Cards
export { StatCard } from './components/cards/stat-card';
export type { StatCardProps } from './components/cards/stat-card';

// Icons
export * from './icons';

// Navigation
export { TabBar } from './components/navigation/tab-bar';
export type { TabItem } from './components/navigation/tab-bar';

// Data display
export { StarRating } from './components/data-display/star-rating';
export {
  SelectableStackedList,
  SelectableStackedListItem,
  stackedListItemVariants,
} from './components/data-display/selectable-stacked-list';
export type {
  SelectableStackedListItemProps,
  SelectableStackedListProps,
} from './components/data-display/selectable-stacked-list';

// Cards
export { ReviewCard } from './components/cards/review-card';
export type { ReviewData } from './components/cards/review-card';

// Composite primitives
export { ToggleChip }     from './components/ui/toggle-chip';
export { TogglePill, togglePillVariants } from './components/ui/toggle-pill';
export type { TogglePillProps } from './components/ui/toggle-pill';
export { PasswordInput }  from './components/ui/password-input';

// Shared cross-framework components
export { LanguageSwitcher } from './components/shared/language-switcher';
export type { LanguageSwitcherProps, LocaleOption } from './components/shared/language-switcher';

// Primitives
export { Button, buttonVariants } from './components/ui/button';
export type { ButtonProps } from './components/ui/button';

export { Input } from './components/ui/input';
export type { InputProps } from './components/ui/input';

export { Label } from './components/ui/label';

export { Badge, badgeVariants } from './components/ui/badge';
export type { BadgeProps } from './components/ui/badge';

export { Separator } from './components/ui/separator';

export { SurfaceCard, surfaceCardVariants } from './components/ui/surface-card';
export type { SurfaceCardProps } from './components/ui/surface-card';

export { DecorativeOrb, decorativeOrbVariants } from './components/ui/decorative-orb';
export type { DecorativeOrbProps } from './components/ui/decorative-orb';

export { Checkbox } from './components/ui/checkbox';
export type { CheckboxProps } from './components/ui/checkbox';

export { RadioGroup, RadioItem } from './components/ui/radio-group';
export type { RadioItemProps } from './components/ui/radio-group';

export { Textarea } from './components/ui/textarea';
export type { TextareaProps } from './components/ui/textarea';

export { Avatar } from './components/ui/avatar';
export type { AvatarProps } from './components/ui/avatar';

export { ToggleSwitch } from './components/ui/toggle-switch';

// Notifications
export { NotificationIcon } from './components/notifications/NotificationIcon';
export { NotificationPreview } from './components/notifications/NotificationPreview';
export { NotificationRow } from './components/notifications/NotificationRow';
export { NotificationPreferencesPanel } from './components/notifications/NotificationPreferencesPanel';
export type { PrefSection } from './components/notifications/NotificationPreferencesPanel';
export type { NotificationItem, NotificationType } from './components/notifications/notification.types';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
} from './components/ui/dropdown-menu';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from './components/ui/select';
