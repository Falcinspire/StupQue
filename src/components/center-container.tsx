import { makeStyles } from '@material-ui/core';
import React from 'react';
import { mergeClasses } from '../utils/style-util';

const useStyles = makeStyles({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fillParentWidth: {
        width: '100%'
    },
    fillParentHeight: {
        height: '100%'
    }
});

/**
 * A simple container that fills its parent and aligns
 * its child to its center
 * 
 * @param props.children The element to be put in the container
 * @param props.contentFillWidth Whether the element in the center of the container should expand to fill the parent's width
 */
const CenterContainer = (props: { children: JSX.Element, contentFillWidth?: boolean, [x: string]: any }) => {
    const { children, contentFillWidth, className, ...inheritedProps } = props;
    const classes = useStyles();
    return (
        <div className={mergeClasses([
                        classes.container,  
                        className
                ])} {...inheritedProps}>
            <div className={mergeClasses([contentFillWidth ? classes.fillParentWidth : undefined])}>
                { props.children }
            </div>
        </div>
    );
};

export default CenterContainer;