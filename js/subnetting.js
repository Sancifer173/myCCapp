(function (global) {
  'use strict';

  function isValidIPv4(ip) {
    const parts = (ip || '').trim().split('.');
    if (parts.length !== 4) return false;
    return parts.every((p) => /^\d+$/.test(p) && Number(p) >= 0 && Number(p) <= 255);
  }

  function ipToInt(ip) {
    const parts = ip.trim().split('.').map(Number);
    return (((parts[0] << 24) >>> 0) + ((parts[1] << 16) >>> 0) + ((parts[2] << 8) >>> 0) + parts[3]) >>> 0;
  }

  function intToIp(num) {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');
  }

  function cidrToMaskInt(cidr) {
    if (cidr === 0) return 0;
    return (0xffffffff << (32 - cidr)) >>> 0;
  }

  function toBinaryOctets(num) {
    return [
      ((num >>> 24) & 255).toString(2).padStart(8, '0'),
      ((num >>> 16) & 255).toString(2).padStart(8, '0'),
      ((num >>> 8) & 255).toString(2).padStart(8, '0'),
      (num & 255).toString(2).padStart(8, '0')
    ].join('.');
  }

  function analyzeIPv4(ip, cidr) {
    const c = Number(cidr);
    const ipInt = ipToInt(ip);
    const maskInt = cidrToMaskInt(c);
    const wildcardInt = (~maskInt) >>> 0;
    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | wildcardInt) >>> 0;
    const totalAddresses = Math.pow(2, 32 - c);
    const usableHosts = c >= 31 ? (c === 32 ? 1 : 2) : totalAddresses - 2;
    const firstHostInt = c >= 31 ? networkInt : (networkInt + 1) >>> 0;
    const lastHostInt = c >= 31 ? broadcastInt : (broadcastInt - 1) >>> 0;

    // Magic number & interesting octet
    const interestingOctetIdx = c === 32 ? 3 : Math.floor(c / 8);
    const maskOctets = intToIp(maskInt).split('.').map(Number);
    const ipOctets = ip.split('.').map(Number);
    const blockSize = 256 - maskOctets[interestingOctetIdx];
    const networkOctetVal = Math.floor(ipOctets[interestingOctetIdx] / blockSize) * blockSize;

    return {
      ip,
      cidr: c,
      mask: intToIp(maskInt),
      wildcard: intToIp(wildcardInt),
      network: intToIp(networkInt),
      broadcast: intToIp(broadcastInt),
      firstHost: intToIp(firstHostInt),
      lastHost: intToIp(lastHostInt),
      usableHosts,
      totalAddresses,
      ipBinary: toBinaryOctets(ipInt),
      maskBinary: toBinaryOctets(maskInt),
      interestingOctetIdx: interestingOctetIdx + 1,
      interestingMaskOctet: maskOctets[interestingOctetIdx],
      blockSize,
      networkOctetVal
    };
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateIPv4Challenge(difficulty) {
    let minCidr = 16;
    let maxCidr = 30;
    if (difficulty === 'easy') {
      minCidr = 24;
      maxCidr = 30;
    } else if (difficulty === 'medium') {
      minCidr = 16;
      maxCidr = 23;
    }
    const cidr = randInt(minCidr, maxCidr);
    const bases = [
      [10, randInt(1, 254), randInt(1, 254), randInt(1, 254)],
      [172, randInt(16, 31), randInt(1, 254), randInt(1, 254)],
      [192, 168, randInt(1, 254), randInt(1, 254)]
    ];
    const octets = bases[randInt(0, bases.length - 1)];
    const ip = octets.join('.');
    const info = analyzeIPv4(ip, cidr);

    // Pick a host that isn't already network or broadcast so the challenge feels realistic
    if (ip === info.network || ip === info.broadcast) {
      const shifted = intToIp((ipToInt(info.network) + 1) >>> 0);
      return { ip: shifted, cidr, info: analyzeIPv4(shifted, cidr) };
    }
    return { ip, cidr, info };
  }

  function expandIPv6(addr) {
    const clean = (addr || '').trim().toLowerCase();
    if (!clean) return null;
    const parts = clean.split('::');
    if (parts.length > 2) return null;
    let hextets = [];
    if (parts.length === 2) {
      const left = parts[0] ? parts[0].split(':') : [];
      const right = parts[1] ? parts[1].split(':') : [];
      const missing = 8 - (left.length + right.length);
      if (missing < 1) return null;
      hextets = [...left, ...Array(missing).fill('0000'), ...right];
    } else {
      hextets = clean.split(':');
    }
    if (hextets.length !== 8) return null;
    if (!hextets.every((h) => /^[0-9a-f]{1,4}$/.test(h))) return null;
    return hextets.map((h) => h.padStart(4, '0')).join(':');
  }

  function compressIPv6(addr) {
    const expanded = expandIPv6(addr);
    if (!expanded) return null;
    const stripped = expanded.split(':').map((h) => h.replace(/^0+/, '') || '0');
    let bestStart = -1;
    let bestLen = 0;
    let curStart = -1;
    let curLen = 0;
    for (let i = 0; i < 8; i++) {
      if (stripped[i] === '0') {
        if (curStart === -1) curStart = i;
        curLen++;
        if (curLen > bestLen) {
          bestStart = curStart;
          bestLen = curLen;
        }
      } else {
        curStart = -1;
        curLen = 0;
      }
    }
    if (bestLen < 2) return stripped.join(':');
    const left = stripped.slice(0, bestStart).join(':');
    const right = stripped.slice(bestStart + bestLen).join(':');
    return left + '::' + right;
  }

  function generateIPv6Challenge() {
    const randHex = () => randInt(1, 0xffff).toString(16).padStart(4, '0');
    const templates = [
      {
        typeLabel: 'Global Unicast (2000::/3)',
        full: ['2001', '0db8', '00' + randInt(10, 99).toString(16), '0000', '0000', '0000', '0000', '00' + randInt(10, 99).toString(16)]
      },
      {
        typeLabel: 'Link-Local Unicast (FE80::/10)',
        full: ['fe80', '0000', '0000', '0000', '02' + randInt(10, 99).toString(16), '00ff', 'fe' + randInt(10, 99).toString(16), randHex()]
      },
      {
        typeLabel: 'Unique Local (FC00::/7)',
        full: ['fd' + randInt(10, 99).toString(16), '0000', '0000', '001a', '0000', '0000', '0000', '000' + randInt(1, 9).toString(16)]
      },
      {
        typeLabel: 'Global Unicast (2000::/3)',
        full: ['2001', '0db8', '0000', '0000', '000a', '0000', '0000', '0001']
      }
    ];
    const picked = templates[randInt(0, templates.length - 1)];
    const fullStr = picked.full.join(':');
    const compressedStr = compressIPv6(fullStr);
    const mode = Math.random() < 0.5 ? 'compress' : 'expand';
    return {
      mode,
      typeLabel: picked.typeLabel,
      full: fullStr,
      compressed: compressedStr,
      promptAddress: mode === 'compress' ? fullStr : compressedStr,
      expected: mode === 'compress' ? compressedStr : fullStr
    };
  }

  global.CCNASubnetting = {
    isValidIPv4,
    analyzeIPv4,
    generateIPv4Challenge,
    expandIPv6,
    compressIPv6,
    generateIPv6Challenge
  };
})(window);
