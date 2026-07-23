type PatternProps = { id: string; color?: 'blue' | 'navy'; className?: string }

export default function TechnicalPattern({ id, color = 'blue', className }: PatternProps) {
  const stroke = color === 'navy' ? '#0F172A' : '#3B5BDB'
  const dotFill = color === 'navy' ? '#0F172A' : '#3B5BDB'

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className ?? ''}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id={id} x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke={stroke} strokeWidth="0.5"/>
          <circle cx="0" cy="0" r="1.2" fill={dotFill}/>
          <line x1="12" y1="0" x2="12" y2="4" stroke={stroke} strokeWidth="0.5"/>
          <line x1="0" y1="12" x2="4" y2="12" stroke={stroke} strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity="0.055"/>
    </svg>
  )
}
