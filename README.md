# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Birthcode QA Smoke Checklist

Run this checklist before merging navigation/state changes:

1. Launch app and verify Home renders without errors.
2. Create first profile in onboarding and generate chart.
3. Switch tabs: Profile -> Chart -> Insights -> Practices -> Saved.
4. Open Profiles from header pill and switch active profile.
5. Create second profile, generate, and switch back/forth.
6. Save and unsave multiple insights/practices; confirm Saved updates.
7. Open Definitions and return to tabs/home.
8. Change language EN/PL from Home and Definitions; verify immediate UI update.
9. Clear data from Settings and verify app returns to Home safely.

Validation commands:

```bash
npx tsc --noEmit
npm run lint
```

## Supabase/RLS Quick Checklist

1. `EXPO_PUBLIC_SUPABASE_URL` i `EXPO_PUBLIC_SUPABASE_ANON_KEY` ustawione w `.env`.
2. RLS dla `public.profiles` zgodne z aktualnym trybem aplikacji (u nas: `device_id` + nagłówek `x-device-id`).
3. Przed testami uruchom: `npx expo start -c`.
4. W trybie dev (`__DEV__`) w Settings użyj:
   - `Test Supabase connection`
   - `Insert debug profile row`
   - `Load profiles from Supabase`
5. Po insercie sprawdź `public.profiles` w Supabase Table Editor.

## Astro Engine v1 (Backend Pipeline)

1. Run SQL migration in Supabase SQL Editor:
   - `supabase/migrations/20260220_astro_engine_v1.sql`
2. Deploy edge function:
   - `supabase functions deploy astro-engine-v1 --project-ref <your-project-ref>`
3. Test in app:
   - open Profile screen
   - click `Generate chart` (first click -> computed)
   - click `Refresh astro result` (second click -> cache)
   - verify `public.astro_results` row with `engine_version = 'v1'`
   - verify preview card shows `engine_version`, `source`, and `big_three`

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
