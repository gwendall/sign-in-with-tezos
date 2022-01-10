import React from 'react';
import axios from 'axios';
import { SigningType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { getSignatureBytes, getSignatureMessage } from '../utils';

const Tezos = new TezosToolkit('https://api.tez.ie/rpc/mainnet');
const wallet = new BeaconWallet({
  name: 'sign-test',
  iconUrl: 'https://hic.af/logo.png',
  preferredNetwork: 'mainnet',
});
Tezos.setWalletProvider(wallet);

const Page = () => {
  const [status, setStatus] = React.useState();
  const handleClick = async () => {
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
        const payload = {
          signingType: SigningType.MICHELINE,
          payload: getSignatureBytes(),
          sourceAddress: publicAddress,
        };
        const { signature } = await wallet.client.requestSignPayload(payload);
        const body = {
          signature,
          publicKey,
        };
        const { data } = await axios.post('/api/verify', body);
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
      <button onClick={handleClick}>sign message</button>
      {status ? (
        <pre>{ JSON.stringify(status, null, 2) }</pre>
      ) : null}
    </>
  );
}

export default Page;