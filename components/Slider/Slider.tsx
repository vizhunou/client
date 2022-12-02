import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './Slider.module.scss';

enum Key {
    Up = 'ArrowUp',
    Right = 'ArrowRight',
    Down = 'ArrowDown',
    Left = 'ArrowLeft',
}

export type SliderProps = Readonly<{
    value: number;
    onChange: (value: number) => void;
}>

const clamp = (value: number) => {
    if (value < 0) return 0;
    if (value > 100) return 100;
    return Math.round(value);
};

export const Slider = ({ value, onChange }: SliderProps) => {
    const sliderRef = useRef<HTMLSpanElement>(null);
    const [_value, setValue] = useState(value);

    useEffect(() => {
        onChange(_value);
    }, [_value, onChange]);

    const handleMouseMove = (event: React.MouseEvent | MouseEvent) => {
        if (sliderRef.current) {
            const { width, x } = sliderRef.current.getBoundingClientRect();
            setValue(clamp((event.clientX - x) * 100 / width));
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
                setValue(value => clamp(value - 1));
                break;
            case event.key === Key.Right || event.key === Key.Up:
                setValue(value => clamp(value + 1));
        }
    }, []);

    const handleOnFocus = () => {
        if (sliderRef.current) {
            sliderRef.current.addEventListener('keydown', handleKeyDown);
        }
    };

    const trackStyle = {
        backgroundImage: `linear-gradient(to right, currentColor 0%, currentColor ${value}%, transparent ${value}%)`
    };

    const thumbStyle = {
        left: `${value}%`
    };

    return (
        <span
            ref={sliderRef}
            role="slider"
            className={styles.base}
            tabIndex={0}
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={100}
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
