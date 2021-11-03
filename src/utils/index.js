const toPaddedHex = (n, padLen = 8, padChar = '0') => n.toString(16).padStart(padLen, padChar);

const stringEncoder = (s) => {
  const bytes = Buffer.from(s, 'utf8');
  return `0501${toPaddedHex(bytes.length)}${bytes.toString('hex')}`;
};

export const getSignatureBytes = (message) => {
  const formattedInput = [
    'Tezos Signed Message:',
    message,
  ].join(' ');
  return stringEncoder(formattedInput);
};
