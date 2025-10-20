import { Pipe, PipeTransform } from '@angular/core';
import { CryptoNetworkEnum } from '@app/contracts';

@Pipe({
  name: 'txHash',
  standalone: true,
})
export class TxHashPipe implements PipeTransform {
  transform(
    txHash: string,
    network: CryptoNetworkEnum = CryptoNetworkEnum.Cardano,
  ): string {
    if (!txHash || txHash.length <= 8) return txHash;

    return `${txHash.slice(0, 4)}...${txHash.slice(-4)}`;
  }
}
