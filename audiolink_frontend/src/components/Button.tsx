import React from 'react';

type ButtonVariant = 'artist' | 'producer' | 'outline' | 'ghost' | 'error';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = ({
    children,
    variant = 'artist',
    size = 'md',
    isLoading,
    fullWidth,
    leftIcon,
    rightIcon,
    className = "",
    ...props
}: ButtonProps) => {

    const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        artist: "bg-artist hover:bg-artist/90 text-white shadow-lg shadow-artist/10",
        producer: "bg-producer hover:bg-producer/90 text-black shadow-lg shadow-producer/10",
        outline: "border-2 border-gray-light text-light hover:bg-gray-light/10",
        ghost: "text-subtitle hover:text-light hover:bg-gray-light/5",
        error: "bg-error/10 text-error hover:bg-error hover:text-white"
    };

    const sizes = {
        sm: "px-4 py-2 text-[10px] rounded-lg",
        md: "px-6 py-3 text-xs rounded-xl",
        lg: "px-10 py-4 text-sm rounded-xl",
        xl: "px-12 py-5 text-base rounded-2xl"
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : leftIcon && (
                <span className="mr-2">{leftIcon}</span>
            )}

            {children}

            {!isLoading && rightIcon && (
                <span className="ml-2">{rightIcon}</span>
            )}
        </button>
    );
};

export default Button;