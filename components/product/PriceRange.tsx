import { useState, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import DualRangeSlider from './DualRangSlider';

// Debounce hook
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

type PriceRangeFilterProps = {
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    setCurrentPage: (page: number) => void;
    isMobile: boolean;
    expandedSections: { [key: string]: boolean };
    toggleSection: (section: "brands" | "price") => void;
};

const PriceRangeFilter = ({
    priceRange,
    setPriceRange,
    setCurrentPage,
    isMobile,
    expandedSections,
    toggleSection
}: PriceRangeFilterProps) => {
    const [localPriceRange, setLocalPriceRange] = useState(priceRange);
    const [isSliderActive, setIsSliderActive] = useState(false);
    const [minInput, setMinInput] = useState(priceRange[0].toString());
    const [maxInput, setMaxInput] = useState(priceRange[1].toString());

    // Debounce the local price range changes
    const debouncedPriceRange = useDebounce(localPriceRange, 300);

    // Update parent state when debounced value changes and slider is not active
    useEffect(() => {
        if (!isSliderActive && (debouncedPriceRange[0] !== priceRange[0] || debouncedPriceRange[1] !== priceRange[1])) {
            setPriceRange(debouncedPriceRange);
            setCurrentPage(1);
        }
    }, [debouncedPriceRange, isSliderActive, priceRange, setPriceRange, setCurrentPage]);

    // Handle slider value change (immediate visual feedback)
    const handleSliderChange = useCallback((value: [number, number]) => {
        setLocalPriceRange(value);
        setMinInput(value[0].toString());
        setMaxInput(value[1].toString());
    }, []);

    // Handle mouse/touch events for slider
    const handleSliderPointerDown = useCallback(() => {
        setIsSliderActive(true);
    }, []);

    const handleSliderPointerUp = useCallback(() => {
        setIsSliderActive(false);
        // Immediately update parent state when user releases
        setPriceRange(localPriceRange);
        setCurrentPage(1);
    }, [localPriceRange, setPriceRange, setCurrentPage]);

    // Handle input changes
    const handleMinInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMinInput(value);

        const numValue = parseInt(value) || 0;
        if (numValue >= 0 && numValue <= localPriceRange[1]) {
            setLocalPriceRange([numValue, localPriceRange[1]]);
        }
    }, [localPriceRange]);

    const handleMaxInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMaxInput(value);

        const numValue = parseInt(value) || 50000;
        if (numValue >= localPriceRange[0] && numValue <= 50000) {
            setLocalPriceRange([localPriceRange[0], numValue]);
        }
    }, [localPriceRange]);

    // Handle input blur (apply changes)
    const handleInputBlur = useCallback(() => {
        const minVal = Math.max(0, parseInt(minInput) || 0);
        const maxVal = Math.min(50000, parseInt(maxInput) || 50000);

        // Ensure min <= max
        const validMin = Math.min(minVal, maxVal);
        const validMax = Math.max(minVal, maxVal);

        setLocalPriceRange([validMin, validMax]);
        setMinInput(validMin.toString());
        setMaxInput(validMax.toString());
        setPriceRange([validMin, validMax]);
        setCurrentPage(1);
    }, [minInput, maxInput, setPriceRange, setCurrentPage]);

    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('En-Us', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value).replace('BDT', '৳');
    };

    return (
        <div className="space-y-3">
            <Collapsible
                open={isMobile ? expandedSections.price : true}
                onOpenChange={() => isMobile && toggleSection('price')}
            >
                <CollapsibleTrigger
                    className={`flex items-center justify-between w-full ${isMobile ? 'py-2' : ''}`}
                >
                    <h3 className="font-semibold text-sm uppercase tracking-wider">
                        Price Range
                    </h3>
                    {isMobile && (
                        <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${expandedSections.price ? 'rotate-180' : ''
                                }`}
                        />
                    )}
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-4">
                    <div className={`space-y-6 ${isMobile ? 'mt-2' : ''}`}>
                        {/* Input Fields */}
                        <div className="gap-3 grid grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="min-price" className="text-muted-foreground text-xs">
                                    Minimum
                                </Label>
                                <div className="relative">
                                    <span className="top-1/2 left-3 absolute text-muted-foreground text-sm -translate-y-1/2">
                                        ৳
                                    </span>
                                    <Input
                                        id="min-price"
                                        type="number"
                                        value={minInput}
                                        onChange={handleMinInputChange}
                                        onBlur={handleInputBlur}
                                        onKeyDown={(e) => e.key === 'Enter' && handleInputBlur()}
                                        className="pl-7 text-sm"
                                        min="0"
                                        max="50000"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max-price" className="text-muted-foreground text-xs">
                                    Maximum
                                </Label>
                                <div className="relative">
                                    <span className="top-1/2 left-3 absolute text-muted-foreground text-sm -translate-y-1/2">
                                        ৳
                                    </span>
                                    <Input
                                        id="max-price"
                                        type="number"
                                        value={maxInput}
                                        onChange={handleMaxInputChange}
                                        onBlur={handleInputBlur}
                                        onKeyDown={(e) => e.key === 'Enter' && handleInputBlur()}
                                        className="pl-7 text-sm"
                                        min="0"
                                        max="50000"
                                        placeholder="50000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Slider */}
                        <div className="space-y-3">
                            <DualRangeSlider
                                min={0}
                                max={50000}
                                value={localPriceRange}
                                step={1000}
                                onChange={handleSliderChange}
                                onPointerDown={handleSliderPointerDown}
                                onPointerUp={handleSliderPointerUp}
                                className="w-full"
                                formatLabel={formatCurrency}
                            />

                            {/* Range Display */}
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">
                                    {formatCurrency(localPriceRange[0])}
                                </span>
                                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                    {isSliderActive && (
                                        <span className="animate-pulse">●</span>
                                    )}
                                    <span>to</span>
                                </div>
                                <span className="text-muted-foreground">
                                    {formatCurrency(localPriceRange[1])}
                                </span>
                            </div>
                        </div>

                        {/* Quick Preset Buttons */}
                        <div className="gap-2 grid grid-cols-3">
                            {[
                                { label: 'Under 5K', range: [0, 5000] },
                                { label: '5K-20K', range: [5000, 20000] },
                                { label: '20K+', range: [20000, 50000] },
                            ].map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => {
                                        setLocalPriceRange(preset.range as [number, number]);
                                        setMinInput(preset.range[0].toString());
                                        setMaxInput(preset.range[1].toString());
                                        setPriceRange(preset.range as [number, number]);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-3 py-2 text-xs rounded-md border transition-colors ${localPriceRange[0] === preset.range[0] && localPriceRange[1] === preset.range[1]
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background hover:bg-muted border-border'
                                        }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default PriceRangeFilter;