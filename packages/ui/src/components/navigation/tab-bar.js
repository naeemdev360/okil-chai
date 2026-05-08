import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../utils/cn';
export function TabBar({ items, active, onChange, variant = 'light', className, }) {
    return (_jsx("div", { className: cn('flex overflow-x-auto', className), children: items.map((item) => {
            const isActive = item.id === active;
            return (_jsxs("button", { onClick: () => onChange(item.id), className: cn('inline-flex items-center gap-1.5 border-b-2 transition-all duration-150 whitespace-nowrap font-sans', variant === 'light'
                    ? [
                        'px-3.5 py-3.5 text-[13px]',
                        isActive
                            ? 'border-b-gold text-navy font-semibold'
                            : 'border-b-transparent text-gray-600 font-normal hover:text-navy',
                    ]
                    : [
                        'px-5 py-3.5 text-sm font-medium',
                        isActive
                            ? 'text-gold border-gold'
                            : 'text-white/60 border-transparent hover:text-white/80',
                    ]), children: [item.label, variant === 'light' && item.count !== undefined && item.count > 0 && (_jsx("span", { className: cn('inline-flex items-center justify-center px-1.5 rounded-full text-[10px] font-bold', isActive ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-600'), children: item.count }))] }, item.id));
        }) }));
}
