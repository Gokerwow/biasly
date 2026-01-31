import { LucideIcon, Search } from "lucide-react";
import { ChangeEvent } from "react";

interface InputProps {
    type?: string;
    placeholder: string;
    className?: string;
    label?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    name: string;
    required?: boolean
    icon?: LucideIcon;
    endIcon?: LucideIcon;
    isSearch?: boolean
}

export const Input = ({ type = 'text', placeholder, className, onChange, value, name, required, icon: Icon, endIcon: EndIcon, isSearch = false }: InputProps) => {
    return (
        <div className="relative flex items-center group w-full max-w-md">

            {isSearch && (
                <Search className="absolute left-3 h-4 w-4 text-gray-500 group-focus-within:text-pink-500 transition-colors pointer-events-none" />
            )}

            {Icon && (
                <Icon className="absolute left-3 h-4 w-4 text-gray-500 group-focus-within:text-pink-500 transition-colors pointer-events-none" />
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                required={required}
                className={`bg-[#161B22] border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-pink-500/50 outline-none transition-all w-full ${className}`}
            />
            {EndIcon && (
                <EndIcon className="absolute right-3 h-4 w-4 text-gray-500 group-focus-within:text-pink-500 transition-colors pointer-events-none" />
            )}
        </div>
    )
}