// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-7 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-wrap justify-center gap-8">
          <Link href="/wenting" className="w-64 h-64 bg-blue-100 hover:bg-blue-200 transition-colors duration-300 rounded-lg shadow-md flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-xl font-bold mb-4">Wenting 对 德罗心</h2>
            <p className="text-sm text-gray-600">点击查看详细比较</p>
          </Link>
          <Link href="/herers" className="w-64 h-64 bg-green-100 hover:bg-green-200 transition-colors duration-300 rounded-lg shadow-md flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-xl font-bold mb-4">德罗心 对 赫芮斯</h2>
            <p className="text-sm text-gray-600">点击查看详细比较</p>
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}