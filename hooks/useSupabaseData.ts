"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabaseData<T>(
  table: string,
  options?: {
    orderBy?: string;
    ascending?: boolean;
    limit?: number;
    filter?: { column: string; value: any };
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        let query = supabase.from(table).select('*');

        if (options?.filter) {
          query = query.eq(options.filter.column, options.filter.value);
        }

        if (options?.orderBy) {
          query = query.order(options.orderBy, {
            ascending: options.ascending ?? true,
          });
        }

        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const { data: result, error: queryError } = await query;

        if (queryError) {
          setError(queryError);
        } else if (result) {
          setData(result);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, options?.orderBy, options?.ascending, options?.limit]);

  return { data, loading, error };
}
