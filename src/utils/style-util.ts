/**
 * Merges a primary element style and incoming styles
 * 
 * @param primaryStyle The main style to apply. These values are final
 * @param otherStyle The other style to apply. These values may be overwritten by <code>primaryStyle</code>
 */
//TODO untested
export function mergeStyles(primaryStyle: { [x: string]: any }, otherStyle: { [x: string]: any }) {
    return Object.assign({}, otherStyle, primaryStyle);
}

/**
 * Merges together class names while filtering out falsy values
 * 
 * @param classes The list of classes
 */
export function mergeClasses(classes: (string | null | undefined)[]) {
    return classes.filter(it => !!it).join(' ');
}