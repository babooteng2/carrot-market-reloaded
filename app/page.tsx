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
      <div className="flex flex-col w-full gap-4">
        <input className="          
          form-input
        " />
        <input type="date" name="" id="" className="form-input" />
        <select name="" id="" className="form-select">
          <option value="">Copporate event</option>
          <option value="">Wedding</option>
          <option value="">Birthday</option>
          <option value="">Other</option>
        </select>
        <textarea className="form-textarea" />
        <div>
          <label className="inline-flex items-center">
            <input type="checkbox" name="" id="" className="form-checkbox" />
            <span className="ml-2">Email me news and special offers</span>
          </label>
        </div>
        <button className="
          btn
          text-bigger-hello  
        ">Submit</button>
      </div>
    </div>
  </main>;
}
