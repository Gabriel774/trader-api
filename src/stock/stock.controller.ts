import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockBody } from './dtos/create-stock-body';
import { FileInterceptor } from '@nestjs/platform-express';
import { StockRepository } from './repositories/stock-repository';
import { UpdateStockBody } from './dtos/update-stock-body';
import { Stock } from '@prisma/client';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UpdateUserStockQuantityBody } from './dtos/update-user-stock-quantity-body';

@Controller('stocks')
export class StockController {
  constructor(
    private readonly stockService: StockService,
    private stockRepository: StockRepository,
  ) {}

  @Get('')
  @UseGuards(AuthGuard)
  async getAll(@Request() req: any): Promise<Stock[]> {
    return this.stockService.getAll(this.stockRepository, req.user.sub);
  }

  @Post('')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('company_logo'))
  async create(
    @Body() body: CreateStockBody,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png|jpg|jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build({
          fileIsRequired: true,
        }),
    )
    company_logo: Express.Multer.File,
  ) {
    const res = await this.stockService.create(this.stockRepository, {
      ...body,
      initial_value: Number(body.initial_value),
      company_logo,
    });

    if (!res)
      throw new InternalServerErrorException({
        msg: 'Error on stock creation',
      });

    return res;
  }

  @Put('')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('company_logo'))
  async update(
    @Body() body: UpdateStockBody,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png|jpg|jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    company_logo: Express.Multer.File,
  ) {
    const res = await this.stockService.update(this.stockRepository, body.id, {
      initial_value: body.initial_value
        ? Number(body.initial_value)
        : undefined,
      company_logo: company_logo ? company_logo.filename : undefined,
    });

    if (!res)
      throw new InternalServerErrorException({
        msg: 'Error on stock update or stock id does not exist',
      });

    return res;
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: number): Promise<Object> {
    await this.stockService.delete(this.stockRepository, id);
    return { msg: 'Stock deleted successfully' };
  }

  @Put('/update-stocks-value')
  @UseGuards(AuthGuard)
  async updateStocksValue(@Request() req: any): Promise<Stock[]> {
    return await this.stockService.updateStocksValue(
      this.stockRepository,
      req.user.sub,
    );
  }

  @Put('/update-stock-quantity')
  @UseGuards(AuthGuard)
  async updateStockQuantity(
    @Body() body: UpdateUserStockQuantityBody,
    @Request() req: any,
  ): Promise<any> {
    return await this.stockService.updateStockQuantity(
      this.stockRepository,
      req.user.sub,
      body.stock_id,
      body.quantity,
      body.type,
    );
  }
}
