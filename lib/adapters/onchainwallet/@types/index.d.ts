type SendTokenParams = {
  pk: string;
  mint: string;
  recipients: {
    address: string;
    amount: number;
  }[];
  runAt?: string;
  userId?: number;
};

type MintNFTParams = {
  name: string;
  symbol: string;
  imageUri: string;
  description: string;
  imgType: string;
  attributes: { trait_type: string; value: string }[];
};
