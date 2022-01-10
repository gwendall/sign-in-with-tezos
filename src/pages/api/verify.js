import { getPkhfromPk, verifySignature } from '@taquito/utils';
import { getSignatureMessage, getSignatureBytes } from "../../utils";
import { getUserByAddress } from '../../utils/users';

export default async function handler(req, res) {
  const {
    signature,
    publicKey,
  } = req.query;
  const address = getPkhfromPk(publicKey);
  const user = getUserByAddress(address);
  const message = getSignatureMessage(user?.nonce?.toString());
  const bytes = getSignatureBytes(message);
  const isVerified = verifySignature(
    bytes,
    publicKey,
    signature
  );
  return res.status(200).json({ isVerified });
}