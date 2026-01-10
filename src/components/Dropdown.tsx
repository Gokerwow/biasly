import { useState } from 'react';

export default function CustomSelect() {
    const [selectedOption, setSelectedOption] = useState('all');
    const [isOpen, setIsOpen] = useState(false);

    const options = [
        { id: 'all', label: 'All' },
        { id: 'option-1', label: 'option-1' },
        { id: 'option-2', label: 'option-2' },
        { id: 'option-3', label: 'option-3' }
    ];

    const getSelectedLabel = () => {
        return options.find(opt => opt.id === selectedOption)?.label || 'All';
    };

    const handleOptionClick = (id) => {
        setSelectedOption(id);
        setIsOpen(false);
    };

    return (
        <div
            className="w-fit cursor-pointer relative text-white  rounded-[5px]"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Selected (Header) */}
            <div className="bg-kpop-pink p-[5px] rounded-[5px] relative z-[10] text-[15px] flex items-center justify-between min-w-[150px]">
                <span>{getSelectedLabel()}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 512 512"
                    className={`h-[10px] w-[25px] fill-white transition-transform duration-300 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
                >
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
                </svg>
            </div>

            {/* Options (Dropdown) */}
            <div
                className={`absolute left-0 w-full flex flex-col rounded-[5px] p-[5px] bg-kpop-pink transition-all duration-300 z-[20] mt-[3px] origin-top ${
                    isOpen 
                    ? 'opacity-100 scale-y-100 translate-y-0 visible' 
                    : 'opacity-0 scale-y-75 -translate-y-2 invisible'
                }`}
            >
                {options.map((option) => (
                    selectedOption !== option.id && (
                        <div key={option.id} title={option.label}>
                            <input
                                id={option.id}
                                name="option"
                                type="radio"
                                checked={selectedOption === option.id}
                                onChange={() => handleOptionClick(option.id)}
                                className="hidden"
                            />
                            <label
                                htmlFor={option.id}
                                onClick={() => handleOptionClick(option.id)}
                                className="block rounded-[5px] p-[5px] transition-all duration-300 bg-kpop-pink text-[15px] hover:bg-kpop-pink-hover cursor-pointer"
                            >
                                {option.label}
                            </label>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}