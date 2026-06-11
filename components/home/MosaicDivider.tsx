export function MosaicDivider({ height = 96 }: { height?: number }) {
  return (
    <div className="w-full overflow-hidden" style={{ height, lineHeight: 0 }}>
      <svg
        viewBox="0 0 1200 96"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          {/* Gloss overlay — makes tiles look like glazed ceramics */}
          <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.10" />
          </linearGradient>
        </defs>

        {/* Grout background */}
        <rect width="1200" height="96" fill="#B8A898" />

        {/* ── Row 1 ── */}
        <polygon points="0,0 88,3 82,50 0,55"         fill="#003087" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="88,3 178,0 172,53 82,50"      fill="#FFDF00" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="178,0 268,4 262,50 172,53"    fill="#4ECDC4" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="268,4 358,1 352,54 262,50"    fill="#009C3B" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="358,1 448,3 442,51 352,54"    fill="#F8F6F0" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="448,3 545,0 539,53 442,51"    fill="#0047AB" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="545,0 635,4 629,50 539,53"    fill="#F4C842" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="635,4 725,1 719,54 629,50"    fill="#E07B5A" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="725,1 820,0 814,52 719,54"    fill="#2E8B57" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="820,0 910,3 904,50 814,52"    fill="#3498DB" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="910,3 1005,1 999,53 904,50"   fill="#9B59B6" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="1005,1 1095,4 1089,50 999,53" fill="#FFDF00" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="1095,4 1200,0 1200,55 1089,50" fill="#003087" stroke="#B8A898" strokeWidth="2"/>

        {/* ── Row 2 ── */}
        <polygon points="0,55 82,50 92,96 0,96"          fill="#F4C842" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="82,50 172,53 162,96 92,96"       fill="#F8F6F0" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="172,53 262,50 252,96 162,96"     fill="#003087" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="262,50 352,54 342,96 252,96"     fill="#4ECDC4" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="352,54 442,51 432,96 342,96"     fill="#E07B5A" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="442,51 539,53 529,96 432,96"     fill="#009C3B" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="539,53 629,50 619,96 529,96"     fill="#0047AB" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="629,50 719,54 709,96 619,96"     fill="#FFDF00" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="719,54 814,52 804,96 709,96"     fill="#002776" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="814,52 904,50 894,96 804,96"     fill="#1ABC9C" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="904,50 999,53 989,96 894,96"     fill="#F8F6F0" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="999,53 1089,50 1079,96 989,96"   fill="#E07B5A" stroke="#B8A898" strokeWidth="2"/>
        <polygon points="1089,50 1200,55 1200,96 1079,96" fill="#F4C842" stroke="#B8A898" strokeWidth="2"/>

        {/* Gloss layer over everything */}
        <rect width="1200" height="96" fill="url(#gloss)" />
      </svg>
    </div>
  )
}
