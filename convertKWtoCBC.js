import exportCryptoKey from "./exportCryptoKey.js";

async function convertKWToCBC(keyToConvert) {
    // export the key to be converted into JWK format
    let jwkTestKW = await exportCryptoKey(keyToConvert);
    // import a key using the JWK values, but specify the algorithm as AES-CBC
    let testImportedKWAsCBC = await window.crypto.subtle.importKey(
        "jwk",
        {
            kty: jwkTestKW.kty,
            k: jwkTestKW.k,
            alg: "A256CBC",
            ext: true,
        },
        {
            name: "AES-CBC"
        },
        true,
        ["encrypt", "decrypt"]
    );
    // return the imported key as a cryptokey object
    return testImportedKWAsCBC;
}

export default convertKWToCBC;