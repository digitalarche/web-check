export interface ServerLocation {
  city: string,
  region: string,
  country: string,
  postCode: string,
  regionCode: string,
  countryCode: string,
  coords: {
    latitude: number,
    longitude: number,
  },
  isp: string,
  timezone: string,
  languages: string,
  currency: string,
  currencyCode: string,
  countryDomain: string,
  countryAreaSize: number,
  countryPopulation: number,
};

export interface Whois {
  created: string,
  expires: string,
  updated: string,
  nameservers: string[],
}

export const getLocation = (response: any): ServerLocation => {
  return {
    city: response.city,
    region: response.region,
    country: response.country_name,
    postCode: response.postal,
    regionCode: response.region_code,
    countryCode: response.country_code,
    coords: {
      latitude: response.latitude,
      longitude: response.longitude,
    },
    isp: response.org,
    timezone: response.timezone,
    languages: response.languages,
    currencyCode: response.currency,
    currency: response.currency_name,
    countryDomain: response.country_tld,
    countryAreaSize: response.country_area,
    countryPopulation: response.country_population,
  };
};


export interface ServerInfo {
  org: string,
  asn: string,
  isp: string,
  os?: string,
  ip?: string,
  ports?: string,
  loc?: string,
  type?: string,
};

export const getServerInfo = (response: any): ServerInfo => {
  return {
    org: response.org,
    asn: response.asn,
    isp: response.isp,
    os: response.os,
    ip: response.ip_str,
    ports: response.ports.toString(),
    loc: response.city ? `${response.city}, ${response.country_name}` : '',
    type: response.tags ? response.tags.toString() : '',
  };
};

export interface HostNames {
  domains: string[],
  hostnames: string[],
};

export const getHostNames = (response: any): HostNames | null => {
  const { hostnames, domains } = response;
  if ((!domains || domains.length < 1) && (!hostnames || hostnames.length < 1)) {
    return null;
  }
  const results: HostNames = {
    domains: domains || [],
    hostnames: hostnames || [],
  };
  return results;
};

export interface Technology {
  Categories?: string[];
  Parent?: string;
  Name: string;
  Description: string;
  Link: string;
  Tag: string;
  FirstDetected: number;
  LastDetected: number;
  IsPremium: string;
}

export interface TechnologyGroup {
  tag: string;
  technologies: Technology[];
}

export const makeTechnologies = (response: any): TechnologyGroup[] => {
  let flatArray = response.Results[0].Result.Paths
    .reduce((accumulator: any, obj: any) => accumulator.concat(obj.Technologies), []);
  let technologies = flatArray.reduce((groups: any, item: any) => {
    let tag = item.Tag;
    if (!groups[tag]) groups[tag] = [];
    groups[tag].push(item);
    return groups;
  }, {});
  return technologies;
};

export type Cookie = {
  name: string;
  value: string;
  attributes: Record<string, string>;
};

export const parseCookies = (cookiesHeader: string): Cookie[] => {
  if (!cookiesHeader) return [];
  return cookiesHeader.split(/,(?=\s[A-Za-z0-9]+=)/).map(cookieString => {
    const [nameValuePair, ...attributePairs] = cookieString.split('; ').map(part => part.trim());
    const [name, value] = nameValuePair.split('=');
    const attributes: Record<string, string> = {};
    attributePairs.forEach(pair => {
      const [attributeName, attributeValue = ''] = pair.split('=');
      attributes[attributeName] = attributeValue;
    });
    return { name, value, attributes };
  });
}

type RobotsRule = {
  lbl: string;
  val: string;
};

export const parseRobotsTxt = (content: string): RobotsRule[] => {
  const lines = content.split('\n');
  const rules: RobotsRule[] = [];
  lines.forEach(line => {
    const match = line.match(/^(Allow|Disallow):\s*(\S*)$/);
    if (match) {
      const rule: RobotsRule = {
        lbl: match[1],
        val: match[2],
      };
      
      rules.push(rule);
    }
  });
  return rules;
}