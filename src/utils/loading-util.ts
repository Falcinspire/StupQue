/**
 * Utility function for forcing stalls
 * 
 * @param seconds The number of seconds to stall 
 */
export async function sleep(seconds: number) {
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));
}