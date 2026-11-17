/* CCNA 200-301 Study Hub — Obsidian-Style Concept Knowledge Map */
(function (global) {
  'use strict';

  global.CCNA_GRAPH = {
    nodes: [
      { id: 'kw-01', label: 'OSI & PDU', labelZh: 'OSI 七層 & PDU', domain: 'fundamentals', importance: 3 },
      { id: 'kw-02', label: 'TCP / UDP & Ports', labelZh: 'TCP / UDP & Port', domain: 'fundamentals', importance: 3 },
      { id: 'kw-03', label: 'L2 Switch & Domains', labelZh: 'L2 Switch & 網域', domain: 'fundamentals', importance: 3 },
      { id: 'kw-04', label: 'UTP & Duplex', labelZh: '銅線 & Duplex', domain: 'fundamentals', importance: 2 },
      { id: 'kw-05', label: 'Fiber SMF / MMF', labelZh: '光纖 SMF / MMF', domain: 'fundamentals', importance: 2 },
      { id: 'kw-06', label: 'Wireless & CAPWAP', labelZh: '無線 & WLC/CAPWAP', domain: 'access', importance: 2 },
      { id: 'kw-07', label: 'IPv4 & RFC 1918', labelZh: 'IPv4 & 私有 IP', domain: 'fundamentals', importance: 3 },
      { id: 'kw-08', label: 'Subnetting & VLSM', labelZh: '子網切割 & VLSM', domain: 'fundamentals', importance: 3 },
      { id: 'kw-09', label: 'IOS CLI & Console', labelZh: 'IOS CLI & 密碼', domain: 'access', importance: 2 },
      { id: 'kw-10', label: 'Interface Status', labelZh: '介面狀態診斷', domain: 'connectivity', importance: 2 },
      { id: 'kw-11', label: 'LPM, AD & Metric', labelZh: 'LPM, AD & Metric', domain: 'connectivity', importance: 3 },
      { id: 'kw-12', label: 'Static & Floating', labelZh: '靜態 & 浮動路由', domain: 'connectivity', importance: 3 },
      { id: 'kw-13', label: 'RIPv2', labelZh: 'RIPv2 路由', domain: 'connectivity', importance: 2 },
      { id: 'kw-14', label: 'EIGRP & DUAL', labelZh: 'EIGRP & DUAL', domain: 'connectivity', importance: 2 },
      { id: 'kw-15', label: 'OSPFv2 & Cost', labelZh: 'OSPFv2 & Cost', domain: 'connectivity', importance: 3 },
      { id: 'kw-16', label: 'OSPF States & DR', labelZh: 'OSPF 鄰居 & DR/BDR', domain: 'connectivity', importance: 3 },
      { id: 'kw-17', label: 'IPv6 & EUI-64', labelZh: 'IPv6 & EUI-64', domain: 'connectivity', importance: 3 },
      { id: 'kw-18', label: 'IPv6 Static / OSPFv3', labelZh: 'IPv6 路由 & OSPFv3', domain: 'connectivity', importance: 2 },
      { id: 'kw-19', label: 'TFTP / FTP / SCP', labelZh: 'TFTP / FTP / SCP', domain: 'services', importance: 1 },
      { id: 'kw-20', label: 'CDP vs LLDP', labelZh: 'CDP vs LLDP', domain: 'access', importance: 2 },
      { id: 'kw-21', label: 'DHCP DORA & Relay', labelZh: 'DHCP & Helper IP', domain: 'services', importance: 3 },
      { id: 'kw-22', label: 'SSHv2 & AAA', labelZh: 'SSHv2 & AAA', domain: 'security', importance: 3 },
      { id: 'kw-23', label: 'NTP & Syslog', labelZh: 'NTP & Syslog', domain: 'services', importance: 2 },
      { id: 'kw-24', label: 'SNMP & QoS', labelZh: 'SNMP & QoS', domain: 'services', importance: 2 },
      { id: 'kw-25', label: 'Wildcard & Std ACL', labelZh: 'Wildcard & 標準 ACL', domain: 'security', importance: 3 },
      { id: 'kw-26', label: 'Extended ACL', labelZh: '延伸 ACL & 方向', domain: 'security', importance: 3 },
      { id: 'kw-27', label: 'NAT & PAT Overload', labelZh: 'NAT & PAT 轉換', domain: 'services', importance: 3 },
      { id: 'kw-28', label: 'SDN & DNA Center', labelZh: 'SDN & DNA Center', domain: 'automation', importance: 3 },
      { id: 'kw-29', label: 'Ansible & RESTCONF', labelZh: '自動化 & JSON/REST', domain: 'automation', importance: 3 },
      { id: 'kw-30', label: 'Campus & Spine-Leaf', labelZh: '三層 / Spine-Leaf 拓撲', domain: 'fundamentals', importance: 2 },
      { id: 'kw-31', label: 'FHRP / HSRP', labelZh: 'HSRP / VRRP / GLBP', domain: 'services', importance: 3 },
      { id: 'kw-32', label: 'IPsec VPN & GRE', labelZh: 'IPsec VPN & GRE', domain: 'security', importance: 2 },
      { id: 'kw-33', label: 'VLAN & 802.1Q Trunk', labelZh: 'VLAN & 802.1Q Trunk', domain: 'access', importance: 3 },
      { id: 'kw-34', label: 'Inter-VLAN & SVI', labelZh: '跨 VLAN 路由 & SVI', domain: 'connectivity', importance: 3 },
      { id: 'kw-35', label: 'Port Security', labelZh: 'Port Security 安全', domain: 'security', importance: 3 },
      { id: 'kw-36', label: 'STP 802.1D & PortFast', labelZh: 'STP 802.1D & Root', domain: 'access', importance: 3 },
      { id: 'kw-37', label: 'Root & BPDU Guard', labelZh: 'Root / BPDU Guard', domain: 'security', importance: 2 },
      { id: 'kw-38', label: 'RSTP 802.1w', labelZh: 'RSTP 快速生成樹', domain: 'access', importance: 2 },
      { id: 'kw-39', label: 'EtherChannel', labelZh: 'EtherChannel 聚合', domain: 'access', importance: 3 },
      { id: 'kw-40', label: 'Native VLAN & Hopping', labelZh: 'Native VLAN & 防跳躍', domain: 'security', importance: 2 },
      { id: 'kw-41', label: 'DHCP Snoop & DAI', labelZh: 'DHCP Snooping & DAI', domain: 'security', importance: 3 },
      { id: 'kw-42', label: 'PoE & Interface Errors', labelZh: 'PoE 供電 & 介面錯誤', domain: 'fundamentals', importance: 2 },
      { id: 'kw-43', label: 'DNS & DHCP Options', labelZh: 'DNS 解析 & Option 150', domain: 'services', importance: 2 },
      { id: 'kw-44', label: 'Threats, MFA & WPA3', labelZh: '網路威脅, MFA & WPA3', domain: 'security', importance: 2 },
      { id: 'kw-45', label: 'BGP & Cloud IaaS/SaaS', labelZh: 'BGP & 雲端虛擬化', domain: 'connectivity', importance: 2 },
      { id: 'kw-46', label: 'Lab 1: 4-Router WAN', labelZh: 'Lab 1: 4-Router WAN', domain: 'connectivity', importance: 2 },
      { id: 'kw-47', label: 'Lab 2: 5-Router WAN', labelZh: 'Lab 2: 5-Router 動態路由', domain: 'connectivity', importance: 2 },
      { id: 'kw-48', label: 'Lab 3: Dual-SW VLAN', labelZh: 'Lab 3: 雙 Switch 跨 VLAN', domain: 'access', importance: 2 }
    ],
    edges: [
      {
        source: 'kw-01', target: 'kw-02',
        rel: 'L4 Transport', relZh: 'Layer 4 傳輸封裝',
        why: 'OSI Layer 4 segments/datagrams use TCP or UDP port numbers to multiplex application traffic.',
        whyZh: 'OSI 第四層（Transport Layer）透過 TCP / UDP 及 Port 號分辨唔同應用程式嘅數據流（Segment / Datagram）。'
      },
      {
        source: 'kw-01', target: 'kw-03',
        rel: 'L2 Frame Forwarding', relZh: 'Layer 2 Frame 轉發',
        why: 'OSI Layer 2 switches inspect destination MAC addresses in Ethernet frames while routers separate Layer 3 broadcast domains.',
        whyZh: 'OSI 第二層交換器睇 Frame 入面嘅 MAC 位址轉發數據；而第三層 Router 先可以隔開 Broadcast Domain。'
      },
      {
        source: 'kw-01', target: 'kw-11',
        rel: 'L3 Packet Routing', relZh: 'Layer 3 封包選路',
        why: 'Routers decapsulate Layer 2 headers, inspect the Layer 3 IPv4/IPv6 packet destination, and pick the best path via LPM.',
        whyZh: 'Router 拆開 Layer 2 Frame 後會檢查 Layer 3 Packet 嘅目的 IP，再用最長前綴匹配 (LPM) 決定轉發出口。'
      },
      {
        source: 'kw-02', target: 'kw-19',
        rel: 'File Protocol Ports', relZh: '檔案傳輸底層 Port',
        why: 'TFTP uses unreliable UDP 69, whereas FTP (TCP 20/21) and SCP/SFTP (TCP 22) rely on TCP reliability.',
        whyZh: 'TFTP 用無連線 UDP 69；FTP 用 TCP 20/21；而加密嘅 SCP/SFTP 就經 TCP 22 傳送 IOS 或設定檔。'
      },
      {
        source: 'kw-02', target: 'kw-21',
        rel: 'DHCP Uses UDP 67/68', relZh: 'DHCP 用 UDP 67/68',
        why: 'DHCP clients use UDP port 68 and servers listen on UDP port 67 during broadcast DORA discovery.',
        whyZh: '未有 IP 嘅主機要用廣播收發封包，所以 DHCP 採用輕量嘅 UDP 67 (Server) 同 UDP 68 (Client)。'
      },
      {
        source: 'kw-02', target: 'kw-22',
        rel: 'SSH TCP 22 vs Telnet 23', relZh: 'SSH (22) vs Telnet (23)',
        why: 'Securing management replaces plaintext TCP 23 Telnet with encrypted TCP 22 SSHv2.',
        whyZh: '遠端管理一定要棄用明文 TCP 23 Telnet，改用加密嘅 TCP 22 SSHv2 保護密碼同指令。'
      },
      {
        source: 'kw-02', target: 'kw-26',
        rel: 'ACL Port Filtering', relZh: 'Extended ACL 過濾 Port',
        why: 'Extended ACLs match Layer 4 protocol (TCP/UDP) and port numbers such as HTTP 80, HTTPS 443, and DNS 53.',
        whyZh: 'Extended ACL 除了對 IP，仲可以直接按 TCP/UDP Port 號（例如 eq 80, 443, 53）精準放行或阻擋流量。'
      },
      {
        source: 'kw-03', target: 'kw-04',
        rel: 'Duplex & Collision Domain', relZh: '全雙工消除碰撞',
        why: 'Modern full-duplex switches isolate each port into its own collision domain and eliminate CSMA/CD late collisions.',
        whyZh: 'Switch 每個 Port 係獨立 Collision Domain；配合 Full-Duplex 可以雙向同時收發，完全唔會發生碰撞。'
      },
      {
        source: 'kw-03', target: 'kw-33',
        rel: 'VLAN Splits Broadcast Domain', relZh: 'VLAN 切割廣播網域',
        why: 'By default all switch ports share one broadcast domain; VLANs divide one physical switch into multiple isolated broadcast domains.',
        whyZh: '預設 Switch 所有 Port 屬同一廣播網域；劃分 VLAN 後每個 VLAN 各自成為獨立嘅 Broadcast Domain。'
      },
      {
        source: 'kw-03', target: 'kw-35',
        rel: 'MAC Table Protection', relZh: '限制每個 Port 學幾多個 MAC',
        why: 'Port Security limits how many dynamic or sticky MAC addresses a switch port may learn in its CAM table.',
        whyZh: 'Switch 靠 CAM Table 記低 MAC；Port Security 就係鎖死每個 Port 最多學到幾多個合法 MAC。'
      },
      {
        source: 'kw-03', target: 'kw-36',
        rel: 'Loop-Free L2 Switching', relZh: '防止 L2 廣播風暴',
        why: 'Because Layer 2 frames have no TTL, redundant switch links cause broadcast storms unless STP blocks redundant paths.',
        whyZh: 'Layer 2 Frame 冇 TTL，一旦有冗餘線就會出現廣播風暴同 MAC Table 震盪，所以一定要靠 STP 阻塞冗餘埠。'
      },
      {
        source: 'kw-04', target: 'kw-05',
        rel: 'Copper vs Fiber Media', relZh: '銅線 vs 光纖選型',
        why: 'UTP copper reaches 100 m and resists EMI poorly, while MMF (~550 m) and SMF (kilometers) carry light over SFP transceivers.',
        whyZh: 'Cat5e/6 銅線上限 100 米；超過距離或防電磁干擾就要用多模 MMF（短中距）或單模 SMF（長距離）光纖。'
      },
      {
        source: 'kw-04', target: 'kw-10',
        rel: 'Layer 1 Diagnostics', relZh: 'Duplex 不匹配同介面錯誤',
        why: 'Duplex mismatch, bad UTP crimps, or wrong cable standards show up as CRC, runts, late collisions, or down/down in show interfaces.',
        whyZh: '插錯線、接觸不良或者 Duplex 不匹配，會喺 show interfaces 呈現 Late Collisions、CRC 錯誤甚至 down/down。'
      },
      {
        source: 'kw-04', target: 'kw-42',
        rel: 'Power + Data over UTP', relZh: '同一條 UTP 同時供電',
        why: 'PoE injects DC power onto UTP pairs alongside Ethernet data to power IP phones and wireless access points.',
        whyZh: 'PoE (802.3af/at/bt) 直接透過現有 Cat5e/6 銅線為 AP 同 IP 電話供電，唔駛額外拉電源線。'
      },
      {
        source: 'kw-06', target: 'kw-33',
        rel: 'SSID Maps to VLAN', relZh: '每個 SSID 對應專屬 VLAN',
        why: 'Lightweight APs and WLC FlexConnect/central switching map wireless SSIDs to tagged 802.1Q VLANs on switch ports.',
        whyZh: '企業無線網路會將唔同 SSID（例如公司網、訪客網）對應去唔同 VLAN，經 Trunk 送入核心網分流。'
      },
      {
        source: 'kw-06', target: 'kw-42',
        rel: 'APs Powered by PoE+', relZh: 'AP 靠 PoE 供電',
        why: 'Enterprise 802.11ax/ac Access Points draw power from switch ports using 802.3at PoE+ or 802.3bt.',
        whyZh: '掛喺天花板嘅企業級 AP 通常靠 Switch 提供 802.3at PoE+ 供電，所以要識睇 Switch PoE 功率上限。'
      },
      {
        source: 'kw-06', target: 'kw-44',
        rel: 'Wireless Encryption', relZh: 'WPA2 / WPA3 無線保安',
        why: '802.11 WLANs require WPA2-AES or WPA3 (SAE / 802.1X RADIUS) rather than broken WEP/TKIP.',
        whyZh: 'Wi-Fi 訊號喺空氣傳播好易俾人截聽，必須用 WPA2-AES 或 WPA3 + 802.1X 保護無線連線。'
      },
      {
        source: 'kw-07', target: 'kw-08',
        rel: 'Classful Base to CIDR', relZh: '由 Classful 演變至 VLSM',
        why: 'Understanding Class A/B/C boundaries and RFC 1918 private blocks is the foundation for binary CIDR and VLSM subnetting.',
        whyZh: '先分清 Class A/B/C 預設遮罩同 RFC 1918 私有範圍，先可以靈活進行 CIDR 同 VLSM 慳 IP 切割。'
      },
      {
        source: 'kw-07', target: 'kw-27',
        rel: 'Private IPs Need NAT', relZh: 'RFC 1918 上網必須經 NAT',
        why: 'RFC 1918 private addresses are not routable on the public Internet and must be translated by NAT/PAT at the edge router.',
        whyZh: '10.x、172.16-31.x、192.168.x 私有 IP 唔可以直接出公網，一定要喺邊界 Router 做 NAT / PAT 轉換。'
      },
      {
        source: 'kw-07', target: 'kw-17',
        rel: 'IPv4 Exhaustion -> IPv6', relZh: '解決 IPv4 位址耗盡',
        why: '32-bit IPv4 exhaustion drove NAT workarounds and the transition to 128-bit IPv6 with global end-to-end reachability.',
        whyZh: '因為 32-bit IPv4 唔夠用先要用 NAT 頂住；長遠解決方案係轉用 128-bit IPv6。'
      },
      {
        source: 'kw-08', target: 'kw-11',
        rel: 'Prefix Length Picks Route', relZh: '遮罩長度決定選路',
        why: 'VLSM creates overlapping summaries and specific host routes; routers always pick the longest matching prefix first.',
        whyZh: 'VLSM 令路由表同時出現唔同長度嘅網段，Router 永遠優先揀遮罩最長（最精準）嗰條路 (Longest Prefix Match)。'
      },
      {
        source: 'kw-08', target: 'kw-25',
        rel: 'Subnet Mask vs Wildcard', relZh: '遮罩反轉變 Wildcard Mask',
        why: 'ACL and OSPF wildcard masks are the bitwise inverse of subnet masks (255.255.255.255 minus subnet mask).',
        whyZh: '計準 Subnet Mask 之後，用 255.255.255.255 一減就係 ACL 同 OSPF 要用嘅 Wildcard Mask！'
      },
      {
        source: 'kw-08', target: 'kw-46',
        rel: 'Applied in WAN Lab', relZh: 'Lab 1 網段規劃基礎',
        why: 'Lab Sheet 1 allocates /30 point-to-point serial links and /24 LAN subnets across four routers.',
        whyZh: 'Lab Sheet 1 要自己為 4 部 Router 嘅 Serial WAN (/30) 同 LAN 分配唔重疊嘅 IP 網段。'
      },
      {
        source: 'kw-09', target: 'kw-10',
        rel: 'Basic Bring-Up Commands', relZh: 'no shutdown 啟動介面',
        why: 'Cisco ports on routers start administratively down until enabled via interface configuration mode using no shutdown.',
        whyZh: 'Router 新介面預設係 administratively down，要入 config-if 打 no shutdown 先會變成 up/up。'
      },
      {
        source: 'kw-09', target: 'kw-22',
        rel: 'Securing Console & VTY', relZh: '由 Console 密碼升級 SSH',
        why: 'Basic line passwords and service password-encryption lead directly into SSHv2 and AAA hardening for VTY remote access.',
        whyZh: '做完 Console 密碼同 secret 加密，下一步就要設定 domain-name、RSA key 同 transport input ssh 鎖定 VTY。'
      },
      {
        source: 'kw-10', target: 'kw-39',
        rel: 'Member Port Mismatch Drops', relZh: '參數不符導致 err-disabled',
        why: 'Speed/duplex or trunk mismatches drop bundled EtherChannel interfaces or put ports into err-disabled/suspended state.',
        whyZh: 'EtherChannel 成員 Port 速度/Duplex 唔一致，會喺 show interfaces 同 EtherChannel 狀態出現 suspended 或 err-disabled。'
      },
      {
        source: 'kw-11', target: 'kw-12',
        rel: 'AD Controls Backup Route', relZh: '用 AD 設定浮動備援路由',
        why: 'Setting an Administrative Distance higher than OSPF (110) or EIGRP (90) makes a static route a floating backup path.',
        whyZh: '明白 AD 值（Connected 0 < Static 1 < EIGRP 90 < OSPF 110），先識將備援靜態路由嘅 AD 調高做成 Floating Static Route。'
      },
      {
        source: 'kw-11', target: 'kw-13',
        rel: 'AD 120 & Hop Count Metric', relZh: 'RIPv2 用 AD 120 及跳數',
        why: 'RIPv2 uses AD 120 and a simple hop-count metric capped at 15, losing whenever EIGRP or OSPF knows the same route.',
        whyZh: 'RIPv2 嘅 AD 高達 120（只細過 Unknown），加上只計 Hop 數唔理頻寬，所以會讓路俾 OSPF 或 EIGRP。'
      },
      {
        source: 'kw-11', target: 'kw-14',
        rel: 'AD 90 & Composite Metric', relZh: 'EIGRP AD 90 及 DUAL Metric',
        why: 'Internal EIGRP beats OSPF (110) thanks to AD 90 and selects Feasible Successors via bandwidth and delay.',
        whyZh: 'EIGRP Internal AD 係 90（細過 OSPF 110），Metric 則結合頻寬同延遲，由 DUAL 即時切換備援路徑。'
      },
      {
        source: 'kw-11', target: 'kw-15',
        rel: 'AD 110 & Cost Metric', relZh: 'OSPF AD 110 與 Cost 計算',
        why: 'OSPF compares routes to the same prefix using cumulative interface Cost (Reference BW / Interface BW) and installs routes at AD 110.',
        whyZh: 'OSPF 以 AD 110 寫入路由表；同為 OSPF 路徑時則比較累積 Cost（參考頻寬 ÷ 介面頻寬）。'
      },
      {
        source: 'kw-12', target: 'kw-34',
        rel: 'Default Gateway Beyond LAN', relZh: 'LAN 出口與 Default Route',
        why: 'After Layer 3 switches or ROAS perform Inter-VLAN routing, a default route (0.0.0.0/0) forwards Internet-bound traffic to the WAN edge.',
        whyZh: '內網靠 ROAS 或 SVI 做完跨 VLAN 互通之後，去街外上網就靠 Default Static Route (0.0.0.0/0) 指去出口 Router。'
      },
      {
        source: 'kw-12', target: 'kw-46',
        rel: 'Static Routing Practice', relZh: 'Lab 1 實作靜態與預設路由',
        why: 'Lab Sheet 1 tests static routes, recursive next-hop lookups, and default routes across R1–R4.',
        whyZh: 'Lab Sheet 1 第一階段正正要求用 Static Route 同 Default Route 打通 4 部 Router。'
      },
      {
        source: 'kw-13', target: 'kw-15',
        rel: 'Distance-Vector vs Link-State', relZh: '距離向量 vs 鏈路狀態演進',
        why: 'RIPv2 broadcasts periodic neighbor tables (max 15 hops); OSPFv2 builds a complete LSDB map and computes SPF trees.',
        whyZh: 'RIPv2 係「道聽塗說」每隔 30 秒傳表（最多 15 hop）；OSPF 就每部機拎齊整個拓撲 LSDB 再跑 SPF，收斂快又無跳數限制。'
      },
      {
        source: 'kw-14', target: 'kw-47',
        rel: 'Dynamic WAN Comparisons', relZh: 'Lab 2 多跳拓撲選路對比',
        why: 'In multi-path 5-router topologies, EIGRP bandwidth/delay behaves differently from RIP hop counts and OSPF cost.',
        whyZh: '喺 Lab 2 五部 Router 多路徑拓撲中，好易睇出 RIP 睇跳數同 EIGRP / OSPF 睇頻寬嘅分別。'
      },
      {
        source: 'kw-15', target: 'kw-16',
        rel: 'LSDB Requires Adjacency', relZh: '必須先起 Full 鄰居先計到 Cost',
        why: 'OSPF routers only exchange LSAs and run SPF after Hello parameters match and neighbors reach FULL state (including DR/BDR election on LANs).',
        whyZh: 'OSPF 必須先通過 Hello 參數檢查並喺廣播網段選出 DR/BDR，建立 FULL 鄰居交換 LSA，先可以計出 Cost 路線。'
      },
      {
        source: 'kw-15', target: 'kw-47',
        rel: 'Multi-Router OSPF Practice', relZh: 'Lab 2 OSPF Area 0 實作',
        why: 'Lab Sheet 2 verifies OSPF Area 0 neighbor formation, Cost-based path choice, and convergence across 5 routers.',
        whyZh: 'Lab Sheet 2 要求用 OSPF Area 0 連通 R1–R5 並驗證其中一條 WAN 斷線後自動繞道。'
      },
      {
        source: 'kw-16', target: 'kw-18',
        rel: 'IPv4 OSPF to OSPFv3 Rules', relZh: 'OSPFv2 概念延伸至 OSPFv3',
        why: 'OSPFv3 keeps 32-bit Router IDs, Area 0 backbone design, Hello/Dead matching, and DR/BDR roles while running over IPv6 link-local addresses.',
        whyZh: 'OSPFv3 一樣用 32-bit Router ID、Area 0 同 DR/BDR 機制，只不過改用 IPv6 Link-Local 建立鄰居兼喺介面下啟用。'
      },
      {
        source: 'kw-17', target: 'kw-18',
        rel: 'IPv6 Addressing to Routing', relZh: 'IPv6 位址驅動 Link-Local 選路',
        why: 'IPv6 static routes and OSPFv3 next-hops routinely rely on FE80::/10 Link-Local addresses and SLAAC/EUI-64 interface IDs.',
        whyZh: '識得分辨 GUA (2000::/3) 同 Link-Local (FE80::/10)，先明點解 IPv6 路由成日用 FE80:: 做 Next-Hop。'
      },
      {
        source: 'kw-20', target: 'kw-06',
        rel: 'Verify AP & Phone Neighbors', relZh: '用 CDP/LLDP 查 AP 同電話',
        why: 'Engineers run show cdp neighbors or show lldp neighbors to confirm AP/IP-phone port connections, PoE draw, and Voice VLAN negotiation.',
        whyZh: '現場除錯最常用 show cdp neighbors detail 睇對方設備 IP、型號、PoE 供電同 Voice VLAN 是否正常。'
      },
      {
        source: 'kw-20', target: 'kw-48',
        rel: 'Verify Trunk Links in Lab 3', relZh: 'Lab 3 檢查 Switch 互連埠',
        why: 'Before troubleshooting VLANs, CDP/LLDP verifies which physical ports interconnect SW1, SW2, and the router.',
        whyZh: '做雙 Switch Lab 時，用 CDP 一眼就睇到邊幾個 Port 插錯線或者 Trunk 駁去邊部機。'
      },
      {
        source: 'kw-21', target: 'kw-34',
        rel: 'Helper Across VLANs', relZh: '跨 VLAN 必須設 ip helper-address',
        why: 'Because routers block broadcast DHCP Discover messages between VLANs, SVI or ROAS subinterfaces need ip helper-address pointing to the DHCP server.',
        whyZh: 'VLAN 之間唔通廣播！Client 同 DHCP Server 喺唔同 VLAN 時，必須喺該 VLAN Gateway (SVI / 子介面) 加 ip helper-address。'
      },
      {
        source: 'kw-21', target: 'kw-41',
        rel: 'Securing DORA with Snooping', relZh: '用 DHCP Snooping 擋假 Server',
        why: 'DHCP has no built-in server authentication; DHCP Snooping stops rogue DHCP Offers by trusting only the uplink port to the real DHCP server.',
        whyZh: '原生 DHCP DORA 冇認證機制，黑客插部假 Server 就搶派錯 Gateway；所以 Access Switch 必須開 DHCP Snooping 防護。'
      },
      {
        source: 'kw-21', target: 'kw-43',
        rel: 'DHCP Delivers DNS & TFTP', relZh: 'DHCP 派埋 DNS 同 Option 150',
        why: 'Beyond IP and default gateway, DHCP pools distribute DNS servers and Option 150 TFTP addresses for IP phones.',
        whyZh: 'DHCP 唔單止派 IP 同 Gateway，仲會順手派 DNS Server 同埋 IP Phone 要用嘅 TFTP Server (Option 150)。'
      },
      {
        source: 'kw-22', target: 'kw-28',
        rel: 'CLI SSH to Controller API', relZh: '傳統 SSH CLI 走向控制器管理',
        why: 'Traditional per-device SSHv2 CLI administration scales into centralized controller and NETCONF/RESTCONF automation.',
        whyZh: '以前逐部機 SSH 入去打 CLI；現代企業改用 SDN Controller (DNA Center) 統一經 API 下發設定。'
      },
      {
        source: 'kw-22', target: 'kw-44',
        rel: 'Hardening & AAA / MFA', relZh: 'SSHv2 配 AAA 強化登入安全',
        why: 'Enforcing SSHv2, complex passwords, login block-for, and AAA authentication counters brute-force management attacks.',
        whyZh: '密碼策略、AAA 本地/伺服器驗證同 SSHv2 係防禦暴力破解同未授權存取嘅第一道防線。'
      },
      {
        source: 'kw-23', target: 'kw-24',
        rel: 'Ops Visibility: Time, Logs, SNMP', relZh: '網路維運鐵三角',
        why: 'Accurate NTP timestamps let engineers correlate Syslog event messages with SNMP polling alerts and traps.',
        whyZh: '一定要先用 NTP 對準時間，Syslog 出事記錄同 SNMP 告警嘅時間軸先至夾得返黎查案。'
      },
      {
        source: 'kw-24', target: 'kw-02',
        rel: 'SNMP UDP 161/162 & Voice QoS', relZh: 'SNMP Port 及語音優先權',
        why: 'SNMP polls on UDP 161/162, while QoS prioritizes latency-sensitive UDP voice RTP streams over bulk TCP downloads.',
        whyZh: 'SNMP 用 UDP 161/162 收發監控資料；而 QoS 則優先保障對延遲敏感嘅 UDP 語音/視像封包。'
      },
      {
        source: 'kw-25', target: 'kw-26',
        rel: 'Standard vs Extended Rules', relZh: '標準 ACL vs 延伸 ACL 擺位原則',
        why: 'Standard ACLs only match source IP and go close to the destination; Extended ACLs match src/dst/port and go close to the source.',
        whyZh: 'Standard ACL 只睇 Source IP 所以要放近目的地以免誤殺；Extended ACL 條件夠精準，應放近起點省頻寬。'
      },
      {
        source: 'kw-25', target: 'kw-27',
        rel: 'ACL Defines NAT Inside Traffic', relZh: 'ACL 指定邊啲內網 IP 做 NAT',
        why: 'NAT Overload (PAT) uses a Standard ACL referenced in ip nat inside source list <ACL> interface ... overload to pick translatable subnets.',
        whyZh: '設定 Dynamic NAT / PAT 時，Router 靠 Standard ACL (list 1) 圈出邊組私有 IP 先准做轉換。'
      },
      {
        source: 'kw-25', target: 'kw-22',
        rel: 'access-class Limits SSH VTY', relZh: 'ACL 保護 VTY SSH 入口',
        why: 'Applying a Standard ACL on line vty 0 15 with access-class restricts SSH logins solely to trusted admin subnets.',
        whyZh: '喺 line vty 加 ip access-class，就可以只容許 IT 網段 SSH 入 Router，大幅減少被掃描攻擊風險。'
      },
      {
        source: 'kw-26', target: 'kw-32',
        rel: 'Crypto ACL Selects Interesting Traffic', relZh: 'Crypto ACL 觸發 VPN 加密',
        why: 'IPsec site-to-site VPNs use an Extended ACL (crypto ACL) to specify which site-to-site subnets must be encrypted inside the tunnel.',
        whyZh: 'IPsec VPN 要靠 Extended ACL（Crypto ACL）定義邊啲分公司對總公司流量需要進入加密隧道。'
      },
      {
        source: 'kw-28', target: 'kw-29',
        rel: 'Controller APIs & Automation', relZh: 'API 與自動化工具協作',
        why: 'SDN controllers expose RESTful Northbound APIs returning JSON payloads that tools like Ansible and Python scripts consume.',
        whyZh: 'DNA Center 等 SDN 控制器開放 Northbound REST API，俾 Ansible 或 Python 用 JSON 批量讀取同修改網路設定。'
      },
      {
        source: 'kw-28', target: 'kw-30',
        rel: 'Fabric Overlay on Leaf-Spine', relZh: 'SD-Access 結合 Spine-Leaf 架構',
        why: 'Cisco DNA Center SD-Access and ACI automate virtual overlays atop physical Campus Two-Tier/Three-Tier or Data Center Spine-and-Leaf underlays.',
        whyZh: 'SDN（如 DNA Center / ACI）特別擅長喺 Spine-and-Leaf 高速底層拓撲上面自動化部署虛擬 Overlay 網路。'
      },
      {
        source: 'kw-29', target: 'kw-19',
        rel: 'Zero-Touch Backup & Push', relZh: '自動化替代人手 TFTP 備份',
        why: 'Ansible push-mode playbooks and RESTCONF replace manual TFTP/SCP CLI copying with repeatable declarative configuration templates.',
        whyZh: '以前靠 TFTP/SCP 逐部機抄 Config；宜家透過 Ansible / Puppet / RESTCONF 做到零手動、一致性自動部署。'
      },
      {
        source: 'kw-30', target: 'kw-36',
        rel: 'L2 Loops vs Routed Access', relZh: '三層設計與 STP 邊界',
        why: 'Traditional Core/Distribution/Access campuses require STP where Access links form redundant Layer 2 loops.',
        whyZh: '傳統園區 Access 接雙 Distribution Switch 若行 Layer 2 Trunk，就會形成迴圈，必須用 STP 或改成 L3 Routed Access 處理。'
      },
      {
        source: 'kw-30', target: 'kw-39',
        rel: 'Redundant Distribution Uplinks', relZh: '多條 Uplink 靠聚合防阻塞',
        why: 'Two-tier and Three-tier distribution links bundle multiple uplinks into Port-Channels so STP does not block half the bandwidth.',
        whyZh: '核心同匯聚層之間通常拉 2 至 4 條線行 EtherChannel，避免 STP 塞住一半頻寬兼提升冗餘。'
      },
      {
        source: 'kw-31', target: 'kw-34',
        rel: 'Redundant VLAN Default Gateway', relZh: '雙重 SVI 配 HSRP 虛擬閘道',
        why: 'In redundant Layer 3 switch designs, two SVI gateways share one HSRP virtual IP so hosts keep connectivity if one switch fails.',
        whyZh: '雙核心 Switch 各建一個 SVI 後，再綁同一個 HSRP Virtual IP 做 Default Gateway，死咗一部 Switch 都唔斷網。'
      },
      {
        source: 'kw-32', target: 'kw-44',
        rel: 'CIA Triad & Tunnel Crypto', relZh: 'AES 加密同雜湊保數據機密',
        why: 'IPsec enforces confidentiality (AES), integrity (SHA-2/HMAC), and authentication (PSK/RSA) across untrusted WAN links.',
        whyZh: 'IPsec 正正體現資安 CIA 原則：用 AES 防偷睇、SHA-2 防篡改、PSK/憑證確認對方身份。'
      },
      {
        source: 'kw-32', target: 'kw-45',
        rel: 'Site-to-Cloud & WAN Tunnels', relZh: '連接企業總部與雲端 VPC',
        why: 'Enterprises combine BGP over GRE/IPsec tunnels to connect on-premises campuses to AWS/Azure cloud IaaS/PaaS environments.',
        whyZh: '企業上雲端時，常常用 IPsec / GRE 隧道再跑 BGP，將辦公室內網安全駁通公有雲 IaaS/PaaS 網段。'
      },
      {
        source: 'kw-33', target: 'kw-34',
        rel: 'Trunk Carries VLANs to Router', relZh: 'Trunk 送 Tagged 流量去 Router',
        why: 'An 802.1Q trunk carries multiple tagged VLANs from access switches up to a Router-on-a-Stick subinterface or Layer 3 switch SVI.',
        whyZh: 'Access Switch 用 802.1Q Trunk 將多個 VLAN 標籤傳上去 Router-on-a-Stick 或三層 Switch SVI，先實現跨 VLAN 互通。'
      },
      {
        source: 'kw-33', target: 'kw-40',
        rel: 'Trunk Security & Native VLAN', relZh: 'Trunk 安全：改走 Native VLAN 1',
        why: 'Every 802.1Q trunk uses one untagged Native VLAN; leaving it as VLAN 1 or mismatching ends enables VLAN hopping attacks.',
        whyZh: '802.1Q Trunk 預設有不貼標籤嘅 Native VLAN 1；必須改為專用無人用 VLAN 同兩邊一致，先可以防止 VLAN Hopping。'
      },
      {
        source: 'kw-33', target: 'kw-48',
        rel: 'Trunking Across SW1 & SW2', relZh: 'Lab 3 雙 Switch Trunk 實作',
        why: 'Lab Sheet 3 configures access ports and 802.1Q trunks between two switches before verifying Inter-VLAN pings.',
        whyZh: 'Lab Sheet 3 正正練習喺雙 Switch 之間起好 VLAN 同 802.1Q Trunk，再經 Router 通訊。'
      },
      {
        source: 'kw-34', target: 'kw-48',
        rel: 'ROAS Practice in Lab 3', relZh: 'Lab 3 Router-on-a-Stick 實作',
        why: 'Lab Sheet 3 uses Router-on-a-Stick subinterfaces (encapsulation dot1Q) so PCs in separate VLANs can reach one another.',
        whyZh: 'Lab Sheet 3 透過 Router 子介面設定 encapsulation dot1Q 實現唔同 VLAN PC 互 Ping。'
      },
      {
        source: 'kw-35', target: 'kw-41',
        rel: 'Defense Against CAM & L2 Attacks', relZh: '防範 MAC 溢位與 L2 欺騙',
        why: 'Port Security stops MAC flooding attacks on switch CAM tables, complementing DHCP Snooping and DAI against ARP spoofing.',
        whyZh: 'Port Security 擋住 CAM Table 溢位攻擊；配合 DHCP Snooping + DAI 防埋偽造 DHCP 同 ARP Spoofing，齊全保護 Access 層。'
      },
      {
        source: 'kw-36', target: 'kw-37',
        rel: 'Locking Root & Access Edge', relZh: '守護 Root Bridge 及邊緣埠',
        why: 'STP Root elections and PortFast edge ports require Root Guard (preventing rogue lower BID) and BPDU Guard (protecting PortFast ports).',
        whyZh: 'STP 怕人亂插 Switch 搶 Root 或整出迴圈：用 Root Guard 鎖住 Root 位，喺 PortFast 用 BPDU Guard 一收到 BPDU 就 Shutdown。'
      },
      {
        source: 'kw-36', target: 'kw-38',
        rel: '802.1D Evolved to RSTP 802.1w', relZh: '30-50 秒進化至秒級收斂',
        why: 'RSTP replaces legacy 802.1D Listening/Learning 30–50 s timers with Discarding/Learning/Forwarding and active Proposal/Agreement handshakes.',
        whyZh: 'RSTP 保留咗 Root 選舉邏輯，但將 50 秒等待縮減到幾秒內（簡化狀態為 Discarding/Learning/Forwarding），係現代預設首選。'
      },
      {
        source: 'kw-36', target: 'kw-39',
        rel: 'STP Treats Bundle as 1 Link', relZh: 'EtherChannel 避免被 STP 阻塞',
        why: 'EtherChannel groups multiple parallel cables into one logical Port-Channel interface so STP runs per bundle and keeps full aggregate bandwidth.',
        whyZh: '兩部 Switch 之間拉多條線若唔做 EtherChannel，STP 會塞住多餘嗰幾條；綁成一個 Port-Channel 後 STP 當一條線，用盡全部頻寬！'
      },
      {
        source: 'kw-39', target: 'kw-33',
        rel: 'Trunk Inside Port-Channel', relZh: 'Port-Channel 上設定 Trunk',
        why: 'Once member ports match duplex, speed, and allowed VLANs, switchport mode trunk applies logically to the interface port-channel.',
        whyZh: '起好 Port-Channel 之後，Trunk 模式同 Allowed VLAN 清單一定要全部成員 Port 同步一致。'
      },
      {
        source: 'kw-40', target: 'kw-35',
        rel: 'Access Port Hardening Checklist', relZh: 'Access Port 加固必備組合',
        why: 'Disabling DTP (nonegotiate), forcing switchport mode access, pruning unused ports to a parking VLAN, and enabling Port Security harden Layer 2 access.',
        whyZh: 'CCNA L2 安全黃金法則：強制 switchport mode access + switchport nonegotiate + Port Security + BPDU Guard。'
      },
      {
        source: 'kw-41', target: 'kw-37',
        rel: 'Complete Access-Layer Defense', relZh: 'Access 層完整縱深防禦',
        why: 'Combining BPDU Guard, DHCP Snooping, and DAI shuts down rogue switches, rogue DHCP servers, and ARP spoofing on user access ports.',
        whyZh: '實戰 Switch 邊緣埠安全清單：BPDU Guard 防假 Switch、DHCP Snooping 防假 DHCP、DAI 防 ARP 欺騙。'
      },
      {
        source: 'kw-43', target: 'kw-27',
        rel: 'DNS Inside NAT Networks', relZh: '內網 DNS 查詢經 PAT 出公網',
        why: 'Clients resolve domain names via UDP 53 DNS queries that pass through NAT Overload / PAT when hitting public DNS resolvers like 8.8.8.8.',
        whyZh: '公司內網機查詢外部域名時，UDP 53 DNS 封包一樣要經 PAT 轉成公司公網 IP 先出到去。'
      },
      {
        source: 'kw-46', target: 'kw-47',
        rel: '4-Router WAN -> 5-Router Scale', relZh: '由 4 部進化至 5 部多跳測試',
        why: 'Lab 2 builds on Lab 1 serial and loopback fundamentals by introducing alternate multi-hop paths and dynamic convergence testing.',
        whyZh: '掌握 Lab 1 嘅 Serial Clock Rate 同靜態路由之後，Lab 2 考你喺 5 部機多路徑下驗證動態路由自動繞路。'
      },
      {
        source: 'kw-47', target: 'kw-48',
        rel: 'WAN Routing Meets LAN VLANs', relZh: 'WAN 路由結合 LAN 跨 VLAN',
        why: 'Combining Lab 2 WAN dynamic routing with Lab 3 Switch VLANs and ROAS forms a complete enterprise campus-to-WAN topology.',
        whyZh: '將 Lab 2 嘅 WAN 動態路由駁埋 Lab 3 嘅多 VLAN 園區內網，就係完整企業網路考題架構。'
      }
    ]
  };
})(window);
