
export const zodiacRoles = {
  Gemini: {
    Sun: [
      { id: "z_gemini_sun_01", text: "Słońce w Bliźniętach daje Ci naturalną ciekawość świata. Twóją największą siłą jest zdolność łączenia informacji i szybkie uczenie się nowych rzeczy." }
    ],
    Moon: [
      { id: "z_gemini_moon_01", text: "Księżyc w Bliźniętach sprawia, że emocjonalnie potrzebujesz rozmowy i mentalnej stymulacji. Cisza i stagnacja mogą powodować u Ciebie niepokój." }
    ],
    Asc: [
      { id: "z_gemini_asc_01", text: "Ascendent w Bliźniętach sprawia, że ludzie widzą Cię jako osobę komunikatywną, szybką w reakcjach i otwartą na nowe doświadczenia." }
    ]
  },

  Scorpio: {
    Sun: [
      { id: "z_scorpio_sun_01", text: "Słońce w Skorpionie daje intensywność i zdolność widzenia rzeczy pod powierzchnią. Naturalnie dostrzegasz to, co dla innych jest ukryte." }
    ]
  },

  Capricorn: {
    Sun: [
      { id: "z_capricorn_sun_01", text: "Słońce w Koziorożcu buduje w Tobie silne poczucie odpowiedzialności i zdolność długoterminowego działania. Potrafisz konsekwentnie budować rzeczy, które mają trwałą wartość." }
    ]
  }
}

export function zodiacRoleSnippet(sign: string, role: 'Sun' | 'Moon' | 'Asc'): { id: string; text: string } | null {
  const signNode = zodiacRoles[sign as keyof typeof zodiacRoles] as
    | Record<'Sun' | 'Moon' | 'Asc', Array<{ id: string; text: string }>>
    | undefined;
  if (!signNode) {
    return null;
  }
  const roleEntries = signNode[role];
  if (!Array.isArray(roleEntries) || roleEntries.length === 0) {
    return null;
  }
  return roleEntries[0] ?? null;
}
