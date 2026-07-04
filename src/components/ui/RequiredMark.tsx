// `required` on the input already carries the programmatic semantics — this is the
// visual-only cue (audit finding: required fields had no sighted indicator, only AT users
// could tell via the attribute).
export function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-brand-error">
      {' '}
      *
    </span>
  )
}
