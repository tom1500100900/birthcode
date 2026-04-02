import { API_BASE_URL } from '@/lib/config/env';
import { NatalChartRequestDto, NatalChartResponseDto } from '@/types/api';
import { AstroChart, BirthInput } from '@/types/astro';

import { requestJson } from './http';

function buildUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const cleanedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanedPath}`;
}

export async function fetchNatalChart(input: BirthInput): Promise<AstroChart> {
  const requestBody: NatalChartRequestDto = { input };
  const response = await requestJson<NatalChartResponseDto>(
    buildUrl('/api/natal-chart'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    },
    { timeoutMs: 15000, retries: 2 }
  );

  return response.chart;
}
