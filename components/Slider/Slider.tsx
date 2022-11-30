import React, {useState, useMemo, useRef, useCallback, useEffect} from "react";
import styles from './Slider.module.scss';

enum Key {
    Up = 'ArrowUp',
    Right = 'ArrowRight',
    Down = 'ArrowDown',
    Left = 'ArrowLeft',
}

export type SliderProps = Readonly<{
    valueMin?: number;
    valueMax?: number;
    initialValue?: number;
    onChange: (value: number) => void;
}>

const clamp = (value: number) => {
    if (value < 0) return 0;
    if (value > 100) return 100;
    return Number(value.toFixed(2));
}

const STEP = 5;

export const Slider = ({
   valueMin = 0,
   valueMax = 100,
   initialValue = 0,
   onChange,
}: SliderProps) => {
    const sliderRef = useRef<HTMLSpanElement>(null);
    const [value, setValue] = useState(initialValue);
    const [percentage, setPercentage] = useState((value - valueMin) * 100 / (valueMax - valueMin));

    useEffect(() => {
        setValue(Math.round(valueMin + percentage * (valueMax - valueMin) / 100));
    }, [percentage]);

    useEffect(() => {
        onChange(value);
    }, [value]);

    const handlePointerMove = (event: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => {
        if (sliderRef.current) {
            const {width, x} = sliderRef.current.getBoundingClientRect();
            const touch = 'changedTouches' in event
                ? event.changedTouches[0].clientX
                : event.clientX;
            setPercentage(clamp((touch - x) * 100 / width));
        }
    }

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handlePointerMove);
    }

    const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handlePointerMove);
    }

    const handleMouseDown = (event: React.MouseEvent) => {
        handlePointerMove(event);
        document.addEventListener('mousemove', handlePointerMove);
        document.addEventListener('mouseup', handleMouseUp, {once: true});
    }

    const handleTouchStart = (event: React.TouchEvent) => {
        handlePointerMove(event);
        document.addEventListener('touchmove', handlePointerMove);
        document.addEventListener('touchend', handleTouchEnd, {once: true});
    }

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        switch (true) {
            case event.key === Key.Left || event.key === Key.Down:
                setPercentage(value => clamp(value - STEP));
                break;
            case event.key === Key.Right || event.key === Key.Up:
                setPercentage(value => clamp(value + STEP));
        }
    }, []);

    const handleOnFocus = () => {
        if (sliderRef.current) {
            sliderRef.current.addEventListener('keydown', handleKeyDown);
        }
    }

    const trackBackgroundImage = useMemo(() => ({
        backgroundImage: `linear-gradient(to right, currentColor 0%, currentColor ${percentage}%, transparent ${percentage}%)`
    }), [value]);

    const thumbPosition = useMemo(() => ({
        left: `${percentage}%`
    }), [value]);

    return (
        <span
            ref={sliderRef}
            role="slider"
            className={styles.base}
            tabIndex={0}
            aria-orientation={'horizontal'}
            aria-valuemin={0}
            aria-valuemax={valueMax}
            aria-valuenow={value}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onFocus={handleOnFocus}
        >
            <span
                className={styles.track}
                style={trackBackgroundImage}
            ></span>
            <span
                className={styles.thumb}
                style={thumbPosition}
            ></span>
        </span>
    )
}
