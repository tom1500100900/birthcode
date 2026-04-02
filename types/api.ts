import { AstroChart, BirthInput } from '@/types/astro';

export interface NatalChartRequestDto {
  input: BirthInput;
}

export interface NatalChartResponseDto {
  chart: AstroChart;
}
