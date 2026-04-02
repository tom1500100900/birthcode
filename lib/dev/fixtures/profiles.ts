import type { BirthInput, PersonProfile } from '@/types/astro';

export type FixtureProfile = {
  id: string;
  label: string;
  birthInput: BirthInput;
};

export const TEST_FIXTURE_PROFILES: FixtureProfile[] = [
  {
    id: 'fixture-tomek-1979-06-04-1730-warsaw',
    label: 'Tomek 1979-06-04 17:30 Warsaw',
    birthInput: { dateISO: '1979-06-04', timeHHmm: '17:30', placeName: 'Warsaw', timezone: 'Europe/Warsaw', lat: 52.2297, lon: 21.0122 },
  },
  {
    id: 'fixture-ania-1990-02-11-0815-krakow',
    label: 'Ania 1990-02-11 08:15 Krakow',
    birthInput: { dateISO: '1990-02-11', timeHHmm: '08:15', placeName: 'Krakow', timezone: 'Europe/Warsaw', lat: 50.0647, lon: 19.945 },
  },
  {
    id: 'fixture-marek-1986-09-20-2210-gdansk',
    label: 'Marek 1986-09-20 22:10 Gdansk',
    birthInput: { dateISO: '1986-09-20', timeHHmm: '22:10', placeName: 'Gdansk', timezone: 'Europe/Warsaw', lat: 54.352, lon: 18.6466 },
  },
  {
    id: 'fixture-kasia-1995-12-01-0640-wroclaw',
    label: 'Kasia 1995-12-01 06:40 Wroclaw',
    birthInput: { dateISO: '1995-12-01', timeHHmm: '06:40', placeName: 'Wroclaw', timezone: 'Europe/Warsaw', lat: 51.1079, lon: 17.0385 },
  },
  {
    id: 'fixture-piotr-1983-03-14-1345-poznan',
    label: 'Piotr 1983-03-14 13:45 Poznan',
    birthInput: { dateISO: '1983-03-14', timeHHmm: '13:45', placeName: 'Poznan', timezone: 'Europe/Warsaw', lat: 52.4064, lon: 16.9252 },
  },
  {
    id: 'fixture-marta-2001-07-29-1950-lodz',
    label: 'Marta 2001-07-29 19:50 Lodz',
    birthInput: { dateISO: '2001-07-29', timeHHmm: '19:50', placeName: 'Lodz', timezone: 'Europe/Warsaw', lat: 51.7592, lon: 19.4559 },
  },
  {
    id: 'fixture-jan-1972-10-08-0530-szczecin',
    label: 'Jan 1972-10-08 05:30 Szczecin',
    birthInput: { dateISO: '1972-10-08', timeHHmm: '05:30', placeName: 'Szczecin', timezone: 'Europe/Warsaw', lat: 53.4285, lon: 14.5528 },
  },
  {
    id: 'fixture-ola-1998-05-18-1140-lublin',
    label: 'Ola 1998-05-18 11:40 Lublin',
    birthInput: { dateISO: '1998-05-18', timeHHmm: '11:40', placeName: 'Lublin', timezone: 'Europe/Warsaw', lat: 51.2465, lon: 22.5684 },
  },
  {
    id: 'fixture-adam-1988-01-25-0020-katowice',
    label: 'Adam 1988-01-25 00:20 Katowice',
    birthInput: { dateISO: '1988-01-25', timeHHmm: '00:20', placeName: 'Katowice', timezone: 'Europe/Warsaw', lat: 50.2649, lon: 19.0238 },
  },
  {
    id: 'fixture-ewa-1993-11-30-1635-bialystok',
    label: 'Ewa 1993-11-30 16:35 Bialystok',
    birthInput: { dateISO: '1993-11-30', timeHHmm: '16:35', placeName: 'Bialystok', timezone: 'Europe/Warsaw', lat: 53.1325, lon: 23.1688 },
  },
];

export function fixtureProfilesToPersons(now = new Date().toISOString()): PersonProfile[] {
  return TEST_FIXTURE_PROFILES.map((item) => ({
    id: item.id,
    label: item.label,
    birthInput: item.birthInput,
    profileContext: null,
    astroResult: null,
    createdAt: now,
    updatedAt: now,
  }));
}
