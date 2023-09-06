import { v4 as uuidv4 } from "uuid";

function generateUserAgent(appVersion, buildNumber, osVersion, deviceModel) {
    const userId = uuidv4();
    const sessionUserAgent = `BlibliAndroid/${appVersion}(${buildNumber}) ${userId} Dalvik/2.1.0 (Linux; U; ${osVersion}; ${deviceModel} Build/PI)`;
    return sessionUserAgent;
}

export { generateUserAgent as userAgent }