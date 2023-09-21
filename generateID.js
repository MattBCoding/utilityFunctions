function generateID() {
    let guid = window.crypto.randomUUID();
    let m = guid.substring(19, 36);
    let n = m.replace("-", "");
    return n;
}

export default generateID;
