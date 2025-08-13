/*
 * @Author: 羚羊公子
 * @FilePath: \welfare_tip\src\utils\base64.js
 */
// utils/base64.js
import { Base64 } from 'js-base64'

export const encode = (str) => Base64.encode(str)
export const decode = (str) => Base64.decode(str)