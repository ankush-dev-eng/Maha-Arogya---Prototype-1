import dynamic from 'next/dynamic';

const DynamicMap = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-500 rounded-lg animate-pulse">
        Loading Map...
      </div>
    )
  }
);

export type { MarkerData } from './MapComponent';
export default DynamicMap;

