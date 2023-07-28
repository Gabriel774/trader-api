import { Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { supabase_credentials } from '../constants';

@Injectable()
export class Supabase {
  public client: SupabaseClient = createClient(
    supabase_credentials.url,
    supabase_credentials.key,
    { auth: { persistSession: false } },
  );
}
