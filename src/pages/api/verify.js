import { getSignatureBytes } from "../../utils";

const sodium = require("libsodium-wrappers")
const bs58check = require("bs58check")

const prefix = {
  edsig: new Uint8Array([9, 245, 205, 134, 18]),
  edpk: new Uint8Array([13, 15, 37, 217])
};

function hex2buf(hex) {
  return new Uint8Array(
    hex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    })
  );
}

function b58decode(enc, prefix) {
  return bs58check.decode(enc).slice(prefix.length);
}

async function verifyUserSignature(bytes, sig, pk) {
  await sodium.ready;
  try {
    const verify = sodium.crypto_sign_verify_detached(
      b58decode(sig, prefix.edsig),
      sodium.crypto_generichash(32, hex2buf(bytes)),
      b58decode(pk, prefix.edpk)
    )
    console.log("Verify: ", verify)
    return verify
  } catch (e) {
    console.log("Error: ", e)
    throw e
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        signature,
        publicKey,
      } = req.body;
      // console.log('got signature...', signature);
      const bytes = getSignatureBytes();
      const isVerified = await verifyUserSignature(
        bytes,
        signature,
        // 'dsigtavu5pc5UUu68pemt7gYKqDMSiRvKf81Akpei7yEvGz6LmsQoTKm3rAAGaLrxRRjmt5F8jsnyxBfmtyVA5uTGQiXSzKPfB',
        publicKey
      );
      if (isVerified) {
        return res.status(200).json({ verified: true });
      }
      return res.status(401).send({
        error: 'Verification failed',
      });
    } catch (err) {
      console.log('Could not sign in.', err);
      return res.status(401).send({
        error: 'Verification failed',
      });
    }
  }
  return res.status(404).json({ name: 'Endpoint not found' });
}