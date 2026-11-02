import InfoSidebar from '@/components/layout/InfoSidebar'

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="max-w-7xl w-full mx-auto px-4 py-10 flex flex-col flex-1">
        <div className="flex gap-10 flex-1 min-h-0">
          <aside className="w-64 shrink-0">
            <InfoSidebar />
          </aside>
          <main className="flex-1 min-w-0 min-h-0 flex flex-col">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
