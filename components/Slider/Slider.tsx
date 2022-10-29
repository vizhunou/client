import React, {useState, useMemo, useRef, useCallback} from "react";
import {SliderProps} from "./types";
import styles from './Slider.module.scss';

enum Key {
    Up = 'ArrowUp',
    Right = 'ArrowRight',
    Down = 'ArrowDown',
    Left = 'ArrowLeft',
}

const keepShiftInRange = (value: number) => value < 0 ? 0 : value > 100 ? 100 : Number(value.toFixed(2));

const Slider = ({ valueMax }: SliderProps) => {
    const STEP = 5;

    const sliderRef = useRef<HTMLSpanElement>(null);

    const [shift, setShift] = useState(0);

    const handleSetShift = (value: number) => {
        setShift(keepShiftInRange(value));
    }

    const handlePointerMove = (event: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => {
        if (sliderRef.current) {
            const { width, x } = sliderRef.current.getBoundingClientRect();
            const touch = 'changedTouches' in event
                ? event.changedTouches[0].clientX
                : event.clientX;
            const value = (touch - x) * 100 / width;
            handleSetShift(value);
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
        document.addEventListener('mouseup', handleMouseUp, { once: true });
    }

    const handleTouchStart = (event: React.TouchEvent) => {
        handlePointerMove(event);
        document.addEventListener('touchmove', handlePointerMove);
        document.addEventListener('touchend', handleTouchEnd, { once: true });
    }

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        switch (true) {
            case event.key === Key.Left || event.key === Key.Down:
                setShift(shift => keepShiftInRange(shift - STEP));
                break;
            case event.key === Key.Right || event.key === Key.Up:
                setShift(shift => keepShiftInRange(shift + STEP));
        }
    }, []);

    const handleOnFocus = () => {
        if (sliderRef.current) {
            sliderRef.current.addEventListener('keydown', handleKeyDown);
        }
    }

    const trackBackgroundImage = useMemo(() => ({
        backgroundImage: `linear-gradient(to right, currentColor 0%, currentColor ${shift}%, transparent ${shift}%)`
    }), [shift]);

    const thumbPosition = useMemo(() => ({
        left: `${shift}%`
    }), [shift]);

    const valueNow = useMemo(() => Math.round(shift * valueMax / 100), [shift]);

    return (
        <span
            ref={sliderRef}
            role="slider"
            className={styles.base}
            tabIndex={0}
            aria-orientation={'horizontal'}
            aria-valuemin={0}
            aria-valuemax={valueMax}
            aria-valuenow={valueNow}
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

export default Slider;
