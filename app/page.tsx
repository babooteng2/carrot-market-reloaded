export default function Home() {
  return <main className="bg-gray-300 h-screen flex items-center justify-center p-5 
    dark:bg-gray-700
      sm:bg-red-100
      md:bg-green-100
      lg:bg-blue-100
      xl:bg-orange-100      
      2xl:bg-purple-100
  ">
    <div className="flex flex-col md:flex-row gap-2 bg-white w-full shadow-lg p-5 rounded-2xl max-w-screen-sm">
      <input className="w-full rounded-full pl-5 bg-gray-100 py-3 ring ring-transparent outline-none 
        focus:ring-orange-500
          focus:ring-offset-2
          transition-shadow          
        " type="text" placeholder="Search here..." />
      <button className="bg-black font-medium text-white py-2 rounded-full active:scale-95 
        transition-transform outline-none
        md:px-10
      ">Search</button>
    </div>
  </main>;
}
