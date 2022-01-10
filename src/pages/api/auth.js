import { getUserByAddress, setUserByAddress } from '../../utils/users'

export default function auth(req, res) {
  const { address } = req.query;
  let user = getUserByAddress(address);
  if (!user) {
    user = {
      address,
      nonce: Math.floor(Math.random() * 10000000)
    }
  } else {
    const nonce = Math.floor(Math.random() * 10000000)
    user.nonce = nonce
  };
  setUserByAddress(address, user);
  res.status(200).json(user);
}