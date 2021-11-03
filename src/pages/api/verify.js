import { getSignatureBytes } from "../../utils";
import { prefix, b58cdecode } from '@taquito/utils';
import sodium from 'sodium-javascript';
import blake2b from 'blake2b';

const verifySignature = async ({
  bytes,
  signature,
  publicKey,
}) => {
  try {
    const verify = sodium.crypto_sign_verify_detached(
      b58cdecode(signature, prefix.edsig),
      blake2b(32, bytes),
      b58cdecode(publicKey, prefix.edpk),
    );
    return verify;
  } catch (e) {
    console.log('Error: ', e);
    throw e;
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      signature,
      publicKey,
    } = req.body;
    const bytes = getSignatureBytes('hello world');
    console.log('Got bytes from nonce.', bytes);
    const isVerified = await verifySignature({ bytes, signature, publicKey });
    console.log('Verified signature?', isVerified);
    // TODO: We should be able to get a boolean to know whether we could validate the signature server-side
    if (isVerified) {
      return res.status(200).json({ verified: true });
    }
    return res.status(401).send({
      error: 'Verification failed',
    });
  }
  return res.status(404).json({ name: 'Endpoint not found' });
}
