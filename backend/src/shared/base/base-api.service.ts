import { Logger } from '@nestjs/common';
import { ApiResponseException } from '../exceptions/app-api-response-exception';
import {
  AxiosResponse,
  AxiosResponseHeaders,
  isAxiosError,
  RawAxiosResponseHeaders,
} from 'axios';
import { ErrorCode } from '@app/contracts/codes';
import { AlertsService } from 'src/notifications/services/alerts.service';

export class BaseApiService {
  protected baseUrl: string;

  constructor(
    protected readonly logger: Logger,
    protected readonly alerts: AlertsService,
  ) {}

  protected logError(error, additionalData: object = null) {
    if (error instanceof ApiResponseException) {
      if (error.code === ErrorCode.RATE_LIMIT_EXCEEDED) {
        this.alerts.error(error.message).then(() => {});
      }

      this.logger.error(error.message, error.stack, {
        response: error.response,
        message: error.message,
      });
    } else if (isAxiosError(error)) {
      const errorData: { [key: string]: any } = {};
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // errorData.response = error.response.data;
        const response = error.response.data;
        let message = error.message;

        if (response.error) {
          message = response.error;

          if (response.error_description) {
            message += `: ${response.error_description}`;
          }
        }

        errorData.status = error.response.status;
        errorData.headers = error.response.headers;
        errorData.message = message;
      } else {
        // Something happened in setting up the request that triggered an Error
        errorData.message = error.message;
      }
      this.logger.error(
        `AxiosError: ${error.code} Status: ${error.response?.status}`,
        error.stack,
        errorData,
      );
    } else if (error instanceof Error) {
      this.logger.error(error.message, error.stack);
    } else {
      this.logger.error(error);
    }

    if (additionalData) {
      this.logger.error(additionalData);
    }
  }

  protected reportRateLimit(res: AxiosResponse) {
    const remaining = this.getRateLimitRemaining(res.headers);
    if (remaining && remaining <= 0) {
      throw new ApiResponseException(
        'Rate limit exceeded',
        ErrorCode.RATE_LIMIT_EXCEEDED,
        {
          url: res.config.url,
          status: res.status,
          headers: res.headers,
          data: res.data,
        },
      );
    }
  }

  protected getRateLimitRemaining(
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders,
  ) {
    // universal
    let rateLimitRemaining = headers['RateLimit-Remaining'];
    if (!rateLimitRemaining) {
      // RapidAPI
      rateLimitRemaining = headers['x-ratelimit-requests-remaining'];
    }

    if (!rateLimitRemaining) {
      // Trottler
      for (const header in headers) {
        if (header.toLowerCase().includes('x-rate-limit-remaining')) {
          rateLimitRemaining = headers[header];
          break;
        }
      }
    }

    if (!rateLimitRemaining) {
      return null;
    }

    let remaining = Number.parseInt(rateLimitRemaining);
    if (isNaN(remaining)) {
      return null;
    }

    return remaining;
  }
}
