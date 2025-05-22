import React, { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    }

    const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white rounded-[20px] border border-green-300 shadow-lg w-[700px] p-14 relative">
            <button
            onClick={onClose}
            className="absolute top-4 right-4 text-green-500 text-2xl font-bold"
            aria-label="Close modal"
            >
            ×
            </button>
            {children}
        </div>
        </div>
    );
};

export default Modal;
