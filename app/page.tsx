export default function Home() {
  return <main className="bg-gray-300 h-screen flex items-center justify-center p-5 dark:bg-gray-700">
    <div className="flex flex-col gap-2 bg-white w-full shadow-lg p-5 rounded-2xl max-w-screen-sm">
      <input className="w-full rounded-full pl-5 bg-gray-100 py-3 ring ring-transparent outline-none 
        focus:ring-orange-500
          focus:ring-offset-2
          transition-shadow          
        " type="text" placeholder="Search here..." />
      <button className="bg-black font-medium text-white py-2 rounded-full active:scale-95 transition-transform outline-none">Search</button>
    </div>
  </main>;
}
