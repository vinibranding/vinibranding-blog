export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="absolute inset-0 z-[9999] bg-white">
      {children}
    </div>
  )
}
