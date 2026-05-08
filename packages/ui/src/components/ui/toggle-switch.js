import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../../utils/cn';
export function ToggleSwitch({ checked, onChange, label, disabled = false }) {
    return (_jsx("button", { type: "button", role: "switch", "aria-checked": checked, "aria-label": label, disabled: disabled, onClick: () => onChange(!checked), className: cn('relative shrink-0 w-9 h-5 rounded-full transition-colors duration-150', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold', disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer', checked ? 'bg-navy' : 'bg-gray-200'), children: _jsx("span", { className: cn('absolute top-[3px] w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-150', checked ? 'left-[calc(100%-17px)]' : 'left-[3px]') }) }));
}
