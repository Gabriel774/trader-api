import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Supabase } from './supabase';

@Injectable()
export class SupabaseService {
  async uploadImage(supabase: Supabase, image: Express.Multer.File) {
    return await supabase.client.storage
      .from('trader-images')
      .upload(
        `public/${randomUUID()}${extname(image.originalname)}`,
        image.buffer,
        {
          cacheControl: '3600',
          upsert: false,
        },
      )
      .then((res) => res.data.path);
  }
}
