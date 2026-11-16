(function (global) {
  'use strict';

  const QUESTIONS_ZH = {
    // 1. Network Fundamentals
    'nf-01': {
      prompt: 'TCP/IP 模型中的哪一層最對應於 OSI 模型的「資料連結層」與「實體層」的結合？',
      options: ['應用層 (Application)', '傳輸層 (Transport)', '網際網路層 (Internet)', '網路存取層 (Network Access)'],
      explanation: '在 4 層 TCP/IP (DoD) 模型中，網路存取層（Network Access / Link Layer）涵蓋了 OSI 的實體層（第 1 層）與資料連結層（第 2 層）。',
      tip: 'TCP/IP 4 層：網路存取層、網際網路層、傳輸層、應用層。'
    },
    'nf-02': {
      prompt: '網路工程師使用 SFP+ 光纖收發器與多模光纖 (OM3) 直接連接兩台 Cisco Catalyst 交換器。SFP/SFP+ 光模組最常搭配哪一種光纖接頭？',
      options: ['SC', 'ST', 'LC', 'RJ-45'],
      explanation: 'SFP 與 SFP+ 光纖模組因體積緊湊，幾乎全面採用雙工 LC (Lucent Connector) 光纖跳線接頭。',
      tip: 'LC = Little Connector → 高密度 SFP/SFP+ 模組標準接頭。'
    },
    'nf-03': {
      prompt: '哪一個 IEEE 標準又稱為 PoE+，並可從供電端設備 (PSE) 提供高達 30W 的電力？',
      options: ['IEEE 802.3af', 'IEEE 802.3at', 'IEEE 802.3bt', 'IEEE 802.1Q'],
      explanation: 'IEEE 802.3af (PoE) 提供最高 15.4W；IEEE 802.3at (PoE+) 提供最高 30W；IEEE 802.3bt (PoE++/4PPoE) 提供 60W (Type 3) 或 90–100W (Type 4)。',
      tip: 'af = 15.4W，at = 30W，bt = 60W/100W。'
    },
    'nf-04': {
      prompt: '與 TCP 相比，以下哪兩項特徵正確描述了 UDP？（複選兩項）',
      options: [
        '傳送資料前會進行三向交握 (3-way handshake)',
        '擁有較小的標頭負擔（8 位元組）',
        '透過序號保證資料依序送達',
        '無連線 (Connectionless) 的盡力而為傳輸',
        '使用滑動視窗 (Sliding Window) 進行流量控制'
      ],
      explanation: 'UDP 屬於無連線協定且標頭僅 8 位元組（TCP 至少 20 位元組），提供低延遲、盡力而為的傳輸，不進行交握、序號重組或視窗控制。',
      tip: 'UDP = 8-byte 標頭、無連線、無 ACK 與重傳機制。'
    },
    'nf-05': {
      prompt: '在 IPv6 網路中，哪一個位址前綴代表「鏈結本地單播位址」(Link-Local Unicast)？',
      options: ['2000::/3', 'FC00::/7', 'FE80::/10', 'FF00::/8'],
      explanation: 'FE80::/10 保留給 IPv6 鏈結本地位址（僅在單一鏈結上有效且不可路由）。2000::/3 為全域單播，FC00::/7 為唯一本地，FF00::/8 為多播 (Multicast)。',
      tip: 'FE80 = Link-Local；FF00 = Multicast；FC00/FD00 = Unique Local；2000::/3 = Global。'
    },
    'nf-06': {
      prompt: '包含 192.168.14.77/27 的子網路，其有效可用主機位址範圍為何？',
      options: [
        '192.168.14.65 - 192.168.14.94',
        '192.168.14.64 - 192.168.14.95',
        '192.168.14.33 - 192.168.14.62',
        '192.168.14.65 - 192.168.14.126'
      ],
      explanation: '/27 的遮罩為 255.255.255.224（區塊大小 = 32）。32 的倍數為 0、32、64、96，因此 .77 落在 192.168.14.64/27（廣播為 .95），可用主機為 .65 至 .94。',
      tip: '區塊大小 (Block size) = 256 - 關鍵八位元組遮罩值。'
    },
    'nf-07': {
      prompt: '當交換器收到一個訊框，其目的 MAC 位址「不在」MAC 位址表中時，會執行哪一種轉送行為？',
      options: [
        '丟棄訊框並回傳 ICMP Unreachable',
        '將訊框從同一 VLAN 內除了接收埠以外的所有埠泛洪 (Flood) 出去',
        '僅轉送給預設閘道器',
        '代表發送端發送 ARP 請求'
      ],
      explanation: '未知單播 (Unknown Unicast) 訊框會被泛洪到同一個 VLAN 中所有啟用的連接埠（不包含原本進入的連接埠）。',
      tip: '交換器會在同 VLAN 內泛洪：未知單播、廣播與多播訊框。'
    },
    'nf-08': {
      prompt: '在資料中心的 Spine-Leaf（脊葉）拓撲架構中，Leaf 交換器與 Spine 交換器如何互連？',
      options: [
        '每台 Leaf 交換器都連接到每一台 Spine 交換器',
        'Leaf 交換器彼此以環狀串接',
        'Spine 交換器直接連接終端裝置與伺服器',
        '僅允許一條活動鏈路，其餘皆由 STP 阻斷'
      ],
      explanation: 'Spine-Leaf (Clos) 架構中，每台 Leaf 連接到每一台 Spine（層間全網狀連接），提供可預期的低延遲與 ECMP 負載平衡；終端伺服器只接在 Leaf 交換器上。',
      tip: 'Leaf 到 Leaf 流量永遠經過 2 跳：Leaf → Spine → Leaf。'
    },
    'nf-09': {
      prompt: '某台 PC 收到路由器公告 (RA) 中的 IPv6 前綴，且旗標設定為 M=0、O=1。該 PC 如何取得其 IPv6 位址與 DNS 伺服器資訊？',
      options: [
        'IPv6 位址透過 DHCPv6；DNS 透過 SLAAC',
        'IPv6 位址透過 SLAAC；DNS 透過無狀態 DHCPv6 (Stateless DHCPv6)',
        'IPv6 位址與 DNS 皆透過有狀態 DHCPv6',
        'IPv6 位址與 DNS 皆僅透過 SLAAC'
      ],
      explanation: 'M=0 表示不使用有狀態 DHCPv6 取得位址（改用 SLAAC 自動配置）；O=1 (Other configuration) 指示主機向無狀態 DHCPv6 取得 DNS 等額外參數。',
      tip: 'M = Managed（位址由 DHCPv6 配發）；O = Other config（DNS 等選項由 DHCPv6 提供）。'
    },
    'nf-10': {
      prompt: '技術人員執行 `show interfaces GigabitEthernet0/1` 後看到 `GigabitEthernet0/1 is up, line protocol is down`。最可能的原因是什麼？',
      options: [
        '介面被管理員手動 shutdown 關閉',
        '實體層未接上網路線',
        'Layer 1 實體訊號正常，但發生 Layer 2 不匹配（如雙工/速度/Keepalive/封裝錯誤）',
        '交換器學到太多 MAC 位址'
      ],
      explanation: '第一個狀態 (`up`) 代表 Layer 1 實體訊號正常；第二個狀態 (`line protocol is down`) 則代表 Layer 2 協商或封裝（keepalive、速率/雙工、封裝類型）有問題。',
      tip: 'admin down/down = shutdown；down/down = Layer 1；up/down = Layer 2。'
    },

    // 2. Network Access
    'na-01': {
      prompt: '在 Cisco 交換器的 802.1Q Trunk 連接埠上，屬於 Native VLAN 的訊框預設會如何處理？',
      options: [
        '除非加上 VLAN 1 標籤，否則會被丟棄',
        '在 Trunk 上以「不加標籤」(Untagged) 方式傳送',
        '會使用 ISL 進行封裝',
        '只加上優先權 7 的標籤'
      ],
      explanation: 'IEEE 802.1Q 預設會將 Native VLAN（預設為 VLAN 1）的訊框以不加標籤的方式通過 Trunk。Trunk 兩端的 Native VLAN 設定必須一致。',
      tip: '802.1Q 會為所有 VLAN 加上 4-byte 標籤，唯獨 Native VLAN 不加標籤。'
    },
    'na-02': {
      prompt: '哪一種 DTP 連接埠模式會主動發送 DTP 訊框以協商形成 Trunk，且當對端為 desirable 或 auto 時皆可成功建立 Trunk？',
      options: ['switchport mode access', 'switchport mode dynamic auto', 'switchport mode dynamic desirable', 'switchport nonegotiate'],
      explanation: '`dynamic desirable` 會主動嘗試將鏈路轉換為 Trunk；`dynamic auto` 則為被動等待，只有當對端為 `trunk` 或 `dynamic desirable` 時才會成為 Trunk。',
      tip: 'auto + auto = Access！至少一端必須是 trunk 或 dynamic desirable。'
    },
    'na-03': {
      prompt: '在 Rapid PVST+ (802.1w) 中，非根橋交換器上的哪一種連接埠角色作為通往根橋的備援路徑，且當 Root Port 故障時可立即接手？',
      options: ['Designated Port (指定埠)', 'Alternate Port (替代埠)', 'Backup Port (備份埠)', 'Disabled Port (停用埠)'],
      explanation: '在 RSTP (802.1w) 中，Alternate Port 收到來自其他交換器的更優 BPDU，作為 Root Port 的備援路徑；Backup Port 則是收到來自「同一台」交換器的更優 BPDU（如接在 Hub 上），作為 Designated Port 的備援。',
      tip: 'Alternate = Root Port 備援；Backup = Designated Port 備援。'
    },
    'na-04': {
      prompt: '當兩台交換器的 Bridge Priority 完全相同時，STP 根橋 (Root Bridge) 選舉會優先比較哪一個條件？',
      options: [
        '最低的介面 MAC 位址',
        '最低的交換器基底 MAC 位址 (Base MAC)',
        'VLAN 1 上最高的 IP 位址',
        '最低的連接埠成本 (Port Cost)'
      ],
      explanation: 'Bridge ID 由 Priority（預設 32768 + VLAN ID）與交換器 Base MAC 組成。若 Priority 平手，擁有最低 Base MAC 位址的交換器會勝出成為 Root Bridge。',
      tip: 'Bridge ID 數值越低越優先成為 Root Bridge。'
    },
    'na-05': {
      prompt: '以下哪兩種 EtherChannel 模式組合能成功建立 LACP Port-Channel？（複選兩項）',
      options: [
        'active / active',
        'active / passive',
        'passive / passive',
        'desirable / auto',
        'on / active'
      ],
      explanation: 'LACP 使用 `active` 與 `passive`，至少必須有一端為 `active`（`active/active` 或 `active/passive`）。`desirable/auto` 屬於 Cisco PAgP，而 `on` 會關閉協商。',
      tip: 'LACP = active/passive；PAgP = desirable/auto；靜態 = on/on。'
    },
    'na-06': {
      prompt: '某交換器埠已設定 `spanning-tree portfast` 與 `spanning-tree bpduguard enable`，此時意外接上一台未知交換器並收到 BPDU。該連接埠會發生什麼事？',
      options: [
        '暫時進入 Blocking 狀態',
        '忽略該 BPDU 並維持 Forwarding',
        '立即進入 err-disabled 狀態關閉連接埠',
        '自動協商成為 802.1Q Trunk'
      ],
      explanation: 'BPDU Guard 保護啟用 PortFast 的存取埠，一旦收到任何 BPDU，會立即將連接埠置入 `err-disabled` 狀態以防止產生網路迴圈。',
      tip: 'BPDU Guard + 收到 BPDU = err-disabled。'
    },
    'na-07': {
      prompt: '哪一個標準化（跨廠牌，IEEE 802.1AB）協定能探索直連鄰居設備的資訊，例如主機名稱、管理 IP 與連接埠編號？',
      options: ['CDP', 'LLDP', 'DTP', 'VTP'],
      explanation: 'LLDP (Link Layer Discovery Protocol, IEEE 802.1AB) 是開放標準，功能相當於 Cisco 專有的 CDP。',
      tip: 'CDP = Cisco 專有；LLDP = IEEE 802.1AB 跨廠牌標準。'
    },
    'na-08': {
      prompt: '在 Cisco 分離式 MAC (Split-MAC) 無線架構中，輕量級基地台 (LAP) 與無線控制器 (WLC) 之間使用哪一個協定來建立控制與資料通道？',
      options: ['CAPWAP', 'RADIUS', '802.11ax', 'SNMPv3'],
      explanation: 'CAPWAP 負責將輕量級基地台與 WLC 之間的控制流量（UDP 5246）與資料流量（UDP 5247）進行穿隧封裝。',
      tip: 'CAPWAP 使用 UDP 5246（控制）與 UDP 5247（資料）。'
    },
    'na-09': {
      prompt: '在 2.4 GHz Wi-Fi 頻段中，哪三個頻道是標準互不重疊 (Non-overlapping) 頻道？',
      options: ['1, 5, 9', '1, 6, 11', '2, 7, 12', '3, 6, 9'],
      explanation: '2.4 GHz ISM 頻段每個頻道寬度約 22 MHz、間隔 5 MHz，因此頻道 1、6、11 是經典的三個互不重疊頻道。',
      tip: '2.4 GHz 互不重疊頻道 = 1, 6, 11。'
    },
    'na-10': {
      prompt: '當設定一個交換器埠同時連接 IP 電話與後方電腦 (PC) 時，哪一條指令用來指定 IP 電話流量所使用的 VLAN？',
      options: [
        'switchport trunk native vlan 20',
        'switchport voice vlan 20',
        'switchport access vlan 20',
        'switchport priority extend trust'
      ],
      explanation: '`switchport voice vlan <id>` 會在存取埠上建立語音 VLAN，讓 IP 電話訊框帶有 802.1Q 語音 VLAN 標籤，同時 PC 資料訊框保持無標籤並歸屬於 Access VLAN。',
      tip: 'IP 電話連接埠標準設定：`switchport access vlan X` + `switchport voice vlan Y`。'
    },

    // 3. IP Connectivity
    'ic-01': {
      prompt: '某路由器的路由表包含以下路徑：\n• 10.10.0.0/16 經 OSPF (AD 110)\n• 10.10.4.0/22 經 EIGRP (AD 90)\n• 10.10.5.0/24 經 RIP (AD 120)\n• 10.10.5.0/25 靜態路由 (AD 1)\n請問目的位址 10.10.5.200 會選擇哪一條路徑？',
      options: [
        '10.10.5.0/25 靜態路由',
        '10.10.5.0/24 經 RIP',
        '10.10.4.0/22 經 EIGRP',
        '10.10.0.0/16 經 OSPF'
      ],
      explanation: '路由查詢一律先看「最長前綴匹配 (Longest Prefix Match)」！`10.10.5.0/25` 僅涵蓋 .0–.127，並不符合 .200。在符合 .200 的路徑（/24、/22、/16）中，`/24` 前綴最長，因此即使 RIP 的 AD 為 120 仍會被選中。',
      tip: '轉送查表永遠先比「最長前綴匹配」，AD 只在相同前綴/遮罩競爭進入路由表時才比較。'
    },
    'ic-02': {
      prompt: 'Static、OSPF、eBGP 與 iBGP 的預設管理距離 (AD) 由最信任到最不信任排序為何？',
      options: [
        'Static (1), eBGP (20), OSPF (110), iBGP (200)',
        'Static (1), OSPF (110), eBGP (20), iBGP (200)',
        'eBGP (20), Static (1), OSPF (110), iBGP (200)',
        'Static (1), OSPF (110), iBGP (200), eBGP (20)'
      ],
      explanation: 'Cisco 預設 AD：直連 (0)、Static (1)、eBGP (20)、內部 EIGRP (90)、OSPF (110)、IS-IS (115)、RIP (120)、外部 EIGRP (170)、iBGP (200)。',
      tip: '必背 AD：C=0, S=1, eBGP=20, EIGRP=90, OSPF=110, RIP=120, iBGP=200。'
    },
    'ic-03': {
      prompt: '在 OSPFv2 多重存取乙太網路中，路由器決定其 OSPF Router ID 的優先順序為何？',
      options: [
        '最高實體 IP → 最高 Loopback IP → `router-id` 指令',
        '`router-id` 指令 → 最高啟用中 Loopback IP → 最高啟用中實體 IP',
        '最高 Loopback IP → `router-id` 指令 → 最低實體 IP',
        '最低 MAC 位址 → `router-id` 指令 → 最高 Loopback IP'
      ],
      explanation: 'OSPF 挑選 Router ID 的順序為：1) 手動設定 `router-id` 指令，2) up/up Loopback 介面上最高的 IP，3) up/up 非 Loopback 實體介面上最高的 IP。',
      tip: '手動 router-id > 最高 Loopback > 最高啟用中實體介面 IP。'
    },
    'ic-04': {
      prompt: '兩台 OSPF 路由器在乙太網路鏈路上無法成為鄰居。觀察發現 Router A 的 Hello/Dead 計時器為 10/40，Router B 為 30/120。結果會如何？',
      options: [
        '雙方以較低的計時器建立鄰居關係',
        '停留在 INIT 或 DOWN 狀態，無法建立鄰接關係',
        '只要位於 Area 0 就能建立鄰接關係',
        'Router B 會自動套用 Router A 的計時器'
      ],
      explanation: 'OSPF 鄰居雙方的 Hello 與 Dead 間隔時間（連同 Area ID、子網路遮罩、驗證設定與 Stub 旗標）必須完全一致才能建立鄰接關係。',
      tip: 'OSPF 鄰居必要條件：Hello/Dead 計時器、Area ID、子網路遮罩、MTU（進入 Full）、驗證、唯一 Router ID。'
    },
    'ic-05': {
      prompt: 'Cisco IOS 中 OSPFv2 的預設參考頻寬 (Reference Bandwidth) 是多少？為何常需使用 `auto-cost reference-bandwidth` 修改？',
      options: [
        '10 Mbps；為了區分 FastEthernet 與 Ethernet',
        '100 Mbps；因為 FastEthernet、Gigabit 與 10G 鏈路算出來的 Cost 全都是 1',
        '1000 Mbps；為了讓 100 Mbps 鏈路 Cost 為 1',
        '10 Gbps；為了配合現代光纖骨幹'
      ],
      explanation: 'OSPF Cost = 參考頻寬 / 介面頻寬。在預設 100 Mbps 下，100M、1G 與 10G 介面的 Cost 全部進位成 1，導致 OSPF 無法區分更高速的鏈路。',
      tip: '預設參考頻寬 = 100 Mbps。全網路由器應統一設定如 `auto-cost reference-bandwidth 10000`。'
    },
    'ic-06': {
      prompt: '哪一條 OSPF `network` 指令「只會」在介面 Gi0/1（IP 為 172.16.10.1/24）上啟用 OSPF？',
      options: [
        'network 172.16.10.1 0.0.0.0 area 0',
        'network 172.16.0.0 0.0.255.255 area 0',
        'network 172.16.10.0 255.255.255.0 area 0',
        'network 172.16.10.1 255.255.255.255 area 0'
      ],
      explanation: 'OSPF 的 `network` 指令使用萬用字元遮罩 (Wildcard Mask)，`0.0.0.0` 代表精確比對該單一介面 IP。`255.255.255.0` 是子網路遮罩，在 OSPF 中意義相反且錯誤。',
      tip: '萬用字元遮罩：0 = 必須相符；255 = 不在乎。'
    },
    'ic-07': {
      prompt: '哪一條浮動靜態路由 (Floating Static Route) 只會在主要 OSPF 預設路由 (AD 110) 消失時才生效？',
      options: [
        'ip route 0.0.0.0 0.0.0.0 203.0.113.1 90',
        'ip route 0.0.0.0 0.0.0.0 203.0.113.1 120',
        'ip route 0.0.0.0 0.0.0.0 203.0.113.1 1',
        'ip route 0.0.0.0 0.0.0.0 203.0.113.1 105'
      ],
      explanation: '浮動靜態路由的 AD 必須「大於」主要動態路由協定的 AD。因為 OSPF 的 AD 是 110，設定 AD 120 會讓這條靜態路由在 OSPF 正常時保持隱藏，待其失效才接手。',
      tip: '浮動靜態路由 AD > 主要路由協定 AD。'
    },
    'ic-08': {
      prompt: '在 `router ospf 1` 下設定 `passive-interface GigabitEthernet0/0` 的作用為何？',
      options: [
        '完全關閉該介面',
        '停止在 OSPF 中公告 Gi0/0 的網段',
        '仍會在 OSPF 中公告 Gi0/0 的網段，但停止在該介面上發送與處理 OSPF Hello 封包',
        '將 Gi0/0 指定為 OSPF BDR'
      ],
      explanation: '將連接使用者網段的介面設為 Passive，可防止非預期的 OSPF 鄰居建立與浪費頻寬的 Hello 封包，同時仍把該網段公告給其他 OSPF 路由器。',
      tip: 'Passive interface = 照常公告網段 (YES)，但停止收發 Hello (NO)。'
    },
    'ic-09': {
      prompt: '哪一種第一跳冗餘協定 (FHRP) 為 Cisco 專有，使用 Active/Standby 角色，且 HSRPv1 虛擬 MAC 為 `0000.0c07.acXX`？',
      options: ['VRRP', 'HSRP', 'GLBP', 'OSPF'],
      explanation: 'HSRP 為 Cisco 專有，採用 Active/Standby 架構（HSRPv1 虛擬 MAC `0000.0c07.acXX`，v2 為 `0000.0c9f.fXXX`）。VRRP 為開放標準（Master/Backup），GLBP 支援多台閘道負載平衡。',
      tip: 'HSRP = Active/Standby (Cisco)；VRRP = Master/Backup (RFC)；GLBP = AVG/AVF 負載平衡。'
    },
    'ic-10': {
      prompt: '在 Cisco 路由器上設定 `ipv6 route ::/0 GigabitEthernet0/1 FE80::1` 會產生什麼結果？',
      options: [
        '設定失敗，因為 IPv6 靜態路由不能使用鏈結本地位址作為下一跳',
        '成功建立一條透過 Gi0/1 指向鏈結本地鄰居 FE80::1 的 IPv6 預設靜態路由',
        '建立一條 AD 為 10 的 IPv6 浮動路由',
        '將 IPv6 直連路由重分發進 OSPFv3'
      ],
      explanation: '當使用 IPv6 鏈結本地位址 (`FE80::1`) 作為下一跳 (Next-hop) 時，因為每條鏈路都共用 FE80::/10，因此「必須」同時指定輸出介面 (`Gi0/1`)。',
      tip: 'IPv6 靜態路由若下一跳是 FE80::，必須同時寫出「輸出介面 + 下一跳位址」。'
    },

    // 4. IP Services
    'is-01': {
      prompt: '在 Cisco IOS NAT 設定中，哪一條指令能藉由追蹤來源埠號，將多台內部私有 IP 轉換成單一公網 IP（即 PAT）？',
      options: [
        'ip nat inside source static 10.0.0.5 203.0.113.5',
        'ip nat inside source list 1 interface GigabitEthernet0/0 overload',
        'ip nat pool PUB 203.0.113.10 203.0.113.20 netmask 255.255.255.0',
        'ip nat outside source list 1 pool PUB'
      ],
      explanation: '`overload` 關鍵字即啟用 PAT (Port Address Translation)，讓大量內部主機透過不同的來源連接埠共用同一個外部公網 IP。',
      tip: '`overload` = PAT（多對一埠號轉換）。'
    },
    'is-02': {
      prompt: 'DHCPv4 取得位址的四步驟順序 (DORA) 為何？',
      options: [
        'Discover, Offer, Request, Acknowledge',
        'Discover, Request, Offer, Acknowledge',
        'Detect, Offer, Reserve, Accept',
        'Discover, Obtain, Renew, Acknowledge'
      ],
      explanation: 'DHCPv4 流程為 DORA：Discover（用戶端廣播）→ Offer（伺服器回應）→ Request（用戶端廣播請求）→ Acknowledge（伺服器確認）。',
      tip: 'DORA = Discover, Offer, Request, Ack（UDP 67 伺服器 / 68 用戶端）。'
    },
    'is-03': {
      prompt: 'DHCP 伺服器位於 VLAN 100 (10.100.0.10)，而用戶端 PC 位於 VLAN 20 (10.20.0.0/24)。需要在路由器或 SVI 上如何設定讓 VLAN 20 用戶端能取得 IP？',
      options: [
        '在 SVI 100 設定：`ip helper-address 10.20.0.1`',
        '在 SVI 20 設定：`ip helper-address 10.100.0.10`',
        '在 SVI 20 設定：`ip dhcp relay 10.100.0.10`',
        '在 SVI 20 設定：`ip dhcp excluded-address 10.100.0.10`'
      ],
      explanation: '`ip helper-address <DHCP伺服器IP>` 必須設定在「面向 DHCP 用戶端」的 Layer 3 閘道介面（即 SVI 20）上，負責將廣播封包轉為單播送給 DHCP 伺服器。',
      tip: '把 `ip helper-address` 設在「用戶端閘道介面」並指向 DHCP 伺服器 IP。'
    },
    'is-04': {
      prompt: '哪一個 NTP 階層 (Stratum) 數值代表路由器直接與原子鐘或 GPS 接收器 (Stratum 0) 同步？',
      options: ['Stratum 0', 'Stratum 1', 'Stratum 15', 'Stratum 16'],
      explanation: 'Stratum 0 為參考時鐘硬體本身（原子鐘/GPS）。直接連接 Stratum 0 的 NTP 伺服器為 Stratum 1；Stratum 16 代表未同步。',
      tip: 'Stratum 數字越小越接近基準時鐘；最大有效值為 15，16 代表未同步。'
    },
    'is-05': {
      prompt: '若 Cisco 路由器設定了 `logging trap warnings`，會將哪些 Syslog 嚴重等級傳送到 Syslog 伺服器？',
      options: [
        '僅等級 4 (Warnings)',
        '等級 0 到 4 (Emergencies, Alerts, Critical, Errors, Warnings)',
        '等級 4 到 7 (Warnings, Notifications, Informational, Debugging)',
        '僅等級 0 到 3'
      ],
      explanation: '設定 Syslog 門檻後，會記錄該等級「以及數字更小（更嚴重）」的所有等級：0=Emergency, 1=Alert, 2=Critical, 3=Error, 4=Warning, 5=Notification, 6=Informational, 7=Debugging。',
      tip: '口訣：Every Awesome Cisco Engineer Will Need Ice Cream Daily (0..7)。'
    },
    'is-06': {
      prompt: '哪一個 SNMP 版本同時提供訊息完整性驗證與負載加密 (`authPriv`)？',
      options: ['SNMPv1', 'SNMPv2c', 'SNMPv3', 'SNMP-Trap'],
      explanation: 'SNMPv1 與 SNMPv2c 僅使用明文 Community String；SNMPv3 提供使用者安全模型，最高等級 `authPriv` 可同時驗證（SHA/MD5）並加密（AES/DES）。',
      tip: 'SNMPv3 `authPriv` = 驗證 + 加密。'
    },
    'is-07': {
      prompt: '在 QoS DiffServ 架構中，建議為對延遲敏感的 VoIP 語音流量標記哪一個 DSCP 轉送行為 (PHB)？',
      options: ['AF11', 'CS0 (Best Effort)', 'EF (Expedited Forwarding, DSCP 46)', 'AF41'],
      explanation: 'EF (加速轉送，DSCP 46) 對應優先佇列 (LLQ)，確保即時語音流量擁有最低延遲與抖動。',
      tip: 'EF (DSCP 46) = 語音 Voice；AF41 = 視訊 Video。'
    },
    'is-08': {
      prompt: '在 Cisco IOS 路由器上產生 RSA 金鑰以啟用 SSH 之前，哪兩項事前設定是必要的？（複選兩項）',
      options: [
        '設定非預設的主機名稱 (`hostname`)',
        '設定 IP 網域名稱 (`ip domain-name`)',
        '設定 `transport input telnet`',
        '在 Loopback0 啟用 OSPF',
        '啟用 `service password-encryption`'
      ],
      explanation: 'Cisco IOS 會將 RSA 金鑰命名為 `<hostname>.<domain-name>`，因此執行 `crypto key generate rsa` 前必須先設定 `hostname` 與 `ip domain-name`。',
      tip: 'SSH 必備步驟：hostname + ip domain-name + crypto key generate rsa + 本地帳號/login local + transport input ssh。'
    },
    'is-09': {
      prompt: '以下關於 TFTP 與 FTP 的比較，何者正確？',
      options: [
        'TFTP 使用 TCP 69 並支援目錄清單；FTP 使用 UDP 21',
        'TFTP 使用 UDP 69 且不需身份驗證；FTP 使用 TCP 20 與 21 並支援帳號驗證',
        'TFTP 與 FTP 預設都會加密登入憑證',
        'TFTP 因為使用 TLS 所以比 SCP 更快'
      ],
      explanation: 'TFTP 非常輕量，使用 UDP 69 且沒有身份驗證機制；FTP 使用 TCP 21（控制）與 TCP 20（資料）並提供帳號密碼驗證。',
      tip: 'TFTP = UDP 69；FTP = TCP 20/21；SSH/SCP/SFTP = TCP 22。'
    },
    'is-10': {
      prompt: '`ip nat inside source static 192.168.10.50 203.0.113.50` 這條指令建立了什麼轉換？',
      options: [
        '一組動態位址池',
        '內部私有 IP 與外部公網 IP 之間永久的一對一 (1:1) 對應',
        '共用連接埠 50 的 PAT 轉換',
        '一條 NAT 豁免規則'
      ],
      explanation: 'Static NAT 會在內部本地位址 (Inside Local) 與外部全域位址 (Inside Global) 之間建立永久的一對一轉換，常用於對外提供服務的伺服器。',
      tip: 'Static NAT = 永久 1 對 1 對應。'
    },

    // 5. Security Fundamentals
    'sf-01': {
      prompt: 'TACACS+ 與 RADIUS 在傳輸協定與封包加密行為上有何差異？',
      options: [
        'TACACS+ 使用 UDP 1812 且只加密密碼；RADIUS 使用 TCP 49',
        'TACACS+ 使用 TCP 49 並加密整個封包主體；RADIUS 使用 UDP 1812/1813 且只加密密碼',
        '兩者皆使用 TCP 49 並加密整個負載',
        'RADIUS 比 TACACS+ 更細緻地分離 AAA 功能'
      ],
      explanation: 'TACACS+ 使用 TCP 49、加密整個封包內容，且完全分離認證/授權/稽核（非常適合設備管理員 CLI 指令授權）；RADIUS 使用 UDP 1812/1813 且只加密密碼欄位。',
      tip: 'TACACS+ = TCP 49、全加密、適合設備 CLI 管理；RADIUS = UDP 1812/1813、適合網路存取/802.1X。'
    },
    'sf-02': {
      prompt: '標準 IPv4 ACL (1-99) 與延伸 IPv4 ACL (100-199) 建議分別套用在網路中的哪個位置？',
      options: [
        '標準 ACL 靠近來源端；延伸 ACL 靠近目的端',
        '標準 ACL 靠近目的端；延伸 ACL 靠近來源端',
        '兩者皆盡量靠近來源端',
        '兩者皆只能套用在 WAN 邊緣入向'
      ],
      explanation: '標準 ACL 只比對來源 IP，若放在來源端會阻斷該來源前往所有目的地的流量，因此應盡量靠近「目的端」；延伸 ACL 可精確比對來源、目的、協定與埠號，因此應放在靠近「來源端」以提早丟棄無效流量。',
      tip: '標準 ACL → 靠近目的端；延伸 ACL → 靠近來源端。'
    },
    'sf-03': {
      prompt: '某交換器埠設定如下：\n`switchport port-security`\n`switchport port-security maximum 2`\n`switchport port-security violation restrict`\n當第 3 個不同 MAC 位址從此埠傳送流量時會發生什麼事？',
      options: [
        '連接埠立即進入 err-disabled 狀態',
        '第 3 個 MAC 的訊框被丟棄，並產生 Syslog/SNMP 告警與累計違規次數，同時前 2 個 MAC 仍可正常運作',
        '第 3 個 MAC 的訊框被靜默丟棄，不留任何紀錄或計數',
        '最舊的 MAC 位址會被清除以讓第 3 個 MAC 進入'
      ],
      explanation: 'Port Security 違規模式：`shutdown`（預設，進入 err-disabled）、`restrict`（丟棄違規訊框、記錄日誌並增加計數器）、`protect`（僅靜默丟棄，無日誌無計數）。',
      tip: 'protect = 靜默丟棄；restrict = 丟棄 + 日誌/計數；shutdown = err-disabled。'
    },
    'sf-04': {
      prompt: '哪一項 Layer 2 安全功能會比對 DHCP Snooping 繫結表來驗證非信任埠上的 ARP 封包，以防範 ARP 欺騙攻擊？',
      options: ['Port Security', 'Dynamic ARP Inspection (DAI)', 'BPDU Guard', 'IP Source Guard'],
      explanation: '動態 ARP 檢測 (DAI) 會攔截非信任埠上的 ARP 請求與回應，並與 DHCP Snooping 繫結資料庫比對 IP-MAC 關係，藉此防禦 ARP Spoofing/Poisoning。',
      tip: 'DHCP Snooping 建立繫結表；DAI 驗證 ARP；IP Source Guard 驗證 IP/MAC 資料流量。'
    },
    'sf-05': {
      prompt: '在交換器上設定 DHCP Snooping 時，哪些介面應該設定 `ip dhcp snooping trust`？',
      options: [
        '所有連接一般電腦的存取埠',
        '只有連接合法 DHCP 伺服器或通往合法 DHCP 伺服器的上行鏈路 (Uplink)',
        '所有 SVI 介面',
        '僅停用的連接埠'
      ],
      explanation: '啟用 DHCP Snooping 後所有連接埠預設皆為「非信任 (Untrusted)」，會丟棄來自該埠的 DHCP 伺服器回應 (Offer/Ack)，因此只有通往合法 DHCP 伺服器的連接埠必須設為 Trust。',
      tip: '只對通往合法 DHCP 伺服器的連接埠設定 Trust。'
    },
    'sf-06': {
      prompt: '每一條 Cisco IOS 存取控制清單 (ACL) 的最底部都有什麼隱藏規則？',
      options: ['permit ip any any', 'deny ip any any (隱含拒絕)', 'permit tcp any any established', 'log-input all'],
      explanation: '每條 Cisco ACL 結尾都有一個隱含的 `deny any`（或 `deny ip any any`）。若 ACL 中只有 deny 規則而沒有任何明確的 permit，所有流量都會被丟棄。',
      tip: '記得在 ACL 中至少要有一條 `permit`，否則隱含拒絕會阻斷全部流量！'
    },
    'sf-07': {
      prompt: '哪一個無線安全標準以「對等實體同時驗證」(SAE) 取代傳統 4-way handshake 的 PSK，藉此抵禦離線字典暴力破解攻擊？',
      options: ['WEP', 'WPA-TKIP', 'WPA2-PSK', 'WPA3-Personal'],
      explanation: 'WPA3-Personal 採用 SAE (Dragonfly 交握)，提供前向保密並有效防堵針對預共用金鑰的離線字典攻擊。',
      tip: 'WPA2-Personal = PSK + AES-CCMP；WPA3-Personal = SAE + 強制保護管理訊框 (PMF)。'
    },
    'sf-08': {
      prompt: '哪一種社交工程攻擊專門鎖定高階主管或企業高層，並偽造緊急指令（如要求立即匯款）進行詐騙？',
      options: ['網路釣魚 (Phishing)', '捕鯨攻擊 (Whaling)', '尾隨入侵 (Tailgating)', 'ARP 下毒'],
      explanation: 'Whaling（捕鯨攻擊）屬於魚叉式網路釣魚的進階型態，專門針對企業高層等高價值目標。',
      tip: 'Phishing（廣發）→ Spear phishing（特定對象）→ Whaling（高層主管）。'
    },
    'sf-09': {
      prompt: '在站對站 (Site-to-Site) IPsec VPN 中，哪一個協定能同時為 IP 負載提供機密性（加密）、完整性與來源驗證？',
      options: ['AH (Authentication Header)', 'ESP (Encapsulating Security Payload)', '僅 IKE Phase 1', '未搭配 IPsec 的 GRE'],
      explanation: 'ESP（IP 協定號 50）提供加密、完整性與驗證；AH（IP 協定號 51）只提供完整性與驗證，並不支援加密。',
      tip: 'ESP 有加密；AH 只驗證不加密。'
    },
    'sf-10': {
      prompt: '哪一條指令能確保本地帳號密碼使用高強度雜湊（如 scrypt Type 8/9 或 SHA-256）儲存，而非容易被反推的弱 Type 7 編碼？',
      options: [
        'username admin password cisco',
        'username admin secret Str0ngP@ss!',
        'enable password cisco',
        'service password-encryption'
      ],
      explanation: '`username <name> secret <pass>` 會以不可逆單向雜湊儲存密碼；而 `password` 搭配 `service password-encryption` 僅使用極易還原的 Vigenere Type 7 編碼。',
      tip: '永遠優先使用 `secret` 而非 `password`。'
    },

    // 6. Automation & Programmability
    'ap-01': {
      prompt: '在軟體定義網路 (SDN) 與 Cisco Catalyst Center 架構中，哪一類 API 負責將 SDN 控制器往下連接到實體或虛擬網路設備？',
      options: ['北向 API (Northbound, REST)', '南向 API (Southbound, 如 NETCONF, OpenFlow, SSH)', '東西向 API', 'GraphQL 用戶端 API'],
      explanation: '北向 API（通常為 REST/JSON）往上對接應用程式與腳本；南向 API（NETCONF、RESTCONF、OpenFlow、CLI/SNMP）往下控制網路交換器與路由器。',
      tip: '北向 = App ↔ 控制器；南向 = 控制器 ↔ 網路設備。'
    },
    'ap-02': {
      prompt: 'REST API 中的哪一個 HTTP 方法對應到 CRUD 的「更新 / 完整替換」(Update / Replace) 操作？',
      options: ['GET', 'POST', 'PUT', 'DELETE'],
      explanation: 'CRUD 對應關係：Create = POST、Read = GET、Update/Replace = PUT（局部更新為 PATCH）、Delete = DELETE。',
      tip: 'GET=讀取，POST=建立，PUT=替換更新，PATCH=局部更新，DELETE=刪除。'
    },
    'ap-03': {
      prompt: '哪一種資料序列化格式嚴格依賴「空格縮排」（不可使用 Tab）來表示層級，且檔案開頭常出現 `---`？',
      options: ['JSON', 'XML', 'YAML', 'CSV'],
      explanation: 'YAML 使用空格縮排表達層級、以 `---` 標記文件開頭並支援 `#` 註解（常見於 Ansible Playbook）；JSON 則使用 `{}` 與 `[]` 且不允許註解。',
      tip: 'YAML = 縮排、可讀性高、支援 `#` 註解（Ansible 專用）。'
    },
    'ap-04': {
      prompt: '關於組態管理工具的預設架構（無代理程式 Agentless 與需代理程式 Agent-based），下列何者正確？',
      options: [
        'Ansible 為無代理程式架構（透過 SSH/NETCONF 推送）；Puppet 與 Chef 傳統上需在受管節點安裝代理程式',
        'Puppet 為無代理程式；Ansible 需要在每台 Cisco 交換器安裝 Python 代理程式',
        'Chef 為無代理程式；Ansible 使用 TCP 8140 代理程式',
        '三者皆必須在 Cisco IOS 交換器內安裝代理程式'
      ],
      explanation: 'Ansible 採無代理程式 (Agentless) 的推送 (Push) 模型，直接透過 SSH/NETCONF/REST 管理設備；Puppet 與 Chef 傳統上採用拉取 (Pull) 模型與代理程式。',
      tip: 'Ansible = Agentless + Push + YAML；Puppet/Chef = Agent + Pull + Ruby DSL。'
    },
    'ap-05': {
      prompt: '在 Cisco Catalyst Center 的 SDA（軟體定義存取）架構中，構成整個網路結構 (Fabric) 的兩大層面為何？',
      options: [
        'Underlay（實體 IP 連通，如 IS-IS）與 Overlay（LISP 控制平面 + VXLAN 資料平面）',
        'OSPF Area 0 與 RIPv2',
        'STP Root 與 VTP Server',
        'BGP AS 65000 與 Frame Relay'
      ],
      explanation: 'Cisco SDA 將底層實體傳輸 Underlay（自動化 IS-IS 路由）與虛擬覆蓋網路 Overlay（控制平面 LISP、資料封裝 VXLAN、安全群組標籤 SGT）明確分離。',
      tip: 'SDA Overlay 三大元素：控制 = LISP、資料 = VXLAN、策略 = SGT/CTS。'
    },
    'ap-06': {
      prompt: '以下哪一段 JSON 語法正確定義了一個包含兩個介面名稱陣列的 JSON 物件？',
      options: [
        '{ interfaces: [ "Gi0/0", "Gi0/1" ] }',
        '{ "interfaces": [ "Gi0/0", "Gi0/1" ] }',
        '{ "interfaces": ( "Gi0/0", "Gi0/1" ) }',
        '{ "interfaces": [ "Gi0/0", "Gi0/1", ] }'
      ],
      explanation: '合法的 JSON 要求鍵名與字串皆須使用雙引號 (`"interfaces"`)、陣列使用中括號 `[]`，且最後一個元素後方不可有多餘的逗號。',
      tip: 'JSON 規則：鍵值用雙引號、無尾隨逗號、無註解。'
    },
    'ap-07': {
      prompt: '哪一個基礎設施即程式碼 (IaC) 工具使用 HCL 語言並透過狀態檔 (`terraform.tfstate`) 以宣告式管理雲端與網路基礎架構？',
      options: ['Ansible', 'Terraform', 'Chef', 'Postman'],
      explanation: 'Terraform（納入 CCNA 200-301 v1.1 考綱）使用宣告式的 HCL (`.tf`) 檔案與 State file 來追蹤並協調基礎架構狀態。',
      tip: 'Terraform = 宣告式 IaC + HCL + State 狀態檔（v1.1 新考點！）。'
    },
    'ap-08': {
      prompt: '在 CCNA v1.1 考綱的「AI/ML 於網路維運應用」中，預測式 AI 與生成式 AI 如何協助網路工程師？',
      options: [
        '以虛擬無線電波取代 Layer 1 光纖線路',
        '從遙測資料建立正常基準線 (Baseline)、主動偵測異常並加速根因分析排錯',
        '徹底消除 IPv4 網路對 IP 位址的需求',
        '在尖峰時段自動停用所有 ACL'
      ],
      explanation: 'CCNA 200-301 v1.1 新增了網路維運中的生成式 AI、預測式 AI 與機器學習概念——利用遙測資料學習基準線，進而偵測異常並提供排錯建議。',
      tip: 'AI/ML in NetOps = 基準線學習、異常偵測、預測性維運與排錯輔助。'
    },
    'ap-09': {
      prompt: '在 REST HTTP 狀態碼中，哪兩個範圍分別代表「請求成功」(如 200 OK、201 Created) 與「用戶端錯誤」(如 401 Unauthorized、404 Not Found)？',
      options: [
        '2xx = 成功，4xx = 用戶端錯誤',
        '1xx = 成功，3xx = 用戶端錯誤',
        '3xx = 成功，5xx = 用戶端錯誤',
        '2xx = 伺服器錯誤，5xx = 成功'
      ],
      explanation: 'HTTP 狀態碼分類：2xx = 成功、3xx = 重新導向、4xx = 用戶端錯誤（語法錯誤、未授權、找不到資源）、5xx = 伺服器端錯誤。',
      tip: '2xx 成功，4xx 用戶端問題，5xx 伺服器問題。'
    },
    'ap-10': {
      prompt: '傳統路由器/交換器轉向 SDN 控制器架構時，哪兩個平面的運作方式會被解耦並集中化？',
      options: [
        '資料平面與管理平面',
        '控制平面集中至 SDN 控制器，而資料平面仍分散保留在各網路設備硬體上',
        '實體平面與電源平面',
        '資料平面與實體佈線皆移至雲端'
      ],
      explanation: 'SDN 將負責路徑運算與決策的控制平面 (Control Plane) 抽離並集中至軟體控制器，而高速轉送封包的資料平面 (Data Plane) 仍留在設備本機執行。',
      tip: 'SDN = 集中式控制平面 + 分散式資料平面。'
    }
  };

  const FLASHCARDS_ZH = {
    'fc-01': { front: 'OSI 七層模型（由下而上）', back: '1. 實體層 (Physical)\n2. 資料連結層 (Data Link)\n3. 網路層 (Network)\n4. 傳輸層 (Transport)\n5. 會議層 (Session)\n6. 表現層 (Presentation)\n7. 應用層 (Application)\n(PDU：Bits, Frames, Packets, Segments, Data)' },
    'fc-02': { front: 'TCP 與 UDP 標頭大小及核心差異', back: 'TCP：20–60 bytes、導向連線（三向交握）、可靠傳輸（ACK、序號、滑動視窗）。\nUDP：8 bytes、無連線、盡力而為、低延遲。' },
    'fc-03': { front: '常見連接埠：FTP, SSH, Telnet, SMTP, DNS', back: 'FTP：TCP 20 (資料) / 21 (控制)\nSSH：TCP 22\nTelnet：TCP 23\nSMTP：TCP 25\nDNS：UDP/TCP 53' },
    'fc-04': { front: '常見連接埠：DHCP, TFTP, HTTP, HTTPS, SNMP', back: 'DHCP：UDP 67 (伺服器) / 68 (用戶端)\nTFTP：UDP 69\nHTTP：TCP 80\nHTTPS：TCP 443\nSNMP：UDP 161 (代理) / 162 (Trap)' },
    'fc-05': { front: 'RFC 1918 私有 IPv4 位址範圍', back: '10.0.0.0/8 (10.0.0.0 – 10.255.255.255)\n172.16.0.0/12 (172.16.0.0 – 172.31.255.255)\n192.168.0.0/16 (192.168.0.0 – 192.168.255.255)' },
    'fc-06': { front: 'IPv6 位址類型與前綴', back: '全域單播 (Global Unicast)：2000::/3\n唯一本地 (Unique Local)：FC00::/7 (FD00::/8)\n鏈結本地 (Link-Local)：FE80::/10\n多播 (Multicast)：FF00::/8\n迴圈：::1/128 | 未指定：::/128' },
    'fc-07': { front: 'IPv6 常用多播位址與請求節點多播', back: 'FF02::1 = 所有節點\nFF02::2 = 所有路由器\nFF02::5 = 所有 OSPF 路由器\nFF02::6 = 所有 OSPF DR/BDR\nFF02::1:FFxx:xxxx = Solicited-Node Multicast' },
    'fc-08': { front: 'PoE 供電標準與最大 PSE 瓦數', back: '802.3af (PoE)：15.4 W\n802.3at (PoE+)：30.0 W\n802.3bt Type 3 (4PPoE)：60 W\n802.3bt Type 4：90–100 W' },
    'fc-09': { front: '單模光纖 (SMF) vs 多模光纖 (MMF)', back: 'SMF：約 9 µm 纖芯、雷射光源、黃色外皮、長距離（10–80+ km）。\nMMF：50 或 62.5 µm 纖芯、LED/VCSEL、橘色 (OM1/2) 或水藍色 (OM3/4)、短距離 (<550 m)。' },
    'fc-10': { front: '介面狀態 (Status / Line Protocol) 判讀', back: 'admin down / down = 已設定 `shutdown`\ndown / down = Layer 1 問題（未接線/無訊號）\nup / down = Layer 2 問題（封裝/Keepalive 不符）\nup / up = 正常運作中' },
    'fc-11': { front: 'DTP Trunk 協商矩陣', back: 'trunk + 任何模式（access 除外）= Trunk\ndynamic desirable + desirable/auto = Trunk\ndynamic auto + dynamic auto = Access（不會變 Trunk！）' },
    'fc-12': { front: '802.1Q 標籤長度與 Native VLAN 規則', back: '4-byte 802.1Q 標頭（含 12-bit VLAN ID，可用 1–4094）。\nNative VLAN（預設 VLAN 1）在 802.1Q Trunk 上不加標籤 (Untagged) 傳送。' },
    'fc-13': { front: 'Rapid PVST+ (802.1w) 連接埠狀態 vs 802.1D', back: '802.1w 僅有 3 種狀態：\n• Discarding（取代 Disabled, Blocking, Listening）\n• Learning\n• Forwarding' },
    'fc-14': { front: 'STP Root Port 與 Designated Port 選舉順序', back: '1. 最低 Root Path Cost（累積路徑成本）\n2. 最低傳送端 Bridge ID\n3. 最低傳送端 Port Priority + Port ID\n（預設 Bridge Priority = 32768 + VLAN ID）' },
    'fc-15': { front: 'STP 連接埠成本 (802.1D Short Cost)', back: '10 Mbps = 100\n100 Mbps = 19\n1 Gbps = 4\n10 Gbps = 2' },
    'fc-16': { front: 'EtherChannel LACP 與 PAgP 模式對照', back: 'LACP (802.3ad)：active / passive\nPAgP (Cisco)：desirable / auto\n靜態（不協商）：on / on\nLACP 最多 8 條同時活動（最多 16 條含備援）。' },
    'fc-17': { front: 'CDP 與 LLDP 指令及計時器', back: 'CDP (Cisco)：60s hello / 180s hold (`show cdp neighbors detail`)\nLLDP (IEEE 802.1AB)：30s hello / 120s hold（全域設定 `lldp run`）' },
    'fc-18': { front: 'Cisco WLC 無線 AP 運作模式', back: 'Local = 一般服務用戶端\nFlexConnect = 當連往 WLC 的 WAN 斷線時可本地交換\nMonitor = 僅作 IDS / 偵測非法 AP\nSniffer / Rogue Detector / Bridge / Mesh' },
    'fc-19': { front: 'CAPWAP 使用的 UDP 連接埠', back: 'UDP 5246 = CAPWAP 控制通道（DTLS 加密）\nUDP 5247 = CAPWAP 資料通道' },
    'fc-20': { front: 'Wi-Fi 標準：802.11a/b/g/n/ac/ax', back: '802.11a：5 GHz (54M)\n802.11b：2.4 GHz (11M)\n802.11g：2.4 GHz (54M)\n802.11n (Wi-Fi 4)：2.4/5 GHz\n802.11ac (Wi-Fi 5)：5 GHz\n802.11ax (Wi-Fi 6)：2.4/5 GHz' },
    'fc-21': { front: 'Cisco 預設管理距離 (AD)', back: 'Connected：0\nStatic：1\neBGP：20\nInternal EIGRP：90\nOSPF：110\nIS-IS：115\nRIP：120\nExternal EIGRP：170\niBGP：200' },
    'fc-22': { front: '路由器封包轉送決策順序', back: '1. 最長前綴匹配 (Longest Prefix Match，最精確遮罩優先)\n（註：AD 決定「同一網段」由哪個協定進入路由表；Metric 決定「同一協定」內的最佳路徑。）' },
    'fc-23': { front: 'OSPFv2 鄰居狀態機 (7 個狀態)', back: 'Down → Init → 2-Way（於此選舉 DR/BDR）→ ExStart → Exchange → Loading → Full。\n註：DROTHER 之間會停留在 2-Way！' },
    'fc-24': { front: 'OSPFv2 預設組態計時器與多播位址', back: 'Broadcast/P2P Hello：10s | Dead：40s\nNBMA Hello：30s | Dead：120s\n224.0.0.5 = 所有 OSPF 路由器\n224.0.0.6 = 所有 OSPF DR/BDR' },
    'fc-25': { front: 'OSPF Router ID 挑選順序', back: '1. 手動 `router-id A.B.C.D`\n2. up/up Loopback 介面上最高 IP\n3. up/up 實體介面上最高 IP\n（修改後需執行 `clear ip ospf process` 生效）' },
    'fc-26': { front: '需要 vs 不需選舉 DR/BDR 的 OSPF 網路類型', back: 'Broadcast (乙太網路) 與 NBMA：需選舉 DR/BDR。\nPoint-to-Point (`ip ospf network point-to-point`)：不選 DR/BDR，收斂更快。' },
    'fc-27': { front: 'OSPF 注入預設路由指令', back: '`default-information originate`（若路由表已有 0.0.0.0/0 則公告）\n加上 `always`（`default-information originate always`）則無論本機是否有預設路由皆強制公告。' },
    'fc-28': { front: 'HSRP vs VRRP vs GLBP 快速比較', back: 'HSRP：Cisco，Active/Standby，UDP 1985，224.0.0.2(v1)/.102(v2)，預設優先權 100。\nVRRP：RFC 標準，Master/Backup，IP proto 112，224.0.0.18。\nGLBP：Cisco，AVG + 最多 4 台 AVF（負載平衡）。' },
    'fc-29': { front: 'IPv4 靜態路由與浮動靜態路由語法', back: '`ip route <網路> <遮罩> <下一跳IP> [AD]`\n浮動靜態路由：設定比動態路由協定更大的 AD（例如設為 `120` 作為 OSPF `110` 的備援）。' },
    'fc-30': { front: '`show ip route` 路由表代碼意義', back: 'C = 直連 (Connected)，L = 本地介面 (/32 主機路由)，S = 靜態，S* = 候選預設路由，O = OSPF，D = EIGRP，R = RIP，B = BGP' },
    'fc-31': { front: '4 種 NAT 位址術語 (Inside/Outside Local/Global)', back: 'Inside Local：內部主機的私有 IP\nInside Global：代表內部主機的公網 IP\nOutside Global：外部伺服器的公網 IP\nOutside Local：內部視角所見的外部主機 IP' },
    'fc-32': { front: 'DHCPv4 DORA 四步驟流程', back: 'D - Discover（廣播，用戶端→伺服器）\nO - Offer（伺服器→用戶端）\nR - Request（廣播，用戶端→伺服器）\nA - Acknowledge（伺服器→用戶端）' },
    'fc-33': { front: 'DHCP 中繼 (Relay) 指令與套用位置', back: '`ip helper-address <DHCP伺服器IP>`\n設定於面向 DHCP 用戶端的路由器介面 / SVI 上。' },
    'fc-34': { front: 'NTP 階層 (Stratum) 與驗證指令', back: 'Stratum 0：參考時鐘（GPS/原子鐘）\nStratum 1..15：有效同步設備\nStratum 16：未同步\n驗證：`show ntp status`, `show ntp associations`' },
    'fc-35': { front: 'Syslog 嚴重等級 0 到 7', back: '0 Emergencies | 1 Alerts | 2 Critical | 3 Errors | 4 Warnings | 5 Notifications | 6 Informational | 7 Debugging\n(Every Awesome Cisco Engineer Will Need Ice Cream Daily)' },
    'fc-36': { front: 'SNMPv3 三種安全等級', back: 'noAuthNoPriv：僅使用者名稱\nauthNoPriv：僅驗證（MD5/SHA）\nauthPriv：驗證 + 加密（DES/3DES/AES）' },
    'fc-37': { front: 'QoS Per-Hop Behaviors (EF, AF, CS)', back: 'EF (DSCP 46)：Expedited Forwarding → 語音（低延遲佇列）\nAF (AF11..AF43)：Assured Forwarding → 4 類別 × 3 丟棄機率（AF41 = 視訊）\nCS0 (DSCP 0)：Best Effort' },
    'fc-38': { front: 'Cisco IOS SSH 最小必要設定清單', back: '1. `hostname R1`\n2. `ip domain-name lab.local`\n3. `crypto key generate rsa modulus 2048`\n4. `username admin secret <pw>`\n5. `line vty 0 4` → `login local` + `transport input ssh`' },
    'fc-39': { front: 'QoS 分類標記 vs 限速 (Policing) 與整形 (Shaping)', back: 'Classification/Marking：識別並標記 CoS (L2 3-bit) 或 DSCP (L3 6-bit)。\nPolicing：直接丟棄或降級超額流量。\nShaping：緩衝延遲超額流量使輸出平滑。' },
    'fc-40': { front: 'NAT Overload (PAT) 設定三步驟', back: '1. 在介面設定 `ip nat inside` 與 `ip nat outside`\n2. `access-list 1 permit 192.168.1.0 0.0.0.255`\n3. `ip nat inside source list 1 interface Gi0/0 overload`' },
    'fc-41': { front: 'TACACS+ vs RADIUS 比較', back: 'TACACS+：Cisco，TCP 49，加密整個封包，完全分離 A-A-A（適合設備 CLI 管理）。\nRADIUS：標準，UDP 1812/1813，僅加密密碼，合併 AuthN+AuthZ（適合 802.1X/VPN）。' },
    'fc-42': { front: '標準 vs 延伸 IPv4 ACL 放置原則', back: '標準 (1-99, 1300-1999)：僅比對來源 IP → 放於靠近「目的端」。\n延伸 (100-199, 2000-2699)：比對來源/目的/協定/埠 → 放於靠近「來源端」。' },
    'fc-43': { front: 'Port Security 三種違規處理模式', back: 'shutdown（預設）：err-disabled + 日誌 + 計數\nrestrict：丟棄違規訊框 + Syslog/SNMP + 計數\nprotect：僅靜默丟棄（無日誌、無計數）' },
    'fc-44': { front: 'DHCP Snooping + DAI + IP Source Guard 關聯', back: 'DHCP Snooping：阻擋非法 DHCP 伺服器（Uplink 設 `ip dhcp snooping trust`），建立繫結表。\nDAI：依繫結表檢查 ARP。\nIPSG：依繫結表過濾 IP/MAC 流量。' },
    'fc-45': { front: 'Port Security 黏著 MAC (Sticky MAC) 指令', back: '`switchport port-security mac-address sticky`\n動態學習連線主機 MAC 並自動寫入 running-config。' },
    'fc-46': { front: 'WPA2 vs WPA3 關鍵改良', back: 'WPA2-Personal：PSK + AES-CCMP（4-way handshake 易受離線字典攻擊）。\nWPA3-Personal：SAE (Dragonfly) + 強制 Protected Management Frames (PMF) + 企業版 192-bit 加密套件。' },
    'fc-47': { front: '資訊安全三要素 (CIA Triad)', back: '機密性 (Confidentiality)：加密 (AES, IPsec, TLS)\n完整性 (Integrity)：雜湊 (SHA-256, HMAC)\n可用性 (Availability)：冗餘備援 (HSRP, EtherChannel, UPS, DDoS 防護)' },
    'fc-48': { front: 'IPsec Transport vs Tunnel 模式與 AH vs ESP', back: 'Tunnel Mode：加密整個原始 IP 封包並加上新 IP 標頭（站對站 VPN）。\nTransport Mode：僅加密負載（主機對主機）。\nESP (Proto 50)：加密 + 驗證。AH (Proto 51)：僅驗證。' },
    'fc-49': { front: 'ACL 萬用字元遮罩 (Wildcard Mask) 技巧', back: 'Wildcard = 255.255.255.255 減去子網路遮罩。\n`0.0.0.0` = `host` 關鍵字\n`255.255.255.255` = `any` 關鍵字\n偶數/奇數網段比對可檢查最後一個位元 (0.0.0.254)。' },
    'fc-50': { front: 'Cisco IOS 密碼加密等級類型', back: 'Type 0：明文\nType 7：弱 Vigenere 編碼 (`service password-encryption`)\nType 5：MD5（舊版 `enable secret`）\nType 8/9：PBKDF2-SHA256 / scrypt（現代 `secret`）' },
    'fc-51': { front: '控制平面 vs 資料平面 vs 管理平面', back: '控制平面 (Control)：建立路由/MAC/ARP 表（OSPF, STP）。\n資料平面 (Data)：硬體高速轉送封包/訊框（CEF, ASIC）。\n管理平面 (Management)：設備登入與監控（SSH, SNMP, Syslog, REST）。' },
    'fc-52': { front: 'SDN 北向 (Northbound) vs 南向 (Southbound) API', back: '北向：應用程式/腳本 ↔ 控制器（常為 REST/JSON）。\n南向：控制器 ↔ 網路設備（NETCONF, RESTCONF, OpenFlow, SSH/SNMP）。' },
    'fc-53': { front: 'REST HTTP 動詞與 CRUD 對應', back: 'POST = Create (建立)\nGET = Read (讀取)\nPUT = Update/Replace (完整替換)\nPATCH = Update (局部更新)\nDELETE = Delete (刪除)' },
    'fc-54': { front: 'REST HTTP 狀態碼分類', back: '2xx = 成功 (200 OK, 201 Created, 204 No Content)\n3xx = 重新導向\n4xx = 用戶端錯誤 (400 Bad Request, 401 Unauth, 403 Forbidden, 404 Not Found)\n5xx = 伺服器錯誤 (500, 503)' },
    'fc-55': { front: 'JSON vs YAML vs XML 特徵比較', back: 'JSON：`{ "key": "val" }`、陣列 `[]`、無註解、無尾隨逗號。\nYAML：空格縮排、`---` 開頭、`#` 註解（Ansible）。\nXML：`<tag>value</tag>`（NETCONF）。' },
    'fc-56': { front: 'Ansible vs Puppet vs Chef vs Terraform', back: 'Ansible：無代理、Push、YAML。\nPuppet：有代理、Pull、Ruby DSL (TCP 8140)。\nChef：有代理、Pull、Ruby (Recipes/Cookbooks)。\nTerraform：宣告式 IaC、HCL、State 狀態檔。' },
    'fc-57': { front: 'Cisco SDA (軟體定義存取) 各平面協定', back: 'Underlay：實體 IP 連通性 (IS-IS)\nOverlay 控制平面：LISP\nOverlay 資料平面：VXLAN\nOverlay 安全策略：SGT (Security Group Tags)' },
    'fc-58': { front: 'NETCONF vs RESTCONF 連接埠與格式', back: 'NETCONF：SSH (TCP 830)、XML 格式、YANG 資料模型。\nRESTCONF：HTTPS (TCP 443)、JSON 或 XML 格式、YANG 資料模型。' },
    'fc-59': { front: 'AI/ML 於網路維運的應用 (CCNA v1.1)', back: '預測式 AI/ML 透過遙測建立正常基準線，提早預測容量瓶頸並標記異常。\n生成式 AI 協助工程師以自然語言查詢、解讀組態並加速排錯流程。' },
    'fc-60': { front: '傳統逐台管理 vs 控制器集中管理', back: '傳統架構：控制平面分散在每台設備，手動 CLI/SSH 易產生組態漂移。\n控制器架構（如 Catalyst Center）：集中式意圖與策略管理、自動化佈署、單一監控介面。' }
  };

  const LABS_ZH = {
    'lab-vlan-trunk': {
      title: 'VLAN 與 802.1Q Trunk 組態',
      objective: '建立 VLAN 10 (Sales)，將 Gi0/1 設為 VLAN 10 存取埠，並將 Gi0/24 設定為 Native VLAN 99 的 802.1Q Trunk。',
      steps: [
        '進入特權模式 (Privileged EXEC)',
        '進入全域組態模式 (Global Config)',
        '建立 VLAN 10',
        '將 VLAN 10 命名為 Sales',
        '進入介面 GigabitEthernet0/1',
        '將 Gi0/1 明確設為 Access 存取模式',
        '將 Gi0/1 指派給 VLAN 10',
        '進入上行鏈路介面 Gi0/24',
        '將 Gi0/24 強制設為 802.1Q Trunk 模式',
        '將 Trunk Gi0/24 的 Native VLAN 設為 99'
      ]
    },
    'lab-port-security': {
      title: '交換器連接埠安全 (Port Security)',
      objective: '在存取埠 Gi0/2 啟用 Port Security：最多允許 2 個 MAC 位址、啟用 Sticky MAC 學習，並將違規動作設為 restrict。',
      steps: [
        '進入全域組態模式',
        '進入介面 GigabitEthernet0/2',
        '確認連接埠為靜態 Access 模式（Port Security 必要條件）',
        '在 Gi0/2 啟用 Port Security',
        '設定最大允許 MAC 位址數為 2',
        '啟用 Sticky MAC 學習',
        '設定違規動作為 restrict（丟棄 + 日誌 + 累計計數）'
      ]
    },
    'lab-ospf': {
      title: '單區域 OSPFv2 路由設定',
      objective: '設定 OSPFv2 Process 1、指定 Router ID 1.1.1.1、在 Area 0 公告 10.1.0.0/24，並將 LAN 介面 Gi0/1 設為被動介面。',
      steps: [
        '進入全域組態模式',
        '啟動 OSPF 程序 1',
        '手動設定 Router ID 為 1.1.1.1',
        '使用萬用字元遮罩在 Area 0 公告 10.1.0.0/24',
        '將 LAN 介面 Gi0/1 設為被動介面 (passive-interface)'
      ]
    },
    'lab-roas': {
      title: '單臂路由 (Router-on-a-Stick)',
      objective: '啟用實體介面 Gi0/0，並建立對應 VLAN 10 的子介面 Gi0/0.10，設定閘道 IP 為 192.168.10.1/24。',
      steps: [
        '進入實體介面 Gi0/0',
        '啟用實體介面 (`no shutdown`)',
        '建立子介面 Gi0/0.10',
        '將子介面綁定 802.1Q VLAN 10（必須在設 IP 前執行！）',
        '設定 IP 位址 192.168.10.1 255.255.255.0'
      ]
    },
    'lab-dhcp': {
      title: 'Cisco IOS DHCPv4 伺服器',
      objective: '排除 192.168.10.1–192.168.10.10，建立名為 LAN10 的 DHCP 位址池，並設定預設閘道 192.168.10.1 與 DNS 1.1.1.1。',
      steps: [
        '排除保留位址 .1 至 .10',
        '建立名為 LAN10 的 DHCP Pool',
        '定義發放網段 192.168.10.0 255.255.255.0',
        '設定預設閘道 192.168.10.1',
        '設定 DNS 伺服器 1.1.1.1'
      ]
    },
    'lab-pat': {
      title: 'NAT Overload (PAT 多對一轉換)',
      objective: '設定 PAT 將 192.168.1.0/24 (ACL 1) 透過 WAN 介面 Gi0/1 轉換出去，Gi0/0 設為 inside、Gi0/1 設為 outside。',
      steps: [
        '進入 LAN 介面 Gi0/0',
        '將 Gi0/0 標記為 NAT inside',
        '進入 WAN 介面 Gi0/1',
        '將 Gi0/1 標記為 NAT outside',
        '退回全域組態模式 (`exit`)',
        '建立標準 ACL 1 允許 192.168.1.0 0.0.0.255',
        '使用 ACL 1 在 Gi0/1 上啟用 PAT overload'
      ]
    },
    'lab-ssh': {
      title: 'SSHv2 與 VTY 安全強化',
      objective: '設定主機名稱 R1、網域 ccna.lab、建立本地 admin 帳號、產生 2048-bit RSA 金鑰、啟用 SSHv2，並限制 VTY 0 4 僅允許 SSH 連線。',
      steps: [
        '設定主機名稱 R1',
        '設定 IP 網域名稱 ccna.lab',
        '建立本地管理員帳號 admin 並使用 secret 密碼',
        '產生 2048-bit RSA 金鑰對',
        '強制使用 SSH 第 2 版',
        '進入 VTY 線路 0 4',
        '使用本地資料庫驗證 (`login local`)',
        '限制 VTY 僅允許 SSH 入向連線'
      ]
    },
    'sim-1': {
      title: 'PDF 實作題 1：IPv4 /28 與 IPv6 /124 介面位址',
      objective: '在 R1 e0/0 設定 10.0.12.0/28 與 2001:db8:12::/124 第一個可用主機 IP，R2 e0/0 設定最後一個可用主機 IP 並 Ping 驗證。',
      steps: [
        '[R1] 進入介面 e0/0',
        '[R1] 設定 10.0.12.0/28 第一個可用 IPv4 位址 (.1)',
        '[R1] 設定 2001:db8:12::/124 第一個可用 IPv6 位址 (::1)',
        '[R1] 啟用介面 e0/0 (`no shutdown`)',
        '[R2] 進入介面 e0/0',
        '[R2] 設定 10.0.12.0/28 最後一個可用 IPv4 位址 (.14)',
        '[R2] 設定 2001:db8:12::/124 最後一個可用 IPv6 位址 (::e)',
        '[R2] 啟用介面 e0/0',
        '[R2] Ping R1 IPv4 (10.0.12.1) 驗證連通性'
      ]
    },
    'sim-1a': {
      title: 'PDF 實作題 1A：IPv4 /29 與 IPv6 /126',
      objective: '在 R1 與 R2 的 e0/2 分別設定 10.12.18.24/29 與 2001:db8:12::c/126 的首個與最後一個可用位址。',
      steps: [
        '[R1] 進入介面 e0/2',
        '[R1] 設定第一個可用 IPv4 (.25/29)',
        '[R1] 設定第一個可用 IPv6 (2001:db8:12::d/126)',
        '[R1] 啟用介面 e0/2 (`no shutdown`)',
        '[R2] 進入介面 e0/2',
        '[R2] 設定最後一個可用 IPv4 (.30/29)',
        '[R2] 設定最後一個可用 IPv6 (2001:db8:12::e/126)',
        '[R2] 啟用介面 e0/2'
      ]
    },
    'sim-1b': {
      title: 'PDF 實作題 1B：雙堆疊 /29 與 /126 設定',
      objective: '在 R1 e0/0 設定 172.16.12.32/29 與 2001:db8:12::34/126 首個可用位址，R2 e0/0 設定最後一個可用位址。',
      steps: [
        '[R1] 進入介面 e0/0',
        '[R1] 設定第一個可用 IPv4 (.33/29)',
        '[R1] 設定第一個可用 IPv6 (2001:db8:12::35/126)',
        '[R1] 啟用介面 (`no shutdown`)',
        '[R2] 進入介面 e0/0',
        '[R2] 設定最後一個可用 IPv4 (.38/29)',
        '[R2] 設定最後一個可用 IPv6 (2001:db8:12::36/126)',
        '[R2] 啟用介面 (`no shutdown`)'
      ]
    },
    'sim-2': {
      title: 'PDF 實作題 2：OSPFv2 與 DR 選舉 (R2)',
      objective: '在 R2 啟用 OSPF Process 10、設 Router-ID 為 10.2.2.2、於 Area 0 公告 10.0.23.0/28 與 10.0.12.0/30，並強制 R2 成為 DR。',
      steps: [
        '啟動 OSPF 程序 10',
        '設定 OSPF Router-ID 為 Loopback0 (10.2.2.2)',
        '在 Area 0 公告 10.0.23.0/28',
        '在 Area 0 公告 10.0.12.0/30',
        '進入介面 e0/0 設定 DR 優先權',
        '將 e0/0 OSPF priority 設為 255',
        '進入介面 e0/1',
        '將 e0/1 OSPF priority 設為 255'
      ]
    },
    'sim-2a': {
      title: 'PDF 實作題 2A：介面啟用 OSPF 與 DR (R1)',
      objective: '在 R1 啟用 OSPF Process 30、以 e0/0 IP (10.0.12.1) 為 Router-ID、於介面上直接啟用 OSPF 並設優先權 255 成為 DR。',
      steps: [
        '啟動 OSPF 程序 30',
        '設定 Router-ID 為 10.0.12.1',
        '進入介面 e0/0',
        '在 e0/0 直接啟用 OSPF 30 Area 0',
        '將 e0/0 OSPF priority 設為 255',
        '進入介面 e0/1',
        '在 e0/1 直接啟用 OSPF 30 Area 0',
        '將 e0/1 OSPF priority 設為 255'
      ]
    },
    'sim-3': {
      title: 'PDF 實作題 3：Data/Voice VLAN 與 LLDP',
      objective: '建立 VLAN 77 / 177、指派 SW1 e0/1-2 的資料與語音 VLAN，並全域啟用 LLDP 鄰居探索。',
      steps: [
        '建立 VLAN 77',
        '命名 VLAN 77 為 IT_User_VLAN',
        '建立語音 VLAN 177',
        '命名 VLAN 177 為 IT_Voice_VLAN',
        '進入介面範圍 e0/1-2',
        '將 e0/1-2 設為 access 模式',
        '指派資料 VLAN 77 給 e0/1-2',
        '指派語音 VLAN 177 給 e0/1-2',
        '退回全域組態模式 (`exit`)',
        '全域啟用 LLDP (`lldp run`)'
      ]
    },
    'sim-3a': {
      title: 'PDF 實作題 3A：VLAN 15/66 與 LLDP',
      objective: '在 SW-1 建立 VLAN 15 (OPS) 指派給 e0/1，在 SW-2 建立 VLAN 66 (ENGINEERING) 指派給 e0/1，並於兩台交換器啟用 LLDP。',
      steps: [
        '[SW-1] 建立 VLAN 15',
        '[SW-1] 命名 VLAN 15 為 OPS',
        '[SW-1] 進入介面 e0/1',
        '[SW-1] 設定為 access 模式',
        '[SW-1] 指派 VLAN 15 給 e0/1',
        '[SW-1] 全域啟用 LLDP (`lldp run`)',
        '[SW-2] 建立 VLAN 66',
        '[SW-2] 命名 VLAN 66 為 ENGINEERING',
        '[SW-2] 進入介面 e0/1',
        '[SW-2] 指派 VLAN 66 給 e0/1',
        '[SW-2] 全域啟用 LLDP (`lldp run`)'
      ]
    },
    'sim-3b': {
      title: 'PDF 實作題 3B：VLAN 與連接埠停用 LLDP',
      objective: '在 SW1 建立 VLAN 35 SALES、將 e0/2 指派給 PC1、全域啟用 LLDP，並在面向 PC1 的 e0/2 停用 LLDP 收發。',
      steps: [
        '[SW1] 建立 VLAN 35',
        '[SW1] 命名 VLAN 35 為 SALES',
        '[SW1] 進入 PC1 連接埠 e0/2',
        '[SW1] 將 e0/2 指派給 VLAN 35',
        '[SW1] 在 e0/2 停用 LLDP 傳送 (`no lldp transmit`)',
        '[SW1] 在 e0/2 停用 LLDP 接收 (`no lldp receive`)',
        '[SW1] 全域啟用 LLDP (`lldp run`)'
      ]
    },
    'sim-4': {
      title: 'PDF 實作題 4：LACP EtherChannel 12 與 Trunk',
      objective: '將 e0/0-1 設為允許 VLAN 1,12,22 的 802.1Q Trunk 並聚合為 LACP Po12 (active)，另將 e0/2 設為僅允許 VLAN 12,22。',
      steps: [
        '[SW-1] 進入介面範圍 e0/0-1',
        '[SW-1] 設定 802.1Q 封裝 (`switchport trunk encapsulation dot1q`)',
        '[SW-1] 設定 Trunk 模式',
        '[SW-1] 僅允許 VLAN 1,12,22 通過 Trunk',
        '[SW-1] 加入 LACP Port-Channel 12 (`channel-group 12 mode active`)',
        '[SW-1] 進入介面 e0/2',
        '[SW-1] 僅允許 VLAN 12,22 通過 e0/2'
      ]
    },
    'sim-4a': {
      title: 'PDF 實作題 4A：LACP Port-Channel 10',
      objective: '在 SW1 與 SW2 的 e0/0-1 設定僅允許 VLAN 10,30 的 Trunk，並以 LACP active 模式建立 Port-Channel 10。',
      steps: [
        '[SW1] 進入介面範圍 e0/0-1',
        '[SW1] 設定 Trunk 模式',
        '[SW1] 僅允許 VLAN 10,30',
        '[SW1] 建立 LACP Port-Channel 10 (active)',
        '[SW2] 進入介面範圍 e0/0-1',
        '[SW2] 僅允許 VLAN 10,30',
        '[SW2] 建立 LACP Port-Channel 10 (active)'
      ]
    },
    'sim-4b': {
      title: 'PDF 實作題 4B：Native VLAN 77 與 LACP Po34',
      objective: '設定 SW-1 e0/0 允許 VLAN 5,6、e0/1 使用 Native VLAN 77，並在 SW-3 (active) 與 SW-4 (passive) 建立 LACP Po34。',
      steps: [
        '[SW-1] 進入介面 e0/0',
        '[SW-1] 僅允許 VLAN 5,6',
        '[SW-1] 進入介面 e0/1',
        '[SW-1] 設定 Native VLAN 77',
        '[SW-3] 進入介面範圍 e0/0-1',
        '[SW-3] 以 LACP active 發起協商 (`channel-group 34 mode active`)',
        '[SW-4] 進入介面範圍 e0/0-1',
        '[SW-4] 以 LACP passive 被動協商 (`channel-group 34 mode passive`)'
      ]
    },
    'sim-5': {
      title: 'PDF 實作題 5：靜態與預設路由 (最短路徑)',
      objective: '在 DC 設定經 ISP 的預設路由、在 Branch 設定往 10.0.44.0/24 經 HQ 的靜態路由，以及經 DC 的最短跳數預設路由。',
      steps: [
        '[DC] 設定往 ISP (209.165.201.1) 的預設路由',
        '[DC] Ping Web Server (209.165.202.129) 驗證',
        '[Branch] 設定往 10.0.44.0/24 經 HQ (10.0.24.1) 的靜態路由',
        '[Branch] 設定往網際網路經 DC (10.0.22.1) 的最短路徑預設路由',
        '[Branch] Ping Web Server (209.165.202.129) 驗證'
      ]
    },
    'sim-5a': {
      title: 'PDF 實作題 5A：主機路由與浮動備援路由',
      objective: '在 SJC 設定往 ISP 的預設路由，在 SQL 設定往 PC (10.10.44.2/32) 的主路徑 (10.10.54.1) 與 AD=5 備援浮動路由 (10.10.10.1)。',
      steps: [
        '[SJC] 設定往 ISP (209.165.201.2) 的預設路由',
        '[SJC] Ping Web Server (209.165.202.129) 驗證',
        '[SQL] 設定往 PC (10.10.44.2/32) 的主要主機路由 (via 10.10.54.1)',
        '[SQL] 設定經 10.10.10.1 的備援浮動路由（AD 設為 5）',
        '[SQL] Ping PC (10.10.44.2) 驗證連通性'
      ]
    }
  };

  global.CCNA_ZH = {
    QUESTIONS: QUESTIONS_ZH,
    FLASHCARDS: FLASHCARDS_ZH,
    LABS: LABS_ZH
  };
})(window);
