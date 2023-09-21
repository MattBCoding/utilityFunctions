import { Temporal } from '@js-temporal/polyfill';

export default function generateTimestamp() {
    console.log("generateTimestamp.js: generateTimestamp() called")
    const now = Temporal.Now.instant();
    const timestamp = now.toString();
    console.log("generateTimestamp.js: timestamp: ", timestamp)

    return timestamp;
}