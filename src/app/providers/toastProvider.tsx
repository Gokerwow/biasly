'use client'

import CustomToaster from "@/components/UI/toaster";
import { createContext, useContext } from "react"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type ToastContextType = {
    showToast: (message: string, type: 'info' | 'success' | 'warning' | 'error' | 'default') => void
};

const ToastContext = createContext<ToastContextType | null>(null)

export default function ToastProvider({ children }: { children: React.ReactNode }) {
    const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' | 'default') => {

        toast(<CustomToaster>{message}</CustomToaster>, {
            type: type,
            className: '!bg-transparent !p-0 !shadow-none', // Remove default styles
            bodyClassName: '!p-0',
            icon: false, // Disable default icon
            closeButton: false,

        });
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                closeButton={false}
            />
            {children}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)
    if (context === undefined || context === null) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context
}