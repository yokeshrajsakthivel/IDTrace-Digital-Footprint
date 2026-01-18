export const SOURCE_LOCATIONS: Record<string, { country: string; lat: number; lng: number }> = {
    // Major US Tech
    'linkedin': { country: 'United States', lat: 37.77, lng: -122.41 },
    'adobe': { country: 'United States', lat: 37.33, lng: -121.89 },
    'canva': { country: 'Australia', lat: -33.86, lng: 151.20 },
    'dropbox': { country: 'United States', lat: 37.77, lng: -122.41 },
    'facebook': { country: 'United States', lat: 37.42, lng: -122.16 },
    'twitter': { country: 'United States', lat: 37.77, lng: -122.41 },
    'yahoo': { country: 'United States', lat: 37.36, lng: -122.03 },
    'uber': { country: 'United States', lat: 37.77, lng: -122.41 },
    'equifax': { country: 'United States', lat: 33.74, lng: -84.38 },

    // Russian / Eastern Europe
    'vk': { country: 'Russia', lat: 59.93, lng: 30.33 },
    'vk.com': { country: 'Russia', lat: 59.93, lng: 30.33 },
    'yandex': { country: 'Russia', lat: 55.75, lng: 37.61 },
    'mail.ru': { country: 'Russia', lat: 55.75, lng: 37.61 },
    'rambler': { country: 'Russia', lat: 55.75, lng: 37.61 },

    // Asian
    'weibo': { country: 'China', lat: 39.90, lng: 116.40 },
    'taobao': { country: 'China', lat: 30.27, lng: 120.15 },
    'alibaba': { country: 'China', lat: 30.27, lng: 120.15 },
    'netease': { country: 'China', lat: 39.90, lng: 116.40 },

    // European
    'dailymotion': { country: 'France', lat: 48.85, lng: 2.35 },
    'deezer': { country: 'France', lat: 48.85, lng: 2.35 },
    'last.fm': { country: 'United Kingdom', lat: 51.50, lng: -0.12 },
    'badoo': { country: 'United Kingdom', lat: 51.50, lng: -0.12 },

    // Social Media / Common US
    'instagram': { country: 'United States', lat: 37.48, lng: -122.14 },
    'github': { country: 'United States', lat: 37.77, lng: -122.41 },
    'reddit': { country: 'United States', lat: 37.77, lng: -122.41 },
    'pinterest': { country: 'United States', lat: 37.77, lng: -122.41 },
    'spotify': { country: 'Sweden', lat: 59.32, lng: 18.06 },
    'soundcloud': { country: 'Germany', lat: 52.52, lng: 13.40 },
    'gitlab': { country: 'United States', lat: 37.77, lng: -122.41 },
    'twitch': { country: 'United States', lat: 37.77, lng: -122.41 },
    'discord': { country: 'United States', lat: 37.77, lng: -122.41 },
    'trello': { country: 'United States', lat: 40.71, lng: -74.00 },
    'vimeo': { country: 'United States', lat: 40.71, lng: -74.00 },
    'flickr': { country: 'United States', lat: 37.77, lng: -122.41 },

    // Generic / Collection
    'collection': { country: 'Unknown (Dark Web)', lat: 0, lng: 0 },
    'compilation': { country: 'Unknown (Dark Web)', lat: 0, lng: 0 },
    'public leak': { country: 'Global Distribution', lat: 20, lng: 0 },
};

export function getLocationForSource(sourceName: string): { country: string; lat: number; lng: number } {
    const normalized = sourceName.toLowerCase().trim();

    // Direct lookup
    if (SOURCE_LOCATIONS[normalized]) {
        return SOURCE_LOCATIONS[normalized];
    }

    // Partial match (e.g. "linkedin scraper" -> "linkedin")
    for (const key of Object.keys(SOURCE_LOCATIONS)) {
        if (normalized.includes(key)) {
            return SOURCE_LOCATIONS[key];
        }
    }

    // Default for totally unknown sources
    return { country: 'Global / Unknown', lat: 25.0 + (Math.random() * 10 - 5), lng: 0.0 + (Math.random() * 20 - 10) };
}
