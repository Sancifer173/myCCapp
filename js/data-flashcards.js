(function (global) {
  'use strict';

  const FLASHCARDS = [
    // Network Fundamentals
    { id: 'fc-01', domain: 'fundamentals', front: 'OSI Model 7 Layers (Bottom to Top)', back: '1. Physical\n2. Data Link\n3. Network\n4. Transport\n5. Session\n6. Presentation\n7. Application\n(PDUs: Bits, Frames, Packets, Segments, Data)' },
    { id: 'fc-02', domain: 'fundamentals', front: 'TCP vs UDP Header Sizes & Key Differences', back: 'TCP: 20-60 bytes, connection-oriented (3-way handshake), reliable (ACKs, sequencing, windowing).\nUDP: 8 bytes, connectionless, best-effort, low latency.' },
    { id: 'fc-03', domain: 'fundamentals', front: 'Well-Known Ports: FTP, SSH, Telnet, SMTP, DNS', back: 'FTP: TCP 20 (data) / 21 (control)\nSSH: TCP 22\nTelnet: TCP 23\nSMTP: TCP 25\nDNS: UDP/TCP 53' },
    { id: 'fc-04', domain: 'fundamentals', front: 'Well-Known Ports: DHCP, TFTP, HTTP, HTTPS, SNMP', back: 'DHCP: UDP 67 (server) / 68 (client)\nTFTP: UDP 69\nHTTP: TCP 80\nHTTPS: TCP 443\nSNMP: UDP 161 (agent) / 162 (trap)' },
    { id: 'fc-05', domain: 'fundamentals', front: 'RFC 1918 Private IPv4 Ranges', back: '10.0.0.0/8 (10.0.0.0 – 10.255.255.255)\n172.16.0.0/12 (172.16.0.0 – 172.31.255.255)\n192.168.0.0/16 (192.168.0.0 – 192.168.255.255)' },
    { id: 'fc-06', domain: 'fundamentals', front: 'IPv6 Address Types & Prefixes', back: 'Global Unicast: 2000::/3\nUnique Local: FC00::/7 (FD00::/8)\nLink-Local: FE80::/10\nMulticast: FF00::/8\nLoopback: ::1/128 | Unspecified: ::/128' },
    { id: 'fc-07', domain: 'fundamentals', front: 'IPv6 Solicited-Node Multicast & Well-Known Multicast', back: 'FF02::1 = All Nodes\nFF02::2 = All Routers\nFF02::5 = All OSPF Routers\nFF02::6 = All OSPF DR/BDR\nFF02::1:FFxx:xxxx = Solicited-Node Multicast' },
    { id: 'fc-08', domain: 'fundamentals', front: 'PoE Standards & Max PSE Power', back: '802.3af (PoE): 15.4 W\n802.3at (PoE+): 30.0 W\n802.3bt Type 3 (4PPoE): 60 W\n802.3bt Type 4: 90–100 W' },
    { id: 'fc-09', domain: 'fundamentals', front: 'Single-Mode (SMF) vs Multimode (MMF) Fiber', back: 'SMF: ~9 µm core, laser, yellow jacket, long distance (10–80+ km).\nMMF: 50 or 62.5 µm core, LED/VCSEL, orange (OM1/2) or aqua (OM3/4) jacket, short distance (<550 m).' },
    { id: 'fc-10', domain: 'fundamentals', front: 'Interface Status / Line Protocol Meanings', back: 'admin down / down = `shutdown` configured\ndown / down = Layer 1 problem (no cable/signal)\nup / down = Layer 2 problem (encap/keepalive)\nup / up = Operational' },

    // Network Access
    { id: 'fc-11', domain: 'access', front: 'DTP Trunk Negotiation Matrix', back: 'trunk + anything (except access) = Trunk\ndynamic desirable + dynamic desirable/auto = Trunk\ndynamic auto + dynamic auto = Access (NO trunk!)' },
    { id: 'fc-12', domain: 'access', front: '802.1Q Tag Size & Native VLAN Rule', back: '4-byte 802.1Q header (includes 12-bit VLAN ID, 0-4095; usable 1-4094).\nNative VLAN (default VLAN 1) is sent UNTAGGED on 802.1Q trunks.' },
    { id: 'fc-13', domain: 'access', front: 'Rapid PVST+ (802.1w) Port States vs 802.1D', back: '802.1w has 3 states:\n• Discarding (replaces Disabled, Blocking, Listening)\n• Learning\n• Forwarding' },
    { id: 'fc-14', domain: 'access', front: 'STP Root Port & Designated Port Selection Order', back: '1. Lowest Root Path Cost\n2. Lowest Sender Bridge ID\n3. Lowest Sender Port Priority + Port ID\n(Default Bridge Priority = 32768 + VLAN ID)' },
    { id: 'fc-15', domain: 'access', front: 'STP Port Costs (Short vs Long / 802.1D)', back: '10 Mbps = 100\n100 Mbps = 19\n1 Gbps = 4\n10 Gbps = 2' },
    { id: 'fc-16', domain: 'access', front: 'EtherChannel LACP vs PAgP Modes', back: 'LACP (802.3ad): active / passive\nPAgP (Cisco): desirable / auto\nStatic (no negotiation): on / on\nMax active links in LACP = 8 (up to 16 with standby).' },
    { id: 'fc-17', domain: 'access', front: 'CDP vs LLDP Commands & Timers', back: 'CDP (Cisco): 60s hello / 180s holdtime (`show cdp neighbors detail`)\nLLDP (IEEE 802.1AB): 30s hello / 120s holdtime (`lldp run` globally)' },
    { id: 'fc-18', domain: 'access', front: 'Wireless AP Modes (Cisco WLC)', back: 'Local = normal client serving\nFlexConnect = local switching if WAN to WLC drops\nMonitor = IDS/rogue detection only\nSniffer / Rogue Detector / Bridge / Mesh' },
    { id: 'fc-19', domain: 'access', front: 'CAPWAP UDP Ports', back: 'UDP 5246 = CAPWAP Control (encrypted with DTLS)\nUDP 5247 = CAPWAP Data' },
    { id: 'fc-20', domain: 'access', front: 'Wi-Fi Standards: 802.11a/b/g/n/ac/ax', back: '802.11a: 5 GHz (54M)\n802.11b: 2.4 GHz (11M)\n802.11g: 2.4 GHz (54M)\n802.11n (Wi-Fi 4): 2.4/5 GHz\n802.11ac (Wi-Fi 5): 5 GHz\n802.11ax (Wi-Fi 6): 2.4/5 GHz' },

    // IP Connectivity
    { id: 'fc-21', domain: 'connectivity', front: 'Cisco Default Administrative Distances (AD)', back: 'Connected: 0\nStatic: 1\neBGP: 20\nInternal EIGRP: 90\nOSPF: 110\nIS-IS: 115\nRIP: 120\nExternal EIGRP: 170\niBGP: 200' },
    { id: 'fc-22', domain: 'connectivity', front: 'Router Packet Forwarding Decision Order', back: '1. Longest Prefix Match (most specific mask)\n(Note: AD decides which route enters the RIB when two protocols learn the EXACT same prefix/mask; Metric breaks ties within the same protocol.)' },
    { id: 'fc-23', domain: 'connectivity', front: 'OSPFv2 Neighbor States (7 States)', back: 'Down -> Init -> 2-Way (DR/BDR elected here) -> ExStart -> Exchange -> Loading -> Full.\nNote: DROTHER-to-DROTHER stays in 2-Way!' },
    { id: 'fc-24', domain: 'connectivity', front: 'OSPFv2 Default Timers & Multicast Addresses', back: 'Broadcast/P2P Hello: 10s | Dead: 40s\nNBMA Hello: 30s | Dead: 120s\n224.0.0.5 = All OSPF Routers\n224.0.0.6 = All OSPF DR/BDR' },
    { id: 'fc-25', domain: 'connectivity', front: 'OSPF Router ID Selection Order', back: '1. Manual `router-id A.B.C.D`\n2. Highest IP on up/up Loopback\n3. Highest IP on up/up physical interface\n(Requires `clear ip ospf process` to change after startup)' },
    { id: 'fc-26', domain: 'connectivity', front: 'OSPF Network Types Requiring vs Skipping DR/BDR', back: 'Broadcast (Ethernet) & NBMA: Elect DR/BDR.\nPoint-to-Point (`ip ospf network point-to-point`): NO DR/BDR election, faster convergence.' },
    { id: 'fc-27', domain: 'connectivity', front: 'OSPF Default Route Injection Command', back: '`default-information originate` (advertises 0.0.0.0/0 if already in RIB)\nAdd `always` (`default-information originate always`) to advertise even without an existing default route.' },
    { id: 'fc-28', domain: 'connectivity', front: 'HSRP vs VRRP vs GLBP Quick Compare', back: 'HSRP: Cisco, Active/Standby, UDP 1985, 224.0.0.2 (v1) / .102 (v2), priority default 100.\nVRRP: RFC, Master/Backup, IP proto 112, 224.0.0.18.\nGLBP: Cisco, AVG + up to 4 AVFs (load balances).' },
    { id: 'fc-29', domain: 'connectivity', front: 'IPv4 Static Route Syntax (Next-Hop vs Exit Interface)', back: '`ip route <prefix> <mask> <next-hop-ip> [AD]`\nFloating static: set AD higher than dynamic protocol (e.g. `120` over OSPF `110`).' },
    { id: 'fc-30', domain: 'connectivity', front: 'Routing Table Codes (`show ip route`)', back: 'C = Connected, L = Local (/32 host route of router interface), S = Static, S* = Candidate Default, O = OSPF, D = EIGRP, R = RIP, B = BGP' },

    // IP Services
    { id: 'fc-31', domain: 'services', front: '4 NAT Address Terms (Inside/Outside Local/Global)', back: 'Inside Local: Private IP of internal host\nInside Global: Public IP representing internal host\nOutside Global: Public IP of external server\nOutside Local: IP of external host as seen inside' },
    { id: 'fc-32', domain: 'services', front: 'DHCPv4 DORA Sequence', back: 'D - Discover (Broadcast, client->server)\nO - Offer (server->client)\nR - Request (Broadcast, client->server)\nA - Acknowledge (server->client)' },
    { id: 'fc-33', domain: 'services', front: 'DHCP Relay Command & Placement', back: '`ip helper-address <dhcp-server-ip>`\nConfigured on the router interface / SVI facing the DHCP clients.' },
    { id: 'fc-34', domain: 'services', front: 'NTP Stratum & Verification', back: 'Stratum 0: Reference clock (GPS/Atomic)\nStratum 1..15: Valid synced devices\nStratum 16: Unsynchronized\nVerify: `show ntp status`, `show ntp associations`' },
    { id: 'fc-35', domain: 'services', front: 'Syslog Severity Levels 0 to 7', back: '0 Emergencies | 1 Alerts | 2 Critical | 3 Errors | 4 Warnings | 5 Notifications | 6 Informational | 7 Debugging\n(Every Awesome Cisco Engineer Will Need Ice Cream Daily)' },
    { id: 'fc-36', domain: 'services', front: 'SNMPv3 Security Levels', back: 'noAuthNoPriv: Username only\nauthNoPriv: Auth (MD5/SHA) only\nauthPriv: Auth + Encryption (DES/3DES/AES)' },
    { id: 'fc-37', domain: 'services', front: 'QoS Per-Hop Behaviors (EF, AF, CS)', back: 'EF (DSCP 46): Expedited Forwarding -> Voice (low latency queue)\nAF (AF11..AF43): Assured Forwarding -> 4 classes x 3 drop probs (AF41 = Video)\nCS0 (DSCP 0): Best Effort' },
    { id: 'fc-38', domain: 'services', front: 'Cisco IOS SSH Minimum Configuration Checklist', back: '1. `hostname R1`\n2. `ip domain-name lab.local`\n3. `crypto key generate rsa modulus 2048`\n4. `username admin secret <pw>`\n5. `line vty 0 4` -> `login local` + `transport input ssh`' },
    { id: 'fc-39', domain: 'services', front: 'QoS Classification & Marking vs Policing & Shaping', back: 'Classification/Marking: Identify & tag CoS (L2 3-bit) or DSCP (L3 6-bit).\nPolicing: Drops/remarks excess traffic (sawtooth).\nShaping: Buffers/delays excess traffic to smooth rate.' },
    { id: 'fc-40', domain: 'services', front: 'NAT Overload (PAT) Config Steps', back: '1. Mark `ip nat inside` & `ip nat outside` on interfaces\n2. `access-list 1 permit 192.168.1.0 0.0.0.255`\n3. `ip nat inside source list 1 interface Gi0/0 overload`' },

    // Security Fundamentals
    { id: 'fc-41', domain: 'security', front: 'TACACS+ vs RADIUS', back: 'TACACS+: Cisco, TCP 49, encrypts ENTIRE body, separates A-A-A (best for device CLI admin).\nRADIUS: Standard, UDP 1812/1813, encrypts password only, combines AuthN+AuthZ (best for 802.1X/VPN).' },
    { id: 'fc-42', domain: 'security', front: 'Standard vs Extended IPv4 ACLs', back: 'Standard (1-99, 1300-1999): Matches Source IP only -> Place near DESTINATION.\nExtended (100-199, 2000-2699): Matches Src, Dst, Proto, Ports -> Place near SOURCE.' },
    { id: 'fc-43', domain: 'security', front: 'Port Security Violation Modes', back: 'shutdown (default): err-disabled + log + counter\nrestrict: drop violating frames + syslog/SNMP + counter\nprotect: silent drop only (no log/counter)' },
    { id: 'fc-44', domain: 'security', front: 'DHCP Snooping + DAI + IP Source Guard', back: 'DHCP Snooping: Blocks rogue DHCP servers (`ip dhcp snooping trust` on uplinks); builds binding table.\nDAI: Checks ARP against snooping table.\nIPSG: Filters IP/MAC packets against snooping table.' },
    { id: 'fc-45', domain: 'security', front: 'Port Security Sticky MAC Command', back: '`switchport port-security mac-address sticky`\nDynamically learns MACs and automatically saves them into the running-config.' },
    { id: 'fc-46', domain: 'security', front: 'WPA2 vs WPA3 Key Improvements', back: 'WPA2-Personal: PSK + AES-CCMP (vulnerable to offline dictionary attack on 4-way handshake).\nWPA3-Personal: SAE (Dragonfly) + mandatory Protected Management Frames (PMF) + 192-bit suite for Enterprise.' },
    { id: 'fc-47', domain: 'security', front: 'Security Triad: Confidentiality, Integrity, Availability', back: 'Confidentiality: Encryption (AES, IPsec, TLS)\nIntegrity: Hashing (SHA-256, HMAC)\nAvailability: Redundancy (HSRP, EtherChannel, UPS, DDoS mitigation)' },
    { id: 'fc-48', domain: 'security', front: 'IPsec Transport vs Tunnel Mode & AH vs ESP', back: 'Tunnel Mode: Encrypts entire original IP packet + adds new IP header (site-to-site VPN).\nTransport Mode: Encrypts payload only (host-to-host).\nESP (Proto 50): Encrypts + Auth. AH (Proto 51): Auth only.' },
    { id: 'fc-49', domain: 'security', front: 'ACL Wildcard Mask Trick', back: 'Wildcard = 255.255.255.255 minus Subnet Mask.\n`0.0.0.0` = `host` keyword\n`255.255.255.255` = `any` keyword\nMatch even/odd subnets by inspecting bit 0 (0.0.0.254).' },
    { id: 'fc-50', domain: 'security', front: 'Cisco IOS Password Encryption Types', back: 'Type 0: Cleartext\nType 7: Weak Vigenere (`service password-encryption`)\nType 5: MD5 (`enable secret` older IOS)\nType 8/9: PBKDF2-SHA256 / scrypt (modern `secret`)' },

    // Automation & Programmability
    { id: 'fc-51', domain: 'automation', front: 'Control Plane vs Data Plane vs Management Plane', back: 'Control: Builds routing/MAC/ARP tables (OSPF, STP).\nData: Forwards packets/frames in hardware (CEF, ASIC).\nManagement: Device access/monitoring (SSH, SNMP, Syslog, REST).' },
    { id: 'fc-52', domain: 'automation', front: 'Northbound vs Southbound SDN APIs', back: 'Northbound: Apps/Scripts <-> Controller (usually REST/JSON).\nSouthbound: Controller <-> Network Devices (NETCONF, RESTCONF, OpenFlow, SSH/SNMP).' },
    { id: 'fc-53', domain: 'automation', front: 'REST HTTP Verbs <-> CRUD Mapping', back: 'POST = Create\nGET = Read\nPUT = Update/Replace (full)\nPATCH = Update (partial)\nDELETE = Delete' },
    { id: 'fc-54', domain: 'automation', front: 'REST HTTP Status Code Categories', back: '2xx = Success (200 OK, 201 Created, 204 No Content)\n3xx = Redirect\n4xx = Client Error (400 Bad Request, 401 Unauth, 403 Forbidden, 404 Not Found)\n5xx = Server Error (500, 503)' },
    { id: 'fc-55', domain: 'automation', front: 'JSON vs YAML vs XML', back: 'JSON: `{ "key": "val" }`, arrays `[]`, no comments, no trailing commas.\nYAML: Spaces indentation, `---` start, `#` comments (Ansible).\nXML: `<tag>value</tag>` (NETCONF).' },
    { id: 'fc-56', domain: 'automation', front: 'Ansible vs Puppet vs Chef vs Terraform', back: 'Ansible: Agentless, Push, YAML.\nPuppet: Agent-based, Pull, Ruby DSL (TCP 8140).\nChef: Agent-based, Pull, Ruby (Recipes/Cookbooks).\nTerraform: Declarative IaC, HCL, State file.' },
    { id: 'fc-57', domain: 'automation', front: 'Cisco SDA (Software-Defined Access) Planes', back: 'Underlay: Physical IP reachability (IS-IS)\nOverlay Control: LISP\nOverlay Data: VXLAN\nOverlay Policy: SGT (Security Group Tags)' },
    { id: 'fc-58', domain: 'automation', front: 'NETCONF vs RESTCONF Ports & Formats', back: 'NETCONF: SSH (TCP 830), XML payloads, YANG data models.\nRESTCONF: HTTPS (TCP 443), JSON or XML payloads, YANG data models.' },
    { id: 'fc-59', domain: 'automation', front: 'AI/ML in Network Operations (CCNA v1.1)', back: 'Predictive AI/ML learns normal telemetry baselines to forecast capacity issues & flag anomalies.\nGenerative AI assists engineers with natural-language queries, config explanations, and troubleshooting workflows.' },
    { id: 'fc-60', domain: 'automation', front: 'Traditional Device-by-Device vs Controller-Based Management', back: 'Traditional: Distributed control plane per device, manual CLI/SSH, prone to drift.\nController-Based (e.g. Catalyst Center): Centralized policy/intent, automated provisioning, single pane of glass.' }
  ];

  // SM-2 simplified spaced repetition scheduler
  // quality: 1 = Again, 2 = Hard, 3 = Good, 4 = Easy
  function scheduleCard(prev, quality) {
    const now = Date.now();
    const DAY = 86400000;
    const state = prev ? { ...prev } : { interval: 0, easeFactor: 2.5, reps: 0, lapses: 0, dueAt: now };

    if (quality === 1) {
      state.reps = 0;
      state.interval = 0;
      state.lapses = (state.lapses || 0) + 1;
      state.easeFactor = Math.max(1.3, state.easeFactor - 0.2);
      state.dueAt = now + 60 * 1000; // 1 minute retry
    } else {
      if (state.reps === 0) {
        state.interval = quality === 4 ? 4 : 1;
      } else if (state.reps === 1) {
        state.interval = quality === 4 ? 7 : quality === 3 ? 6 : 3;
      } else {
        const mult = quality === 2 ? 1.2 : quality === 4 ? state.easeFactor * 1.3 : state.easeFactor;
        state.interval = Math.max(1, Math.round(state.interval * mult));
      }
      state.reps += 1;
      const efDelta = quality === 2 ? -0.15 : quality === 4 ? 0.15 : 0;
      state.easeFactor = Math.max(1.3, Math.min(3.0, Number((state.easeFactor + efDelta).toFixed(2))));
      state.dueAt = now + state.interval * DAY;
    }

    state.lastReviewedAt = now;
    return state;
  }

  function formatInterval(days) {
    if (!days || days <= 0) return '1 min';
    if (days === 1) return '1 day';
    if (days < 30) return days + ' days';
    const months = Math.round(days / 30);
    return months === 1 ? '1 mo' : months + ' mos';
  }

  global.CCNA_FLASHCARDS = FLASHCARDS;
  global.CCNACardSRS = { scheduleCard, formatInterval };
})(window);
