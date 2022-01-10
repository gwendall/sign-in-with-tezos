const toPaddedHex = (n, padLen = 8, padChar = '0') => n.toString(16).padStart(padLen, padChar);

const stringEncoder = (s) => {
  const bytes = Buffer.from(s, 'utf8');
  return `0501${toPaddedHex(bytes.length)}${bytes.toString('hex')}`;
};

export const getSignatureMessage = (nonce = 123) => `Hi from Tezos! Sign this message to prove you have access to this wallet and we'll log you in. This won't cost you any XTZ. For enhanced security, here's a one-time code (no need to remember it): ${nonce}.`;

export const getSignatureBytes = (message = getSignatureMessage()) => {
  const formattedInput = [
    'Tezos Signed Message:',
    message,
  ].join(' ');
  return stringEncoder(formattedInput);
};
