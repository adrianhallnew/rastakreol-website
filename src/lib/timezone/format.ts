const SCT_TIMEZONE = 'Indian/Mahe'

export function formatSCT(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat('en-SC', {
    timeZone: SCT_TIMEZONE,
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  }).format(d)
}
