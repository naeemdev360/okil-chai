import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
const badgeVariants = cva('inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium font-sans leading-none', {
    variants: {
        variant: {
            default: 'bg-navy text-white',
            verified: 'bg-navy text-white',
            available: 'bg-success-bg text-success',
            pending: 'bg-warning-bg text-warning',
            cancelled: 'bg-error-bg text-error',
            pro: 'bg-gold-pale text-gold border border-gold',
            topRated: 'bg-gold text-navy font-semibold',
            outline: 'border border-gray-200 text-gray-600 bg-transparent',
        },
    },
    defaultVariants: { variant: 'default' },
});
function Badge({ className, variant, ...props }) {
    return _jsx("span", { className: cn(badgeVariants({ variant }), className), ...props });
}
export { Badge, badgeVariants };
