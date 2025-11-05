export const computeHours = (inTime?: string, outTime?: string) => {
        if (!inTime || !outTime) return "";
        try {
            const [inHour, inMinute] = inTime.split(":").map(Number);
            const [outHour, outMinute] = outTime.split(":").map(Number);
            let start = inHour * 60 + inMinute;
            let end = outHour * 60 + outMinute;
            if (end < start) end += 24 * 60;
            const mins = end - start;
            const hours = Math.floor(mins / 60);
            const minutes = mins % 60;
            return `${hours}:${minutes.toString().padStart(2, "0")}`;
        } catch {
            return "";
        }
    };