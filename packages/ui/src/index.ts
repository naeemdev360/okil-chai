// Utilities
export { cn } from './utils/cn';
export { formatBytes } from './utils/format';

// Loading
export { Spinner } from './components/loading/spinner';
export type { SpinnerProps } from './components/loading/spinner';
export { Skeleton } from './components/loading/skeleton';
export type { SkeletonProps } from './components/loading/skeleton';
export { DotsLoader } from './components/loading/dots-loader';
export type { DotsLoaderProps } from './components/loading/dots-loader';
export { PageLoader } from './components/loading/page-loader';
export type { PageLoaderProps } from './components/loading/page-loader';
export { LawyerCardSkeleton } from './components/loading/lawyer-card-skeleton';
export type { LawyerCardSkeletonProps } from './components/loading/lawyer-card-skeleton';

// Toast
export { AppToaster } from './components/ui/toaster';
export { toast } from 'sonner';

// Animation
export { Reveal, RevealGroup } from './components/animation/reveal';
export type { RevealProps, RevealGroupProps } from './components/animation/reveal';

// Layout
export { SidebarNav } from './components/layout/sidebar-nav';
export type { SidebarNavItem, SidebarNavUser, SidebarNavProps } from './components/layout/sidebar-nav';
export { DarkSidebarNav } from './components/layout/dark-sidebar-nav';
export type { DarkNavItem, DarkNavSection, DarkSidebarNavProps } from './components/layout/dark-sidebar-nav';
export { PortalTopbar } from './components/layout/portal-topbar';
export type { PortalTopbarProps, PortalTopbarUser } from './components/layout/portal-topbar';
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
export { Pagination } from './components/navigation/pagination';
export type { PaginationProps } from './components/navigation/pagination';

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

// Auth
export { PortalAuthGate } from './components/auth/portal-auth-gate';
export type { PortalAuthGateProps, PortalKind } from './components/auth/portal-auth-gate';

// Primitives
export { ConfirmDialog } from './components/ui/confirm-dialog';
export type { ConfirmDialogProps } from './components/ui/confirm-dialog';

export { DocumentItem } from './components/ui/document-item';
export type { DocumentItemProps } from './components/ui/document-item';

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

export { TimePicker } from './components/ui/time-picker';
export type { TimePickerProps } from './components/ui/time-picker';
