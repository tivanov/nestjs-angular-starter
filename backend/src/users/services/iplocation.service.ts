import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { IpLocation } from '../model/iplocation.model';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class IpLocationService {
  private readonly logger = new Logger(IpLocationService.name);
  private readonly baseUrl = 'https://api.iplocation.net';

  constructor(private readonly http: HttpService) {}

  public async getLocation(ip: string): Promise<IpLocation> {
    try {
      const axiosRes = await firstValueFrom(
        this.http.get<IpLocation>(`${this.baseUrl}/`, {
          params: {
            ip: ip,
          },
        }),
      );

      return axiosRes.data;
    } catch (error) {
      this.logger.error('Failed to get location for IP address', error);
      return null;
    }
  }
}
