(function (global) {
  'use strict';

  global.CCNA_KW = [
    // ==================== CH01: NETWORK FUNDAMENTALS, OSI, ETHERNET, WIRELESS ====================
    {
      id: 'kw-01',
      chapter: 'Ch01',
      chapterLabel: 'Ch01: Network Fundamentals & OSI',
      chapterLabelZh: 'Ch01：網路基礎與 OSI 模型',
      domain: 'fundamentals',
      title: 'OSI 7-Layer Model & Encapsulation (PDU)',
      titleZh: 'OSI 七層模型與數據封裝 (PDU)',
      summary: 'The OSI model standardizes network communication into 7 modular layers so hardware and software from different vendors interoperate cleanly.',
      summaryZh: 'OSI 七層模型由 ISO 制定，將複雜嘅網路通訊分拆成 7 個獨立層面（由上層軟件到下層硬件），確保唔同廠商設備互聯互通。傳送資料時由 Layer 7 向下進行封裝 (Encapsulation)，接收時由 Layer 1 向上解封。',
      bullets: [
        'Layer 7–5 (Application, Presentation, Session): PDU = Data',
        'Layer 4 (Transport): PDU = Segment (TCP) or Datagram (UDP), adds Source/Dest Ports',
        'Layer 3 (Network): PDU = Packet, adds Source/Dest IP addresses (Routers)',
        'Layer 2 (Data Link): PDU = Frame, adds Source/Dest MAC + FCS/CRC (Switches)',
        'Layer 1 (Physical): PDU = Bits, electrical/optical/RF signals (Cables, Hubs)'
      ],
      bulletsZh: [
        '第 7–5 層（應用 / 展示 / 會談層）：PDU 統稱為 Data（數據）',
        '第 4 層（傳輸層 Transport）：PDU 為 Segment（分段），加入來源與目的 Port 號',
        '第 3 層（網路層 Network）：PDU 為 Packet（封包），加入來源與目的 IP（Router 工作層）',
        '第 2 層（資料鏈結層 Data Link）：PDU 為 Frame（訊框），加入 MAC 位址及 FCS 校驗碼（Switch 工作層）',
        '第 1 層（實體層 Physical）：PDU 為 Bits（位元），負責網線或光纖電/光訊號傳輸'
      ],
      commands: [],
      trap: 'Routers rewrite Layer 2 MAC headers at every hop, while Layer 3 Source/Dest IP stays unchanged (unless NAT is applied).',
      trapZh: 'Packet 每經過一個 Router，Layer 2 嘅來源/目的 MAC 位址都會重新封裝改變，但 Layer 3 嘅來源/目的 IP 通常保持不變（除非經過 NAT）。'
    },
    {
      id: 'kw-02',
      chapter: 'Ch01',
      chapterLabel: 'Ch01: Network Fundamentals & OSI',
      chapterLabelZh: 'Ch01：網路基礎與 OSI 模型',
      domain: 'fundamentals',
      title: 'TCP vs UDP & Well-Known Ports',
      titleZh: 'TCP 與 UDP 傳輸協定及常用 Port 號',
      summary: 'Transport Layer chooses between reliable connection-oriented TCP and fast low-latency connectionless UDP depending on application needs.',
      summaryZh: 'Layer 4 傳輸層主要分為 TCP 同 UDP。TCP 講求「可靠、按次序傳送」，透過 3-Way Handshake 同 ACK 重傳保證唔甩漏；UDP 屬於無連線協定，唔做重傳同流量控制，速度最快、延遲最低，最啱 VoIP 語音同即時串流。',
      bullets: [
        'TCP: 3-Way Handshake (SYN → SYN-ACK → ACK), Sequence/Ack numbers, Windowing (flow control)',
        'UDP: Connectionless, 8-byte header, no ACK/retransmission — ideal for VoIP, video, DNS, TFTP, DHCP, SNMP',
        'Key TCP ports: FTP (20/21), SSH (22), Telnet (23), SMTP (25), HTTP (80), HTTPS (443)',
        'Key UDP ports: DNS (53), DHCP (67/68), TFTP (69), NTP (123), SNMP (161/162)'
      ],
      bulletsZh: [
        'TCP 特點：三次握手 (SYN → SYN-ACK → ACK)、Sequence/Ack 編號確認、Windowing 流量控制',
        'UDP 特點：標頭僅 8 bytes、無需握手與 ACK 重傳，適合 VoIP、視訊、TFTP、DHCP、SNMP、NTP',
        '必背 TCP Port：FTP (20/21)、SSH (22)、Telnet (23)、SMTP (25)、HTTP (80)、HTTPS (443)',
        '必背 UDP Port：DNS (53，查詢多用 UDP)、DHCP (67/68)、TFTP (69)、NTP (123)、SNMP (161/162)'
      ],
      commands: [],
      trap: 'DNS uses UDP 53 for standard queries and TCP 53 for zone transfers or large responses (>512 bytes).',
      trapZh: '常見考題伏位：DNS 一般查詢用 UDP 53，但區域傳輸 (Zone Transfer) 或大型回應會用 TCP 53；TFTP 同 SNMP 則一定係 UDP。'
    },
    {
      id: 'kw-03',
      chapter: 'Ch01',
      chapterLabel: 'Ch01: Network Fundamentals & OSI',
      chapterLabelZh: 'Ch01：網路基礎與 OSI 模型',
      domain: 'fundamentals',
      title: 'Layer 2 Switching & Collision vs Broadcast Domains',
      titleZh: 'Layer 2 Switch 轉發原理與碰撞/廣播網域',
      summary: 'Switches learn source MAC addresses dynamically and forward frames using the MAC address table, isolating collision domains per port.',
      summaryZh: 'Layer 2 Switch 根據 Frame 入面嘅 MAC 位址作轉發決定。當收到未知目的 MAC (Unknown Unicast) 或 Broadcast Frame 時會 Flood 去同一 VLAN 內所有其他介面。每個 Switch Port 自成一組獨立 Collision Domain，但整個預設 LAN 仍共用同一 Broadcast Domain。',
      bullets: [
        'Learning: Switch records Source MAC + incoming port into CAM / MAC table',
        'Forwarding: Known Unicast → sent only out matching port; Unknown Unicast / Broadcast → flooded out all ports in VLAN except ingress port',
        'Hub: 1 Collision Domain + 1 Broadcast Domain (Half-duplex shared bus)',
        'Switch: Each port = 1 Collision Domain; entire VLAN = 1 Broadcast Domain',
        'Router: Separates both Collision Domains AND Broadcast Domains per interface'
      ],
      bulletsZh: [
        '學習機制：Switch 睇 Frame 嘅「來源 MAC (Source MAC)」嚟寫入 MAC Address Table',
        '轉發機制：搵到目的 MAC 就單一介面轉送 (Unicast)；搵唔到 (Unknown Unicast) 或 Broadcast (FFFF.FFFF.FFFF) 就向同 VLAN 所有其他介面廣播 (Flood)',
        'Hub：全部埠共用 1 個 Collision Domain 同 1 個 Broadcast Domain',
        'Switch：每個 Port 獨立 1 個 Collision Domain，但未分 VLAN 時全部共用 1 個 Broadcast Domain',
        'Router：每個介面同時分隔 Collision Domain 同 Broadcast Domain'
      ],
      commands: ['Switch# show mac address-table', 'Switch# show mac address-table dynamic'],
      trap: 'A switch learns from the SOURCE MAC address, never the destination MAC address.',
      trapZh: '切記：Switch 學習 MAC Table 係記「Source MAC」，而決定點樣轉發 Frame 就係查「Destination MAC」。'
    },
    {
      id: 'kw-04',
      chapter: 'Ch01',
      chapterLabel: 'Ch01: Network Fundamentals & OSI',
      chapterLabelZh: 'Ch01：網路基礎與 OSI 模型',
      domain: 'fundamentals',
      title: 'Ethernet UTP Cabling, Duplex & Late Collisions',
      titleZh: '乙太網銅纜標準、雙工模式與 Late Collisions',
      summary: 'UTP copper cabling standards support up to 100 meters; speed/duplex mismatches on Ethernet links cause collisions and degraded performance.',
      summaryZh: 'UTP 雙絞線 (Cat5e / Cat6 / Cat6a) 最大傳輸距離為 100 米。直通線 (Straight-through) 用於連接唔同類設備 (PC–Switch / Switch–Router)，交叉線 (Crossover) 用於同類設備。若一端設定 Full-Duplex 而另一端為 Half-Duplex，會產生 Duplex Mismatch 及 Late Collisions。',
      bullets: [
        'Cat 5e / Cat 6 / Cat 6a max run = 100 meters; Cat 6a supports 10GBASE-T up to 100m (Cat 6 up to 55m)',
        'Straight-through: Switch ↔ Router, Switch ↔ PC; Crossover: Switch ↔ Switch, Router ↔ Router, Router ↔ PC (MDIX auto-detects on modern ports)',
        'Duplex mismatch (one side Full, one side Half) causes Late Collisions (detected after first 64 bytes) & FCS/CRC errors',
        'Common late collision causes: duplex mismatch or cable length exceeding 100m'
      ],
      bulletsZh: [
        'Cat 5e / Cat 6 / Cat 6a 標準最長傳輸距離皆為 100 米（Cat 6a 支援 10Gbps 行足 100 米）',
        '接線規則：唔同層/設備用 Straight-through（PC–Switch、Router–Switch）；同類設備用 Crossover（Router–Router、Switch–Switch）',
        'Duplex Mismatch：一邊強制 Full-Duplex、另一邊強制 Half-Duplex（或自動協商失敗跌落 Half），會導致大量 Late Collisions',
        'Late Collision（超過頭 64 bytes 先發生碰撞）兩大主因：Duplex Mismatch 或網線過長超過 100 米'
      ],
      commands: ['Switch# show interfaces g0/1', 'Router(config-if)# duplex full', 'Router(config-if)# speed 1000'],
      trap: 'Auto-negotiation vs hardcoded Full-Duplex falls back to Half-Duplex on the auto side for 10/100 Ethernet, creating a duplex mismatch.',
      trapZh: '一端手動設 `duplex full`、另一端留 `auto` 時，10/100M 介面通常會協商失敗跌落 Half-Duplex，即刻出現 Duplex Mismatch！'
    },
    {
      id: 'kw-05',
      chapter: 'Ch01',
      chapterLabel: 'Ch01: Network Fundamentals & OSI',
      chapterLabelZh: 'Ch01：網路基礎與 OSI 模型',
      domain: 'fundamentals',
      title: 'Fiber Optics (SMF vs MMF) & SFP Transceivers',
      titleZh: '光纖傳輸 (SMF vs MMF) 與 SFP 模組',
      summary: 'Single-mode fiber uses lasers for long-distance backbone links, while multi-mode fiber uses LEDs for shorter campus/building runs.',
      summaryZh: '光纖唔受電磁干擾 (EMI) 且距離遠高於銅纜。單模光纖 (SMF) 用黃色外皮、9 µm 幼芯配雷射光源，專攻長距離；多模光纖 (MMF) 用橙/淺藍外皮、50/62.5 µm 粗芯配 LED，適合大樓內短距離。常見接頭有 LC 及 SC，Switch 透過可熱插拔 SFP (1G) / SFP+ (10G) 連接。',
      bullets: [
        'SMF (Single-Mode, OS1/OS2 Yellow): ~9 µm core, Laser source, 1310nm / 1550nm, tens of km reach',
        'MMF (Multi-Mode, OM3/OM4 Aqua): 50/62.5 µm core, LED/VCSEL source, 850nm / 1300nm, shorter distance (~300–550m)',
        'Connectors: LC (Little/Lucent Connector, small duplex) & SC (Square Connector)',
        'Transceivers: SFP (1 Gbps), SFP+ (10 Gbps), QSFP+ (40G), AOC (Active Optical Cable)'
      ],
      bulletsZh: [
        '單模光纖 SMF（黃色 OS1/OS2）：芯徑極幼 (~9 µm)、用 Laser 光源、波長 1310/1550nm，傳幾十公里',
        '多模光纖 MMF（橙/淺藍色 OM3/OM4）：芯徑較粗 (50 µm)、用 LED 光源、波長 850nm，適合幾百米機房內連線',
        '常用光纖接頭：LC（體積細、SFP 常用雙頭）與 SC（方形推拉接頭）',
        'SFP 模組規格：SFP 支援 1 Gbps；SFP+ 支援 10 Gbps；AOC 主動式光纖線自帶兩端光電轉換 SFP+ 頭'
      ],
      commands: ['Switch# show interfaces transceiver'],
      trap: 'Never mix SMF (yellow, laser) and MMF (orange/aqua, LED) transceivers on the same link.',
      trapZh: 'SMF（單模）同 MMF（多模）嘅波長同芯徑完全唔同，唔可以混接同一條光纖通道！'
    },
    {
      id: 'kw-06',
      chapter: 'Ch01',
      chapterLabel: 'Ch01: Network Fundamentals & OSI',
      chapterLabelZh: 'Ch01：網路基礎與 OSI 模型',
      domain: 'access',
      title: 'Wireless Standards, Channels & WLC/CAPWAP Architecture',
      titleZh: '無線網路 802.11 標準、頻道規劃與 WLC/CAPWAP 架構',
      summary: 'Enterprise Wi-Fi centralizes AP management via Wireless LAN Controllers (WLC) using CAPWAP tunnels and careful 2.4/5 GHz channel planning.',
      summaryZh: '企業無線網路多採用 Lightweight AP + Wireless LAN Controller (WLC) 集中管理，AP 透過 CAPWAP 隧道向 WLC 註冊同領取設定（SSID、加密原則）。2.4 GHz 只有 1、6、11 三條完全唔重疊頻道；5 GHz 頻道多、干擾少但穿透力較弱。',
      bullets: [
        'IEEE Standards: 802.11b (2.4GHz, 11M), a (5GHz, 54M), g (2.4GHz, 54M), n/Wi-Fi 4 (2.4/5GHz, 600M), ac/Wi-Fi 5 (5GHz), ax/Wi-Fi 6 (2.4/5GHz)',
        'Non-overlapping 2.4 GHz channels: 1, 6, 11 (20 MHz wide)',
        'SSID: Unique identifier broadcast by an AP to establish wireless connectivity',
        'Autonomous AP (standalone CLI/GUI) vs Lightweight AP (LWAPP/CAPWAP UDP 5246 control, UDP 5247 data to WLC)',
        'AP Modes: Local (normal client traffic), FlexConnect (local switching if WAN to WLC fails), Monitor (IDS/rogue scan)'
      ],
      bulletsZh: [
        '802.11 制式演進：a/g (54M) → n / Wi-Fi 4 (雙頻) → ac / Wi-Fi 5 (專攻 5GHz) → ax / Wi-Fi 6 (支援 OFDMA 雙頻)',
        '2.4 GHz 黃金非重疊頻道：Channel 1、6、11；5 GHz 擁有大量唔重疊頻道適合高密度部署',
        'SSID 係無線網路名稱，用嚟識別唔同 WLAN；Security 常見 WPA2-PSK / WPA2-Enterprise (802.1X + RADIUS) / WPA3',
        'Autonomous AP 逐部獨立設定；Lightweight AP 經由 CAPWAP (UDP 5246 Control / 5247 Data) 由 WLC 統一控制',
        'FlexConnect Mode：當分支辦公室連去總部 WLC 嘅 WAN 斷線時，AP 仍可喺本地繼續轉發用戶流量'
      ],
      commands: ['Switch(config-if)# switchport trunk allowed vlan ...', '(WLC GUI → WLANs / Wireless / Controller)'],
      trap: 'CAPWAP uses UDP 5246 for control plane and UDP 5247 for data plane; FlexConnect keeps local branch wireless running during WAN outages.',
      trapZh: '記住 CAPWAP 係行 UDP 5246 (Control) 同 5247 (Data)；如果要 AP 喺 WAN 斷線時照常本地運作，要轉用 FlexConnect 模式。'
    },

    // ==================== CH02: IPV4 ADDRESSING, SUBNETTING, VLSM, IOS BASICS ====================
    {
      id: 'kw-07',
      chapter: 'Ch02',
      chapterLabel: 'Ch02: IPv4, Subnetting & IOS Basics',
      chapterLabelZh: 'Ch02：IPv4 定址、子網路與 IOS 基礎',
      domain: 'fundamentals',
      title: 'IPv4 Classes, Private IPv4 (RFC 1918) & Public vs Private',
      titleZh: 'IPv4 位址分類與私有位址 (RFC 1918)',
      summary: 'RFC 1918 private IPv4 ranges alleviate public IPv4 exhaustion and allow multiple organizations to reuse the same internal addresses behind NAT.',
      summaryZh: '由於全球 IPv4 公網位址短缺，IANA 同 IETF 規劃咗三段 Private IP (俗稱內網/假 IP)。唔同公司可以同時重用同一批 Private IP 而唔會衝突，但必須經 Router 同 NAT 轉換先可以上到 Internet。',
      bullets: [
        'Class A: 1.0.0.0–126.255.255.255 (/8); Private: 10.0.0.0/8 (10.0.0.0 – 10.255.255.255)',
        'Class B: 128.0.0.0–191.255.255.255 (/16); Private: 172.16.0.0/12 (172.16.0.0 – 172.31.255.255)',
        'Class C: 192.0.0.0–223.255.255.255 (/24); Private: 192.168.0.0/16 (192.168.0.0 – 192.168.255.255)',
        'Loopback: 127.0.0.0/8 (host self-test); APIPA: 169.254.0.0/16 (assigned when DHCP fails)'
      ],
      bulletsZh: [
        'Class A 預設 /8；Private 範圍：10.0.0.0 – 10.255.255.255 (10.0.0.0/8)',
        'Class B 預設 /16；Private 範圍：172.16.0.0 – 172.31.255.255 (172.16.0.0/12)',
        'Class C 預設 /24；Private 範圍：192.168.0.0 – 192.168.255.255 (192.168.0.0/16)',
        '特殊位址：127.0.0.1 本機 Loopback 測試；169.254.x.x 為搵唔到 DHCP Server 時嘅 APIPA 自動位址'
      ],
      commands: [],
      trap: '172.32.0.1 is a PUBLIC IP! Class B private ends at 172.31.255.255 (/12).',
      trapZh: '經典伏位：172.16.0.0/12 只去到 172.31.255.255，所以 172.32.x.x 或者 172.15.x.x 都屬於 Public IP！'
    },
    {
      id: 'kw-08',
      chapter: 'Ch02',
      chapterLabel: 'Ch02: IPv4, Subnetting & IOS Basics',
      chapterLabelZh: 'Ch02：IPv4 定址、子網路與 IOS 基礎',
      domain: 'fundamentals',
      title: 'IPv4 Subnetting, CIDR & VLSM',
      titleZh: 'IPv4 子網路切割、CIDR 與 VLSM 實戰',
      summary: 'Subnetting divides one large broadcast domain into smaller efficient subnets; VLSM tailors mask lengths (/30 for point-to-point links, larger blocks for LANs) to avoid wasting IPs.',
      summaryZh: '切 Subnet 可以縮細廣播網域 (Broadcast Domain) 並慳番 IP 位址。可用主機數公式為 2^(主機位元 h) - 2（扣除 Network ID 同 Broadcast）。點對點 Router 連線一般用 /30 (255.255.255.252，啱啱好 2 個可用 IP)；VLSM 則按各部門人數需求靈活分配唔同長度遮罩。',
      bullets: [
        'Usable hosts = 2^h - 2 (h = host bits = 32 - prefix)',
        'Magic block size = 256 - interesting octet mask (e.g. /27 = .224 → block size 32; /28 = .240 → block size 16)',
        '/30 (255.255.255.252): 2 usable hosts — standard for router-to-router point-to-point WAN links',
        '/31 (RFC 3021): 2 usable hosts on supported point-to-point links without broadcast waste',
        'VLSM rule: Always assign the LARGEST host-count subnet first down to the smallest (/30 last) to avoid overlap'
      ],
      bulletsZh: [
        '可用主機數量 = 2^h - 2（扣除頭尾 Network ID 同 Broadcast Address）',
        '速算 Magic Number：256 減該 Octet Mask（例：/27 = .224 → 每段大細 32；/26 = .192 → 每段 64）',
        '/30 (255.255.255.252)：每段 4 個 IP，扣頭尾剩 2 個可用 IP，專畀兩部 Router 點對點連線用',
        'VLSM 分配次序：永遠由「需求最多主機」嘅部門開始分配，最後先分最少 IP 嘅 /30 網段，咁先唔會重疊撞位'
      ],
      commands: ['Router(config-if)# ip address 192.168.1.1 255.255.255.224'],
      trap: 'The first address of a subnet is the Network ID and the last is the Broadcast — neither can be assigned to a host interface.',
      trapZh: '切記檢查個 IP 係咪剛好踩中 Network ID 或者 Broadcast 位址，兩者都唔可以 Set 落 PC 或 Router 介面！'
    },
    {
      id: 'kw-09',
      chapter: 'Ch02',
      chapterLabel: 'Ch02: IPv4, Subnetting & IOS Basics',
      chapterLabelZh: 'Ch02：IPv4 定址、子網路與 IOS 基礎',
      domain: 'access',
      title: 'Cisco IOS CLI Modes, Console & Password Hardening',
      titleZh: 'Cisco IOS 指令模式、Console 設定與密碼加密',
      summary: 'Navigating IOS modes cleanly, setting Console timeouts and logging synchronous, and encrypting passwords securely with enable secret.',
      summaryZh: '操作 Cisco Router/Switch 必須分清 User EXEC (>), Privileged EXEC (#), Global Config ((config)#) 及介面/線路模式。設定 `logging synchronous` 可防止系統訊息打斷打字；`enable secret` 用強雜湊保護，而 `service password-encryption` 只提供較弱 Type 7 加密。',
      bullets: [
        'Modes: `enable` (>`#`), `configure terminal` (#`(config)#`), `end` / `Ctrl+Z` (jump back to `#`), `do <cmd>` (run exec command inside config mode)',
        'Console hardening: `line console 0` → `exec-timeout 0 10` (minutes seconds), `logging synchronous`, `password ...` + `login`',
        'Time config: `clock set hh:mm:ss day month year` (in `#` Privileged EXEC mode)',
        '`enable secret <pw>` (strong hash, overrides `enable password`) vs `service password-encryption` (weak reversible Type 7)',
        'Save config to NVRAM: `copy running-config startup-config` (or `write memory`)'
      ],
      bulletsZh: [
        '模式切換：`enable` 入 `#`；`conf t` 入全域設定模式；喺 `(config)` 入面要執行 `show` 可於前面加 `do`',
        'Console 實用設定：`logging synchronous` 避免彈出 Log 打斷指令；`exec-timeout <分> <秒>` 設定閒置自動登出時間（10秒 = `0 10`）',
        '時鐘指令：修改時間係喺 Privileged Mode `#` 下輸入 `clock set ...`（注意唔係喺 `config t` 入面！）',
        '`enable secret` 使用較強加密並優先於 `enable password`；`service password-encryption` 只將明文密碼轉成易被破解嘅 Type 7',
        '儲存設定：必須執行 `copy running-config startup-config`，否則重開機後所有 RAM 設定會消失'
      ],
      commands: [
        'Router# clock set 14:30:00 17 Nov 2026',
        'Router(config)# enable secret cisco123',
        'Router(config)# service password-encryption',
        'Router(config)# line console 0',
        'Router(config-line)# exec-timeout 5 0',
        'Router(config-line)# logging synchronous',
        'Router# copy running-config startup-config'
      ],
      trap: '`exec-timeout 10` means 10 MINUTES, not 10 seconds! 10 seconds requires `exec-timeout 0 10`.',
      trapZh: '考試高危伏位：`exec-timeout 10` 預設單位係「分鐘」！要設 10 秒閒置逾時必須打 `exec-timeout 0 10`。'
    },
    {
      id: 'kw-10',
      chapter: 'Ch02',
      chapterLabel: 'Ch02: IPv4, Subnetting & IOS Basics',
      chapterLabelZh: 'Ch02：IPv4 定址、子網路與 IOS 基礎',
      domain: 'connectivity',
      title: 'Interface Diagnostics (show interface & Status Codes)',
      titleZh: '介面狀態診斷 (up/up, down/down, administratively down)',
      summary: 'Interpreting Layer 1 (status) and Layer 2 (line protocol) state combinations isolates physical faults from encapsulation/keepalive errors.',
      summaryZh: '用 `show ip interface brief` 或 `show interface` 檢查介面時，第一個狀態代表 Layer 1 (實體訊號)，第二個代表 Layer 2 (協定/封裝)。只有「up / up」先代表正常運作。',
      bullets: [
        'administratively down / down: Interface has `shutdown` configured (`no shutdown` needed)',
        'down / down: Layer 1 problem — unplugged cable, broken fiber, far-end powered off, wrong cable',
        'up / down: Layer 1 is fine, Layer 2 failed — keepalive mismatch, encapsulation mismatch (HDLC vs PPP), missing clock rate',
        'up / up (err-disabled): Disabled by security/loop protection (Port Security / BPDU Guard / DAI)'
      ],
      bulletsZh: [
        'administratively down / down：管理員未開介面，需入介面打 `no shutdown`',
        'down / down：Layer 1 實體問題（未插線、線壞、對方關機或用錯線）',
        'up / down：Layer 1 通咗但 Layer 2 失敗（兩端封裝協定唔同如 HDLC vs PPP、無 Keepalive 或 Speed 唔匹配）',
        'down (err-disabled)：觸發咗安全保護機制自動封鎖（如 Port-Security 違規、BPDU Guard、DAI）'
      ],
      commands: ['Router# show ip interface brief', 'Router# show interfaces g0/0', 'Switch(config-if)# shutdown / no shutdown'],
      trap: 'If an interface reads `up, line protocol is down`, check Layer 2 (encapsulation/keepalives/VLAN mismatch) — NOT cabling.',
      trapZh: '記住口訣：第一欄睇硬件線材 (L1)，第二欄睇協定封裝 (L2)。見 `up / down` 唔好換線，應該查 Layer 2 設定！'
    },

    // ==================== CH03: STATIC ROUTING, DEFAULT ROUTE, AD, RIPV2 ====================
    {
      id: 'kw-11',
      chapter: 'Ch03',
      chapterLabel: 'Ch03: Static Routing & RIPv2',
      chapterLabelZh: 'Ch03：靜態路由與 RIPv2',
      domain: 'connectivity',
      title: 'Longest Prefix Match, Administrative Distance (AD) & Metric',
      titleZh: '最長前綴匹配、管理距離 (AD) 與 Metric 選路順序',
      summary: 'Routers choose paths strictly in order: (1) Longest Prefix Match, (2) Lowest Administrative Distance between protocols, (3) Lowest Metric within a protocol.',
      summaryZh: 'Router 收到去同一目的地嘅多條路由時，選路次序絕對唔可以撈亂！第一步永遠先揀 Longest Prefix Match（子網路遮罩最精準、前綴最長）；只有當「同一網路且相同遮罩」撞埋一齊，先會比較唔同協定之間嘅 AD（越細越優先）；同一種協定入面有多條路先比較 Metric（越細越優先）。',
      bullets: [
        'Priority 1 — Longest Prefix Match: `/28` ALWAYS beats `/27`, `/24`, or `/0`, regardless of AD or metric!',
        'Priority 2 — Lowest AD (only when prefix/mask is identical across different routing sources): Connected (0) < Static (1) < eBGP (20) < EIGRP (90) < OSPF (110) < IS-IS (115) < RIP (120) < External EIGRP (170) < iBGP (200)',
        'Priority 3 — Lowest Metric (within the same routing protocol): RIP = Hop count; OSPF = Cost; EIGRP = FD (Bandwidth + Delay)',
        'Equal-cost paths: Installed together for ECMP load balancing'
      ],
      bulletsZh: [
        '第一優先 — Longest Prefix Match：只要 Prefix 長度唔同（例 `/28` vs `/24`），`/28` 一定贏，完全唔使睇 AD！',
        '第二優先 — AD 值（前綴完全相同先比）：Connected (0) < Static (1) < eBGP (20) < EIGRP (90) < OSPF (110) < RIP (120) < iBGP (200)',
        '第三優先 — Metric（同一協定內比較）：RIP 比跳數 (Hop)、OSPF 比 Cost (頻寬)、EIGRP 比複合值 (頻寬+延遲)',
        '如果同一協定入面出現完全相同 Metric 嘅多條路，Router 會啟動 ECMP 等價負載平衡一齊用'
      ],
      commands: ['Router# show ip route'],
      trap: 'A RIP route to 192.168.12.0/28 (AD 120) STILL beats an EIGRP route to 192.168.12.0/24 (AD 90) because /28 is more specific!',
      trapZh: '必考大伏：好多同學會即刻揀 EIGRP (AD 90)，但記住如果 RIP 學返嚟係 `/28` 而 EIGRP 係 `/24`，Router 會先睇 Longest Prefix Match 而揀 `/28` 嗰條！'
    },
    {
      id: 'kw-12',
      chapter: 'Ch03',
      chapterLabel: 'Ch03: Static Routing & RIPv2',
      chapterLabelZh: 'Ch03：靜態路由與 RIPv2',
      domain: 'connectivity',
      title: 'IPv4 Static Route, Default Route & Floating Static Route',
      titleZh: 'IPv4 靜態路由、預設路由與浮動靜態備援路由',
      summary: 'Static routes define explicit paths with AD 1; Floating Static Routes raise AD above a primary dynamic protocol to act as backup paths.',
      summaryZh: 'Static Route (`ip route`) 預設 AD 係 1，適合小型或確定拓撲。Default Route (`0.0.0.0 0.0.0.0`) 又叫 Gateway of Last Resort，通常指向 ISP 出口。如果想設一條「後備 Static Route」(Floating Static Route)，只要喺指令最尾加一個比主路由高嘅 AD 值（例如 OSPF 係 110，備援就設 115 或 200），平時唔會入 Routing Table，主路由一斷先會浮出嚟頂替。',
      bullets: [
        'Standard static route: `ip route <dest-net> <mask> <next-hop-ip | exit-intf>`',
        'Default route (`S*`): `ip route 0.0.0.0 0.0.0.0 <next-hop-ip>`',
        'Floating static route: `ip route <net> <mask> <next-hop> <AD>` where `<AD>` > primary protocol (e.g., >110 for OSPF, >90 for EIGRP, >120 for RIP)',
        'Routing table codes: `L` Local (/32 host IP), `C` Connected, `S` Static, `S*` Candidate default'
      ],
      bulletsZh: [
        '靜態路由指令：`ip route <目的網段> <子網路遮罩> <下一跳 IP 或本地出口介面>`',
        '預設路由 (`S*` Gateway of last resort)：`ip route 0.0.0.0 0.0.0.0 <ISP Next-Hop>`',
        '浮動靜態路由 (Floating Static)：喺指令最後加上較大嘅 AD 值（例 `ip route 10.0.0.0 255.0.0.0 172.16.0.6 111`），主路由 (如 OSPF AD 110) 跌咗先至接手',
        '睇 Routing Table：`L` 代表該介面本身 `/32` IP；`C` 代表直連網段；`S` 代表靜態路由'
      ],
      commands: [
        'Router(config)# ip route 172.16.2.0 255.255.255.224 172.16.0.6',
        'Router(config)# ip route 0.0.0.0 0.0.0.0 209.165.200.246',
        'Router(config)# ip route 172.16.2.0 255.255.255.224 172.16.0.6 115'
      ],
      trap: 'Next-hop IP MUST belong to a reachable connected subnet on the adjacent router, and its subnet mask must match the remote destination network.',
      trapZh: '睇題目畫 Static Route 要睇清 Next-Hop IP 係對方介面（唔係自己介面！），而且目的 Mask 要對應右邊網段而非兩部 Router 中間條 Link。'
    },
    {
      id: 'kw-13',
      chapter: 'Ch03',
      chapterLabel: 'Ch03: Static Routing & RIPv2',
      chapterLabelZh: 'Ch03：靜態路由與 RIPv2',
      domain: 'connectivity',
      title: 'RIPv2 Distance-Vector Routing',
      titleZh: 'RIPv2 距離向量動態路由',
      summary: 'RIPv2 is a legacy classless distance-vector protocol using hop count (max 15, 16 = unreachable), 30-second periodic updates, and multicast 224.0.0.9.',
      summaryZh: 'RIPv2 屬於距離向量 (Distance Vector) 協定，單純以經過 Router 嘅跳數 (Hop Count) 作為 Metric，上限最多 15 跳（16 跳即當作 Unreachable 無法到達）。每 30 秒用 Multicast 224.0.0.9 定時廣播一次路由表。',
      bullets: [
        'Metric: Hop count (max 15 hops; 16 = unreachable)',
        'Default AD = 120 (adjustable with `distance <num>`)',
        'RIPv2 supports VLSM/CIDR (sends subnet masks) & uses multicast `224.0.0.9` (RIPv1 was broadcast `255.255.255.255`)',
        'Timers: Update 30s, Invalid 180s, Holddown 180s, Flush 240s; always configure `version 2` & `no auto-summary`'
      ],
      bulletsZh: [
        'Metric 計法：只計 Hop Count（最多 15 個 Router，第 16 跳視為無法到達）',
        '預設 AD = 120（可用 `distance` 指令修改）；Update 每 30 秒傳送一次',
        'RIPv2 支援 VLSM / CIDR（會傳送 Subnet Mask），使用 Multicast `224.0.0.9`',
        '記得加 `version 2` 同 `no auto-summary`，避免自動匯總做錯路由'
      ],
      commands: ['Router(config)# router rip', 'Router(config-router)# version 2', 'Router(config-router)# no auto-summary', 'Router(config-router)# network 172.16.0.0'],
      trap: 'Remember 15 hops max (16 = infinity/unreachable) and AD = 120.',
      trapZh: '記實「RIP 最大可用係 15 跳，16 跳等於斷線/不可達」，AD 係 120。'
    },

    // ==================== CH04: EIGRP & OSPFV2 ====================
    {
      id: 'kw-14',
      chapter: 'Ch04',
      chapterLabel: 'Ch04: EIGRP & OSPFv2',
      chapterLabelZh: 'Ch04：EIGRP 與 OSPFv2 動態路由',
      domain: 'connectivity',
      title: 'EIGRP Fundamentals, DUAL & Metrics',
      titleZh: 'EIGRP 進階距離向量、DUAL 演算法與 Metric',
      summary: 'EIGRP is an advanced distance-vector protocol using DUAL for loop-free convergence and composite metrics (Bandwidth & Delay by default).',
      summaryZh: 'EIGRP 原本係 Cisco 專利進階距離向量協定（現部分公開為 RFC 7868），使用 DUAL 演算法達致極快收斂同無迴圈備援 (Feasible Successor)。預設 AD = 90（External EIGRP = 170），Metric 預設只用 Bandwidth (K1) 同 Delay (K3) 計算 FD (Feasible Distance)。',
      bullets: [
        'AD: Internal = 90 (`D`), External = 170 (`D EX`), Summary = 5',
        'DUAL terms: Successor (best path), Feasible Successor (instant backup), FD (Feasible Distance), AD/RD (Reported Distance)',
        'Feasibility Condition: Neighbor RD < local Successor FD guarantees loop-free backup path',
        'Multicast `224.0.0.10`; AS number must match between neighbors; `show ip eigrp topology` shows `P` (Passive/Stable) vs `A` (Active/Recomputing)'
      ],
      bulletsZh: [
        'AD 值：Internal EIGRP = 90 (`D`)；External = 170 (`D EX`)',
        'DUAL 術語：Successor（最佳路徑）、Feasible Successor（後備路徑）、FD（總距離）、RD（鄰居匯報距離）',
        '后備條件 (Feasibility Condition)：後備路線嘅 RD 必須「嚴格細過 (<)」最佳路線嘅 FD，先至唔會產生 Routing Loop',
        '`show ip eigrp topology` 入面見到 `P` (Passive) 代表正常穩定，`A` (Active) 代表緊搵緊路'
      ],
      commands: ['Router# show ip eigrp topology', 'Router# show ip eigrp neighbors'],
      trap: 'In EIGRP topology output, `P` (Passive) is GOOD/healthy — `A` (Active) means the route is broken and searching!',
      trapZh: '唔好俾字面誤導！EIGRP 入面 `Passive (P)` 先係正常穩定，`Active (A)` 代表斷線重算緊！'
    },
    {
      id: 'kw-15',
      chapter: 'Ch04',
      chapterLabel: 'Ch04: EIGRP & OSPFv2',
      chapterLabelZh: 'Ch04：EIGRP 與 OSPFv2 動態路由',
      domain: 'connectivity',
      title: 'OSPFv2 Areas, Link-State Cost & Reference Bandwidth',
      titleZh: 'OSPFv2 區域架構 (Area 0) 與 Cost / 參考頻寬計算',
      summary: 'OSPFv2 is an open-standard Link-State IGP using Dijkstra SPF to pick the lowest cumulative Cost path; all non-backbone areas must connect to Area 0.',
      summaryZh: 'OSPFv2 係開放標準 (IETF) 鏈結狀態路由協定，AD = 110，用 SPF 演算法以沿途總 Cost 最低揀最佳路徑。Cost = Reference Bandwidth (預設 100 Mbps) / Interface Bandwidth。現代 Gigabit / 10G 網路必須調高 `auto-cost reference-bandwidth`，否則 100M、1G 同 10G 全都當作 Cost = 1！',
      bullets: [
        'Backbone Area `0` (mandatory core); multi-area OSPF requires all other areas connect directly to Area 0 via ABRs',
        'Cost formula: `10^8 / Bandwidth(bps)` → FastEthernet (100M) = 1, T1 (1.544M) = 64, 1G/10G also = 1 unless reference bandwidth is raised!',
        'Adjust reference bandwidth: `auto-cost reference-bandwidth 10000` (in Mbps → 10 Gbps, must match on ALL OSPF routers)',
        'Wildcard mask in `network <ip> <wildcard> area <id>`: e.g. `0.0.0.255` for `/24`, `0.0.0.0` matches exact interface IP'
      ],
      bulletsZh: [
        '單一或多區域 OSPF 都一定要有 Backbone Area 0；其他 Area 必須經 ABR 連接返 Area 0',
        '預設 Cost 公式：100 Mbps ÷ 介面頻寬 → 100M/1G/10G 預設 Cost 通通都係 1（未能分辨快慢！）',
        '調較指令：`auto-cost reference-bandwidth 10000`（單位 Mbps，即 10G 為基準），全網所有 OSPF Router 必須設一致',
        '啟用介面可用 `network <IP> <Wildcard> area 0` 或直接喺介面下打 `ip ospf <pid> area 0`'
      ],
      commands: [
        'Router(config)# router ospf 1',
        'Router(config-router)# auto-cost reference-bandwidth 10000',
        'Router(config-router)# network 192.168.10.0 0.0.0.255 area 0',
        'Router# show ip ospf interface s0/0/0'
      ],
      trap: '`auto-cost reference-bandwidth` takes Mbps (not bps!), so 10 Gbps = `10000` and 100 Gbps = `100000`.',
      trapZh: '注意單位：`auto-cost reference-bandwidth` 後面個數係 Mbps（例如 10 Gbps 係打 `10000`），而 `bandwidth` 指令先係 kbps。'
    },
    {
      id: 'kw-16',
      chapter: 'Ch04',
      chapterLabel: 'Ch04: EIGRP & OSPFv2',
      chapterLabelZh: 'Ch04：EIGRP 與 OSPFv2 動態路由',
      domain: 'connectivity',
      title: 'OSPF Neighbor States, Router ID & DR/BDR Election',
      titleZh: 'OSPF 鄰居狀態機、Router ID 選拔與 DR/BDR 選舉',
      summary: 'OSPF neighbors pass through Init, 2-Way, ExStart, Exchange, Loading, and Full; Broadcast networks elect a DR and BDR using priority then highest Router ID.',
      summaryZh: '兩部 OSPF Router 要達成 `Full` 鄰接關係必須通過一致嘅 Hello/Dead Timer、Subnet Mask、Area ID 同 MTU。喺 Ethernet (Broadcast) 網路入面，DROther 之間只會停喺 `2-Way` 狀態，只同 DR / BDR 建立 `Full`；Point-to-Point 連線（或手動設 `ip ospf network point-to-point`）則唔使選 DR/BDR。',
      bullets: [
        '7 States: Down → Init → 2-Way (DR/BDR election happens here!) → ExStart (Master/Slave + MTU check) → Exchange (DBD) → Loading (LSR/LSU) → Full',
        'Router ID election order: (1) Manual `router-id A.B.C.D` → (2) Highest IP on active Loopback → (3) Highest IP on active up/up physical interface',
        'DR/BDR Election (Broadcast/Ethernet): Highest OSPF Priority (default 1; `0` = never become DR/BDR), tiebreaker = highest Router ID (non-preemptive!)',
        'Multicast addresses: `224.0.0.5` (All OSPF Routers), `224.0.0.6` (All DR/BDR Routers)',
        'Neighbor requirements: Same Area ID, Hello (10s) / Dead (40s) timers, Subnet Mask, Authentication, unique Router ID, matching MTU'
      ],
      bulletsZh: [
        '7 個狀態次序：Down → Init → 2-Way（見自己 RID，選 DR/BDR）→ ExStart（比對 MTU）→ Exchange → Loading → Full',
        'Router ID 優先次序：(1) 手動 `router-id` → (2) 最高 up Loopback IP → (3) 最高 up 實體介面 IP；若完全無 IP 則 OSPF 唔能啟動',
        'DR/BDR 選舉：Priority 最高贏（預設 1，設 0 唔參選），同分比最高 Router ID；Non-preemptive 唔會即時搶位',
        'OSPF Multicast 位址：`224.0.0.5` 代表全部 OSPF Router；`224.0.0.6` 專畀 DR / BDR 收 LSU 用',
        'Ethernet 雙機直連可加 `ip ospf network point-to-point` 跳過 DR/BDR 選舉加快收斂'
      ],
      commands: [
        'Router(config-router)# router-id 1.1.1.1',
        'Router(config-if)# ip ospf priority 100',
        'Router(config-if)# ip ospf network point-to-point',
        'Router# show ip ospf neighbor',
        'Router# show ip ospf database'
      ],
      trap: 'Seeing `2-WAY/DROTHER` in `show ip ospf neighbor` on a LAN segment with multiple routers is completely NORMAL — only DR/BDR connections reach `FULL`.',
      trapZh: '喺 Multi-access Ethernet 睇到其他 DROther 顯示 `2-WAY` 係完全正常，唔代表故障！唯有 Point-to-Point 斷喺 ExStart 通常係兩端 MTU 唔一致。'
    },

    // ==================== CH05: IPV6 & OSPFV3 ====================
    {
      id: 'kw-17',
      chapter: 'Ch05',
      chapterLabel: 'Ch05: IPv6 & OSPFv3',
      chapterLabelZh: 'Ch05：IPv6 位址架構與 OSPFv3',
      domain: 'connectivity',
      title: 'IPv6 Address Types, Compression & EUI-64',
      titleZh: 'IPv6 位址類型、縮寫規則與 EUI-64 自動生成',
      summary: 'IPv6 eliminates broadcast and NAT using 128-bit Global Unicast, Unique Local, Link-Local, and Multicast addresses plus SLAAC/EUI-64 autoconfiguration.',
      summaryZh: 'IPv6 使用 128-bit（8 組 4 位十六進位），固定 40-byte Header，完全取消咗 Broadcast 而改用 Multicast 及 Anycast。每個啟用 IPv6 嘅介面都會自動擁有 `FE80::/10` Link-Local 位址。EUI-64 會將 48-bit MAC 中間插入 `FFFE` 並反轉第 7 個 bit 變成 64-bit Interface ID。',
      bullets: [
        'Compression rules: Omit leading zeros in each hextet; replace ONE contiguous all-zero run with `::`',
        'Global Unicast (`2000::/3`): Public routable on Internet; Unique Local (`FC00::/7` / `FD00::/8`): Private internal only, non-routable on Internet',
        'Link-Local (`FE80::/10`): Single-link only (used as routing next-hop & OSPFv3 neighbor communication)',
        'Loopback: `::1/128`; Default route: `::/0`; Unspecified: `::`',
        'Multicast (`FF00::/8`): `FF02::1` (All Nodes), `FF02::2` (All Routers), `FF02::5` (All OSPFv3), `FF02::6` (OSPFv3 DR/BDR)',
        'EUI-64 steps: Split 48-bit MAC in half, insert `FFFE`, invert the 7th bit (Universal/Local bit)'
      ],
      bulletsZh: [
        '縮寫規則：每組開頭嘅 0 可省略；全條位址「最多只可以用一次 `::`」取代連續全 0 組別',
        '位址種類：Global Unicast (`2000::/3`) 公網可路由；Unique Local (`FC00::/7` / `FD00::/8`) 似 IPv4 Private IP 唔會出 Internet；Link-Local (`FE80::/10`) 只限同一條鏈路',
        '特別位址：Loopback `::1`；預設路由 `::/0`；Multicast `FF02::1` (所有主機)、`FF02::2` (所有 Router)',
        'EUI-64 計法：將 MAC 分開兩半中間加 `FFFE`，再將頭兩個 Hex 轉二進位反轉第 7 個 bit (0變1、1變0)'
      ],
      commands: ['Router(config)# ipv6 unicast-routing', 'Router(config-if)# ipv6 address 2001:db8:1::/64 eui-64', 'Router# show ipv6 interface brief'],
      trap: 'Anycast uses the SAME unicast address configured on multiple devices — packets route to the topologically nearest one.',
      trapZh: 'IPv6 Anycast 同 Unicast 嘅位址格式相同（設同一組 IP 喺多部伺服器），Router 會自動送去拓撲最近嗰部！'
    },
    {
      id: 'kw-18',
      chapter: 'Ch05',
      chapterLabel: 'Ch05: IPv6 & OSPFv3',
      chapterLabelZh: 'Ch05：IPv6 位址架構與 OSPFv3',
      domain: 'connectivity',
      title: 'IPv6 Static Routes & OSPFv3 Configuration',
      titleZh: 'IPv6 靜態路由與 OSPFv3 動態路由設定',
      summary: 'OSPFv3 enables IPv6 routing per-interface rather than using network statements, requires `ipv6 unicast-routing`, and still uses a 32-bit Router ID.',
      summaryZh: '要喺 Cisco Router 啟用 IPv6 轉發同路由協定，第一條必打 `ipv6 unicast-routing`。OSPFv3 唔再用 `network` 指令，而係直接入去需要參與嘅介面輸入 `ipv6 ospf <pid> area <area>`，而且仍然必須要有一個 32-bit IPv4 格式嘅 Router ID！',
      bullets: [
        'Must enable `ipv6 unicast-routing` globally before routing works',
        'IPv6 Static / Default route: `ipv6 route ::/0 <next-hop-ipv6 | exit-intf [link-local]>` (if next-hop is FE80::, must specify exit interface too)',
        'OSPFv3 activation: Directly on each interface with `ipv6 ospf <pid> area <area-id>`',
        'Router ID in OSPFv3 is STILL 32-bit (IPv4 dotted-decimal format, e.g. `1.1.1.1`); if router has zero IPv4 addresses, you MUST manually set `router-id`!',
        'OSPFv3 default route injection: `default-information originate` (only advertises `::/0` if router already has a default route, unless `always` is added)'
      ],
      bulletsZh: [
        '必須先於全域設定 `ipv6 unicast-routing` 先至會進行 IPv6 路由轉發',
        'IPv6 靜態/預設路由：`ipv6 route ::/0 <Next-Hop>`（若 Next-Hop 用對方 `FE80::` Link-Local，必須同時指定出口介面例如 `g0/0 FE80::1`）',
        'OSPFv3 改為逐個介面啟動：`ipv6 ospf 1 area 0`，唔使打 Wildcard Mask',
        'OSPFv3 依然要用 IPv4 格式 32-bit Router ID！純 IPv6 Router 若無設定 IPv4 位址，必須手動設 `router-id 1.1.1.1`'
      ],
      commands: [
        'Router(config)# ipv6 unicast-routing',
        'Router(config)# ipv6 router ospf 1',
        'Router(config-rtr)# router-id 1.1.1.1',
        'Router(config-if)# ipv6 ospf 1 area 0',
        'Router# show ipv6 route',
        'Router# show ipv6 ospf neighbor'
      ],
      trap: '`default-information originate` without `always` only advertises a default route into OSPF/OSPFv3 when the local router ALREADY has a `::/0` or `0.0.0.0/0` route in its routing table!',
      trapZh: '記住：`default-information originate`（唔加 `always`）只會喺 Router 自己張 Routing Table 已經有預設路由時，先會廣播出去畀鄰居！'
    },

    // ==================== CH06: NETWORK MANAGEMENT & IP SERVICES ====================
    {
      id: 'kw-19',
      chapter: 'Ch06',
      chapterLabel: 'Ch06: Network Management & IP Services',
      chapterLabelZh: 'Ch06：網路管理、服務與安全連線',
      domain: 'services',
      title: 'TFTP, FTP vs SFTP/SCP File Transfers',
      titleZh: 'TFTP 與 FTP / SCP 檔案傳輸及 IOS 備份',
      summary: 'TFTP uses UDP 69 with no authentication for simple IOS image backups, whereas FTP uses TCP 20/21 and SCP/SFTP use encrypted SSH.',
      summaryZh: 'TFTP 用嚟快速備份或還原 Cisco IOS 映像檔（`copy flash tftp`），使用 UDP 69 發起連線（資料傳輸用隨機高位 Ephemeral Port），完全無密碼驗證亦無加密。大型企業傳大檔常用 FTP (TCP 20/21) 或經 SSH 加密嘅 SCP / SFTP (TCP 22)。',
      bullets: [
        'TFTP: UDP port 69, stateless/no auth, random ephemeral ports for data, adjustable blocksize (`ip tftp blocksize 8192`)',
        'FTP: TCP port 21 (Control) + TCP port 20 (Data); plaintext credentials',
        'SCP / SFTP: Runs over SSH (TCP 22) for encrypted file transfers',
        'Cisco IOS backup: `copy flash: tftp:` and `copy running-config tftp:`'
      ],
      bulletsZh: [
        'TFTP：使用 UDP 69、無帳號密碼驗證，發起請求連 Port 69 後，雙方會各自用 1024–65535 隨機 Ephemeral Port 傳檔',
        'FTP：使用 TCP 21 (指令控制) 同 TCP 20 (數據傳輸)，支援傳大檔但無加密',
        'SCP / SFTP：行 TCP 22 (SSH)，提供全程加密安全傳送',
        'IOS 備份指令：`copy flash tftp` 或 `copy running-config tftp`'
      ],
      commands: ['Router# copy flash: tftp:', 'Router(config)# ip tftp blocksize 8192'],
      trap: 'FTP uses BOTH TCP 21 (Control) and TCP 20 (Data) — TFTP uses ONLY UDP 69.',
      trapZh: '見 ACL 放行大型內部檔案傳輸同時開咗 TCP 20 同 21，即係問緊 FTP！見 UDP 69 就係 TFTP。'
    },
    {
      id: 'kw-20',
      chapter: 'Ch06',
      chapterLabel: 'Ch06: Network Management & IP Services',
      chapterLabelZh: 'Ch06：網路管理、服務與安全連線',
      domain: 'access',
      title: 'Layer 2 Neighbor Discovery: CDP vs LLDP',
      titleZh: '鄰居探索協定：CDP 與 LLDP 比較及保安停用',
      summary: 'CDP (Cisco proprietary) and LLDP (IEEE 802.1ab vendor-neutral) advertise local device IDs, platform, capabilities, and management IPs at Layer 2.',
      summaryZh: 'CDP (Cisco Discovery Protocol) 同 LLDP (IEEE 802.1ab) 都運作於 Layer 2，幫管理員即刻查出對端直接相連設備嘅名稱、型號、介面同管理 IP。CDP 係 Cisco 專用（預設開著），LLDP 跨牌子通用（預設關閉）。面對互聯網或不信任對外介面應該用 `no cdp enable` 停用，防止洩露設備型號同 IOS 版本！',
      bullets: [
        'CDP: Cisco proprietary, Layer 2, enabled by default (60s hello, 180s holdtime)',
        'LLDP (IEEE 802.1ab): Open multi-vendor standard, disabled by default (`lldp run` globally, `lldp transmit`/`receive` per port)',
        'Capability codes: `R` Router, `S`/`B` Switch/Bridge, `T` Phone, `W` WLAN AP',
        'Security best practice: Disable on untrusted / Internet-facing links (`no cdp enable` / `no lldp transmit`)'
      ],
      bulletsZh: [
        'CDP：Cisco 專有、預設自動開啟（每 60 秒發一次），可查 `show cdp neighbors detail` 睇對端 IP 同 IOS 版本',
        'LLDP (IEEE 802.1ab)：跨品牌標準、預設關閉，需於全域打 `lldp run` 啟用',
        '`show cdp/lldp neighbors detail` 會顯示 Neighbor 嘅 Device ID、IP、IOS 版本、對端埠口同 Native VLAN',
        '安全考量：連去 ISP 或外部嘅介面應關閉 CDP/LLDP (`no cdp enable`) 以免被 Recon 掃描洩露系統漏洞'
      ],
      commands: ['Router# show cdp neighbors detail', 'Router(config-if)# no cdp enable', 'Switch(config)# lldp run', 'Switch# show lldp neighbors detail'],
      trap: 'To stop CDP only on one interface (like ISP link), use `no cdp enable` in interface config; `no cdp run` disables it globally.',
      trapZh: '記清：`no cdp run` 係全機關閉 CDP；淨係停某個介面用 `no cdp enable`。LLDP 相反，分開 `lldp transmit` 同 `lldp receive`。'
    },
    {
      id: 'kw-21',
      chapter: 'Ch06',
      chapterLabel: 'Ch06: Network Management & IP Services',
      chapterLabelZh: 'Ch06：網路管理、服務與安全連線',
      domain: 'services',
      title: 'DHCP DORA Process, Pools & ip helper-address Relay',
      titleZh: 'DHCP DORA 四步運作、位址池設定與 Relay 跨網轉發',
      summary: 'DHCP dynamically assigns IPs via DORA (Discover, Offer, Request, Ack); routers block broadcasts so `ip helper-address` relays client broadcasts via unicast to another subnet.',
      summaryZh: 'DHCP 透過 DORA 四部曲（Discover → Offer → Request → Ack）自動派發 IP、Subnet Mask、Default Gateway 同 DNS。因為 Router 唔轉發 Broadcast，如果 DHCP Server 喺另一個網段，必須喺面向用戶嗰個 Router 介面上設定 `ip helper-address <DHCP Server IP>` 將廣播轉成 Unicast 送過去。',
      bullets: [
        'DORA: (1) Discover (Client Broadcast 255.255.255.255) → (2) Offer → (3) Request (Broadcast) → (4) Acknowledge',
        'IOS Server setup: `ip dhcp excluded-address` FIRST (before or separate from pool), then `ip dhcp pool <name>` (`network`, `default-router`, `dns-server`)',
        'Relay Agent: `ip helper-address <server-ip>` configured on the router interface facing the DHCP clients (also relays TFTP, DNS, etc.)',
        'Router as DHCP client: `ip address dhcp` on WAN interface'
      ],
      bulletsZh: [
        'DORA 過程：Client Broadcast 發 `DISCOVER` → Server 回 `OFFER` → Client 廣播 `REQUEST` 確認揀選 → Server 發 `ACK` 鎖定租約',
        '設定 Cisco Router 做 DHCP Server：`ip dhcp excluded-address` 排除 Gateway IP，再建 `ip dhcp pool` 配 `network`、`default-router`、`dns-server`',
        '跨網段拎 IP：一定要喺「Client 所在網段」嘅 Router Ingress 介面上打 `ip helper-address <DHCP Server IP>`',
        '查看租出紀錄：`show ip dhcp binding`'
      ],
      commands: [
        'Router(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.10',
        'Router(config)# ip dhcp pool LAN_POOL',
        'Router(dhcp-config)# network 192.168.10.0 255.255.255.0',
        'Router(dhcp-config)# default-router 192.168.10.1',
        'Router(config-if)# ip helper-address 172.16.32.15',
        'Router# show ip dhcp binding'
      ],
      trap: 'Put `ip helper-address` on the router interface RECEIVING client DHCP broadcasts (NOT on the interface facing the DHCP server).',
      trapZh: '常考伏位：`ip helper-address` 要設喺「面向用戶電腦 (LAN)」嘅介面上面，唔係面向 DHCP Server 嗰邊！'
    },
    {
      id: 'kw-22',
      chapter: 'Ch06',
      chapterLabel: 'Ch06: Network Management & IP Services',
      chapterLabelZh: 'Ch06：網路管理、服務與安全連線',
      domain: 'security',
      title: 'SSHv2, VTY Lines & AAA Local Authentication',
      titleZh: 'SSHv2 加密遠端管理與 AAA 本地認證設定',
      summary: 'SSHv2 replaces plaintext Telnet by encrypting remote management sessions; IOS requires hostname, domain-name, RSA keys (≥1024-bit), local user/AAA, and `transport input ssh`.',
      summaryZh: 'Telnet 係明文傳送，極容易畀 Wireshark 攔截密碼，所以考試與實戰必用 SSHv2 (TCP 22)。喺 Cisco 裝置開啟 SSH 缺一不可：Hostname + Domain Name + 產生 RSA Key（1024-bit 以上開 v2）+ 建立用戶名密碼 + 喺 VTY 設 `login local`（或 AAA）及 `transport input ssh`。',
      bullets: [
        '4 SSH prerequisites: Non-default `hostname`, `ip domain-name <name>`, `crypto key generate rsa` (modulus ≥ 1024 for SSHv2), user credentials (`username ... secret ...`)',
        'Lock VTY lines to SSH only: `line vty 0 15` → `transport input ssh` + `login local`',
        'Enable version 2 explicitly: `ip ssh version 2`',
        'AAA stands for: **Authentication** (who you are), **Authorization** (what you can do), **Accounting** (logging actions)'
      ],
      bulletsZh: [
        '開通 SSH 四部曲：(1) `hostname` 唔可以留預設、(2) `ip domain-name`、(3) `crypto key generate rsa` (建議 ≥ 1024 bit)、(4) 設本機帳號 + `ip ssh version 2`',
        '只准 SSH 連入：入 `line vty 0 4`（或 `0 15`）設 `transport input ssh` 同 `login local`（有開 `aaa new-model` 就自動套用 AAA）',
        'AAA 三個 A 代表：Authentication（驗證身份）、Authorization（授權權限）、Accounting（記錄審計）'
      ],
      commands: [
        'Router(config)# hostname R1',
        'Router(config)# ip domain-name lab.local',
        'Router(config)# crypto key generate rsa modulus 2048',
        'Router(config)# ip ssh version 2',
        'Router(config)# username admin privilege 15 secret CiscoPass',
        'Router(config)# line vty 0 15',
        'Router(config-line)# login local',
        'Router(config-line)# transport input ssh'
      ],
      trap: 'If a router still has default `hostname Router` or lacks `ip domain-name`, `crypto key generate rsa` fails immediately!',
      trapZh: '若無改走預設 Hostname 或者漏打 `ip domain-name`，Cisco IOS 會禁止你產生 RSA Key 導致開唔到 SSH！'
    },
    {
      id: 'kw-23',
      chapter: 'Ch06',
      chapterLabel: 'Ch06: Network Management & IP Services',
      chapterLabelZh: 'Ch06：網路管理、服務與安全連線',
      domain: 'services',
      title: 'NTP Time Synchronization & Syslog Severity Levels',
      titleZh: 'NTP 時間同步與 Syslog 日誌嚴重等級 (0–7)',
      summary: 'NTP (UDP 123) aligns device clocks for accurate log correlation; Syslog sends event logs tagged with Severity 0 (Emergency) through 7 (Debugging) to a centralized server.',
      summaryZh: '全公司 Router/Switch 必須靠 NTP (UDP 123) 對準時間，Syslog 先至有統一準確時戳追查事故。Syslog 嚴重度由 Level 0 到 Level 7，數字「越細越嚴重」(`Every Awesome Cisco Engineer Will Need Icecream Daily`)，設咗 `logging trap <N>` 會同時收集 `0` 至 `N` 級別嘅訊息！',
      bullets: [
        'NTP: UDP port 123, Stratum 0 (atomic/GPS clock) → Stratum 1 → Stratum 2..15 (`16` = unsynchronized); command: `ntp server <ip>`',
        'Syslog Severity Levels (0–7, mnemonic "Every Awesome Cisco Engineer Will Need Icecream Daily"): 0 Emergencies, 1 Alerts, 2 Critical, 3 Errors, 4 Warnings, 5 Notifications, 6 Informational, 7 Debugging',
        'Level 5 (Notification) example: Interface line up/down (`%LINK-3-UPDOWN` / `%LINEPROTO-5-UPDOWN`)',
        'Syslog config: `logging host <ip>` + `logging trap <level>` (captures levels 0 up to that number; e.g. `warnings` logs 0–4)'
      ],
      bulletsZh: [
        'NTP：用 UDP 123 同步時間，Stratum 數值越細越精準（最多 15，16 = 未同步）；設定指令為 `ntp server <IP>`',
        'Syslog 八個等級（0 最嚴重 → 7 最詳細）：0 Emergency、1 Alert、2 Critical、3 Error、4 Warning、5 Notification、6 Informational、7 Debugging',
        '記憶口訣：**E**very **A**wesome **C**isco **E**ngineer **W**ill **N**eed **I**cecream **D**aily',
        '`logging trap 4` (Warnings) 代表由 0 到 4 全部都會傳去 Syslog Server (`logging host <IP>`)；介面上下線提示通常係 Level 5 (Notifications)'
      ],
      commands: [
        'Router(config)# ntp server 172.24.54.8',
        'Router# show ntp status',
        'Router(config)# logging host 192.168.10.50',
        'Router(config)# logging trap notifications'
      ],
      trap: 'Syslog `logging trap 5` sends levels 0, 1, 2, 3, 4, AND 5 — NOT level 5 alone, and NOT 6 or 7!',
      trapZh: '注意方向：`logging trap 4` 係傳「0 至 4」，即係「數字細過或等於佢」全部都傳，而 5, 6, 7 就會忽略！'
    },
    {
      id: 'kw-24',
      chapter: 'Ch06',
      chapterLabel: 'Ch06: Network Management & IP Services',
      chapterLabelZh: 'Ch06：網路管理、服務與安全連線',
      domain: 'services',
      title: 'SNMP Monitoring & QoS Fundamentals',
      titleZh: 'SNMP 網路監控架構與 QoS 服務品質機制',
      summary: 'SNMP monitors devices via Agents, MIBs, polling (GET), and alerts (TRAP/INFORM); QoS classifies, marks, polices/shapes, and queues delay-sensitive traffic like voice.',
      summaryZh: 'SNMP 用於監控網內裝置狀態（CPU、流量、介面開關），由被監控設備上嘅 SNMP Agent 保存 MIB 資料庫，主動回報異常 (TRAP 不確認 / INFORM 需確認) 畀管理站 NMS。QoS 則透過 Classification、Marking (DSCP/CoS)、Queuing (LLQ 優先排隊) 及 Policing/Shaping 保障 VoIP 等延遲敏感流量。',
      bullets: [
        'SNMP roles: NMS Manager ↔ SNMP Agent holding MIB (Management Information Base)',
        'UDP 161 (GET/SET queries) and UDP 162 (TRAP = unacknowledged alert, INFORM = acknowledged alert)',
        'SNMPv3 adds encryption (AES) & authentication (SHA) vs community strings in v1/v2c',
        'QoS: LLQ (Low Latency Queuing) gives strict priority to Voice; Shaping buffers excess bursts (smooths rate) while Policing drops/remarks excess'
      ],
      bulletsZh: [
        'SNMP 元件：NMS 監控伺服器 + 設備 Agent + MIB 管理資訊庫；NMS 主動問 (Get) 行 UDP 161，設備主動報警行 UDP 162',
        'TRAP 同 INFORM 分別：TRAP 射完唔理對方收唔收到；INFORM 要求 NMS 回覆 ACK 確認',
        'SNMPv3 支援 Auth + Priv 加密認證，考試講安全監控一定揀 SNMPv3',
        'QoS 要點：VoIP 行嚴格優先佇列 LLQ；Shaping 會暫存超速封包令流量平滑，Policing 則直接丟棄或降級超標封包'
      ],
      commands: ['Router(config)# snmp-server community ReadOnly ro', 'Router# show snmp'],
      trap: 'Shaping buffers/delays excess packets (used outbound); Policing drops or remarks excess packets immediately.',
      trapZh: 'QoS 常考分別：Traffic Shaping 會 Queue/Delay 延遲發送，Traffic Policing 就會即時 Drop 或 Remark 標記降級！'
    },

    // ==================== CH07: ACL & NAT ====================
    {
      id: 'kw-25',
      chapter: 'Ch07',
      chapterLabel: 'Ch07: ACL & NAT',
      chapterLabelZh: 'Ch07：ACL 存取控制串列與 NAT',
      domain: 'security',
      title: 'Wildcard Masks & Standard ACLs (1–99, 1300–1999)',
      titleZh: '反遮罩 Wildcard Mask 與標準 ACL 過濾規則',
      summary: 'Wildcard masks match (0) or ignore (1) address bits; Standard ACLs check ONLY Source IP and should be placed as close to the destination as possible.',
      summaryZh: 'Wildcard Mask（反遮罩）同 Subnet Mask 剛好相反：0 代表「必須完全吻合」、1/255 代表「唔理/任意」；最快計法就係 `255.255.255.255 - Subnet Mask`。Standard ACL (`1-99`) 淨係睇「來源 IP (Source IP)」，因為太粗略易誤殺其他服務，一般放喺**盡量靠近目的地 (Closest to Destination)**。',
      bullets: [
        'Wildcard shortcut: `255.255.255.255 - Subnet Mask` (`/24` → `0.0.0.255`, `/26` → `0.0.0.63`, `/27` → `0.0.0.31`, `/28` → `0.0.0.15`, `/30` → `0.0.0.3`)',
        '`host X.X.X.X` = `X.X.X.X 0.0.0.0`; `any` = `0.0.0.0 255.255.255.255`',
        'Standard ACL numbers: `1–99` and `1300–1999`; inspects Source IP ONLY',
        'Top-down first-match evaluation + invisible **Implicit `deny any`** at the very end!'
      ],
      bulletsZh: [
        '反遮罩速算：`255.255.255.255 - Subnet Mask`（例 `/24` = `0.0.0.255`；`/26` = `0.0.0.63`；單一主機用 `host IP` 即 `0.0.0.0`）',
        'Standard ACL 編號：`1–99`、`1300–1999`，只根據來源 IP 決定 Permit / Deny，放近 Destination',
        '逐行由上而下比對，一撞中即刻停低執行！如果全部唔中，最尾必定有一行隱藏嘅 `deny any` 殺晒所有剩餘封包'
      ],
      commands: ['Router(config)# access-list 10 deny host 172.16.0.1', 'Router(config)# access-list 10 permit any', 'Router(config-if)# ip access-group 10 out'],
      trap: 'Every ACL ends with an invisible `deny any`! If an ACL only contains `deny` statements without `permit any`, it drops ALL traffic.',
      trapZh: '好多考生寫完 `deny` 唔記得喺最尾補返句 `permit any`（或 `permit ip any any`），結果條 Implicit Deny All 會阻擋晒全網正常連線！'
    },
    {
      id: 'kw-26',
      chapter: 'Ch07',
      chapterLabel: 'Ch07: ACL & NAT',
      chapterLabelZh: 'Ch07：ACL 存取控制串列與 NAT',
      domain: 'security',
      title: 'Extended ACLs (100–199), Named ACLs & Interface Placement',
      titleZh: '延伸 ACL (100–199)、具名 ACL 與方向 (in / out) 套用',
      summary: 'Extended ACLs filter by protocol, source/destination IP, and TCP/UDP port numbers, and are placed closest to the source.',
      summaryZh: 'Extended ACL (`100–199` / `2000–2699`) 可以精準指定 Protocol (ip/tcp/udp/icmp)、來源 IP、目的 IP 同 Port 號（例如 `eq 80` Web、`eq 22` SSH、`eq 23` Telnet），應該放喺**盡量靠近來源 (Closest to Source)** 及早攔截垃圾流量！用 Named ACL 仲可以逐條行號插隊或刪除。',
      bullets: [
        'Extended ACL syntax: `access-list 110 <permit|deny> <proto> <src> <src-wc> <dst> <dst-wc> [eq <port>] [log]`',
        'Placement: Extended → Closest to SOURCE; Standard → Closest to DESTINATION',
        'Rule order matters: Most specific statements MUST go BEFORE broader permit/deny lines',
        'Apply with `ip access-group <num|name> <in|out>` on routing interfaces (`access-class <num> in` on `line vty`)'
      ],
      bulletsZh: [
        'Extended 語法次序：`permit/deny <協定> <來源> <目的> eq <Port>`（注意係「來源寫先，目的寫後」！）',
        '位置口訣：**Extended Near Source，Standard Near Destination**',
        '最細緻、常用或者 `deny host` 嘅規則必須擺喺最頂（Sequence 10），寬鬆規則擺下面',
        'Router 介面套用：`ip access-group <號碼或名> in/out`；VTY 限制 Telnet/SSH 遠端登入就用 `access-class`'
      ],
      commands: [
        'Router(config)# ip access-list extended BLOCK_SSH',
        'Router(config-ext-nacl)# deny tcp host 10.0.0.5 any eq 22 log',
        'Router(config-ext-nacl)# permit ip any any',
        'Router(config-if)# ip access-group BLOCK_SSH in'
      ],
      trap: '`permit ip any any` allows all IP traffic; if you write `access-list 100 permit tcp ...`, it does NOT permit UDP/ICMP unless explicitly permitted or covered by `permit ip any any`.',
      trapZh: '寫 Extended ACL 最後想放行其餘全部流量（包括 ping / DNS UDP），記住一定要寫 `permit ip any any`（唔係 `tcp`）。'
    },
    {
      id: 'kw-27',
      chapter: 'Ch07',
      chapterLabel: 'Ch07: ACL & NAT',
      chapterLabelZh: 'Ch07：ACL 存取控制串列與 NAT',
      domain: 'services',
      title: 'NAT Types, Address Terminology & PAT (Overload)',
      titleZh: 'NAT 四大術語與靜態/動態/PAT 轉換設定',
      summary: 'NAT translates between private internal addresses and public global addresses; PAT (Overload) uses unique source TCP/UDP ports so thousands of hosts share one public IP.',
      summaryZh: 'NAT 用於將內網 Private IP 轉成公網 Public IP 上網。考試必須搞清 Inside Local（未轉前真實內網 IP）同 Inside Global（轉完後公網所見 IP）。最常用嘅係 PAT (NAT Overload)，透過加 `overload` 關鍵字並區分 Port 號，令全公司用同一粒公網 IP 同時上網。',
      bullets: [
        '4 NAT terms: **Inside Local** (PC private IP), **Inside Global** (router public NAT IP), **Outside Global** (Internet server real IP), **Outside Local** (server IP as seen inside)',
        'Static NAT: 1-to-1 permanent mapping (`ip nat inside source static <local> <global>`) — used for internal web servers',
        'Dynamic NAT: Many-to-many from a public pool (no `overload` — runs out if concurrent hosts > pool IPs)',
        'PAT / NAT Overload: Many-to-1 using Port numbers (`ip nat inside source list <acl> interface g0/0 overload`)',
        'Must mark interfaces `ip nat inside` and `ip nat outside`!'
      ],
      bulletsZh: [
        '四大名詞必背：**Inside Local** (內網機真實私網 IP)、**Inside Global** (對外出街公網 IP)、**Outside Global** (外網真 IP)',
        'Static NAT：一對一固定轉換，專畀公司內部 Web Server 對外開放服務用',
        'Dynamic NAT：用 Pool 一對多輪流借用，池內公網 IP 用晒就唔可以再上',
        'PAT / Overload：靠 Source Port 識別多對一共用同一粒 Public IP（記得最尾要有 `overload`）',
        '常見失分點：寫完 `ip nat inside source ...` 但唔記得入介面打 `ip nat inside` 同 `ip nat outside`'
      ],
      commands: [
        'Router(config)# access-list 1 permit 192.168.10.0 0.0.0.255',
        'Router(config)# ip nat inside source list 1 interface g0/0 overload',
        'Router(config-if)# ip nat inside / ip nat outside',
        'Router# show ip nat translations'
      ],
      trap: 'Static NAT translates ONE inside address to ONE outside address permanently; PAT/Overload maps MANY private hosts to ONE public IP using port numbers.',
      trapZh: '問「Single inside address to a single outside address」答案係 **Static NAT**；問「Shared single public IP with ports」就係 **PAT / NAT Overload**。'
    },

    // ==================== CH08: SDN, AUTOMATION, ARCHITECTURES, FHRP, VPN/GRE ====================
    {
      id: 'kw-28',
      chapter: 'Ch08',
      chapterLabel: 'Ch08: SDN, Cloud, FHRP & VPN',
      chapterLabelZh: 'Ch08：SDN、自動化、架構、FHRP 與 VPN',
      domain: 'automation',
      title: 'SDN Planes, Northbound/Southbound APIs & Cisco DNA Center',
      titleZh: 'SDN 控制/數據平面分離、南北向 API 與 DNA Center',
      summary: 'Controller-based SDN centralizes the Control Plane off individual devices into a controller that exposes Northbound REST APIs to apps and Southbound APIs to switches/routers.',
      summaryZh: '傳統網路每部 Router/Switch 各自運行 Control Plane；SDN (Controller-based) 將全網 **Control Plane** 抽離並集中到中央控制器（如 Cisco DNA Center），由控制器統一管理所有設備嘅轉發表。上層應用程式透過 **Northbound API (REST)** 向控制器發號施令，控制器再經 **Southbound API (OpenFlow / NETCONF)** 推送設定落底層 **Data Plane** 設備。',
      bullets: [
        '3 Planes: **Data Plane** (forwards packets), **Control Plane** (routing/STP decisions — centralized in SDN!), **Management Plane** (SSH/SNMP/monitoring)',
        'Northbound API (Controller ↔ Applications): REST API / JSON over HTTP(S)',
        'Southbound API (Controller ↔ Network Devices): OpenFlow, NETCONF, RESTCONF, OpFlex',
        'Cisco DNA Center: Central enterprise controller for intent-based policy, automation, and assurance (vs traditional per-box CLI)'
      ],
      bulletsZh: [
        '三個平面：Data Plane（實際轉發封包）、Control Plane（決定路徑 — SDN 正正係將佢中央化！）、Management Plane（管理監控）',
        'Northbound API（北向介面）：連接上層應用/自動化程式，常用 **REST API**',
        'Southbound API（南向介面）：控制底層 Switch/Router，常用 **OpenFlow / NETCONF / RESTCONF**',
        'Cisco DNA Center 屬 Intent-Based Networking 控制器，一鍵統一部署配置與安全策略，大大減低逐部打 CLI 嘅人為出錯'
      ],
      commands: [],
      trap: 'An SDN controller centralizes the CONTROL plane (leaving the DATA plane distributed on switches/routers for hardware-speed forwarding).',
      trapZh: '切記：SDN 控制器係抽走同集中 **Control Plane**（並非 Data Plane），數據轉發依然留喺各部 Switch/Router 本地以確保線速！'
    },
    {
      id: 'kw-29',
      chapter: 'Ch08',
      chapterLabel: 'Ch08: SDN, Cloud, FHRP & VPN',
      chapterLabelZh: 'Ch08：SDN、自動化、架構、FHRP 與 VPN',
      domain: 'automation',
      title: 'Network Automation: Ansible, Puppet, Chef, JSON & RESTCONF',
      titleZh: '網路自動化工具 (Ansible/Puppet/Chef)、JSON 與 REST API',
      summary: 'Automation tools deploy repeatable config changes at scale using structured data (JSON/YAML) and APIs; Ansible is agentless over SSH using Push, whereas Puppet/Chef are agent-based Pull.',
      summaryZh: '網路自動化透過腳本批量、可重複 (Repeatable) 部署設定，大幅減少人手打錯字引致故障。考試必識三大自動化工具特性對比，以及用 HTTP 動詞 (`GET/POST/PUT/DELETE`) 配合 JSON 格式 (`{ "key": "value" }`, 陣列 `[...]`) 存取 RESTCONF API。',
      bullets: [
        'Ansible: **Agentless** (uses SSH), **Push** model, playbooks written in YAML (port 22)',
        'Puppet (TCP 8140) & Chef (TCP 10002/HTTPS): **Agent-based**, **Pull** model, Ruby-based manifests/recipes',
        'JSON syntax: Objects `{"key": "value"}`, Arrays `["a", "b"]`, strings in double quotes `""`, numbers/booleans unquoted, comma-separated',
        'REST CRUD mapping: GET (read), POST (create), PUT (replace), PATCH (partial update), DELETE (remove); RESTCONF uses YANG models over HTTPS'
      ],
      bulletsZh: [
        'Ansible（Red Hat）：**Agentless 無須裝代理程式**、行 **SSH (Push)** 主動推設定，用 **YAML** Playbook（CCNA 考試高頻！）',
        'Puppet / Chef：需要在被管設備上運作 Agent，採 **Pull** 模型定期向 Master 領取組態',
        'JSON 格式守則：Key 一定要雙引號 `""`；Object 用大括號 `{}`；Array 陣列用中括號 `[]`；True/False 同數字唔加引號',
        'REST API HTTP 方法：GET（讀取）、POST（新增）、PUT（完整覆蓋更新）、DELETE（刪除）'
      ],
      commands: ['Router(config)# restconf', 'Router(config)# ip http secure-server'],
      trap: 'Ansible is AGENTLESS (SSH/NETCONF Push); Chef and Puppet require AGENTS (Pull). Also JSON keys ALWAYS require double quotes `"` — never single quotes.',
      trapZh: '必考對比：**Ansible = Agentless + Push + YAML + SSH**；見 JSON 格式題要檢查 Key 有無用雙引號及尾項有無多餘逗號。'
    },
    {
      id: 'kw-30',
      chapter: 'Ch08',
      chapterLabel: 'Ch08: SDN, Cloud, FHRP & VPN',
      chapterLabelZh: 'Ch08：SDN、自動化、架構、FHRP 與 VPN',
      domain: 'fundamentals',
      title: 'Campus & Data Center Topologies (3-Tier vs Spine-and-Leaf)',
      titleZh: '企業網路拓撲設計：三層架構、Two-Tier 與 Spine-and-Leaf',
      summary: 'Traditional campus designs use Access, Distribution, and Core layers; modern data centers use Spine-and-Leaf full-mesh uplinks for predictable low-latency east-west traffic.',
      summaryZh: '傳統大型校園/企業網採用三層設計：Access（接駁終端、Port Security/PoE）、Distribution（聚合、VLAN 路由、ACL 策略）、Core（純高速骨幹轉發）。現代數據中心伺服器間東西向流量 (East-West) 大增，改用 **Spine-and-Leaf**：每部 Leaf 連接每一部 Spine，確保任何兩部機最多 2 跳且延遲固定。',
      bullets: [
        'Three-Tier: **Access** (connects PCs/APs, PoE, port security) → **Distribution** (aggregation, routing boundary, ACLs, FHRP) → **Core** (high-speed Layer 3 switching only, no packet manipulation)',
        'Two-Tier (Collapsed Core): Combines Core + Distribution into one layer for small/medium campuses',
        'Spine-and-Leaf: Every Leaf connects to EVERY Spine; NO Leaf-to-Leaf or Spine-to-Spine links → predictable equal latency & horizontal scalability',
        'WAN Topologies: Full Mesh (highest reliability & cost), Hub-and-Spoke (centralized, cheaper), Point-to-Point'
      ],
      bulletsZh: [
        '三層架構：Access 層接用戶與 PoE；Distribution 層做路由、ACL 及備援閘道；Core 層只做超高速骨幹轉發（唔做 ACL 拖慢速度）',
        'Two-Tier Collapsed Core：中小型企業將 Core 同 Distribution 合併減少設備成本',
        'Spine-and-Leaf 特性：每部 Leaf 必定直連晒全部 Spine（但 Leaf 同 Leaf 之間唔連、Spine 同 Spine 唔連），消滅 STP 阻塞並保持一致低延遲',
        'WAN 拓撲：Full Mesh 可靠度最高但成本最貴；Point-to-Point 只有兩點；Hub-and-Spoke 省成本但 Hub 成單點故障'
      ],
      commands: [],
      trap: 'In Spine-and-Leaf, Leaf switches NEVER connect directly to other Leaf switches, and Spine switches NEVER connect to each other!',
      trapZh: '答 Spine-and-Leaf 題記實鐵則：**Every Leaf connects to EVERY Spine**，Leaf 與 Leaf 之間唔可以直接接線！'
    },
    {
      id: 'kw-31',
      chapter: 'Ch08',
      chapterLabel: 'Ch08: SDN, Cloud, FHRP & VPN',
      chapterLabelZh: 'Ch08：SDN、自動化、架構、FHRP 與 VPN',
      domain: 'services',
      title: 'FHRP: HSRP, VRRP & GLBP Gateway Redundancy',
      titleZh: '第一跳備援協定 (FHRP)：HSRP、VRRP 與 GLBP',
      summary: 'First Hop Redundancy Protocols present a single Virtual IP and Virtual MAC across redundant routers so host default gateways fail over transparently.',
      summaryZh: 'FHRP 用於防止 Default Gateway 單點故障！兩部或以上 Router 組成群組共用一個 **Virtual IP (VIP)** 同 **Virtual MAC** 作為電腦嘅 Default Gateway。當 Active Router 死機，Standby Router 會無縫頂上而用戶完全無需修改 Gateway IP。',
      bullets: [
        'HSRP (Cisco proprietary): **Active** + **Standby** routers; Hello 3s / Hold 10s; default priority 100 (highest wins); Virtual MAC `0000.0c07.acXX` (`XX` = group hex); `preempt` disabled by default',
        'VRRP (IETF open standard): **Master** + **Backup** routers; Virtual MAC `0000.5e00.01XX`; preemption enabled by default',
        'GLBP (Cisco proprietary): **AVG** + **AVFs** — provides BOTH gateway redundancy AND active-active load balancing across routers!',
        'Note: FHRP states use **Active / Standby** (HSRP) or **Master / Backup** (VRRP) — NOT Forwarding/Listening!'
      ],
      bulletsZh: [
        'HSRP（Cisco 專有）：角色為 **Active** 與 **Standby**；預設 Priority 100（高者勝）；Hello 3秒 / Hold 10秒；Virtual MAC `0000.0c07.acXX`',
        'VRRP（IETF 開放跨品牌標準）：角色為 **Master** 與 **Backup**；預設啟動 Preempt；Virtual MAC `0000.5e00.01XX`',
        'GLBP（Cisco 專有）：除咗備援，仲可以同時多部 Router 做 Active Load Balancing 負載分擔',
        'HSRP 常用指令：入介面設 `standby 1 ip <VIP>`、`standby 1 priority 110`、`standby 1 preempt`'
      ],
      commands: ['Router(config-if)# standby 1 ip 10.0.0.100', 'Router(config-if)# standby 1 priority 110', 'Router(config-if)# standby 1 preempt', 'Router# show standby brief'],
      trap: 'HSRP does NOT preempt by default (`standby <grp> preempt` must be added if you want the higher-priority router to reclaim Active after recovery).',
      trapZh: '常見伏位：HSRP 預設係**唔開啟 Preempt**，就算加咗 `priority 150` 仲要加多句 `standby 1 preempt` 復原後先至會搶返 Active 位！'
    },
    {
      id: 'kw-32',
      chapter: 'Ch08',
      chapterLabel: 'Ch08: SDN, Cloud, FHRP & VPN',
      chapterLabelZh: 'Ch08：SDN、自動化、架構、FHRP 與 VPN',
      domain: 'security',
      title: 'Site-to-Site IPsec VPN & GRE Tunneling',
      titleZh: 'Site-to-Site IPsec VPN 加密隧道與 GRE 封裝',
      summary: 'IPsec Site-to-Site VPNs encrypt private site traffic over untrusted public WANs; GRE tunnels encapsulate multicast/routing protocols inside IP but do NOT encrypt without IPsec.',
      summaryZh: '公司總部同分公司經公共互聯網互連內網時，可用 Site-to-Site IPsec VPN 透過 IKE/ISAKMP 建立加密隧道確保資料機密同完整。GRE 則可封裝多種協定及 Multicast 路由更新（如 OSPF/EIGRP），但 GRE 本身**無加密能力**，必須配搭 IPsec (`GRE over IPsec`) 先至安全。',
      bullets: [
        'GRE (Generic Routing Encapsulation, IP Protocol 47): Encapsulates multicast & dynamic routing protocols (`tunnel source`, `tunnel destination`) — NO built-in encryption',
        'IPsec provides Confidentiality (AES encryption), Integrity (SHA-256 HMAC), Authentication (PSK/RSA), and Anti-Replay',
        'Remote Access VPN (TLS/SSL or IPsec client on laptop) vs Site-to-Site VPN (router/firewall-to-router across WAN)',
        'Routing over tunnel: Use recursive lookup caution — tunnel destination must NOT route through the tunnel itself!'
      ],
      bulletsZh: [
        'GRE 隧道（IP Protocol 47）：可將 Multicast (如 OSPF / EIGRP) 封裝跨 Internet 傳送，但 GRE **完全無加密**',
        'IPsec VPN 三大保護：機密性 (AES 加密)、完整性 (SHA 雜湊)、身份認證 (Pre-shared Key / 憑證)',
        '實務常見組合：**GRE over IPsec** —— 先用 GRE 傳送 OSPF/Multicast，再用 IPsec 加密成條隧道',
        'Remote Access VPN 畀出街員工手提電腦連返公司；Site-to-Site VPN 係兩邊閘道 Router 長連加密'
      ],
      commands: ['Router(config-if)# tunnel source g0/0', 'Router(config-if)# tunnel destination 203.0.113.2'],
      trap: 'GRE alone does NOT encrypt data! Always remember: GRE = encapsulation/multicast; IPsec = encryption/integrity.',
      trapZh: 'GRE 淨係負責「封裝隧道」俾非 Unicast 流量過，並唔具備加密保護功能！'
    },

    // ==================== CH09: VLAN, DTP, VTP, INTERVLAN, PORT-SECURITY, STP, PORTFAST ====================
    {
      id: 'kw-33',
      chapter: 'Ch09',
      chapterLabel: 'Ch09: VLANs, Port Security & STP',
      chapterLabelZh: 'Ch09：VLAN、介面安全與生成樹 (STP)',
      domain: 'access',
      title: 'VLANs, 802.1Q Trunks, Voice VLAN & DTP/VTP',
      titleZh: 'VLAN 劃分、802.1Q Trunk、Voice VLAN 與 DTP / VTP',
      summary: 'VLANs segment broadcast domains at Layer 2; IEEE 802.1Q trunks carry multiple VLANs with 4-byte tags while DTP negotiates trunking and VTP syncs VLAN databases.',
      summaryZh: 'VLAN 可以喺同一部甚至跨 Switch 分隔出多個獨立嘅廣播網域 (Broadcast Domain)，提升保安同效能。Access Port 只屬於單一 Data VLAN（如有 IP Phone 可再加設一條 `switchport voice vlan` 讓話機同電腦共用一個孔）；Switch 之間靠 **IEEE 802.1Q** Trunk 打上 4-byte VLAN Tag 同時傳送多個 VLAN。',
      bullets: [
        'Access Port: Assigned to 1 Data VLAN (`switchport mode access`, `switchport access vlan 10`) + optional 1 Voice VLAN (`switchport voice vlan 51`)',
        'IEEE 802.1Q Trunk: Inserts 4-byte tag (12-bit VLAN ID 1–4094); Native VLAN traffic goes UNTAGGED (`switchport mode trunk`)',
        'DTP (Cisco Dynamic Trunking Protocol): `dynamic desirable` initiates trunking; `dynamic auto` passively waits (auto + auto = Access, NOT Trunk!); best practice: `switchport nonegotiate`',
        'VTP (VLAN Trunking Protocol): Modes = **Server** (create/edit/advertise), **Client** (receives, cannot edit), **Transparent** (local edits, forwards v2 ads without applying). Higher revision number overwrites entire domain!'
      ],
      bulletsZh: [
        'Access Port 接電腦 (`switchport access vlan X`)；接 IP Phone 再串連 PC 時加配 `switchport voice vlan Y`',
        '802.1Q Trunk：為非 Native VLAN 嘅 Frame 加上 4-byte Tag 識別屬於邊個 VLAN；設定時可加 `switchport trunk allowed vlan`',
        'DTP 配對鐵則：一邊 `auto` + 另一邊 `auto` = **變為 Access（起唔到 Trunk！）**；至少有一邊設為 `trunk` 或 `dynamic desirable` 先起到 Trunk',
        'VTP 風險：Client 或新插落網嘅舊 Switch 若果 VTP Revision Number 更高，會即刻洗掉全網原有 VLAN 設定！安全起見常用 `transparent` 或 `off`'
      ],
      commands: [
        'Switch(config-if)# switchport mode access',
        'Switch(config-if)# switchport access vlan 50',
        'Switch(config-if)# switchport voice vlan 51',
        'Switch(config-if)# switchport mode trunk',
        'Switch(config-if)# switchport nonegotiate',
        'Switch# show vlan brief',
        'Switch# show interfaces trunk'
      ],
      trap: 'DTP `dynamic auto` + `dynamic auto` results in an ACCESS link, not a trunk! Always hardcode `switchport mode trunk` + `switchport nonegotiate`.',
      trapZh: '必考陷阱：兩邊 Switch 設 `dynamic auto` 係唔會建立 Trunk 嘅！同時要記得 Voice VLAN 同 PC Data VLAN 可以共存喺同一個 Access Port 上面。'
    },
    {
      id: 'kw-34',
      chapter: 'Ch09',
      chapterLabel: 'Ch09: VLANs, Port Security & STP',
      chapterLabelZh: 'Ch09：VLAN、介面安全與生成樹 (STP)',
      domain: 'connectivity',
      title: 'Inter-VLAN Routing (Router-on-a-Stick & SVI)',
      titleZh: '跨 VLAN 路由 (Router-on-a-Stick 與 SVI 三層交換)',
      summary: 'Layer 2 switches cannot route between VLANs; Inter-VLAN routing requires either Router-on-a-Stick 802.1Q subinterfaces or a Layer 3 Switch with SVIs.',
      summaryZh: '唔同 VLAN 屬於唔同嘅 Subnet 與廣播域，Layer 2 Switch 唔可以直接互通佢哋，一定要經 Layer 3 設備做路由！常見有兩種做法：(1) **Router-on-a-Stick**：喺 Router 一個物理介面上開多個 Sub-interface（例如 `g0/0.10`），每個打 `encapsulation dot1Q <VLAN ID>` 並配閘道 IP，連去 Switch Trunk Port；(2) **Layer 3 Switch SVI**：開 `interface vlan <ID>` 配 IP 再啟用 `ip routing`。',
      bullets: [
        'Router-on-a-Stick: Physical interface `no shutdown` (no IP on main interface), subinterfaces `int g0/0.10` → `encapsulation dot1Q 10` → `ip address <gw> <mask>`',
        'Native VLAN on subinterface: `encapsulation dot1Q 99 native`',
        'Switch side connecting to Router-on-a-Stick MUST be configured as an **802.1Q Trunk** allowing those VLANs',
        'Layer 3 Switch SVI: Requires global `ip routing` + `interface vlan <id>` with IP + at least one active port/trunk in that VLAN'
      ],
      bulletsZh: [
        'Router-on-a-Stick 設定次序：主介面 `g0/0` 先開 `no shutdown`（唔使落 IP）→ 入 `g0/0.10` 先打 `encapsulation dot1Q 10` → 再落 `ip address`',
        'Switch 連去 Router 嗰個 Port 必須設為 Trunk (`switchport mode trunk`)，否則單臂路由唔會通',
        'Layer 3 Multi-layer Switch：透過建立 SVI (`interface vlan X`) 配 IP 作為各 VLAN 嘅 Default Gateway，並且必須全域執行 `ip routing`'
      ],
      commands: [
        'Router(config)# interface g0/0.10',
        'Router(config-subif)# encapsulation dot1Q 10',
        'Router(config-subif)# ip address 10.0.0.1 255.0.0.0',
        'Switch(config)# ip routing',
        'Switch(config)# interface vlan 10'
      ],
      trap: 'On a router subinterface, you MUST type `encapsulation dot1Q <vlan>` BEFORE `ip address ...` or IOS rejects the IP command!',
      trapZh: 'IOS 實作/模擬題緊記：入咗 `g0/0.10` 一定要先打 `encapsulation dot1Q <VLAN>`，後先可以打 `ip address`！'
    },
    {
      id: 'kw-35',
      chapter: 'Ch09',
      chapterLabel: 'Ch09: VLANs, Port Security & STP',
      chapterLabelZh: 'Ch09：VLAN、介面安全與生成樹 (STP)',
      domain: 'security',
      title: 'Switch Port Security (Violation Modes & Sticky MAC)',
      titleZh: '交換器介面安全 (Port Security 與三種違規處罰模式)',
      summary: 'Port Security limits how many/which MAC addresses can use an access port, with Protect, Restrict, or Shutdown (err-disabled) actions on violation.',
      summaryZh: 'Port Security 用嚟防止未經授權嘅電腦或 Rogue Switch 隨便插落辦公桌網線孔。可以限制最多允許學習幾多個 MAC（預設 1 個）、用 `mac-address sticky` 自動將學到嘅第一個 MAC 寫死入 Running-Config。當遇到非法 MAC 接入時，有三種處罰模式，預設係最嚴厲嘅 **Shutdown (err-disabled)**。',
      bullets: [
        'Prerequisites: Port MUST be static access (`switchport mode access`) BEFORE `switchport port-security` works',
        '3 Violation Modes: **Protect** (drops illegal frames silently, no syslog/counter), **Restrict** (drops frames + increments counter + sends SNMP/syslog), **Shutdown** (DEFAULT — puts port into `err-disabled`!)',
        'Recovery from `err-disabled`: Remove unauthorized device, then run `shutdown` followed by `no shutdown` (or `errdisable recovery`)',
        'Sticky MAC: `switchport port-security mac-address sticky` dynamically learns and saves MAC into running-config'
      ],
      bulletsZh: [
        '開啟前置條件：介面必須先設為靜態 Access (`switchport mode access`)，Trunk/Dynamic 模式唔支援 Port-Security',
        '三種違規模式比較：**Protect**（靜靜丟棄封包、唔出 Log/唔計數）、**Restrict**（丟棄 + 計數 + 發 Syslog 警告）、**Shutdown**（**預設模式** — 直接關閉 Port 變成 `err-disabled`）',
        '解救 `err-disabled`：先拔走非法網線，再對該 Port 輸入 `shutdown` 跟住 `no shutdown`',
        'Sticky 學習：`switchport port-security mac-address sticky` 會自動記低駁緊嗰部機嘅 MAC 到組態入面'
      ],
      commands: [
        'Switch(config-if)# switchport mode access',
        'Switch(config-if)# switchport port-security',
        'Switch(config-if)# switchport port-security maximum 2',
        'Switch(config-if)# switchport port-security mac-address sticky',
        'Switch(config-if)# switchport port-security violation restrict',
        'Switch# show port-security interface f0/1'
      ],
      trap: '**Protect** drops silently without incrementing violation counters or sending alerts; **Shutdown** is the default mode.',
      trapZh: '常見考題問點解違規發生咗但無 Syslog / Counter 仍為 0？因為佢設咗 `violation protect`！記住預設係 `shutdown`。'
    },
    {
      id: 'kw-36',
      chapter: 'Ch09',
      chapterLabel: 'Ch09: VLANs, Port Security & STP',
      chapterLabelZh: 'Ch09：VLAN、介面安全與生成樹 (STP)',
      domain: 'access',
      title: 'STP 802.1D / PVST+, Root Bridge, Port Roles & PortFast',
      titleZh: '生成樹協定 (STP 802.1D)、Root Bridge 選舉與 PortFast',
      summary: 'STP prevents Layer 2 switching loops and broadcast storms by electing a Root Bridge (lowest Bridge ID) and blocking redundant links; PortFast skips 30s delays on host ports.',
      summaryZh: '當 Switch 之間有冗餘雙線連接時，無 STP 就會引起 Broadcast Storm（廣播風暴）癱瘓全網。STP (802.1D / Cisco PVST+) 選出 **Root Bridge**（最低 Bridge ID = Priority + VLAN + MAC），再為每條路計算累積 Path Cost 決定 Root Port / Designated Port 同阻斷多餘路徑為 Alternate (Blocking)。接電腦嘅 Access Port 可開 `spanning-tree portfast` 跳過 30 秒 Listening + Learning 等待！',
      bullets: [
        'Root Bridge election: Lowest **Bridge ID** (16-bit Priority [default 32768 + sys-id-ext VLAN ID] + MAC address)',
        'Port Roles: Root Port (best path to Root on non-root switches), Designated Port (1 per segment; ALL ports on Root Bridge are Designated!), Alternate/Blocked',
        'Root Port tiebreakers: (1) Lowest cumulative Root Path Cost (10G=2, 1G=4, 100M=19, 10M=100), (2) Lowest sender BID, (3) Lowest sender Port ID, (4) Lowest local Port ID',
        '802.1D Port States (50s max): Blocking (20s MaxAge) → Listening (15s) → Learning (15s) → Forwarding / Disabled',
        'PortFast (`spanning-tree portfast`): Host-facing access ports jump straight from Blocking to Forwarding (avoids DHCP timeouts!)'
      ],
      bulletsZh: [
        'Root Bridge 選舉：Priority 最細贏（預設 32768 + VLAN 編號）；同分就比較 MAC Address 最細贏！Root Bridge 上面所有 Port 都係 Designated Port (Forwarding)',
        'Root Port 決選順序：(1) 返去 Root 總 Path Cost 最低（100M=19、1G=4、10G=2）→ (2) 上游發送者 BID 最細 → (3) 上游/本地介面編號最細',
        '802.1D 五個狀態：Disabled / Blocking (20s) → Listening (15s) → Learning (15s，學 MAC) → Forwarding，開通等 30 秒',
        '**PortFast**：只可以用於接終端 PC/Server/Router 嘅 Access Port，跳過 30 秒 Listening/Learning 直接轉發，否則開機 DHCP 會 Timeout'
      ],
      commands: [
        'Switch(config)# spanning-tree vlan 1 root primary',
        'Switch(config)# spanning-tree vlan 1 priority 4096',
        'Switch(config-if)# spanning-tree portfast',
        'Switch# show spanning-tree vlan 1'
      ],
      trap: 'NEVER enable PortFast on a switch-to-switch link unless paired carefully — PortFast skips Listening/Learning and can create brief loops; ALWAYS pair access PortFast ports with BPDU Guard!',
      trapZh: '記住 STP Path Cost：10M=100、100M=19、1G=4、10G=2。而且開咗 PortFast 嘅用戶介面最好同時加上 **BPDU Guard** 防止有人偷駁 Switch！'
    },

    // ==================== CH10: ROOT GUARD, BPDU GUARD, RSTP, ETHERCHANNEL, NATIVE VLAN, DAI ====================
    {
      id: 'kw-37',
      chapter: 'Ch10',
      chapterLabel: 'Ch10: RSTP, EtherChannel & Layer 2 Security',
      chapterLabelZh: 'Ch10：RSTP、EtherChannel 與交換器安全防護',
      domain: 'security',
      title: 'STP Protection: Root Guard vs BPDU Guard',
      titleZh: 'STP 防護雙雄：Root Guard 與 BPDU Guard 區別',
      summary: 'Root Guard enforces Root Bridge placement by placing ports receiving superior BPDUs into root-inconsistent state; BPDU Guard shuts down (`err-disabled`) access PortFast ports if any BPDU arrives.',
      summaryZh: '防止黑客接部 Priority=0 嘅 Switch 搶做 Root Bridge 或搞亂拓撲有兩招：**Root Guard** 開喺面向下游 Distribution/Access Switch 嘅連線上，收到更低 (Superior) BPDU 就會將該 Port 轉為 **root-inconsistent (Listening/Blocking)**，等對方回復正常即自動解封；**BPDU Guard** 開喺接 PC 嘅 PortFast 用戶孔，只要收到「任何」BPDU 即刻轉入 **err-disabled** 徹底關閉！',
      bullets: [
        'BPDU Guard (`spanning-tree bpduguard enable`): Configured on **PortFast edge/access ports**; disables port into **`err-disabled`** if ANY BPDU is received',
        'Root Guard (`spanning-tree guard root`): Configured on **designated ports** facing other switches where a Root Bridge must NEVER sit; moves port to **`root-inconsistent` (blocking)** only on SUPERIOR BPDUs and auto-recovers when superior BPDUs stop',
        'BPDU Filter: Suppresses sending/receiving BPDUs (dangerous if misused on switch links)'
      ],
      bulletsZh: [
        '**BPDU Guard**：保護 User Access Port（配合 PortFast），唔應該收到任何 Switch BPDU；一收到即變 **`err-disabled`** 斷線',
        '**Root Guard**：保護現有 Root Bridge 地位，開喺面向下級 Switch 嘅 Designated Port；一收到 Priority 更低嘅 Superior BPDU 即變 **`root-inconsistent`** 阻斷，停發後會自動恢復',
        '考試分辨關鍵：寫「PortFast port receives any BPDU → err-disabled」係 **BPDU Guard**；寫「prevent switch from becoming Root Bridge → root-inconsistent」係 **Root Guard**'
      ],
      commands: [
        'Switch(config-if)# spanning-tree bpduguard enable',
        'Switch(config)# spanning-tree portfast bpduguard default',
        'Switch(config-if)# spanning-tree guard root'
      ],
      trap: 'BPDU Guard triggers on ANY BPDU (`err-disabled`), whereas Root Guard triggers ONLY on SUPERIOR BPDUs (`root-inconsistent`)!',
      trapZh: '記清兩者狀態：**BPDU Guard → err-disabled（唔會自己開返）**；**Root Guard → root-inconsistent（停止搶位就會自動復原）**。'
    },
    {
      id: 'kw-38',
      chapter: 'Ch10',
      chapterLabel: 'Ch10: RSTP, EtherChannel & Layer 2 Security',
      chapterLabelZh: 'Ch10：RSTP、EtherChannel 與交換器安全防護',
      domain: 'access',
      title: 'RSTP (802.1w / Rapid PVST+) States & Fast Convergence',
      titleZh: 'RSTP (802.1w) 快速生成樹：3 大狀態與極速收斂',
      summary: 'RSTP (IEEE 802.1w / Cisco Rapid PVST+) cuts convergence from 50s to 1–2 seconds using Proposal/Agreement handshakes and simplifies states into Discarding, Learning, and Forwarding.',
      summaryZh: '傳統 STP (802.1D) 要等 30–50 秒太慢，RSTP (802.1w / Cisco Rapid PVST+) 改用主動 **Proposal / Agreement 握手協議** 達成毫秒至數秒內收斂，並將舊有 5 種 Port State 簡化成得番 3 種：**Discarding**（取代 Disabled/Blocking/Listening）、**Learning**、**Forwarding**，而且新增咗 Backup Port 角色。',
      bullets: [
        '3 RSTP Port States: **Discarding** (no forwarding, no MAC learning), **Learning** (learns MACs, no data forwarding), **Forwarding**',
        '4 RSTP Port Roles: Root, Designated, **Alternate** (backup path to Root), **Backup** (redundant link to same shared hub/segment)',
        'RSTP Link Types: Point-to-point (full-duplex — supports fast Proposal/Agreement sync), Shared (half-duplex), Edge (PortFast)',
        'Keepalive detection: 3 missed Hellos = 6 seconds (vs 20s MaxAge in 802.1D)'
      ],
      bulletsZh: [
        'RSTP 僅有 3 種 Port States：**Discarding**（集結舊 Disabled/Blocking/Listening）、**Learning**、**Forwarding**',
        '新增角色：**Alternate Port**（去 Root 嘅後備路線，唔使等 20s 直接升做 Root Port）及 **Backup Port**（同一共享網段備份）',
        'Point-to-point 全雙工連線會使用 Proposal/Agreement 同步即時轉入 Forwarding；Edge Port = PortFast',
        '切換模式：`spanning-tree mode rapid-pvst`；`show spanning-tree` 見 `protocol rstp`'
      ],
      commands: ['Switch(config)# spanning-tree mode rapid-pvst', 'Switch# show spanning-tree vlan 30'],
      trap: 'RSTP exam question classic: "Aside from Discarding, which two states exist in RSTP?" → **Learning** and **Forwarding** (Listening & Blocking are GONE!).',
      trapZh: '考試必中題：「除咗 Discarding 之外，RSTP 仲有邊兩個 Port State？」答案一定係 **Learning** 同 **Forwarding**（802.1w 已經無咗 Listening 同 Blocking）！'
    },
    {
      id: 'kw-39',
      chapter: 'Ch10',
      chapterLabel: 'Ch10: RSTP, EtherChannel & Layer 2 Security',
      chapterLabelZh: 'Ch10：RSTP、EtherChannel 與交換器安全防護',
      domain: 'access',
      title: 'EtherChannel Aggregation (LACP, PAgP & Port-Channel)',
      titleZh: 'EtherChannel 鏈路聚合 (LACP / PAgP 組合規則)',
      summary: 'EtherChannel bundles 2–8 physical Ethernet links into one logical Port-Channel interface so STP treats it as a single link while multiplying bandwidth and providing failover.',
      summaryZh: 'EtherChannel 將多條（最多 8 條）相同規格實體網線綁成一條邏輯 `Port-Channel`，令 STP 當佢係同一條線而唔會 Block 掉其中一條，同時提升總頻寬同提供斷線備援。動態協商有 **LACP (IEEE 802.3ad)** 同 **PAgP (Cisco 專用)**，如果對面設無協議 `on` 而另一端無設齊好容易引致 STP Loop！',
      bullets: [
        'LACP (IEEE 802.3ad open standard): **`active`** + **`active`** OR **`active`** + **`passive`** form a channel (`passive` + `passive` does NOT!)',
        'PAgP (Cisco proprietary): **`desirable`** + **`desirable`** OR **`desirable`** + **`auto`** form a channel (`auto` + `auto` does NOT!)',
        'Static **`on`** + **`on`**: No negotiation packets; `on` + `active`/`desirable` FAILS to bundle!',
        '5 strict match requirements across member ports: Speed, Duplex, Native VLAN, Allowed VLANs, Switchport mode (Access vs Trunk)',
        'Status flags in `show etherchannel summary`: **`P`** = bundled in port-channel (good!), **`D`** = down, **`I`** = stand-alone, **`s`** = suspended'
      ],
      bulletsZh: [
        'LACP (開放標準)：**Active + Active** 或 **Active + Passive** 先會成功；兩邊都 **Passive** 係建立唔到！',
        'PAgP (Cisco 專有)：**Desirable + Desirable** 或 **Desirable + Auto** 先成功；兩邊 **Auto** 會失敗！',
        '`mode on` 必須兩邊一齊設 `on`（唔好一邊 `on` 一邊 `active`）',
        '捆綁五個必須完全相同條件：Speed、Duplex、Access/Trunk 模式、Native VLAN、Allowed VLANs',
        '`show etherchannel summary` 睇狀態：`SU` (Layer 2 Up) 同括號內 `(P)` 代表成功綁定；見 `(I)` 或 `(s)` 即係有設定唔夾'
      ],
      commands: [
        'Switch(config)# interface range f0/6 - 7',
        'Switch(config-if-range)# channel-group 1 mode active',
        'Switch(config)# interface port-channel 1',
        'Switch# show etherchannel summary',
        'Switch# show lacp neighbor'
      ],
      trap: 'NEVER mix `active` (LACP) with `desirable` (PAgP) or `on` on opposite ends — and verify `SU` / `(P)` in `show etherchannel summary`!',
      trapZh: '常見考題：除咗檢查 Mode 有無撞（例 LACP Active 對 PAgP Desirable 唔會通），仲要檢查各成員 Port 嘅 **Speed、Duplex 同 Native/Allowed VLAN** 係咪完全一致。'
    },
    {
      id: 'kw-40',
      chapter: 'Ch10',
      chapterLabel: 'Ch10: RSTP, EtherChannel & Layer 2 Security',
      chapterLabelZh: 'Ch10：RSTP、EtherChannel 與交換器安全防護',
      domain: 'security',
      title: 'Native VLAN Mismatch & VLAN Hopping Mitigation',
      titleZh: 'Native VLAN 匹配安全與防範 VLAN Hopping 雙重標籤攻擊',
      summary: 'Native VLAN frames traverse 802.1Q trunks untagged; leaving Native VLAN at default VLAN 1 risks VLAN hopping and mismatch leakage — move it to an unused VLAN.',
      summaryZh: '802.1Q Trunk 預設 Native VLAN = 1，所有屬於 Native VLAN 嘅流量過 Trunk 時「唔會加 VLAN Tag」。如果兩端 Trunk 嘅 Native VLAN 設咗唔一樣（例如一邊 VLAN 1、另一邊 VLAN 2），就會發生跨 VLAN 滲漏，或者令黑客透過 Double Tagging (VLAN Hopping) 偷偷跳入目標 VLAN！',
      bullets: [
        'Native VLAN carries UNTAGGED traffic across an 802.1Q trunk (default = VLAN 1)',
        'Mismatch risk: Switch A sends untagged frame from VLAN 1, Switch B receives untagged frame and places it into its own Native VLAN (e.g. VLAN 2) → unintended cross-VLAN leak + CDP mismatch warning',
        'Security best practices against VLAN Hopping & Switch Spoofing: (1) Change Native VLAN on all trunks to an unused VLAN ID (e.g. 999), (2) Disable DTP (`switchport nonegotiate`), (3) Force user ports to `switchport mode access`, (4) Shut down unused ports & move them to an unused VLAN'
      ],
      bulletsZh: [
        'Native VLAN 過 Trunk 時唔會貼 Tag（預設 VLAN 1）',
        'Mismatch 後果：兩端 Native VLAN 唔同會造成「無標籤訊框錯誤跌落對方另一條 VLAN」，同引發 CDP / STP 錯誤日誌',
        '最佳保安防禦 (防 Switch Spoofing 同 Double Tagging)：(1) 將 Trunk 兩端 `switchport trunk native vlan` 一齊改成無人用嘅 VLAN（如 99 或 999）、(2) 關閉 DTP (`nonegotiate`)、(3) 所有電腦孔寫死 `mode access`、(4) 未用介面 `shutdown`'
      ],
      commands: [
        'Switch(config-if)# switchport trunk native vlan 999',
        'Switch(config-if)# switchport trunk allowed vlan 10,20,30',
        'Switch(config-if)# switchport nonegotiate'
      ],
      trap: 'Leaving Native VLAN at VLAN 1 allows Double-Tagging VLAN Hopping attacks if an attacker connects to a port in VLAN 1.',
      trapZh: '記住：Trunk 兩邊嘅 Native VLAN 一定要匹配，而且最佳做法係改去一條唔會用來接用戶電腦嘅獨立 Unused VLAN！'
    },
    {
      id: 'kw-41',
      chapter: 'Ch10',
      chapterLabel: 'Ch10: RSTP, EtherChannel & Layer 2 Security',
      chapterLabelZh: 'Ch10：RSTP、EtherChannel 與交換器安全防護',
      domain: 'security',
      title: 'DHCP Snooping, Dynamic ARP Inspection (DAI) & MAC Flooding',
      titleZh: 'DHCP Snooping、動態 ARP 檢查 (DAI) 與防範 ARP 欺騙/MAC 溢位',
      summary: 'DHCP Snooping blocks rogue DHCP servers and builds an IP-to-MAC binding table; DAI validates incoming ARP packets against that table to stop ARP spoofing/MITM.',
      summaryZh: '黑客常見兩大 Layer 2 攻擊：(1) 發出假 DHCP Offer 搶做 Gateway；(2) **ARP Spoofing (中間人攻擊)** 狂發假 ARP 令 Switch MAC Table 滿瀉或劫持流量。防禦方法：先開 **DHCP Snooping**（只有連真 DHCP Server 嘅埠設為 `trust`）建立合法 IP-to-MAC Binding Table，再開 **Dynamic ARP Inspection (DAI)** 檢查所有 `Untrusted` 埠嘅 ARP，一發現偽造即丟棄或轉 `err-disabled`！',
      bullets: [
        'MAC Flooding / CAM Overflow: Attackers flood thousands of fake source MACs (`show mac address-table count`) → mitigated by **Port Security**',
        'DHCP Snooping (`ip dhcp snooping` + `ip dhcp snooping vlan <id>`): Untrusted (default) drops DHCP Server OFFER/ACK messages; ONLY ports toward legitimate DHCP server/uplink set `ip dhcp snooping trust`',
        'Dynamic ARP Inspection (`ip arp inspection vlan <id>`): Uses the **DHCP Snooping Binding Database** (plus optional static ARP ACLs) to validate ARP packets on untrusted ports (`ip arp inspection trust` on trunks)',
        'Rate limiting on DAI untrusted ports stops ARP storm/flooding (triggers `err-disabled` if exceeded)'
      ],
      bulletsZh: [
        'MAC Address Table 爆滿攻擊 (CAM Overflow)：黑客狂塞幾千個假 MAC 令 Switch 退化做 Hub 全廣播 → 用 **Port Security** 防護',
        'DHCP Snooping：預設所有 Port 都係 **Untrusted**，會擋住非法電腦派出嘅 DHCP OFFER/ACK；淨係將連去真 DHCP Server 嘅 Port/Trunk 設為 `ip dhcp snooping trust`',
        'DAI (`ip arp inspection vlan X`)：必須建基於 DHCP Snooping Binding Database！所有 Untrusted 用戶口收到嘅 ARP Request/Reply 都必須吻合資料庫記錄，否則即殺（Trunk 連接其他 Switch 通常需設 `ip arp inspection trust`）'
      ],
      commands: [
        'Switch(config)# ip dhcp snooping',
        'Switch(config)# ip dhcp snooping vlan 10,20',
        'Switch(config-if)# ip dhcp snooping trust',
        'Switch(config)# ip arp inspection vlan 10,20',
        'Switch(config-if)# ip arp inspection trust',
        'Switch# show ip arp inspection interfaces'
      ],
      trap: 'DAI depends on **DHCP Snooping**! On a DAI-enabled switch, ALL access ports default to **Untrusted** (must manually trust trunks between switches).',
      trapZh: '考試黃金組合：**DHCP Snooping + DAI** 孖寶出現！無開 DHCP Snooping 就無 Binding Table 畀 DAI 核對（除非額外寫靜態 ARP ACL）。'
    },

    // ==================== ADDITIONAL CORE CCNA EXAM TOPICS FROM PDF BANK & LABS ====================
    {
      id: 'kw-42',
      chapter: 'Ch01',
      chapterLabel: 'Ch01: Network Fundamentals & OSI',
      chapterLabelZh: 'Ch01：網路基礎與 OSI 模型',
      domain: 'fundamentals',
      title: 'PoE (Power over Ethernet) & Switch Hardware Forwarding',
      titleZh: 'PoE 網線供電標準 (802.3af/at/bt) 與介面速度/錯誤計數',
      summary: 'PoE supplies DC electrical power alongside data over UTP copper cables to IP phones, APs, and cameras; knowing PoE wattage limits and interface error counters is key on the exam.',
      summaryZh: 'PoE (Power over Ethernet) 容許 Switch 直接透過 Cat5e/Cat6 銅線同時傳數據同供電畀 IP Phone、Wireless AP 同 CCTV 攝影機，唔使另外拉電掣。Cisco 預設支援自動偵測供電，各世代 IEEE 標準瓦數各有上限。',
      bullets: [
        'IEEE 802.3af (PoE): max **15.4 W** per port (Type 1 — basic IP phones)',
        'IEEE 802.3at (PoE+): max **30 W** per port (Type 2 — enterprise dual-band APs, PTZ cameras)',
        'IEEE 802.3bt (UPoE / PoE++): Type 3 = **60 W**, Type 4 = **90–100 W**',
        'Interface errors: **Runts** (<64 bytes), **Giants** (>1518 bytes), **CRC errors** (noise/bad cable/duplex mismatch)'
      ],
      bulletsZh: [
        'IEEE 802.3af (PoE)：每 Port 最高供電 **15.4 W**（一般 VoIP 電話）',
        'IEEE 802.3at (PoE+)：每 Port 最高供電 **30 W**（企業級 Wi-Fi AP / 鏡頭）',
        'IEEE 802.3bt (PoE++)：Type 3 達 **60 W**，Type 4 達 **90–100 W**',
        '`show interfaces` 錯誤指標：**Runts**（細過 64 bytes 殘缺訊框）、**Giants**（大過 1518 bytes）、**CRC**（干擾/線壞/Duplex 錯）'
      ],
      commands: ['Switch# show power inline', 'Switch(config-if)# power inline auto'],
      trap: '802.3af = 15.4W, 802.3at = 30W, 802.3bt = 60W/90W (Type 3/4). Always check remaining switch PoE power budget (`show power inline`).',
      trapZh: '記清數字：af=15.4W，at=30W，bt=60W/90W。插咗新 AP 但唔著燈，記得查 `show power inline` 睇係咪總瓦數爆咗！'
    },
    {
      id: 'kw-43',
      chapter: 'Ch06',
      chapterLabel: 'Ch06: Network Management & IP Services',
      chapterLabelZh: 'Ch06：網路管理、服務與安全連線',
      domain: 'services',
      title: 'DNS Resolution, DHCP Options & Network Services Summary',
      titleZh: 'DNS 域名解析步驟、DHCP 進階選項與服務整合',
      summary: 'DNS resolves human-readable FQDNs to IPv4 (A) or IPv6 (AAAA) records via recursive/iterative lookups between client resolver, local DNS, root, TLD, and authoritative servers.',
      summaryZh: 'DNS 負責將網址（FQDN）翻譯做 IP 位址（IPv4 用 `A` Record，IPv6 用 `AAAA` Record）。當瀏覽器查網址：先查本機 Hosts / Cache → 問設定好嘅 Local Recursive DNS Server → 依序問 Root (`.`) → TLD (`.com`) → Authoritative Name Server 攞返最終 IP！',
      bullets: [
        'DNS Lookup order: Browser/OS cache → hosts file → Local DNS Server (Recursive) → Root → TLD (.com/.org) → Authoritative Server',
        'Records: `A` (IPv4 host), `AAAA` (IPv6 host), `CNAME` (alias), `MX` (mail server), `PTR` (reverse IP→name)',
        'IOS local DNS config: `ip domain-lookup` + `ip name-server 8.8.8.8` (disable on lab routers with `no ip domain-lookup` to avoid typo hangs)',
        'DHCP Option 150 tells Cisco IP phones the **TFTP Server IP** to download firmware/config'
      ],
      bulletsZh: [
        'DNS 查詢順序：本機 Cache / Hosts 檔 → Recursive Local DNS → Root Server → TLD Server (`.com`) → Authoritative DNS',
        '常用 Record 類型：`A` (對應 IPv4)、`AAAA` (對應 IPv6)、`CNAME` (別名)、`MX` (電郵伺服器)、`PTR` (反向查詢)',
        'Router 實習常用 `no ip domain-lookup`，防止打錯指令時路由器停頓幾十秒試圖搵 DNS 解析！',
        'VoIP 整合重點：**DHCP Option 150** 專責話畀 Cisco IP Phone 知 TFTP Server 嘅 IP 位址喺邊'
      ],
      commands: ['Router(config)# ip name-server 8.8.8.8', 'Router(config)# no ip domain-lookup', 'Router(dhcp-config)# option 150 ip 10.1.1.5'],
      trap: 'Option 150 points IP phones to the TFTP server; DNS lookup uses UDP 53 normally.',
      trapZh: 'Drag & Drop 高頻題：要熟悉標準 DNS 查詢步驟先後次序（Resolver → Root → TLD → Authoritative）。'
    },
    {
      id: 'kw-44',
      chapter: 'Ch07',
      chapterLabel: 'Ch07: ACL & NAT',
      chapterLabelZh: 'Ch07：ACL 存取控制串列與 NAT',
      domain: 'security',
      title: 'Cyber Threats, Password Policies, MFA & VPN/Wireless Security',
      titleZh: '網路威脅識別、密碼與 MFA 防護及 WPA2/WPA3 無線安全',
      summary: 'CCNA Security Fundamentals covers social engineering/phishing, DoS/DDoS, brute force, MFA factors, RBAC/least privilege, and wireless WPA2/WPA3 authentication & encryption.',
      summaryZh: 'Security Fundamentals 考點仲涵蓋各類攻擊手法同防護措施：例如釣魚 (Phishing)、社交工程、DoS 阻斷服務、密碼暴力破解（應啟用密碼複雜度與 MFA 多因素驗證：Something you know + have + are），以及無線安全由舊有易破解嘅 WEP/TKIP 升級到 **WPA2 (AES-CCMP)** 同 **WPA3 (SAE)**。',
      bullets: [
        'Threats: **Phishing** (deceptive emails), **Social Engineering** (manipulating humans), **Brute-force** (mitigate via MFA + account lockout), **Rogue AP / Evil Twin** (spoofed Wi-Fi)',
        'MFA factors: Knowledge (password/PIN), Possession (smartcard/OTP token/phone), Inherence (biometrics — fingerprint/iris)',
        'Security principles: **Least Privilege** (grant minimum needed permissions), **Defense in Depth** (layered controls), **RBAC** (Role-Based Access Control)',
        'Wireless security: **WEP** (broken RC4), **WPA** (TKIP), **WPA2** (AES-CCMP), **WPA3** (Simultaneous Authentication of Equals / SAE + 192-bit suite); Enterprise uses **802.1X + RADIUS**'
      ],
      bulletsZh: [
        '常見威脅分類：Phishing 釣魚電郵、Pretexting/社交工程（針對人為漏洞）、DoS/DDoS（耗盡系統資源）、Man-in-the-Middle',
        'MFA 多因素驗證必須結合「最少兩種唔同類別」：你知嘅嘢 (密碼)、你有嘅嘢 (硬件 Token/手機認證)、你係邊個 (指紋/生物辨識)',
        '最小權限原則 (Least Privilege)：只畀職員工作所需嘅最低權限；防禦多層次 (Defense in Depth)',
        '無線加密安全：WPA2 用 **AES (CCMP)**；WPA3 用 **SAE (Simultaneous Authentication of Equals)** 防離線字典破解；企業級用 **802.1X + RADIUS** 認證個別員工帳號'
      ],
      commands: [],
      trap: 'Entering a password + answering a secret security question is STILL Single-Factor (both are "something you know") — NOT MFA!',
      trapZh: '伏位：密碼加保安問題兩者都屬於「Something you know」，所以**唔算** MFA！一定要配電話/Token/指紋等第二種元素。'
    },
    {
      id: 'kw-45',
      chapter: 'Ch08',
      chapterLabel: 'Ch08: SDN, Cloud, FHRP & VPN',
      chapterLabelZh: 'Ch08：SDN、自動化、架構、FHRP 與 VPN',
      domain: 'connectivity',
      title: 'BGP Basics, Cloud Services (IaaS/PaaS/SaaS) & Virtualization',
      titleZh: 'eBGP/iBGP 概念、雲端服務模式 (IaaS/PaaS/SaaS) 與虛擬化',
      summary: 'BGP connects Autonomous Systems across the Internet (eBGP AD 20, iBGP AD 200), while Cloud models (SaaS/PaaS/IaaS) and Hypervisors abstract infrastructure.',
      summaryZh: 'BGP 係互聯網唯一用嚟連接唔同 AS (Autonomous System) 之間嘅外部路由協定（eBGP 跨公司 AD = 20；iBGP 同公司內部 AD = 200）。雲端運算就按管理權限分為 **IaaS**（租底層 VM/虛擬機，自己管 OS）、**PaaS**（租開發平台，只管程式碼）、**SaaS**（直接用現成軟件如 Office 365 / Gmail）。',
      bullets: [
        'eBGP (between different ASNs, AD = **20**) vs iBGP (same AS, AD = **200**)',
        'Cloud models: **IaaS** (VM/storage/network — AWS EC2), **PaaS** (runtime/OS managed — Heroku/App Engine), **SaaS** (ready apps — Microsoft 365 / Gmail)',
        'Type 1 Bare-Metal Hypervisor (ESXi/Hyper-V directly on hardware) vs Type 2 Hosted Hypervisor (VirtualBox on Windows/macOS)'
      ],
      bulletsZh: [
        'BGP AD 值大不同：**eBGP = 20**（高優先），**iBGP = 200**（比 OSPF 110 同 EIGRP 90 都低優先）',
        '雲端分工：IaaS 自理 OS 同 App；PaaS 由雲商管 OS 你只上傳 Code；SaaS 用戶打開 Browser 即用',
        'Hypervisor：Type 1 (Bare-metal 直接裝喺伺服器硬件，如 VMware ESXi) 效能最高；Type 2 裝喺現有 Windows/Mac OS 上面'
      ],
      commands: ['Router(config)# router bgp 65001', 'Router(config-router)# neighbor 203.0.113.2 remote-as 65002'],
      trap: 'eBGP has AD 20 (very trusted), whereas iBGP has AD 200 (less preferred than IGP routes inside your AS to avoid loops).',
      trapZh: '記住：eBGP 同 iBGP 嘅 AD 差十萬八千里（20 vs 200）！見到 BGP Drag & Drop 唔好撈亂。'
    },

    // ==================== LAB HANDOUT TOPOLOGIES (3 LAB SHEETS) ====================
    {
      id: 'kw-46',
      chapter: 'Lab',
      chapterLabel: 'Lab Sheets: Practice Topologies',
      chapterLabelZh: 'Lab Sheets：課堂實習拓撲',
      domain: 'connectivity',
      title: 'Lab Sheet 1: 4-Router Serial WAN Topology (Static/RIP/OSPF)',
      titleZh: 'Lab 實作 1：4-Router Serial 串列廣域網路拓撲訓練',
      summary: 'Hands-on multi-router chain topology (Router A–D) linking 4 LANs (192.168.10–40.0/24) across 3 Serial WAN links (172.16.10–30.0/24).',
      summaryZh: '源自講義《Lab sheet - 4 Router topology.pdf》：四部 Router (A–D) 透過 Serial 介面串連三個 WAN 網段 (`172.16.10.0/24`、`20.0/24`、`30.0/24`)，各自連接四個 LAN (`192.168.10.0/24` 至 `40.0/24`)。呢個架構貫穿 Ch02–Ch08 練習靜態路由、預設路由、RIPv2、OSPFv2、NAT 同 ACL 綜合排錯！',
      bullets: [
        'LANs: RA G0/0 `192.168.10.1/24` (.2 PC), RB `20.1`, RC `30.1`, RD `40.1`',
        'WAN Serial links: RA–RB `172.16.10.1–.2/24`, RB–RC `172.16.20.1–.2/24`, RC–RD `172.16.30.1–.2/24`',
        'Verification checklist: Ensure `no shutdown` on all G0/0 & S0/0/0/S0/1/0, verify `show ip route` has all 4 LAN subnets, test end-to-end PC1 → PC4 `ping`'
      ],
      bulletsZh: [
        '四個用戶 LAN：`192.168.10.0/24`、`20.0/24`、`30.0/24`、`40.0/24`（Router G0/0 全部係 `.1`，PC 係 `.2`）',
        '三條 WAN Link：`172.16.10.0/24`、`172.16.20.0/24`、`172.16.30.0/24`',
        '除錯三步曲：(1) `show ip int brief` 睇所有介面 up/up、(2) `show ip route` 查齊晒對方網段、(3) PC 到 PC 互 `ping` 驗證來回路由都有齊'
      ],
      commands: ['Router_A# show ip interface brief', 'Router_A# show ip route', 'Router_A# ping 192.168.40.2'],
      trap: 'End-to-end ping fails if Router A has a route to 192.168.40.0/24, but Router D lacks a return route back to 192.168.10.0/24!',
      trapZh: 'Static Route 實作最常見失敗原因：淨係寫咗「去程」路由，唔記得喺對面 Router 寫返「回程」路由！'
    },
    {
      id: 'kw-47',
      chapter: 'Lab',
      chapterLabel: 'Lab Sheets: Practice Topologies',
      chapterLabelZh: 'Lab Sheets：課堂實習拓撲',
      domain: 'connectivity',
      title: 'Lab Sheet 2: 5-Router Multi-Hop WAN & Dynamic Routing',
      titleZh: 'Lab 實作 2：5-Router 多跳 WAN 與動態路由全網互通',
      summary: 'Extended 5-router lab topology (Router A–E across 192.168.10–50.0 & 172.16.10–40.0) illustrating why dynamic protocols (OSPF/EIGRP) scale far better than manual static routes.',
      summaryZh: '源自講義《Lab sheet - 5 Router topology.pdf》：五部 Router (A–E) 連接五個 LAN (`192.168.10.x` 至 `50.x`) 及四段 Serial 鏈路 (`172.16.10.x` 至 `40.x`)。當網路擴大到 5 部或更多 Router，手動逐條加 Static Route 極易打錯或漏網段，轉用 OSPFv2 / EIGRP 只需宣告直連網段即可自動計算全網最佳路線！',
      bullets: [
        'Scale test: Manual static routing across 5 routers requires dozens of bidirectional `ip route` entries; OSPF `area 0` converges all 9 subnets automatically',
        'Verify neighbor adjacencies across all Serial links with `show ip ospf neighbor` (`FULL/ -` on Serial point-to-point)',
        'Adjust unequal link speeds with `auto-cost reference-bandwidth` or test path failover'
      ],
      bulletsZh: [
        '擴展體會：5 部 Router 手動寫 Static Route 工作量以倍數暴增；改用 OSPF Area 0 後全體自動交換 LSA 完成收斂',
        'Serial 點對點介面上 `show ip ospf neighbor` 狀態顯示為 `FULL/ -`（`-` 代表無選舉 DR/BDR，屬正常 Point-to-Point 模式）',
        '若其中一條 Serial 鏈路斷線，Dynamic Routing 會自動切換路線而唔使人手改設定'
      ],
      commands: ['Router_C# show ip ospf neighbor', 'Router_C# show ip protocols', 'Router_C# traceroute 192.168.50.2'],
      trap: 'On Serial links (`encapsulation hdlc` or `ppp`), OSPF defaults to `point-to-point` with NO DR/BDR election (`FULL/ -`).',
      trapZh: '見到 Neighbor 顯示 `FULL/ -` 唔好驚係壞咗 — Point-to-Point Serial 連線本來就唔設 DR/BDR！'
    },
    {
      id: 'kw-48',
      chapter: 'Lab',
      chapterLabel: 'Lab Sheets: Practice Topologies',
      chapterLabelZh: 'Lab Sheets：課堂實習拓撲',
      domain: 'access',
      title: 'Lab Sheet 3: Dual-Switch Inter-VLAN Routing & Trunking',
      titleZh: 'Lab 實作 3：雙 Switch 跨 VLAN Trunk 與單臂路由架構',
      summary: 'Hands-on switching topology linking Switch A & Switch B over an 802.1Q Trunk (G0/1) up to a Router-on-a-Stick (G0/0.1–.4) serving VLANs 1–4.',
      summaryZh: '源自講義《Lab sheet - InterVLAN routing.pdf》：兩部 Catalyst 2960 Switch (Switch A 同 Switch B) 透過 G0/1 互連 Trunk，同時 Switch A 以 G0/0 連上 Router 做 Router-on-a-Stick (`G0/0.1` 至 `G0/0.4` 分別作為 VLAN 1–4 預設閘道 `10.0.0.1/8`、`20.0.0.1/8`、`30.0.0.1/8`、`40.0.0.1/8`)。',
      bullets: [
        'Router subinterfaces: `G0/0.1` (VLAN 1: `10.0.0.1/8`), `G0/0.2` (VLAN 2: `20.0.0.1/8`), `G0/0.3` (VLAN 3: `30.0.0.1/8`), `G0/0.4` (VLAN 4: `40.0.0.1/8`)',
        'Switch-to-Switch (`G0/1`) and Switch-to-Router (`G0/0`) ports MUST be 802.1Q Trunks (`switchport mode trunk`)',
        'Host Access ports assigned to exact matching VLANs (`F0/1` VLAN 1, `F0/3`/`F0/4` VLAN 2–3, Switch B `F0/8` VLAN 4); PC Default Gateways set to `.1` of their VLAN'
      ],
      bulletsZh: [
        'Router 建立四個 Subinterface：`G0/0.1`–`.4` 各自綁定對應 `encapsulation dot1Q 1`–`4` 並設 `.1` 為 Gateway',
        '重點檢查：Switch A 連去 Switch B (`G0/1`) **同埋** Switch A 連去 Router (`G0/0`) **兩條都必須係 Trunk Port**',
        '四部電腦 (VLAN 1–4) 本身喺唔同網段，必須透過 Switch Trunk → Router Subinterface 轉發先至可以互相 `ping` 通'
      ],
      commands: [
        'Router(config)# int g0/0.2',
        'Router(config-subif)# encapsulation dot1Q 2',
        'Router(config-subif)# ip address 20.0.0.1 255.0.0.0',
        'Switch_A(config)# int range g0/0 - 1',
        'Switch_A(config-if-range)# switchport mode trunk'
      ],
      trap: 'If Switch B creates VLAN 4 locally or misses VLAN 2/3 in its VLAN database, frames from Switch A get dropped even if the trunk is up!',
      trapZh: '常見實習盲點：Switch B 同 Switch A 兩邊都要齊全建立 VLAN 2、3、4（用 VTP 或手動建），否則 Trunk 過到但對面 Switch 唔認個 VLAN 一樣唔會通！'
    }
  ];
})(window);
