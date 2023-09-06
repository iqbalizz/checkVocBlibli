import fetch from "node-fetch";
import readlineSync from "readline-sync";
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';

const getOauth = (inputNomer, inputPassword, userId, sessionId, requestId) => new Promise((resolve, reject) => {
    const dataString = `grant_type=password&username=${inputNomer}&password=${inputPassword}&client_id=d19b28e9-7c37-47e4-be4b-f6380cc78cce&client_secret=32ce46d4-c0fd-4234-86a0-65390e42ca2b`;
    fetch(`https://account.blibli.com/gdn-oauth/token`, {
        method: 'POST',
        headers: {
            // 'Host': 'account.blibli.com',
            // 'Accept': 'application/json',
            // 'X-Userid': '486b42a9-e900-4183-bfc7-420d4ac8dc3d',
            // 'X-Sessionid': '9b26459b-87a2-4302-87c7-dc0a65085487',
            // 'X-Requestid': 'a4cbcb62-3c3f-4ef1-bf1f-de1670aaa55a',
            // 'User-Agent': 'BlibliAndroid/10.3.1(6345) 486b42a9-e900-4183-bfc7-420d4ac8dc3d Dalvik/2.1.0 (Linux; U; Android 9; SM-G935FD Build/PI)',
            // 'Accept-Language': 'en',
            // 'Build-No': '6345',
            // 'Channelid': 'android',
            // 'Storeid': '10001',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // 'Content-Length': '159',
            // 'Accept-Encoding': 'gzip, deflate',
            // 'Connection': 'close'
            'Host': 'account.blibli.com',
            'Accept': 'application/json',
            'X-Userid': userId,
            'X-Sessionid': sessionId,
            'X-Requestid': requestId,
            'User-Agent': `BlibliAndroid/10.4.0(6367) ${userId} Dalvik/2.1.0 (Linux; U; Android 14; sdk_gphone64_x86_64 Build/UPB5.230623.003)`,
            'Accept-Language': 'en',
            'Build-No': '6367',
            'Channelid': 'android',
            'Storeid': '10001',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': '159',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'close'
        },
        body: dataString
    })
        .then(res => resolve(res.json()))
        .catch(error => reject(error))
});

const getOtpRequest = (token, userId, sessionId, requestId) => new Promise((resolve, reject) => {
    const dataString = `{"challenge":{"token":"${token}"},"type":"SMS"}`;
    fetch(`https://www.blibli.com/backend/common/users/_request-challenge-code`, {
        method: 'POST',
        headers: {
            'Host': 'www.blibli.com',
            // '@': 'ignore-auth',
            'Accept': 'application/json',
            'X-Userid': userId,
            'X-Sessionid': sessionId,
            'X-Requestid': requestId,
            'User-Agent': `BlibliAndroid/10.4.0(6367) ${userId} Dalvik/2.1.0 (Linux; U; Android 14; sdk_gphone64_x86_64 Build/UPB5.230623.003)`,
            'Accept-Language': 'en',
            'Build-No': '6367',
            'Channelid': 'android',
            'Storeid': '10001',
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': '75',
            'Accept-Encoding': 'gzip, deflate',
        },
        body: dataString
    })
        .then(res => resolve(res.json()))
        .catch(error => reject(error))
});

const getOuthToken = (token, inputCodeOTP, inputNomer, userId, sessionId, requestId) => new Promise((resolve, reject) => {
    const dataString = `challenge_token=${token}&grant_type=mfa_otp&challenge_code=${inputCodeOTP}&client_secret=32ce46d4-c0fd-4234-86a0-65390e42ca2b&client_id=d19b28e9-7c37-47e4-be4b-f6380cc78cce&username=${inputNomer}`;
    fetch(`https://account.blibli.com/gdn-oauth/token`, {
        method: 'POST',
        headers: {
            'Host': 'account.blibli.com',
            'Accept': 'application/json',
            'X-Userid': userId,
            'X-Sessionid': sessionId,
            'X-Requestid': requestId,
            'User-Agent': `BlibliAndroid/10.4.0(6367) ${userId} Dalvik/2.1.0 (Linux; U; Android 14; sdk_gphone64_x86_64 Build/UPB5.230623.003)`,
            'Accept-Language': 'en',
            'Build-No': '6367',
            'Channelid': 'android',
            'Storeid': '10001',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': '211',
            'Accept-Encoding': 'gzip, deflate',
        },
        body: dataString
    })
        .then(res => resolve(res.json()))
        .catch(error => reject(error))
});

(async () => {
    // Membuat UUIDv4 acak
    const userId = uuidv4();
    const sessionId = uuidv4();
    const requestId = uuidv4();

    // console.log("X-Userid:", userId);
    // console.log("X-Sessionid:", sessionId);
    // console.log("X-Requestid:", requestId);
    //!Input Uset
    const inputNomer = readlineSync.question(`[?] Masukkan nomer/Email : `);
    const inputPassword = readlineSync.question(`[?] Masukkan Password : `)
    //!Get Oauth
    const ouath = await getOauth(inputNomer, inputPassword, userId, sessionId, requestId);
    const error_description = ouath.error_description
    // console.log(ouath)
    if (error_description === 'login using new device is detected, please do challenge otp') {
        const token = ouath.data.challenge.token;
        console.log(`[!] Token kamu : ${token}`)
        const otpRequest = await getOtpRequest(token, userId, sessionId, requestId)
        console.log(otpRequest);
        const status = otpRequest.code;
        if (status === 200) {
            console.log(`[!] Kode OTP dikirimkan..`);
            const inputCodeOTP = readlineSync.question(`[?] Masukkan kode otp : `)
            const getTokenOuth = await getOuthToken(token, inputCodeOTP, inputNomer, userId, sessionId, requestId);
            // console.log(getTokenOuth)
            const tokenType = getTokenOuth.token_type;
            if (tokenType === 'bearer') {
                console.log(`[!] ${chalk.green(`Berhasil login account!`)}`);
                const accesToken = getTokenOuth.access_token;
                console.log(`[!] ${chalk.green(`Acces Token : ${accesToken}`)}`);
            } else {
                console.log(`[!] ${chalk.red(`Token is invalid.. OTP salah`)}`);
            }
        } else {
            console.log(`[!] ${chalk.red(`Gagal mengirimkan kode OTP!`)}`);
        }
    } else {
        console.log(`[!] ${chalk.red('Akun tidak tersedia..')}`);
    }
})();