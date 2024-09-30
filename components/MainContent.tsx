import { MainContentProps } from "../interface/props";

export const MainContent: React.FC<MainContentProps> = ({ sanitizedHTML, title }) =>
{
    return (
      <div className="flex items-center h-screen w-full flex-col ">
        <div className="bg-black bg-opacity-80 px-6 pb-4 rounded-md space-x-4 h-[95%] overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar]:translate-x-1
   [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:bg-gray-800
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        <h1 className='text-center  text-2xl font-bold text-white'>{title}</h1>
                <div className="text-center text-white"
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
        </div>
      </div>
    );
  };