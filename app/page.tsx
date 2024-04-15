export default function Home() {
  return <main className="bg-gray-300 h-screen flex items-center justify-center p-5 
    dark:bg-gray-700
      sm:bg-red-100
      md:bg-green-100
      lg:bg-blue-100
      xl:bg-orange-100      
      2xl:bg-purple-100
  ">
    <div
      className="flex flex-col md:flex-row gap-3 bg-white w-full shadow-lg p-5 rounded-2xl 
        max-w-screen-sm
    ">
      <div className="group flex flex-col w-full gap-4">
        <input className="bg-gray-100" />
        <span className="group-focus-within:block hidden">
          Make sure it is a valid email...
        </span>
        <a href="#">aaa</a>
        <button className="
          btn
          text-bigger-hello  
        ">Submit</button>
      </div>
      {/* {["Nico", "Me", "You", "Yourself", ""].map((person, index) => (
        <div key={index} className="flex items-center gap-5 group">          
          <div className="size-10 bg-blue-400 rounded-full" />
          <span className="text-lg font-medium
            group-hover:text-red-500
            empty:w-24 empty:h-5 empty:rounded-full empty:animate-pulse empty:bg-gray-300
          ">
            {person}
          </span>
          <div className="size-6
            bg-red-500 text-white flex items-center justify-center rounded-full relative
          ">
            <span className="z-10">{index}</span>
            <div className="size-6 bg-red-500 rounded-full absolute animate-ping" />
          </div>
        </div>
      ))} */}
    </div>
  </main>;
}
