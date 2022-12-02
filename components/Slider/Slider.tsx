import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './Slider.module.scss';

enum Key {
    Up = 'ArrowUp',
    Right = 'ArrowRight',
    Down = 'ArrowDown',
    Left = 'ArrowLeft',
}

export type SliderProps = Readonly<{
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
}>

const clamp = (value: number) => {
    if (value < 0) return 0;
    if (value > 100) return 100;
    return Math.round(value);
};

export const Slider = ({ min, max, value, onChange }: SliderProps) => {
    const sliderRef = useRef<HTMLSpanElement>(null);
    const [percentage, setPercentage] = useState((value - min) * 100 / (max - min));
    const STEP = (max - min) / 100;

    useEffect(() => {
        onChange(Math.round(percentage * 100 / (max - min)));
    }, [percentage, max, min, onChange]);

    const handleMouseMove = (event: React.MouseEvent | MouseEvent) => {
        if (sliderRef.current) {
            const { width, x } = sliderRef.current.getBoundingClientRect();
            setPercentage(clamp((event.clientX - x) * 100 / width));
        }
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
    };

    const handleMouseDown = (event: React.MouseEvent) => {
        handleMouseMove(event);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp, { once: true });
    };

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        switch (true) {
            case event.key === Key.Left || event.key === Key.Down:
                setPercentage(value => clamp(value - STEP));
                break;
            case event.key === Key.Right || event.key === Key.Up:
                setPercentage(value => clamp(value + STEP));
        }
    }, [STEP]);

    const handleOnFocus = () => {
        if (sliderRef.current) {
            sliderRef.current.addEventListener('keydown', handleKeyDown);
        }
    };

    const trackStyle = {
        backgroundImage: `linear-gradient(to right, currentColor 0%, currentColor ${percentage}%, transparent ${percentage}%)`
    };

    const thumbStyle = {
        left: `${percentage}%`
    };

    return (
        <span
            ref={sliderRef}
            role="slider"
            className={styles.base}
            tabIndex={0}
            aria-orientation="horizontal"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            onMouseDown={handleMouseDown}
            onFocus={handleOnFocus}
        >
            <span
                className={styles.track}
                style={trackStyle}
            ></span>
            <span
                className={styles.thumb}
                style={thumbStyle}
            ></span>
        </span>
    );
};
