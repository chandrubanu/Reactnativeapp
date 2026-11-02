
export const formatDateTime = (
    dateValue: string | Date | null | undefined,
    timeZone = 'Asia/Kolkata',
): string => {
    if (!dateValue) {
        return '- - -';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return '- - -';
    }

    return date
        .toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone,
        })
        .replace(/\//g, '-');
};

export const formatDate = (
    dateValue: string | Date | null | undefined,
    timeZone = 'Asia/Kolkata',
): string => {
    if (!dateValue) {
        return '- - -';
    }
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return '- - -';
    }
    return date
        .toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone,
        })
        .replace(/\//g, '-');
};

