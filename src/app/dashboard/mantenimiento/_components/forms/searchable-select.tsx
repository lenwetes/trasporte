"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

interface Option {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: Option[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    name?: string;
    className?: string;
    required?: boolean;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Seleccionar...",
    label,
    name,
    required,
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [internalValue, setInternalValue] = useState(value || "");
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const isControlled = value !== undefined;
    const selectedValue = isControlled ? value : internalValue;

    // Handle clicking outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Focus search input when opening
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const filteredOptions = useMemo(() => {
        return options.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [options, searchTerm]);

    const handleSelect = (optionValue: string) => {
        if (!isControlled) {
            setInternalValue(optionValue);
        }
        setIsOpen(false);
        setSearchTerm("");
        if (onChange) {
            onChange(optionValue);
        }
    };

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    const containerStyle = {
        position: "relative" as const,
        width: "100%",
        fontFamily: "sans-serif",
        marginBottom: "15px"
    };

    const labelStyle = {
        display: "block",
        fontSize: "12px",
        fontWeight: "bold",
        color: "#64748b",
        marginBottom: "6px"
    };

    const triggerStyle = {
        width: "100%",
        padding: "10px 12px",
        backgroundColor: "#fff",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        fontSize: "14px",
        textAlign: "left" as const
    };

    const dropdownStyle = {
        position: "absolute" as const,
        top: "100%",
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        marginTop: "4px",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        zIndex: 50,
        maxHeight: "250px",
        overflowY: "auto" as const
    };

    return (
        <div ref={containerRef} style={containerStyle}>
            {label && <label style={labelStyle}>{label}</label>}
            
            <input
                type="hidden"
                name={name}
                value={selectedValue}
                required={required}
            />

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={triggerStyle}
            >
                <span style={{ color: selectedOption ? "#0f172a" : "#94a3b8" }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={16} />
            </button>

            {isOpen && (
                <div style={dropdownStyle}>
                    <div style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", position: "sticky", top: 0, backgroundColor: "#fff" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 8px", backgroundColor: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                            <Search size={14} style={{ color: "#94a3b8" }} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ 
                                    border: "none", 
                                    backgroundColor: "transparent", 
                                    fontSize: "13px", 
                                    outline: "none",
                                    width: "100%",
                                    padding: "4px 0"
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ padding: "4px" }}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    style={{ 
                                        width: "100%",
                                        padding: "8px 12px",
                                        textAlign: "left",
                                        border: "none",
                                        backgroundColor: selectedValue === option.value ? "#f1f5f9" : "transparent",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <span>{option.label}</span>
                                    {selectedValue === option.value && <Check size={14} style={{ color: "#0f172a" }} />}
                                </button>
                            ))
                        ) : (
                            <div style={{ padding: "12px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                                No se encontraron resultados
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

