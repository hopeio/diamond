// MD5 (RFC 1321) — vendored to drop the `spark-md5` dependency.
//
// MD5 is still required by external/server contracts (wo.cn API signature,
// upload dedup/verification, device-info fingerprint); the Web Crypto API
// (`crypto.subtle.digest`) does not support MD5, so a pure-JS implementation
// is necessary. Accepts a UTF-8 string or a raw ArrayBuffer and returns the
// lowercase hex digest.

const S = new Int32Array([
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
])

const K = new Int32Array([
  -680876936, -389564586, 606105819, -1044525330,
  -176418897, 1200080426, -1473231341, -45705983,
  1770035416, -1958414417, -42063, -1990404162,
  1804603682, -40341101, -1502002290, 1236535329,
  -165796510, -1069501632, 643717713, -373897302,
  -701558691, 38016083, -660478335, -405537848,
  568446438, -1019803690, -187363961, 1163531501,
  -1444681467, -51403784, 1735328473, -1926607734,
  -378558, -2022574463, 1839030562, -35309556,
  -1530992060, 1272893353, -155497632, -1094730640,
  681279174, -358537222, -722521979, 76029189,
  -640364487, -421815835, 530742520, -995338651,
  -198630844, 1126891415, -1416354905, -57434055,
  1700485571, -1894986606, -1051523, -2054922799,
  1873313359, -30611744, -1560198380, 1309151649,
  -145523070, -1120210379, 718787259, -343485551,
])

function rotl(x: number, c: number): number {
  return ((x << c) | (x >>> (32 - c))) | 0
}

function hexLE(n: number): string {
  let u = n >>> 0
  let out = ''
  for (let i = 0; i < 4; i++) {
    out += ((u & 0xff) + 0x100).toString(16).slice(1)
    u >>>= 8
  }
  return out
}

function md5bytes(msg: Uint8Array): string {
  const len = msg.length
  // Pad: 0x80, then zeros so (len+1+zeros) ≡ 56 (mod 64), then 8-byte length.
  const padZeros = (55 - (len % 64) + 64) % 64
  const total = len + 1 + padZeros + 8
  const buf = new Uint8Array(total)
  buf.set(msg)
  buf[len] = 0x80
  const dv = new DataView(buf.buffer)
  const bitLen = len * 8
  dv.setUint32(total - 8, bitLen >>> 0, true)
  dv.setUint32(total - 4, Math.floor(bitLen / 4294967296), true)

  let a0 = 1732584193
  let b0 = -271733879
  let c0 = -1732584194
  let d0 = 271733878

  const x = new Int32Array(16)
  for (let p = 0; p < total; p += 64) {
    for (let j = 0; j < 16; j++) {
      x[j] = dv.getInt32(p + j * 4, true)
    }
    let a = a0
    let b = b0
    let c = c0
    let d = d0
    for (let i = 0; i < 64; i++) {
      let f: number
      let g: number
      if (i < 16) {
        f = (b & c) | (~b & d)
        g = i
      } else if (i < 32) {
        f = (d & b) | (~d & c)
        g = (5 * i + 1) % 16
      } else if (i < 48) {
        f = b ^ c ^ d
        g = (3 * i + 5) % 16
      } else {
        f = c ^ (b | ~d)
        g = (7 * i) % 16
      }
      f = f | 0
      const sum = (a + f + K[i] + x[g]) | 0
      const temp = d
      d = c
      c = b
      b = (b + rotl(sum, S[i])) | 0
      a = temp
    }
    a0 = (a0 + a) | 0
    b0 = (b0 + b) | 0
    c0 = (c0 + c) | 0
    d0 = (d0 + d) | 0
  }
  return hexLE(a0) + hexLE(b0) + hexLE(c0) + hexLE(d0)
}

export function md5(input: string | ArrayBuffer): string {
  const bytes = typeof input === 'string'
    ? new TextEncoder().encode(input)
    : new Uint8Array(input)
  return md5bytes(bytes)
}
