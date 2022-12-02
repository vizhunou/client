import React, { useCallback, useState } from 'react';
import styles from './Root.module.scss';
import { Slider } from '../Slider/Slider';

export const Root = () => {
    const [value, setValue] = useState(14);
    
    const handleSetValue = useCallback((value: number) => {
        console.log(value);
        setValue(value);
    }, []);

    return (
        <div className={styles.base}>
            <Slider min={13} max={23} value={value} onChange={handleSetValue} />
        </div>
    );
};
