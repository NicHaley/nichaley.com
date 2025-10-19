## Stats

The front page stats work by combining data from different sources.

### Current location

This works by:

1. iPhone Shortcuts automation gets current location and sends POST request to /api/update-location
2. Location stored in Redis (managed through Upstash Vercel integration)
3. Location read from Redis

### Weather

Location passed to request to openweathermap.org

### Letterboxd

Simple scraper setup to get data from https://letterboxd.com/nichaley/diary/
