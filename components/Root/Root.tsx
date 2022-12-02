import React, { useState } from 'react';
import styles from './Root.module.scss';
import { Slider } from '../Slider/Slider';

export const Root = () => {
    const [value, setValue] = useState(0);
    
    const handleSetValue = (value: number) => {
        console.log(value);
        setValue(value);
    };

    return (
        <div className={styles.base}>
            <Slider min={0} max={100} value={value} onChange={handleSetValue} />
        </div>
    );
};
