export interface ClientGeoInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  zip?: string;
  isp?: string;
  org?: string;
  device?: string;
  os?: string;
  browser?: string;
  deviceSummary?: string;
}

// In-memory LRU-like cache for IP lookups (up to 500 IPs, 30 min TTL)
const ipCache = new Map<string, { data: Partial<ClientGeoInfo>; expires: number }>();

function isPrivateIp(ip: string): boolean {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip === "localhost") return true;
  if (ip.startsWith("10.") || ip.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return true;
  return false;
}

export function extractClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((s) => s.trim());
    // Find the first public IP
    for (const candidate of ips) {
      if (candidate && !isPrivateIp(candidate)) {
        return candidate.replace(/^::ffff:/, "");
      }
    }
    return ips[0].replace(/^::ffff:/, "");
  }

  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim().replace(/^::ffff:/, "");

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim().replace(/^::ffff:/, "");

  return "127.0.0.1";
}

export function parseUserAgent(ua = ""): {
  device: string;
  os: string;
  browser: string;
  summary: string;
} {
  let device = "Desktop";
  if (/iPad|tablet|PlayBook/i.test(ua)) {
    device = "Tablet";
  } else if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    device = "Mobile";
  }

  let os = "Unknown OS";
  if (/iPhone/i.test(ua)) os = "iPhone (iOS)";
  else if (/iPad/i.test(ua)) os = "iPad (iPadOS)";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Macintosh|Mac OS X/i.test(ua)) os = "macOS";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "Unknown Browser";
  if (/Instagram/i.test(ua)) browser = "Instagram In-App";
  else if (/FBAN|FBAV|FB_IAB/i.test(ua)) browser = "Facebook In-App";
  else if (/WhatsApp/i.test(ua)) browser = "WhatsApp In-App";
  else if (/Edg/i.test(ua)) browser = "Edge";
  else if (/Chrome|CriOS/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua)) browser = "Safari";
  else if (/Firefox/i.test(ua)) browser = "Firefox";

  return {
    device,
    os,
    browser,
    summary: `${device} • ${os} • ${browser}`,
  };
}

export async function resolveClientGeo(req: Request): Promise<ClientGeoInfo> {
  const ip = extractClientIp(req);
  const ua = req.headers.get("user-agent") || "";
  const uaInfo = parseUserAgent(ua);

  // 1. Check Platform Geo Headers (Vercel, Cloudflare, etc.)
  const headerCity =
    req.headers.get("x-vercel-ip-city") ||
    req.headers.get("cf-ipcity") ||
    undefined;
  const headerRegion =
    req.headers.get("x-vercel-ip-country-region") ||
    req.headers.get("cf-region") ||
    undefined;
  const headerCountry =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    undefined;
  const headerZip =
    req.headers.get("x-vercel-ip-postal-code") ||
    req.headers.get("cf-postal-code") ||
    undefined;

  let decodedCity: string | undefined = headerCity;
  if (headerCity) {
    try {
      decodedCity = decodeURIComponent(headerCity);
    } catch {
      decodedCity = headerCity;
    }
  }

  const result: ClientGeoInfo = {
    ip,
    city: decodedCity,
    region: headerRegion,
    country: headerCountry,
    countryCode: headerCountry,
    zip: headerZip,
    device: uaInfo.device,
    os: uaInfo.os,
    browser: uaInfo.browser,
    deviceSummary: uaInfo.summary,
  };

  // If hosting platform already provided city and country, we can return directly
  if (result.city && result.country) {
    return result;
  }

  // 2. If private or local IP, return with local tag
  if (isPrivateIp(ip)) {
    result.city = result.city || "Localhost";
    result.country = result.country || "Development";
    result.isp = "Local Network";
    return result;
  }

  // 3. Check memory cache
  const now = Date.now();
  const cached = ipCache.get(ip);
  if (cached && cached.expires > now) {
    return { ...result, ...cached.data };
  }

  // 4. IP Geolocation Lookup via ip-api.com
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,zip,isp,org,query`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === "success") {
        const geoData = {
          city: data.city || result.city,
          region: data.regionName || result.region,
          country: data.country || result.country,
          countryCode: data.countryCode || result.countryCode,
          zip: data.zip || result.zip,
          isp: data.isp || data.org,
          org: data.org,
        };

        // Cache for 30 minutes
        ipCache.set(ip, {
          data: geoData,
          expires: now + 30 * 60 * 1000,
        });

        return { ...result, ...geoData };
      }
    }
  } catch (err) {
    // Non-blocking fallback
  }

  return result;
}
