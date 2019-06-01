/**
 * 工具类
 */
import Vue from 'vue'
import CryptoJS from 'crypto-js'

export default {//加密
  encrypt(word, keyStr){
    keyStr = keyStr ? keyStr : 'ab*d5678abc-896.';
    let key = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
  },
  //解密
  decrypt(word, keyStr){
    keyStr = keyStr ? keyStr : 'ab*d5678abc-896.';
    let key = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    let decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  }
}
