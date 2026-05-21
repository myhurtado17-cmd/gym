import * as React from 'react';

export function LogoMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path
        d="M7.2 7.3c.9-1.2 2.3-2 3.9-2 2.6 0 4.7 2.1 4.7 4.7v.5c0 2.6-2.1 4.7-4.7 4.7-1.6 0-3-.8-3.9-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.2 12h3.1m5.4 0h3.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3.5 10.3V13.7M20.5 10.3V13.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
