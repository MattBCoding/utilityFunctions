import deriveKeyFromPassword from "./deriveKeyFromPassword";
import wrapKeyWithKey from "./wrapKeyWithKey";


async function wrapKeyWithPassword(password, keyToWrap, salt, iv) {
    let wrappingKey = await deriveKeyFromPassword(password, salt);
    // get the wrapped key
    try {
        let wrapKey = await wrapKeyWithKey(keyToWrap, wrappingKey, iv);

        return wrapKey;

    } catch (e) {
        console.error("error in wrapKey within wrapKeyWithPassword : ", e);
    }

}

export default wrapKeyWithPassword;