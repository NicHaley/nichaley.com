## Getting Started


### Prereqs:
1. Install node v24
2. Install pnpm

### Step 1: Install deps
```
pnpm i
```

### Step 2: Install Playwright
```
pnpm exec playwright install
```

### Step 3: Add environment variables
```
vercel env pull --environment=development;
```


### Step 4: Run Local Dev

```
pnpm dev
```

## Stats

The front page stats work by combining data from different sources. The stats (about) page is forced to generate statically, and is revalidated every hour.

### Current location

This works by:

1. iPhone Shortcuts automation gets current location and sends POST request to /api/update-location
2. Location stored in Redis (managed through Upstash Vercel integration)
3. Location read from Redis

### Weather

Location passed to request to openweathermap.org

### Letterboxd

Simple scraper setup to get data from https://letterboxd.com/nichaley/diary/

### Apple Music

Works using the Apple Music API, which requires an Apple Developer Program membership. Authenticating requires:

1. Developer Token: JWT signed with Apple private key
2. User Token: The token is generated via Apple's MusicKit SDK, which unfortunately can only run in the client. The token appears to be long-lived (6 months). It's not ideal, but the token can be stored in env variables, and needs to be manually refreshed before the 6 month expiry. To refresh it, go to `http://localhost:3000/secret/apple-music-token`. If it expires before the music section will just be hidden.
