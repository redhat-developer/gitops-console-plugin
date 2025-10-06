import * as React from 'react';

export const OciIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className,
  style,
}) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 580 580"
    width="24px"
    height="24px"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <g>
        <g>
          <polygon
            fill="#808184"
            points="326.6,212.6 326.6,132.6 128.6,132.6 128.6,444.6 326.6,444.6 326.6,364.6 208.6,364.6 208.6,212.6"
          />
          <g>
            <rect x="366.5" y="132.6" fill="currentColor" width="79.9" height="79.9" />
            <rect x="366.5" y="252.6" fill="currentColor" width="79.9" height="192" />
          </g>
        </g>
        <path
          fill="currentColor"
          d="M8.5,9.5v558.2h558.2V9.5H8.5z M486.4,484.7H88.7V92.6h397.8V484.7z"
        />
      </g>
    </g>
  </svg>
);

export default OciIcon;
