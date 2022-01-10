import React from 'react';
import axios from 'axios';
import { SigningType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { getSignatureMessage, getSignatureBytes } from '../utils';

const Tezos = new TezosToolkit('https://api.tez.ie/rpc/mainnet');
const wallet = new BeaconWallet({
  name: 'sign-in-with-tezos',
  iconUrl: 'https://hic.af/logo.png',
  preferredNetwork: 'mainnet',
});
Tezos.setWalletProvider(wallet);

const Page = () => {
  const [status, setStatus] = React.useState();
  const signIn = async () => {
    try {
      setStatus(null);
      await wallet.requestPermissions({
        network: {
          type: 'mainnet',
        },
      });
      const acc = await wallet.client.getActiveAccount();
      const {
        address: publicAddress,
        publicKey,
      } = acc || {};
      if (publicAddress) {
        const authData = await axios.get(`/api/auth?address=${publicAddress}`);
        const user = authData.data;
        const message = getSignatureMessage(user?.nonce?.toString());
        const bytes = getSignatureBytes(message);
        const payload = {
          signingType: SigningType.MICHELINE,
          payload: bytes,
          sourceAddress: publicAddress,
        };
        const { signature } = await wallet.client.requestSignPayload(payload);
        const verifyData = await axios.get(`/api/verify?publicKey=${publicKey}&signature=${signature}`);
        const data = verifyData.data;
        setStatus({
          type: 'success',
          data
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        data: err.message,
      });
    } 
  };
  return (
    <>
      <button onClick={ signIn }>sign message</button>
      {status ? (
        <pre>{ JSON.stringify(status, null, 2) }</pre>
      ) : null}
    </>
  );
}

export default Page;