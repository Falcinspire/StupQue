import { Typography } from "@material-ui/core";

/**
 * Renders a text with newlines as a series of text html elements
 */
export function renderTextWithNewlines(text: string): JSX.Element[] {
    return text
        .split('\n')
        .map((it, idx) => (<Typography key={idx} variant="body1">{it}</Typography>));
}