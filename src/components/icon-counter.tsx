import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    enabled: {
        color: 'black'
    },
    disabled: {
        color: 'gray'
    }
})

const IconCounter = (props: { children: JSX.Element, value: number, onClick: () => void, disabled?: boolean, [x: string]: any }) => {
    const { children, value, onClick, disabled, ...inheritedProps } = props;
    const classes = useStyles();
    return (
        <div>
            <IconButton onClick={onClick} disabled={disabled} {...inheritedProps}>
                { children }
              </IconButton>
              <span className={disabled ? classes.disabled : classes.enabled}>{value}</span>
        </div>
    )
};

export default IconCounter;