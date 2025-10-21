import { importPKCS8, SignJWT } from "jose";

const APPLE_MUSIC_API_BASE_URL = "https://api.music.apple.com/v1" as const;

export async function generateAppleMusicDeveloperToken(): Promise<string> {
  const teamId = process.env.APPLE_MUSIC_TEAM_ID;
  const keyId = process.env.APPLE_MUSIC_KEY_ID;
  const privateKey = process.env.APPLE_MUSIC_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!teamId || !keyId || !privateKey) {
    throw new Error(
      "Missing Apple Music env vars: APPLE_MUSIC_TEAM_ID, APPLE_MUSIC_KEY_ID, APPLE_MUSIC_PRIVATE_KEY"
    );
  }

  const key = await importPKCS8(privateKey, "ES256");
  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keyId, typ: "JWT" })
    .setIssuer(teamId)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(key);
  return jwt;
}

export async function getHeavyRotation() {
  const token = process.env.APPLE_MUSIC_USER_TOKEN;
  if (!token) {
    throw new Error(
      "Missing Music-User-Token (provide param or APPLE_MUSIC_USER_TOKEN env var)"
    );
  }

  const developerToken = await generateAppleMusicDeveloperToken();

  const url = new URL(`${APPLE_MUSIC_API_BASE_URL}/me/recent/played/tracks`);
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${developerToken}`,
      "Music-User-Token": token,
    },
    next: { revalidate: 300 },
  });

  console.log(222, res);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apple Music request failed: ${res.status} ${text}`);
  }

  return (await res.json()) as unknown;
}
