export default function Home() {
  return <main className="bg-gray-300 h-screen flex items-center justify-center p-5 dark:bg-gray-700">
    <div className="bg-white w-full shadow-lg p-5 rounded-2xl max-w-screen-sm dark:bg-gray-600">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-gray-600 font-semibold -mb-1 dark:text-gray-300">In transit</span>
          <span className="text-4xl font-semibold dark:text-white">Cool Blue</span>
        </div>
        <div className="size-11 bg-orange-400 rounded-full" /> {/* photo */}
      </div>
      <div className="my-2 flex items-center gap-2">
        <span className="bg-green-500 text-white uppercase text-xs font-medium px-2.5 py-1.5 rounded-full hover:scale-110 transition-all">Today</span>
        <span className="dark:text-gray-100">9:30-10:30u</span>
      </div>
      <div className="relative"> {/* Loading bar */}
        <div className="bg-gray-200 rounded-full w-full h-2 absolute" />
        <div className="bg-green-400 rounded-full w-2/3 h-2 absolute" />
      </div>
      <div className="flex justify-between items-center mt-5 text-gray-600 dark:text-gray-100">
        <span>Expected</span>
        <span>Sorting Center</span>
        <span>In transit</span>
        <span className="text-gray-400 dark:text-gray-500">Delivered</span>
      </div>
    </div>
  </main>;
}
