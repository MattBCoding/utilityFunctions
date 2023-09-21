import { Temporal } from '@js-temporal/polyfill';

export default function generateTimestamp() {
    const now = Temporal.Now.instant();
    const timestamp = now.toString();

    return timestamp;
}