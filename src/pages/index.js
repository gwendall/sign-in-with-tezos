import React from 'react';
import axios from 'axios';
import { SigningType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { getSignatureBytes } from '../utils';

const Page = () => {
  const walletRef = React.useRef();
  const [status, setStatus] = React.useState();
  React.useEffect(() => {
    const Tezos = new TezosToolkit('https://mainnet.smartpy.io');
    walletRef.current = new BeaconWallet({
      name: 'sign-test',
      preferredNetwork: 'mainnet',
    });
    Tezos.setWalletProvider(walletRef.current);
  }, []);
  const handleClick = async () => {
    try {
      setStatus(null);
      const {
        address: publicAddress,
        publicKey,
      } = await walletRef.current.client.getActiveAccount();
      const payload = {
        signingType: SigningType.MICHELINE,
        payload: getSignatureBytes('hello world'),
        sourceAddress: publicAddress,
      };
      console.log('Got payload...', payload);
      const { signature } = await walletRef.current.client.requestSignPayload(payload);
      console.log('Got signature...', signature);
      // 3. verify server-side & generate auth token
      const body = {
        signature,
        publicKey,
      };
      console.log('Verifying signature with body.', body);
      const { data } = await axios.post('/api/verify', body);
      console.log('Got verification response.', data);
      setStatus({
        type: 'success',
        data
      })
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