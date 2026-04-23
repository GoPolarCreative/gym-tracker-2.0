type Props = { message: string; sub: string }

export function RestPanel({ message, sub }: Props) {
  return (
    <div className="text-center py-20">
      <h3 className="text-4xl font-extrabold tracking-widest uppercase text-white/20 mb-3">
        {message}
      </h3>
      <p className="text-white/50 text-sm font-medium">{sub}</p>
    </div>
  )
}
