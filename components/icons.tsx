import { SVGProps } from "react"

export function FootprintIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 100 150"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {/* Detailed Circuit Footprint Path */}
            <g opacity="0.8">
                {/* Main sole */}
                <path d="M30 140c-15 0-25-10-25-30 0-30 10-60 20-80s20-30 25-30 15 10 25 30 20 50 20 80-10 30-25 30H30z" />

                {/* Internal circuit lines */}
                <path d="M20 110h60M25 90h50M30 70h40M38 50h24" opacity="0.5" />
                <path d="M50 30v110M35 50v80M65 50v80" opacity="0.5" />

                {/* Circles/Nodes */}
                <circle cx="50" cy="70" r="2" />
                <circle cx="35" cy="90" r="1.5" />
                <circle cx="65" cy="90" r="1.5" />
                <circle cx="25" cy="110" r="1.5" />
                <circle cx="75" cy="110" r="1.5" />
                <circle cx="50" cy="30" r="1" />

                {/* Toes (Circuit style) */}
                <circle cx="20" cy="20" r="5" />
                <circle cx="35" cy="10" r="6" />
                <circle cx="55" cy="10" r="6" />
                <circle cx="75" cy="15" r="5" />
                <circle cx="90" cy="25" r="4" />

                {/* Connecting toe lines */}
                <path d="M20 25v10M35 16v14M55 16v14M75 20v15M90 29v11" />
            </g>
        </svg>
    )
}

export function FingerprintIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M16.24 7.76a6 6 0 1 0 0 8.48" />
            <path d="M12 10a2 2 0 1 0 0 4" />
            <path d="M22 2L12 12" opacity="0.2" />
        </svg>
    )
}

