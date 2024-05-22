export const getLocalTime = (timestamp: string | number | undefined | null): string => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "numeric", hour12: true };
    const newTimeString = date.toLocaleTimeString("en-US", options);
    return newTimeString;
};
