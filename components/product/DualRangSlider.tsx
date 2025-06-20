// components/DualRangeSlider.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface DualRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  step?: number;
  onChange: (value: [number, number]) => void;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
  className?: string;
  formatLabel?: (value: number) => string;
  disabled?: boolean;
}

const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  min,
  max,
  value,
  step = 1,
  onChange,
  onPointerDown,
  onPointerUp,
  className = "",
  formatLabel,
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const minThumbRef = useRef<HTMLDivElement>(null);
  const maxThumbRef = useRef<HTMLDivElement>(null);

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;
  
  const getValueFromPercentage = (percentage: number) => {
    const rawValue = min + (percentage / 100) * (max - min);
    return Math.round(rawValue / step) * step;
  };

  const handleMouseDown = useCallback((type: 'min' | 'max') => (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(type);
    onPointerDown?.();
  }, [disabled, onPointerDown]);

  const handleTouchStart = useCallback((type: 'min' | 'max') => (e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(type);
    onPointerDown?.();
  }, [disabled, onPointerDown]);

  const updateValue = useCallback((clientX: number) => {
    if (!sliderRef.current || !isDragging) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const newValue = getValueFromPercentage(percentage);

    if (isDragging === 'min') {
      const newMin = Math.min(newValue, value[1] - step);
      onChange([Math.max(min, newMin), value[1]]);
    } else {
      const newMax = Math.max(newValue, value[0] + step);
      onChange([value[0], Math.min(max, newMax)]);
    }
  }, [isDragging, value, min, max, step, onChange]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    updateValue(e.clientX);
  }, [updateValue]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      updateValue(e.touches[0].clientX);
    }
  }, [updateValue]);

  const handleEnd = useCallback(() => {
    setIsDragging(null);
    onPointerUp?.();
  }, [onPointerUp]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

  const minPercentage = getPercentage(value[0]);
  const maxPercentage = getPercentage(value[1]);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Track */}
      <div
        ref={sliderRef}
        className="relative bg-gray-200 rounded-full h-2 cursor-pointer"
        onClick={(e) => {
          if (disabled || isDragging) return;
          
          const rect = e.currentTarget.getBoundingClientRect();
          const percentage = ((e.clientX - rect.left) / rect.width) * 100;
          const clickValue = getValueFromPercentage(percentage);
          
          // Determine which thumb to move based on proximity
          const distanceToMin = Math.abs(clickValue - value[0]);
          const distanceToMax = Math.abs(clickValue - value[1]);
          
          if (distanceToMin < distanceToMax) {
            onChange([Math.max(min, Math.min(clickValue, value[1] - step)), value[1]]);
          } else {
            onChange([value[0], Math.min(max, Math.max(clickValue, value[0] + step))]);
          }
        }}
      >
        {/* Active range */}
        <div
          className="absolute bg-primary-500 rounded-full h-full"
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
          }}
        />
        
        {/* Min thumb */}
        <div
          ref={minThumbRef}
          className={`absolute top-1/2 w-5 h-5 bg-white border-2 border-primary-500 rounded-full cursor-grab transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 hover:scale-110 ${
            isDragging === 'min' ? 'cursor-grabbing scale-110 shadow-lg' : ''
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          style={{ left: `${minPercentage}%` }}
          onMouseDown={handleMouseDown('min')}
          onTouchStart={handleTouchStart('min')}
          role="slider"
          aria-label="Minimum value"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value[0]}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (disabled) return;
            let newValue = value[0];
            
            switch (e.key) {
              case 'ArrowLeft':
              case 'ArrowDown':
                newValue = Math.max(min, value[0] - step);
                break;
              case 'ArrowRight':
              case 'ArrowUp':
                newValue = Math.min(value[1] - step, value[0] + step);
                break;
              case 'Home':
                newValue = min;
                break;
              case 'End':
                newValue = value[1] - step;
                break;
              default:
                return;
            }
            
            e.preventDefault();
            onChange([newValue, value[1]]);
          }}
        />
        
        {/* Max thumb */}
        <div
          ref={maxThumbRef}
          className={`absolute top-1/2 w-5 h-5 bg-white border-2 border-primary-500 rounded-full cursor-grab transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 hover:scale-110 ${
            isDragging === 'max' ? 'cursor-grabbing scale-110 shadow-lg' : ''
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          style={{ left: `${maxPercentage}%` }}
          onMouseDown={handleMouseDown('max')}
          onTouchStart={handleTouchStart('max')}
          role="slider"
          aria-label="Maximum value"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value[1]}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (disabled) return;
            let newValue = value[1];
            
            switch (e.key) {
              case 'ArrowLeft':
              case 'ArrowDown':
                newValue = Math.max(value[0] + step, value[1] - step);
                break;
              case 'ArrowRight':
              case 'ArrowUp':
                newValue = Math.min(max, value[1] + step);
                break;
              case 'Home':
                newValue = value[0] + step;
                break;
              case 'End':
                newValue = max;
                break;
              default:
                return;
            }
            
            e.preventDefault();
            onChange([value[0], newValue]);
          }}
        />
      </div>
      
      {/* Value labels (optional) */}
      
    </div>
  );
};

export default DualRangeSlider;