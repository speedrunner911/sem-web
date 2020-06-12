
const BN = require('bn.js');

const utils = {
  isAddress(address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return false;
    } else if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
      return true
    }
    return this.checkAddressChecksum(address)
  
  },
  checkAddressChecksum(address) {
    // Check each case
    address = address.replace(/^0x/i,'');
    var addressHash = this.sha3(address.toLowerCase()).replace(/^0x/i,'');
    for (var i = 0; i < 40; i++ ) {
      // the nth letter should be uppercase if the nth digit of casemap is 1
      if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
        return false;
      }
    }
    return true;
  },
  sha3(value) {
    if (this.isBN(value)) {
      value = value.toString();
    }
    if (this.isHexStrict(value) && /^0x/i.test((value).toString())) {
      value = this.hexToBytes(value);
    }
    var returnValue = Hash.keccak256(value); 
    if (returnValue === SHA3_NULL_S) {
      return null
    }
    return returnValue
  },
  isBN(object) {
    return BN.isBN(object);
  },
  isHexStrict(hex) {
    return ((this.isString(hex) || this.isNumber(hex)) && /^(-)?0x[0-9a-f]*$/i.test(hex));
  },
  isHex(string) {
    return typeof string === 'string' && !isNaN(parseInt(string,16))
  },
  isString(string) {
    return typeof string === 'string' || (string && string.constructor && string.constructor.name === 'String');
  },
  isNumber(c) {
    if (c >= '0' && c <= '9') return 1
    return 0;
  },
  isValidURL(url) {
    // TO DO
    return String(url)
  },
  isInteger(number) {
    return Number.isInteger(Number(number))
  },
  hexBytes(s) {
    return Buffer.from(s.replace('0x', ''), 'hex')
  },
  toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2)
    }).join('')
  },
  toHex(str) {
    var result = '';
    for (let i = 0; i < str.length; i += 1) {
      result += str.charCodeAt(i).toString(16);
    }
    return `0x${result}`;
  },
}

module.exports = utils
