export default function Loading() {
  return (
    <div className='w-full min-h-screen pt-8 px-10 bg-[#18181a] flex items-center justify-center'>
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p className="text-white text-lg">Loading upload page...</p>
      </div>
    </div>
  );
}
