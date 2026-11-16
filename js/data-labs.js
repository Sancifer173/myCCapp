(function (global) {
  'use strict';

  const LABS = [
    {
      id: 'lab-vlan-trunk',
      domain: 'access',
      title: 'VLANs & 802.1Q Trunking',
      device: 'SW1',
      difficulty: 'Core',
      objective: 'Create VLAN 10 (Sales), assign Gi0/1 as an access port in VLAN 10, and configure Gi0/24 as an 802.1Q trunk with Native VLAN 99.',
      initialMode: 'user',
      steps: [
        {
          hint: 'Enter privileged EXEC mode',
          promptMode: 'user',
          accepted: [/^en(able)?$/i],
          nextMode: 'priv',
          output: '',
          chips: ['enable']
        },
        {
          hint: 'Enter global configuration mode',
          promptMode: 'priv',
          accepted: [/^conf(igure)?\s+t(erminal)?$/i],
          nextMode: 'config',
          output: 'Enter configuration commands, one per line. End with CNTL/Z.',
          chips: ['configure terminal', 'conf t']
        },
        {
          hint: 'Create VLAN 10',
          promptMode: 'config',
          accepted: [/^vlan\s+10$/i],
          nextMode: 'config-vlan',
          output: '',
          chips: ['vlan 10']
        },
        {
          hint: 'Name VLAN 10 as Sales',
          promptMode: 'config-vlan',
          accepted: [/^name\s+sales$/i],
          nextMode: 'config-vlan',
          output: '',
          chips: ['name Sales']
        },
        {
          hint: 'Select interface GigabitEthernet0/1',
          promptMode: 'config-vlan',
          accepted: [/^int(erface)?\s+g(i|igabitethernet)?\s*0\/1$/i],
          nextMode: 'config-if',
          output: '',
          chips: ['interface Gi0/1']
        },
        {
          hint: 'Set Gi0/1 explicitly to access mode',
          promptMode: 'config-if',
          accepted: [/^sw(itchport)?\s+mo(de)?\s+acc(ess)?$/i],
          nextMode: 'config-if',
          output: '',
          chips: ['switchport mode access']
        },
        {
          hint: 'Assign Gi0/1 to VLAN 10',
          promptMode: 'config-if',
          accepted: [/^sw(itchport)?\s+acc(ess)?\s+vlan\s+10$/i],
          nextMode: 'config-if',
          output: '',
          chips: ['switchport access vlan 10']
        },
        {
          hint: 'Select uplink interface Gi0/24',
          promptMode: 'config-if',
          accepted: [/^int(erface)?\s+g(i|igabitethernet)?\s*0\/24$/i],
          nextMode: 'config-if',
          output: '',
          chips: ['interface Gi0/24']
        },
        {
          hint: 'Force Gi0/24 to 802.1Q trunk mode',
          promptMode: 'config-if',
          accepted: [/^sw(itchport)?\s+mo(de)?\s+tr(unk)?$/i],
          nextMode: 'config-if',
          output: '',
          chips: ['switchport mode trunk']
        },
        {
          hint: 'Set Native VLAN to 99 on trunk Gi0/24',
          promptMode: 'config-if',
          accepted: [/^sw(itchport)?\s+tr(unk)?\s+nat(ive)?\s+vlan\s+99$/i],
          nextMode: 'config-if',
          output: '%SPANTREE-5-NATIVE_VLAN_MISMATCH cleared on Gi0/24.',
          chips: ['switchport trunk native vlan 99']
        }
      ]
    },
    {
      id: 'lab-port-security',
      domain: 'security',
      title: 'Switch Port Security',
      device: 'SW-ACCESS',
      difficulty: 'Core',
      objective: 'Harden access port Gi0/2 with Port Security: allow max 2 MAC addresses, enable sticky MAC learning, and set violation mode to restrict.',
      initialMode: 'priv',
      steps: [
        {
          hint: 'Enter global configuration mode',
          promptMode: 'priv',
          accepted: [/^conf(igure)?\s+t(erminal)?$/i],
          nextMode: 'config',
          output: 'Enter configuration commands, one per line. End with CNTL/Z.',
          chips: ['conf t']
        },
        {
          hint: 'Select interface GigabitEthernet0/2',
          promptMode: 'config',
          accepted: [/^int(erface)?\s+g(i|igabitethernet)?\s*0\/2$/i],
          nextMode: 'config-if',
          output: '',
          chips: ['interface Gi0/2']
        },
        {
          hint: 'Ensure port is in static access mode (required for port-security)',
          promptMode: 'config-if',
          accepted: [/^sw(itchport)?\s+mo(de)?\s+acc(ess)?$/i],
          nextMode: 'config-if',
          output: '',
          chips: ['switchport mode access']
        },
        {
          hint: 'Enable Port Security on Gi0/2',
          promptMode: 'config-if',
          accepted: [/^sw(itchport)?\s+port-sec(urity)?$/i],
          nextMode: 'config-if',
          output: '',
          chips: ['switchport port-security']
        },
        {
          hint: 'Set maximum allowed MAC addresses to 2',
          promptMode: 'config-if',
          accepted: [/^sw(itchport)?\s+port-sec(urity)?\s+max(imum)?\s+2$/i],
          nextMode: 'config-if',
          output: '',
          chips: ['switchport port-security maximum 2']
        },
        {
          hint: 'Enable sticky MAC learning',
          promptMode: 'config-if',
          accepted: [/^sw(itchport)?\s+port-sec(urity)?\s+mac(-address)?\s+sticky$/i],
          nextMode: 'config-if',
          output: '',
          chips: ['switchport port-security mac-address sticky']
        },
        {
          hint: 'Set violation action to restrict (drop + log + increment counter)',
          promptMode: 'config-if',
          accepted: [/^sw(itchport)?\s+port-sec(urity)?\s+vio(lation)?\s+restrict$/i],
          nextMode: 'config-if',
          output: 'Port Security active on Gi0/2 (Max: 2, Sticky: Enabled, Violation: Restrict).',
          chips: ['switchport port-security violation restrict']
        }
      ]
    },
    {
      id: 'lab-ospf',
      domain: 'connectivity',
      title: 'Single-Area OSPFv2',
      device: 'R1',
      difficulty: 'Core',
      objective: 'Configure OSPFv2 process 1 with Router ID 1.1.1.1, advertise 10.1.0.0/24 in Area 0, and suppress OSPF Hellos on LAN interface Gi0/1.',
      initialMode: 'priv',
      steps: [
        {
          hint: 'Enter global configuration mode',
          promptMode: 'priv',
          accepted: [/^conf(igure)?\s+t(erminal)?$/i],
          nextMode: 'config',
          output: '',
          chips: ['conf t']
        },
        {
          hint: 'Start OSPF process 1',
          promptMode: 'config',
          accepted: [/^router\s+ospf\s+1$/i],
          nextMode: 'config-router',
          output: '',
          chips: ['router ospf 1']
        },
        {
          hint: 'Set manual Router ID to 1.1.1.1',
          promptMode: 'config-router',
          accepted: [/^router-id\s+1\.1\.1\.1$/i],
          nextMode: 'config-router',
          output: '',
          chips: ['router-id 1.1.1.1']
        },
        {
          hint: 'Advertise 10.1.0.0/24 in Area 0 using wildcard mask',
          promptMode: 'config-router',
          accepted: [/^net(work)?\s+10\.1\.0\.0\s+0\.0\.0\.255\s+area\s+0$/i],
          nextMode: 'config-router',
          output: '%OSPF-5-ADJCHG: Process 1, Nbr 2.2.2.2 on Gi0/0 from LOADING to FULL.',
          chips: ['network 10.1.0.0 0.0.0.255 area 0']
        },
        {
          hint: 'Mark LAN interface Gi0/1 as passive',
          promptMode: 'config-router',
          accepted: [/^pas(sive-interface)?\s+g(i|igabitethernet)?\s*0\/1$/i],
          nextMode: 'config-router',
          output: 'OSPF Hellos suppressed on GigabitEthernet0/1; prefix remains advertised.',
          chips: ['passive-interface Gi0/1']
        }
      ]
    },
    {
      id: 'lab-roas',
      domain: 'connectivity',
      title: 'Router-on-a-Stick (ROAS)',
      device: 'R1',
      difficulty: 'Intermediate',
      objective: 'Bring up physical interface Gi0/0 and create subinterface Gi0/0.10 for VLAN 10 with gateway IP 192.168.10.1/24.',
      initialMode: 'config',
      steps: [
        {
          hint: 'Select physical interface Gi0/0',
          promptMode: 'config',
          accepted: [/^int(erface)?\s+g(i|igabitethernet)?\s*0\/0$/i],
          nextMode: 'config-if',
          output: '',
          chips: ['interface Gi0/0']
        },
        {
          hint: 'Enable the physical interface',
          promptMode: 'config-if',
          accepted: [/^no\s+sh(ut|utdown)?$/i],
          nextMode: 'config-if',
          output: '%LINK-3-UPDOWN: Interface GigabitEthernet0/0, changed state to up',
          chips: ['no shutdown']
        },
        {
          hint: 'Create subinterface Gi0/0.10',
          promptMode: 'config-if',
          accepted: [/^int(erface)?\s+g(i|igabitethernet)?\s*0\/0\.10$/i],
          nextMode: 'config-subif',
          output: '',
          chips: ['interface Gi0/0.10']
        },
        {
          hint: 'Bind subinterface to 802.1Q VLAN 10 (must come BEFORE IP address!)',
          promptMode: 'config-subif',
          accepted: [/^encap(sulation)?\s+dot1q\s+10$/i],
          nextMode: 'config-subif',
          output: '',
          chips: ['encapsulation dot1Q 10']
        },
        {
          hint: 'Assign IP 192.168.10.1 255.255.255.0',
          promptMode: 'config-subif',
          accepted: [/^ip\s+add(ress)?\s+192\.168\.10\.1\s+255\.255\.255\.0$/i],
          nextMode: 'config-subif',
          output: 'Subinterface Gi0/0.10 routing VLAN 10 at 192.168.10.1/24.',
          chips: ['ip address 192.168.10.1 255.255.255.0']
        }
      ]
    },
    {
      id: 'lab-dhcp',
      domain: 'services',
      title: 'Cisco IOS DHCPv4 Server',
      device: 'R1',
      difficulty: 'Core',
      objective: 'Exclude 192.168.10.1–192.168.10.10, create pool LAN10 for 192.168.10.0/24, and configure default-router 192.168.10.1 & DNS 1.1.1.1.',
      initialMode: 'config',
      steps: [
        {
          hint: 'Exclude static/reserved addresses .1 through .10',
          promptMode: 'config',
          accepted: [/^ip\s+dhcp\s+exc(luded-address)?\s+192\.168\.10\.1\s+192\.168\.10\.10$/i],
          nextMode: 'config',
          output: '',
          chips: ['ip dhcp excluded-address 192.168.10.1 192.168.10.10']
        },
        {
          hint: 'Create DHCP pool named LAN10',
          promptMode: 'config',
          accepted: [/^ip\s+dhcp\s+pool\s+LAN10$/i],
          nextMode: 'dhcp-config',
          output: '',
          chips: ['ip dhcp pool LAN10']
        },
        {
          hint: 'Define subnet 192.168.10.0 255.255.255.0',
          promptMode: 'dhcp-config',
          accepted: [/^net(work)?\s+192\.168\.10\.0\s+255\.255\.255\.0$/i],
          nextMode: 'dhcp-config',
          output: '',
          chips: ['network 192.168.10.0 255.255.255.0']
        },
        {
          hint: 'Set default gateway 192.168.10.1',
          promptMode: 'dhcp-config',
          accepted: [/^def(ault-router)?\s+192\.168\.10\.1$/i],
          nextMode: 'dhcp-config',
          output: '',
          chips: ['default-router 192.168.10.1']
        },
        {
          hint: 'Set DNS server 1.1.1.1',
          promptMode: 'dhcp-config',
          accepted: [/^dns(-server)?\s+1\.1\.1\.1$/i],
          nextMode: 'dhcp-config',
          output: 'DHCP pool LAN10 active and ready to lease 192.168.10.11–.254.',
          chips: ['dns-server 1.1.1.1']
        }
      ]
    },
    {
      id: 'lab-pat',
      domain: 'services',
      title: 'NAT Overload (PAT)',
      device: 'EDGE-R1',
      difficulty: 'Intermediate',
      objective: 'Configure PAT translating 192.168.1.0/24 (ACL 1) out WAN interface Gi0/1, with Gi0/0 as inside and Gi0/1 as outside.',
      initialMode: 'config',
      steps: [
        {
          hint: 'Select LAN interface Gi0/0',
          promptMode: 'config',
          accepted: [/^int(erface)?\s+g(i|igabitethernet)?\s*0\/0$/i],
          nextMode: 'config-if',
          output: '',
          chips: ['interface Gi0/0']
        },
        {
          hint: 'Mark Gi0/0 as NAT inside',
          promptMode: 'config-if',
          accepted: [/^ip\s+nat\s+in(side)?$/i],
          nextMode: 'config-if',
          output: '',
          chips: ['ip nat inside']
        },
        {
          hint: 'Select WAN interface Gi0/1',
          promptMode: 'config-if',
          accepted: [/^int(erface)?\s+g(i|igabitethernet)?\s*0\/1$/i],
          nextMode: 'config-if',
          output: '',
          chips: ['interface Gi0/1']
        },
        {
          hint: 'Mark Gi0/1 as NAT outside',
          promptMode: 'config-if',
          accepted: [/^ip\s+nat\s+out(side)?$/i],
          nextMode: 'config-if',
          output: '',
          chips: ['ip nat outside']
        },
        {
          hint: 'Return to global config (`exit`)',
          promptMode: 'config-if',
          accepted: [/^ex(it)?$/i],
          nextMode: 'config',
          output: '',
          chips: ['exit']
        },
        {
          hint: 'Create standard ACL 1 permitting 192.168.1.0 0.0.0.255',
          promptMode: 'config',
          accepted: [/^access-list\s+1\s+permit\s+192\.168\.1\.0\s+0\.0\.0\.255$/i],
          nextMode: 'config',
          output: '',
          chips: ['access-list 1 permit 192.168.1.0 0.0.0.255']
        },
        {
          hint: 'Enable PAT overload on Gi0/1 using ACL 1',
          promptMode: 'config',
          accepted: [/^ip\s+nat\s+inside\s+source\s+list\s+1\s+int(erface)?\s+g(i|igabitethernet)?\s*0\/1\s+overload$/i],
          nextMode: 'config',
          output: 'PAT translation active on EDGE-R1 (Gi0/0 -> Gi0/1).',
          chips: ['ip nat inside source list 1 interface Gi0/1 overload']
        }
      ]
    },
    {
      id: 'lab-ssh',
      domain: 'security',
      title: 'SSHv2 & VTY Hardening',
      device: 'Router',
      difficulty: 'Core',
      objective: 'Set hostname R1, domain ccna.lab, create local admin user, generate 2048-bit RSA keys, enable SSHv2, and lock VTY 0 4 to SSH only.',
      initialMode: 'config',
      steps: [
        {
          hint: 'Configure hostname R1',
          promptMode: 'config',
          accepted: [/^hostname\s+R1$/i],
          nextMode: 'config',
          output: '',
          chips: ['hostname R1'],
          renameDevice: 'R1'
        },
        {
          hint: 'Configure IP domain name ccna.lab',
          promptMode: 'config',
          accepted: [/^ip\s+domain[- ]name\s+ccna\.lab$/i],
          nextMode: 'config',
          output: '',
          chips: ['ip domain-name ccna.lab']
        },
        {
          hint: 'Create local user admin with secret Cisco123!',
          promptMode: 'config',
          accepted: [/^username\s+admin\s+secret\s+\S+$/i],
          nextMode: 'config',
          output: '',
          chips: ['username admin secret Cisco123!']
        },
        {
          hint: 'Generate 2048-bit RSA key pair',
          promptMode: 'config',
          accepted: [/^crypto\s+key\s+generate\s+rsa(\s+modulus\s+2048)?$/i],
          nextMode: 'config',
          output: '% The name for the keys will be: R1.ccna.lab\n% Generating 2048 bit RSA keys, keys will be non-exportable...\n[OK]',
          chips: ['crypto key generate rsa modulus 2048']
        },
        {
          hint: 'Enforce SSH version 2',
          promptMode: 'config',
          accepted: [/^ip\s+ssh\s+version\s+2$/i],
          nextMode: 'config',
          output: '',
          chips: ['ip ssh version 2']
        },
        {
          hint: 'Enter VTY lines 0 4',
          promptMode: 'config',
          accepted: [/^line\s+vty\s+0\s+4$/i],
          nextMode: 'config-line',
          output: '',
          chips: ['line vty 0 4']
        },
        {
          hint: 'Authenticate against local database (`login local`)',
          promptMode: 'config-line',
          accepted: [/^login\s+local$/i],
          nextMode: 'config-line',
          output: '',
          chips: ['login local']
        },
        {
          hint: 'Allow ONLY SSH inbound on VTY lines',
          promptMode: 'config-line',
          accepted: [/^transport\s+input\s+ssh$/i],
          nextMode: 'config-line',
          output: 'SSHv2 enabled on VTY 0 4; Telnet disabled.',
          chips: ['transport input ssh']
        }
      ]
    },
    // ================= PDF SIMULATION LABS (2026 Exam Set) =================
    {
      id: 'sim-1',
      domain: 'fundamentals',
      isPdfSim: true,
      title: 'PDF Sim 1: IPv4 & IPv6 Addressing',
      device: 'R1',
      difficulty: 'PDF Exam Sim',
      topology: './exhibits/sim-1-topo.jpg',
      objective: 'Assign first usable IPv4 (10.0.12.0/28) and IPv6 (2001:db8:12::/124) on R1 e0/0, last usable on R2 e0/0, and verify with ping.',
      initialMode: 'config',
      steps: [
        { hint: '[R1] Enter interface e0/0', promptMode: 'config', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/0$/i], nextMode: 'config-if', output: '', chips: ['interface e0/0'] },
        { hint: '[R1] Assign first usable IPv4 in 10.0.12.0/28', promptMode: 'config-if', accepted: [/^ip\s+add(ress)?\s+10\.0\.12\.1\s+255\.255\.255\.240$/i], nextMode: 'config-if', output: '', chips: ['ip address 10.0.12.1 255.255.255.240'] },
        { hint: '[R1] Assign first usable IPv6 in 2001:db8:12::/124', promptMode: 'config-if', accepted: [/^ipv6\s+add(ress)?\s+2001:db8:12::1\/124$/i], nextMode: 'config-if', output: '', chips: ['ipv6 address 2001:db8:12::1/124'] },
        { hint: '[R1] Enable e0/0 (`no shutdown`)', promptMode: 'config-if', accepted: [/^no\s+sh(utdown)?$/i], nextMode: 'config', output: '%LINK-3-UPDOWN: Interface Ethernet0/0, changed state to up', chips: ['no shutdown'], renameDevice: 'R2' },
        { hint: '[R2] Enter interface e0/0', promptMode: 'config', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/0$/i], nextMode: 'config-if', output: '', chips: ['interface e0/0'] },
        { hint: '[R2] Assign last usable IPv4 in 10.0.12.0/28', promptMode: 'config-if', accepted: [/^ip\s+add(ress)?\s+10\.0\.12\.14\s+255\.255\.255\.240$/i], nextMode: 'config-if', output: '', chips: ['ip address 10.0.12.14 255.255.255.240'] },
        { hint: '[R2] Assign last usable IPv6 (2001:db8:12::e/124)', promptMode: 'config-if', accepted: [/^ipv6\s+add(ress)?\s+2001:db8:12::e\/124$/i], nextMode: 'config-if', output: '', chips: ['ipv6 address 2001:db8:12::e/124'] },
        { hint: '[R2] Enable e0/0 and verify connectivity', promptMode: 'config-if', accepted: [/^no\s+sh(utdown)?$/i], nextMode: 'priv', output: '%LINK-3-UPDOWN: Interface Ethernet0/0, changed state to up', chips: ['no shutdown'] },
        { hint: '[R2] Ping R1 IPv4 (10.0.12.1)', promptMode: 'priv', accepted: [/^ping\s+10\.0\.12\.1$/i], nextMode: 'priv', output: 'Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/1 ms', chips: ['ping 10.0.12.1'] }
      ]
    },
    {
      id: 'sim-1a',
      domain: 'fundamentals',
      isPdfSim: true,
      title: 'PDF Sim 1A: IPv4 /29 & IPv6 /126',
      device: 'R1',
      difficulty: 'PDF Exam Sim',
      topology: './exhibits/sim-1a-topo.jpg',
      objective: 'Configure e0/2 on R1 (first usable) and R2 (last usable) for 10.12.18.24/29 and 2001:db8:12::c/126.',
      initialMode: 'config',
      steps: [
        { hint: '[R1] Enter interface e0/2', promptMode: 'config', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/2$/i], nextMode: 'config-if', output: '', chips: ['interface e0/2'] },
        { hint: '[R1] Assign first usable IPv4 (.25/29)', promptMode: 'config-if', accepted: [/^ip\s+add(ress)?\s+10\.12\.18\.25\s+255\.255\.255\.248$/i], nextMode: 'config-if', output: '', chips: ['ip address 10.12.18.25 255.255.255.248'] },
        { hint: '[R1] Assign first usable IPv6 (2001:db8:12::d/126)', promptMode: 'config-if', accepted: [/^ipv6\s+add(ress)?\s+2001:db8:12::d\/126$/i], nextMode: 'config-if', output: '', chips: ['ipv6 address 2001:db8:12::d/126'] },
        { hint: '[R1] Enable e0/2 (`no shutdown`)', promptMode: 'config-if', accepted: [/^no\s+sh(utdown)?$/i], nextMode: 'config', output: '%LINK-3-UPDOWN: Ethernet0/2 up', chips: ['no shutdown'], renameDevice: 'R2' },
        { hint: '[R2] Enter interface e0/2', promptMode: 'config', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/2$/i], nextMode: 'config-if', output: '', chips: ['interface e0/2'] },
        { hint: '[R2] Assign last usable IPv4 (.30/29)', promptMode: 'config-if', accepted: [/^ip\s+add(ress)?\s+10\.12\.18\.30\s+255\.255\.255\.248$/i], nextMode: 'config-if', output: '', chips: ['ip address 10.12.18.30 255.255.255.248'] },
        { hint: '[R2] Assign last usable IPv6 (2001:db8:12::e/126)', promptMode: 'config-if', accepted: [/^ipv6\s+add(ress)?\s+2001:db8:12::e\/126$/i], nextMode: 'config-if', output: '', chips: ['ipv6 address 2001:db8:12::e/126'] },
        { hint: '[R2] Enable e0/2', promptMode: 'config-if', accepted: [/^no\s+sh(utdown)?$/i], nextMode: 'priv', output: 'R1 <-> R2 IPv4/IPv6 e0/2 link verified up.', chips: ['no shutdown'] }
      ]
    },
    {
      id: 'sim-1b',
      domain: 'fundamentals',
      isPdfSim: true,
      title: 'PDF Sim 1B: Dual-Stack /29 & /126',
      device: 'R1',
      difficulty: 'PDF Exam Sim',
      topology: './exhibits/sim-1b-topo.jpg',
      objective: 'Assign first usable IPv4 (172.16.12.32/29) and IPv6 (2001:db8:12::34/126) on R1 e0/0 and last usable on R2 e0/0.',
      initialMode: 'config',
      steps: [
        { hint: '[R1] Enter interface e0/0', promptMode: 'config', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/0$/i], nextMode: 'config-if', output: '', chips: ['interface e0/0'] },
        { hint: '[R1] Assign first usable IPv4 (.33/29)', promptMode: 'config-if', accepted: [/^ip\s+add(ress)?\s+172\.16\.(12|16)\.33\s+255\.255\.255\.248$/i], nextMode: 'config-if', output: '', chips: ['ip address 172.16.12.33 255.255.255.248'] },
        { hint: '[R1] Assign first usable IPv6 (2001:db8:12::35/126)', promptMode: 'config-if', accepted: [/^ipv6\s+add(ress)?\s+2001:db8:12::35\/126$/i], nextMode: 'config-if', output: '', chips: ['ipv6 address 2001:db8:12::35/126'] },
        { hint: '[R1] Enable interface (`no shutdown`)', promptMode: 'config-if', accepted: [/^no\s+sh(utdown)?$/i], nextMode: 'config', output: '%LINK-3-UPDOWN: Ethernet0/0 up', chips: ['no shutdown'], renameDevice: 'R2' },
        { hint: '[R2] Enter interface e0/0', promptMode: 'config', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/0$/i], nextMode: 'config-if', output: '', chips: ['interface e0/0'] },
        { hint: '[R2] Assign last usable IPv4 (.38/29)', promptMode: 'config-if', accepted: [/^ip\s+add(ress)?\s+172\.16\.(12|16)\.38\s+255\.255\.255\.248$/i], nextMode: 'config-if', output: '', chips: ['ip address 172.16.12.38 255.255.255.248'] },
        { hint: '[R2] Assign last usable IPv6 (2001:db8:12::36/126)', promptMode: 'config-if', accepted: [/^ipv6\s+add(ress)?\s+2001:db8:12::36\/126$/i], nextMode: 'config-if', output: '', chips: ['ipv6 address 2001:db8:12::36/126'] },
        { hint: '[R2] Enable interface (`no shutdown`)', promptMode: 'config-if', accepted: [/^no\s+sh(utdown)?$/i], nextMode: 'priv', output: 'Dual-stack /29 & /126 peering verified.', chips: ['no shutdown'] }
      ]
    },
    {
      id: 'sim-2',
      domain: 'connectivity',
      isPdfSim: true,
      title: 'PDF Sim 2: OSPF & DR Election (R2)',
      device: 'R2',
      difficulty: 'PDF Exam Sim',
      topology: './exhibits/sim-2-topo.jpg',
      objective: 'Configure OSPF process 10 on R2 with router-id 10.2.2.2, advertise 10.0.23.0/28 and 10.0.12.0/30 in Area 0, and force R2 as DR.',
      initialMode: 'config',
      steps: [
        { hint: 'Start OSPF process 10', promptMode: 'config', accepted: [/^router\s+ospf\s+10$/i], nextMode: 'config-router', output: '', chips: ['router ospf 10'] },
        { hint: 'Set OSPF router-id to Loopback0 (10.2.2.2)', promptMode: 'config-router', accepted: [/^router-id\s+10\.2\.2\.2$/i], nextMode: 'config-router', output: '', chips: ['router-id 10.2.2.2'] },
        { hint: 'Advertise 10.0.23.0/28 in Area 0', promptMode: 'config-router', accepted: [/^network\s+10\.0\.23\.0\s+0\.0\.0\.15\s+area\s+0$/i], nextMode: 'config-router', output: '', chips: ['network 10.0.23.0 0.0.0.15 area 0'] },
        { hint: 'Advertise 10.0.12.0/30 in Area 0', promptMode: 'config-router', accepted: [/^network\s+10\.0\.12\.0\s+0\.0\.0\.3\s+area\s+0$/i], nextMode: 'config-router', output: '', chips: ['network 10.0.12.0 0.0.0.3 area 0'] },
        { hint: 'Select interface e0/0 to set DR priority', promptMode: 'config-router', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/0$/i], nextMode: 'config-if', output: '', chips: ['interface e0/0'] },
        { hint: 'Set OSPF priority 255 on e0/0', promptMode: 'config-if', accepted: [/^ip\s+ospf\s+priority\s+255$/i], nextMode: 'config-if', output: '', chips: ['ip ospf priority 255'] },
        { hint: 'Select interface e0/1', promptMode: 'config-if', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/1$/i], nextMode: 'config-if', output: '', chips: ['interface e0/1'] },
        { hint: 'Set OSPF priority 255 on e0/1', promptMode: 'config-if', accepted: [/^ip\s+ospf\s+priority\s+255$/i], nextMode: 'config-if', output: '%OSPF-5-ADJCHG: Process 10, R2 elected DR on e0/0 and e0/1.', chips: ['ip ospf priority 255'] }
      ]
    },
    {
      id: 'sim-2a',
      domain: 'connectivity',
      isPdfSim: true,
      title: 'PDF Sim 2A: Interface OSPF & DR (R1)',
      device: 'R1',
      difficulty: 'PDF Exam Sim',
      topology: './exhibits/sim-2a-topo.jpg',
      objective: 'Configure OSPF process 30 on R1 using e0/0 IP (10.0.12.1) as router-id, enable OSPF directly on e0/0 & e0/1, and force R1 as DR.',
      initialMode: 'config',
      steps: [
        { hint: 'Start OSPF process 30', promptMode: 'config', accepted: [/^router\s+ospf\s+30$/i], nextMode: 'config-router', output: '', chips: ['router ospf 30'] },
        { hint: 'Set router-id to e0/0 IP (10.0.12.1)', promptMode: 'config-router', accepted: [/^router-id\s+10\.0\.12\.1$/i], nextMode: 'config-router', output: '', chips: ['router-id 10.0.12.1'] },
        { hint: 'Enter interface e0/0', promptMode: 'config-router', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/0$/i], nextMode: 'config-if', output: '', chips: ['interface e0/0'] },
        { hint: 'Enable OSPF process 30 Area 0 on e0/0', promptMode: 'config-if', accepted: [/^ip\s+ospf\s+30\s+area\s+0$/i], nextMode: 'config-if', output: '', chips: ['ip ospf 30 area 0'] },
        { hint: 'Set OSPF priority 255 on e0/0', promptMode: 'config-if', accepted: [/^ip\s+ospf\s+priority\s+255$/i], nextMode: 'config-if', output: '', chips: ['ip ospf priority 255'] },
        { hint: 'Enter interface e0/1', promptMode: 'config-if', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/1$/i], nextMode: 'config-if', output: '', chips: ['interface e0/1'] },
        { hint: 'Enable OSPF process 30 Area 0 on e0/1', promptMode: 'config-if', accepted: [/^ip\s+ospf\s+30\s+area\s+0$/i], nextMode: 'config-if', output: '', chips: ['ip ospf 30 area 0'] },
        { hint: 'Set OSPF priority 255 on e0/1', promptMode: 'config-if', accepted: [/^ip\s+ospf\s+priority\s+255$/i], nextMode: 'config-if', output: '%OSPF-5-ADJCHG: Process 30, R1 elected DR with R2 and R3.', chips: ['ip ospf priority 255'] }
      ]
    },
    {
      id: 'sim-3',
      domain: 'access',
      isPdfSim: true,
      title: 'PDF Sim 3: Data/Voice VLANs & LLDP',
      device: 'SW1',
      difficulty: 'PDF Exam Sim',
      topology: './exhibits/sim-3-topo.jpg',
      objective: 'Create Data/Voice VLANs (77, 88, 177, 188), assign access & voice VLANs on SW1 ports e0/1-3, and enable LLDP.',
      initialMode: 'config',
      steps: [
        { hint: 'Create VLAN 77 and name it IT_User_VLAN', promptMode: 'config', accepted: [/^vlan\s+77$/i], nextMode: 'config-vlan', output: '', chips: ['vlan 77'] },
        { hint: 'Name VLAN 77 as IT_User_VLAN', promptMode: 'config-vlan', accepted: [/^name\s+IT_User_VLAN$/i], nextMode: 'config-vlan', output: '', chips: ['name IT_User_VLAN'] },
        { hint: 'Create Voice VLAN 177', promptMode: 'config-vlan', accepted: [/^vlan\s+177$/i], nextMode: 'config-vlan', output: '', chips: ['vlan 177'] },
        { hint: 'Name VLAN 177 as IT_Voice_VLAN', promptMode: 'config-vlan', accepted: [/^name\s+IT_Voice_VLAN$/i], nextMode: 'config-vlan', output: '', chips: ['name IT_Voice_VLAN'] },
        { hint: 'Configure interface range e0/1-2', promptMode: 'config-vlan', accepted: [/^int(erface)?\s+range\s+e(thernet)?\s*0\/1\s*-\s*2$/i], nextMode: 'config-if-range', output: '', chips: ['interface range e0/1-2'] },
        { hint: 'Set access mode on e0/1-2', promptMode: 'config-if-range', accepted: [/^sw(itchport)?\s+mo(de)?\s+acc(ess)?$/i], nextMode: 'config-if-range', output: '', chips: ['switchport mode access'] },
        { hint: 'Assign Data VLAN 77 to e0/1-2', promptMode: 'config-if-range', accepted: [/^sw(itchport)?\s+acc(ess)?\s+vlan\s+77$/i], nextMode: 'config-if-range', output: '', chips: ['switchport access vlan 77'] },
        { hint: 'Assign Voice VLAN 177 to e0/1-2', promptMode: 'config-if-range', accepted: [/^sw(itchport)?\s+voice\s+vlan\s+177$/i], nextMode: 'config-if-range', output: '', chips: ['switchport voice vlan 177'] },
        { hint: 'Return to global config and enable LLDP (`exit` then `lldp run`)', promptMode: 'config-if-range', accepted: [/^ex(it)?$/i], nextMode: 'config', output: '', chips: ['exit'] },
        { hint: 'Enable LLDP globally', promptMode: 'config', accepted: [/^lldp\s+run$/i], nextMode: 'config', output: 'LLDP enabled globally on SW1; Data & Voice VLANs applied.', chips: ['lldp run'] }
      ]
    },
    {
      id: 'sim-3a',
      domain: 'access',
      isPdfSim: true,
      title: 'PDF Sim 3A: VLAN 15/66 & LLDP',
      device: 'SW-1',
      difficulty: 'PDF Exam Sim',
      topology: './exhibits/sim-3a-topo.jpg',
      objective: 'Configure SW-1 VLAN 15 (OPS) on e0/1, SW-2 VLAN 66 (ENGINEERING) on e0/1, and enable LLDP on both switches.',
      initialMode: 'config',
      steps: [
        { hint: '[SW-1] Create VLAN 15', promptMode: 'config', accepted: [/^vlan\s+15$/i], nextMode: 'config-vlan', output: '', chips: ['vlan 15'] },
        { hint: '[SW-1] Name VLAN 15 as OPS', promptMode: 'config-vlan', accepted: [/^name\s+OPS$/], nextMode: 'config-vlan', output: '', chips: ['name OPS'] },
        { hint: '[SW-1] Select e0/1 (PC1 port)', promptMode: 'config-vlan', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/1$/i], nextMode: 'config-if', output: '', chips: ['interface e0/1'] },
        { hint: '[SW-1] Set access mode & VLAN 15 (`switchport mode access`)', promptMode: 'config-if', accepted: [/^sw(itchport)?\s+mo(de)?\s+acc(ess)?$/i], nextMode: 'config-if', output: '', chips: ['switchport mode access'] },
        { hint: '[SW-1] Assign VLAN 15 to e0/1', promptMode: 'config-if', accepted: [/^sw(itchport)?\s+acc(ess)?\s+vlan\s+15$/i], nextMode: 'config-if', output: '', chips: ['switchport access vlan 15'] },
        { hint: '[SW-1] Enable LLDP globally (`lldp run`)', promptMode: 'config-if', accepted: [/^lldp\s+run$/i], nextMode: 'config', output: 'SW-1 configured.', chips: ['lldp run'], renameDevice: 'SW-2' },
        { hint: '[SW-2] Create VLAN 66', promptMode: 'config', accepted: [/^vlan\s+66$/i], nextMode: 'config-vlan', output: '', chips: ['vlan 66'] },
        { hint: '[SW-2] Name VLAN 66 as ENGINEERING', promptMode: 'config-vlan', accepted: [/^name\s+ENGINEERING$/], nextMode: 'config-vlan', output: '', chips: ['name ENGINEERING'] },
        { hint: '[SW-2] Select e0/1 and set VLAN 66 (`int e0/1`)', promptMode: 'config-vlan', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/1$/i], nextMode: 'config-if', output: '', chips: ['interface e0/1'] },
        { hint: '[SW-2] Assign access VLAN 66', promptMode: 'config-if', accepted: [/^sw(itchport)?\s+acc(ess)?\s+vlan\s+66$/i], nextMode: 'config-if', output: '', chips: ['switchport access vlan 66'] },
        { hint: '[SW-2] Enable LLDP globally (`lldp run`)', promptMode: 'config-if', accepted: [/^lldp\s+run$/i], nextMode: 'config', output: 'SW-1 & SW-2 VLANs and LLDP verified.', chips: ['lldp run'] }
      ]
    },
    {
      id: 'sim-3b',
      domain: 'access',
      isPdfSim: true,
      title: 'PDF Sim 3B: VLANs & Per-Port LLDP',
      device: 'SW1',
      difficulty: 'PDF Exam Sim',
      topology: './exhibits/sim-3b-topo.jpg',
      objective: 'Create VLAN 35 SALES on SW1 (e0/2), VLAN 39 MARKETING on SW2 (e0/2), enable LLDP globally, and disable LLDP TX/RX on PC1 port e0/2.',
      initialMode: 'config',
      steps: [
        { hint: '[SW1] Create VLAN 35 and name SALES', promptMode: 'config', accepted: [/^vlan\s+35$/i], nextMode: 'config-vlan', output: '', chips: ['vlan 35'] },
        { hint: '[SW1] Name VLAN 35 as SALES', promptMode: 'config-vlan', accepted: [/^name\s+SALES$/], nextMode: 'config-vlan', output: '', chips: ['name SALES'] },
        { hint: '[SW1] Enter e0/2 (PC1 port)', promptMode: 'config-vlan', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/2$/i], nextMode: 'config-if', output: '', chips: ['interface e0/2'] },
        { hint: '[SW1] Set access mode & VLAN 35 (`switchport access vlan 35`)', promptMode: 'config-if', accepted: [/^sw(itchport)?\s+acc(ess)?\s+vlan\s+35$/i], nextMode: 'config-if', output: '', chips: ['switchport access vlan 35'] },
        { hint: '[SW1] Disable LLDP transmit on e0/2', promptMode: 'config-if', accepted: [/^no\s+lldp\s+transmit$/i], nextMode: 'config-if', output: '', chips: ['no lldp transmit'] },
        { hint: '[SW1] Disable LLDP receive on e0/2', promptMode: 'config-if', accepted: [/^no\s+lldp\s+receive$/i], nextMode: 'config-if', output: '', chips: ['no lldp receive'] },
        { hint: '[SW1] Enable LLDP globally (`lldp run`)', promptMode: 'config-if', accepted: [/^lldp\s+run$/i], nextMode: 'config', output: 'LLDP active on SW1 uplinks, suppressed on PC1 port e0/2.', chips: ['lldp run'] }
      ]
    },
    {
      id: 'sim-4',
      domain: 'access',
      isPdfSim: true,
      title: 'PDF Sim 4: LACP EtherChannel 12 & Trunks',
      device: 'SW-1',
      difficulty: 'PDF Exam Sim',
      topology: './exhibits/sim-4-topo.jpg',
      objective: 'Configure e0/0-1 as 802.1Q trunks allowing VLANs 1,12,22, e0/2 allowing 12,22, and bundle e0/0-1 into LACP Port-Channel 12 (active).',
      initialMode: 'config',
      steps: [
        { hint: '[SW-1] Select range e0/0-1', promptMode: 'config', accepted: [/^int(erface)?\s+range\s+e(thernet)?\s*0\/0\s*-\s*1$/i], nextMode: 'config-if-range', output: '', chips: ['interface range e0/0-1'] },
        { hint: '[SW-1] Set 802.1Q encapsulation (`switchport trunk encapsulation dot1q`)', promptMode: 'config-if-range', accepted: [/^sw(itchport)?\s+tr(unk)?\s+enc(apsulation)?\s+dot1q$/i], nextMode: 'config-if-range', output: '', chips: ['switchport trunk encapsulation dot1q'] },
        { hint: '[SW-1] Set trunk mode (`switchport mode trunk`)', promptMode: 'config-if-range', accepted: [/^sw(itchport)?\s+mo(de)?\s+tr(unk)?$/i], nextMode: 'config-if-range', output: '', chips: ['switchport mode trunk'] },
        { hint: '[SW-1] Permit VLANs 1,12,22 on trunk', promptMode: 'config-if-range', accepted: [/^sw(itchport)?\s+tr(unk)?\s+allow(ed)?\s+vlan\s+1,12,22$/i], nextMode: 'config-if-range', output: '', chips: ['switchport trunk allowed vlan 1,12,22'] },
        { hint: '[SW-1] Bundle into LACP Port-Channel 12 (`channel-group 12 mode active`)', promptMode: 'config-if-range', accepted: [/^channel-group\s+12\s+mode\s+active$/i], nextMode: 'config-if-range', output: 'Creating a port-channel interface Port-channel 12', chips: ['channel-group 12 mode active'] },
        { hint: '[SW-1] Enter e0/2 and set trunk allowed VLANs 12,22 (`int e0/2`)', promptMode: 'config-if-range', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/2$/i], nextMode: 'config-if', output: '', chips: ['interface e0/2'] },
        { hint: '[SW-1] Permit VLANs 12,22 on e0/2', promptMode: 'config-if', accepted: [/^sw(itchport)?\s+tr(unk)?\s+allow(ed)?\s+vlan\s+12,22$/i], nextMode: 'config-if', output: 'Port-channel 12 (Po12 SU) and e0/2 trunk configured.', chips: ['switchport trunk allowed vlan 12,22'] }
      ]
    },
    {
      id: 'sim-4a',
      domain: 'access',
      isPdfSim: true,
      title: 'PDF Sim 4A: LACP Port-Channel 10',
      device: 'SW1',
      difficulty: 'PDF Exam Sim',
      topology: './exhibits/sim-4a-topo.jpg',
      objective: 'Configure e0/0-1 trunks on SW1 & SW2 allowing VLANs 10,30 and create LACP Port-Channel 10 (both active).',
      initialMode: 'config',
      steps: [
        { hint: '[SW1] Select range e0/0-1', promptMode: 'config', accepted: [/^int(erface)?\s+range\s+e(thernet)?\s*0\/0\s*-\s*1$/i], nextMode: 'config-if-range', output: '', chips: ['interface range e0/0-1'] },
        { hint: '[SW1] Configure dot1q trunk mode', promptMode: 'config-if-range', accepted: [/^sw(itchport)?\s+mo(de)?\s+tr(unk)?$/i], nextMode: 'config-if-range', output: '', chips: ['switchport mode trunk'] },
        { hint: '[SW1] Permit VLANs 10,30', promptMode: 'config-if-range', accepted: [/^sw(itchport)?\s+tr(unk)?\s+allow(ed)?\s+vlan\s+10,30$/i], nextMode: 'config-if-range', output: '', chips: ['switchport trunk allowed vlan 10,30'] },
        { hint: '[SW1] Create LACP Port-Channel 10 (`channel-group 10 mode active`)', promptMode: 'config-if-range', accepted: [/^channel-group\s+10\s+mode\s+active$/i], nextMode: 'config', output: 'Creating Port-channel 10', chips: ['channel-group 10 mode active'], renameDevice: 'SW2' },
        { hint: '[SW2] Select range e0/0-1', promptMode: 'config', accepted: [/^int(erface)?\s+range\s+e(thernet)?\s*0\/0\s*-\s*1$/i], nextMode: 'config-if-range', output: '', chips: ['interface range e0/0-1'] },
        { hint: '[SW2] Permit VLANs 10,30 on trunk', promptMode: 'config-if-range', accepted: [/^sw(itchport)?\s+tr(unk)?\s+allow(ed)?\s+vlan\s+10,30$/i], nextMode: 'config-if-range', output: '', chips: ['switchport trunk allowed vlan 10,30'] },
        { hint: '[SW2] Negotiate LACP Port-Channel 10 (`channel-group 10 mode active`)', promptMode: 'config-if-range', accepted: [/^channel-group\s+10\s+mode\s+active$/i], nextMode: 'config-if-range', output: 'Po10 active (SU) between SW1 and SW2.', chips: ['channel-group 10 mode active'] }
      ]
    },
    {
      id: 'sim-4b',
      domain: 'access',
      isPdfSim: true,
      title: 'PDF Sim 4B: Native VLAN 77 & LACP Po34',
      device: 'SW-1',
      difficulty: 'PDF Exam Sim',
      topology: './exhibits/sim-4b-topo.jpg',
      objective: 'Allow VLANs 5,6 on SW-1 e0/0, set native VLAN 77 on e0/1, allow VLAN 6 on SW-2 e0/2, and build LACP Po34 (SW-3 active, SW-4 passive).',
      initialMode: 'config',
      steps: [
        { hint: '[SW-1] Enter e0/0 and allow VLANs 5,6', promptMode: 'config', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/0$/i], nextMode: 'config-if', output: '', chips: ['interface e0/0'] },
        { hint: '[SW-1] Allow VLANs 5,6 on e0/0', promptMode: 'config-if', accepted: [/^sw(itchport)?\s+tr(unk)?\s+allow(ed)?\s+vlan\s+5,6$/i], nextMode: 'config-if', output: '', chips: ['switchport trunk allowed vlan 5,6'] },
        { hint: '[SW-1] Enter e0/1 and set native VLAN 77', promptMode: 'config-if', accepted: [/^int(erface)?\s+e(thernet)?\s*0\/1$/i], nextMode: 'config-if', output: '', chips: ['interface e0/1'] },
        { hint: '[SW-1] Set native VLAN 77 on e0/1', promptMode: 'config-if', accepted: [/^sw(itchport)?\s+tr(unk)?\s+nat(ive)?\s+vlan\s+77$/i], nextMode: 'config', output: '', chips: ['switchport trunk native vlan 77'], renameDevice: 'SW-3' },
        { hint: '[SW-3] Select range e0/0-1 to initiate LACP', promptMode: 'config', accepted: [/^int(erface)?\s+range\s+e(thernet)?\s*0\/0\s*-\s*1$/i], nextMode: 'config-if-range', output: '', chips: ['interface range e0/0-1'] },
        { hint: '[SW-3] Configure LACP active (`channel-group 34 mode active`)', promptMode: 'config-if-range', accepted: [/^channel-group\s+34\s+mode\s+active$/i], nextMode: 'config', output: '', chips: ['channel-group 34 mode active'], renameDevice: 'SW-4' },
        { hint: '[SW-4] Select range e0/0-1 (passive side)', promptMode: 'config', accepted: [/^int(erface)?\s+range\s+e(thernet)?\s*0\/0\s*-\s*1$/i], nextMode: 'config-if-range', output: '', chips: ['interface range e0/0-1'] },
        { hint: '[SW-4] Configure LACP passive (`channel-group 34 mode passive`)', promptMode: 'config-if-range', accepted: [/^channel-group\s+34\s+mode\s+passive$/i], nextMode: 'config-if-range', output: 'Po34 up (SU): SW-3 initiates LACP, SW-4 responds passively.', chips: ['channel-group 34 mode passive'] }
      ]
    },
    {
      id: 'sim-5',
      domain: 'connectivity',
      isPdfSim: true,
      title: 'PDF Sim 5: Static & Default Routes',
      device: 'DC',
      difficulty: 'PDF Exam Sim',
      topology: './exhibits/sim-5-topo.jpg',
      objective: 'Configure a default route on DC via ISP (209.165.201.1), a static route on Branch to 10.0.44.0/24 via HQ (10.0.24.1), and shortest-path default route via DC (10.0.22.1).',
      initialMode: 'config',
      steps: [
        { hint: '[DC] Configure default route to ISP (209.165.201.1 or e0/0)', promptMode: 'config', accepted: [/^ip\s+route\s+0\.0\.0\.0\s+0\.0\.0\.0\s+(209\.165\.201\.1|e(thernet)?0\/0)$/i], nextMode: 'priv', output: '', chips: ['ip route 0.0.0.0 0.0.0.0 209.165.201.1'] },
        { hint: '[DC] Verify Web Server reachability (`ping 209.165.202.129`)', promptMode: 'priv', accepted: [/^ping\s+209\.165\.202\.129$/i], nextMode: 'config', output: 'Success rate is 100 percent (5/5)', chips: ['ping 209.165.202.129'], renameDevice: 'Branch' },
        { hint: '[Branch] Route 10.0.44.0/24 via HQ (10.0.24.1 or e0/1)', promptMode: 'config', accepted: [/^ip\s+route\s+10\.0\.44\.0\s+255\.255\.255\.0\s+(10\.0\.24\.1|e(thernet)?0\/1)$/i], nextMode: 'config', output: '', chips: ['ip route 10.0.44.0 255.255.255.0 10.0.24.1'] },
        { hint: '[Branch] Configure shortest-hop default route via DC (10.0.22.1 or e0/0)', promptMode: 'config', accepted: [/^ip\s+route\s+0\.0\.0\.0\s+0\.0\.0\.0\s+(10\.0\.22\.1|e(thernet)?0\/0)$/i], nextMode: 'priv', output: '', chips: ['ip route 0.0.0.0 0.0.0.0 10.0.22.1'] },
        { hint: '[Branch] Verify Web Server reachability (`ping 209.165.202.129`)', promptMode: 'priv', accepted: [/^ping\s+209\.165\.202\.129$/i], nextMode: 'priv', output: 'Success rate is 100 percent (5/5) via 2-hop Branch -> DC -> ISP path.', chips: ['ping 209.165.202.129'] }
      ]
    },
    {
      id: 'sim-5a',
      domain: 'connectivity',
      isPdfSim: true,
      title: 'PDF Sim 5A: Floating Host Route',
      device: 'SJC',
      difficulty: 'PDF Exam Sim',
      topology: './exhibits/sim-5a-topo.jpg',
      objective: 'Configure SJC default route via ISP (209.165.201.2), and on SQL configure primary host route to PC (10.10.44.2/32) via 10.10.54.1 plus backup floating route via 10.10.10.1 with AD 5.',
      initialMode: 'config',
      steps: [
        { hint: '[SJC] Configure default route via ISP (209.165.201.2)', promptMode: 'config', accepted: [/^ip\s+route\s+0\.0\.0\.0\s+0\.0\.0\.0\s+(209\.165\.201\.2|e(thernet)?0\/0)$/i], nextMode: 'priv', output: '', chips: ['ip route 0.0.0.0 0.0.0.0 209.165.201.2'] },
        { hint: '[SJC] Ping Web Server (209.165.202.129)', promptMode: 'priv', accepted: [/^ping\s+209\.165\.202\.129$/i], nextMode: 'config', output: 'Success rate is 100 percent (5/5)', chips: ['ping 209.165.202.129'], renameDevice: 'SQL' },
        { hint: '[SQL] Primary host route to 10.10.44.2/32 via 10.10.54.1', promptMode: 'config', accepted: [/^ip\s+route\s+10\.10\.44\.2\s+255\.255\.255\.255\s+(10\.10\.54\.1|e(thernet)?0\/1)$/i], nextMode: 'config', output: '', chips: ['ip route 10.10.44.2 255.255.255.255 10.10.54.1'] },
        { hint: '[SQL] Backup floating host route via 10.10.10.1 with AD 5', promptMode: 'config', accepted: [/^ip\s+route\s+10\.10\.44\.2\s+255\.255\.255\.255\s+(10\.10\.10\.1|e(thernet)?0\/2)\s+[2-9]\d*$/i], nextMode: 'priv', output: '', chips: ['ip route 10.10.44.2 255.255.255.255 10.10.10.1 5'] },
        { hint: '[SQL] Verify reachability to PC (10.10.44.2)', promptMode: 'priv', accepted: [/^ping\s+10\.10\.44\.2$/i], nextMode: 'priv', output: 'Success rate is 100 percent (5/5). Primary AD=1 active; AD=5 standby.', chips: ['ping 10.10.44.2'] }
      ]
    }
  ];

  function getPrompt(device, mode) {
    switch (mode) {
      case 'user': return device + '>';
      case 'priv': return device + '#';
      case 'config': return device + '(config)#';
      case 'config-if': return device + '(config-if)#';
      case 'config-if-range': return device + '(config-if-range)#';
      case 'config-subif': return device + '(config-subif)#';
      case 'config-vlan': return device + '(config-vlan)#';
      case 'config-router': return device + '(config-router)#';
      case 'dhcp-config': return device + '(dhcp-config)#';
      case 'config-line': return device + '(config-line)#';
      default: return device + '#';
    }
  }

  global.CCNA_LABS = LABS;
  global.CCNALabHelpers = { getPrompt };
})(window);
