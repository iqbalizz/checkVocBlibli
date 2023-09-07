import fetch from "node-fetch";
import readlineSync from "readline-sync";
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import { banner1, banner2 } from "./utils/banner.js";

const getOauth = (inputNomer, inputPassword, userId, sessionId, requestId) => new Promise((resolve, reject) => {
    const dataString = `grant_type=password&username=${inputNomer}&password=${inputPassword}&client_id=d19b28e9-7c37-47e4-be4b-f6380cc78cce&client_secret=32ce46d4-c0fd-4234-86a0-65390e42ca2b`;
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
            'Content-Length': '159',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'close'
        },
        body: dataString
    })
        .then(res => resolve(res.json()))
        .catch(error => reject(error))
});

const getOtpRequest = (token, sendOTP, userId, sessionId, requestId) => new Promise((resolve, reject) => {
    const dataString = `{"challenge":{"token":"${token}"},"type":"${sendOTP}"}`;
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

const getAccountData = (userId, sessionId, requestId, accesToken, inputNomer) => new Promise((resolve, reject) => {
    fetch(`https://www.blibli.com/backend/mobile/member/account-data?isHomePageLiteConfigured=false`, {
        headers: {
            'Host': 'www.blibli.com',
            'Accept': 'application/json',
            'X-Userid': userId,
            'X-Sessionid': sessionId,
            'X-Requestid': requestId,
            'User-Agent': `BlibliAndroid/10.4.0(6367) ${userId} Dalvik/2.1.0 (Linux; U; Android 14; sdk_gphone64_x86_64 Build/UPB5.230623.003)`,
            'Accept-Language': 'en',
            'Build-No': '6367',
            'Content-Type': 'application/json; charset=UTF-8',
            'Channelid': 'android',
            'Storeid': '10001',
            'Authorization': `bearer ${accesToken}`,
            'X-Blibli-User-Email': inputNomer,
            'Accept-Encoding': 'gzip, deflate'
        }
    })
        .then(res => resolve(res.json()))
        .catch(error => reject(error))
});

const getCheckVoucher = (userId, sessionId, requestId, accesToken, email) => new Promise((resolve, reject) => {
    fetch(`https://www.blibli.com/backend/member-voucher/vouchers?origin=BLIBLI&itemPerPage=25`, {
        headers: {
            'Host': 'www.blibli.com',
            'Accept': 'application/json',
            'X-Userid': userId,
            'X-Sessionid': sessionId,
            'X-Requestid': requestId,
            'User-Agent': `BlibliAndroid/10.4.0(6367) ${userId} Dalvik/2.1.0 (Linux; U; Android 14; sdk_gphone64_x86_64 Build/UPB5.230623.003)`,
            'Accept-Language': 'en',
            'Build-No': '6367',
            'Content-Type': 'application/json; charset=UTF-8',
            'Channelid': 'android',
            'Storeid': '10001',
            'Authorization': `bearer ${accesToken}`,
            'X-Blibli-User-Email': email,
            'Accept-Encoding': 'gzip, deflate'
        }
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
        console.log(`[!] Token kamu : ${chalk.green(token)}`)
        const sendOTP = readlineSync.question(`[?] Send OTP to (SMS/EMAIL) : `)
        const otpRequest = await getOtpRequest(token, sendOTP, userId, sessionId, requestId)
        // console.log(otpRequest);
        const status = otpRequest.code;

        if (status === 200) {
            console.log(`[!] Kode OTP dikirimkan..`);
            let inputCodeOTP;
            let isValid = false;

            while (!isValid) {
                inputCodeOTP = readlineSync.question(`[?] Masukkan kode otp (4 karakter): `);

                // Periksa panjang kode OTP
                if (inputCodeOTP.length === 4) {
                    isValid = true;
                } else {
                    console.log(`[!] ${chalk.red(`Kode OTP harus terdiri dari 4 karakter. Coba lagi.`)}`);
                }
            }
            const getTokenOuth = await getOuthToken(token, inputCodeOTP, inputNomer, userId, sessionId, requestId);
            // console.log(getTokenOuth)
            const tokenType = getTokenOuth.token_type;
            if (tokenType === 'bearer') {
                console.log(`[!] ${chalk.green(`Berhasil login account!`)}`);
                const accesToken = getTokenOuth.access_token;
                console.log(`[!] ${chalk.green(`Acces Token : ${accesToken}`)}`);

                const dataAccount = await getAccountData(userId, sessionId, requestId, accesToken, inputNomer);
                const namaDepanAcc = dataAccount.firstName;
                const namaBelakangAcc = dataAccount.lastName;
                const email = dataAccount.emailAddress;
                const nomerHP = dataAccount.handphone;
                const memberLevel = dataAccount.memberLevel;
                // console.log(dataAccount)
                //!Banner1
                console.log(banner1());
                console.log(`[!] Nama Account Blibli kamu : ${chalk.green(`${namaDepanAcc} ${namaBelakangAcc}`)}`);
                console.log(`[!] Email Kamu : ${chalk.green(`${email}`)}`);
                console.log(`[!] Nomer HP : ${chalk.green(`${nomerHP}`)}`);
                console.log(`[!] Status Level Member : ${chalk.green(`${memberLevel}`)}`);
                //!Banner2
                console.log(banner2());
                const checkVoucher = await getCheckVoucher(userId, sessionId, requestId, accesToken, email)
                // console.log(checkVoucher)
                const statusCode = checkVoucher.code;
                if (statusCode === 200) {
                    checkVoucher.data.forEach((voucher, index) => {
                        console.log(`[!] ${chalk.green(`Check Voucher ${index + 1}!`)}`)
                        const namaVoucher = voucher.name;
                        const minBuy = voucher.minimumPurchaseMessage;
                        const reward = voucher.rewardMessage;
                        const maksCashback = voucher.maximumDiscount;

                        console.log(`[!] Voucher ${index + 1}: ${chalk.green(namaVoucher)}`);
                        console.log(`[!] Minimal Pembelian : ${chalk.green(minBuy)}`);
                        console.log(`[!] Reward : ${chalk.green(reward)}`);
                        console.log(`[!] Max CashBack : ${chalk.green(maksCashback)}`);
                        console.log();
                    });
                }

            } else {
                console.log(`[!] ${chalk.red(`Token is invalid.. OTP salah`)}`);
            }
        } else {
            console.log(`[!] ${chalk.red(`${otpRequest.errors}`)}`);
        }
    } else {
        console.log(`[!] ${chalk.red('Akun tidak tersedia..')}`);
    }
})();