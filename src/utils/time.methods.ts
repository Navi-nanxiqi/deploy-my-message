import { randomUUID } from "crypto";
export const CompareTime = (time1: Date, time2: Date) => {
    return time1 < time2 ? true : false;
}

export const TransTime = (time, delay) => {
    var data = new Date(Date.parse(time) + delay)
    return data;
}

export function formatWithTimezone(date: Date, tz: string): string {
    // tz like '+08:00' or '-05:00'
    const m = /^([+-])(\d{2}):(\d{2})$/.exec(tz ?? '+00:00');
    const sign = m ? (m[1] === '-' ? -1 : 1) : 1;
    const hours = m ? parseInt(m[2], 10) : 0;
    const minutes = m ? parseInt(m[3], 10) : 0;
    const offsetMs = sign * (hours * 60 + minutes) * 60 * 1000;
    const shifted = new Date(date.getTime() + offsetMs);
    // ISO string without timezone conversion; then append tz
    return shifted.toISOString().replace('Z', tz);
}