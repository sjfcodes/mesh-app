import { AssetType } from '../../types';

export type AssetsState = {
  assets: AssetType[];
};

export type AssetsAction =
  | {
      type: 'SUCCESSFUL_GET';
      payload: string;
    }
  | { type: 'FAILED_GET'; payload: number };
