// @ts-ignore
import SpotifyWebApi from "spotify-web-api-node";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "missing code" });
  }

  const api = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI!
  });

  const tokenData = await api.authorizationCodeGrant(code);

  const url = new URL("http://127.0.0.1:3000");
  url.searchParams.set("accessToken", tokenData.body.access_token);
  url.searchParams.set("refreshToken", tokenData.body.refresh_token);
  url.searchParams.set("expiresIn", tokenData.body.expires_in.toString());

  return NextResponse.redirect(url.toString());
}
