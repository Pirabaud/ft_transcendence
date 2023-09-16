import { HttpService } from '@nestjs/axios';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('proxy')
export class ProxyController {
  constructor(private httpService: HttpService) {}

  @Get()
  async getRequestStatus(@Query('url') url: string): Promise<number> {
    try {
      const response = await this.httpService.get(url).toPromise();
      return response.status;
    } catch (error) {
      // throw error;
    }
  }
}
