import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
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
import { imageValidation } from '../utils/imageValidation';
import { SupabaseService } from '../supabase/supabase.service';
import { Supabase } from '../supabase/supabase';

@Controller('stocks')
export class StockController {
  constructor(
    private readonly stockService: StockService,
    private stockRepository: StockRepository,
    private readonly supabaseService: SupabaseService,
    private supabase: Supabase,
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
    @UploadedFile(imageValidation({ required: true }))
    company_logo: Express.Multer.File,
  ): Promise<Stock> {
    const uploaded_image = await this.supabaseService.uploadImage(
      this.supabase,
      company_logo,
    );

    const res = await this.stockService.create(this.stockRepository, {
      ...body,
      initial_value: Number(body.initial_value),
      company_logo: uploaded_image,
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
    @UploadedFile(imageValidation({ required: false }))
    company_logo: Express.Multer.File,
  ): Promise<Stock> {
    const uploaded_image = company_logo
      ? await this.supabaseService.uploadImage(this.supabase, company_logo)
      : undefined;

    const res = await this.stockService.update(this.stockRepository, body.id, {
      initial_value: body.initial_value
        ? Number(body.initial_value)
        : undefined,
      company_logo: uploaded_image,
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
  ): Promise<Object> {
    return await this.stockService.updateStockQuantity(this.stockRepository, {
      user_id: req.user.sub,
      stock_id: body.stock_id,
      quantity: body.quantity,
      type: body.type,
    });
  }
}
