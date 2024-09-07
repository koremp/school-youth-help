import dynamic from "next/dynamic";
import { useMemo } from "react";

const HelpCenterLocationPage = async () => {
  const Map = useMemo(() => dynamic(
    () => import('@/app/components/Map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false,
    }
  ), []);

  return (
    <>
      <section className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-bold mt-20">지역 센터 알아보기</h1>
        <h2 className="text-2xl">Region Center</h2>
        <div className="bg-white-700 mx-auto my-5 w-[98%] h-[480px]">
          <Map posix={[4.79029, -75.69003]} />
        </div>
      </section>
    </>
  );
};

export default HelpCenterLocationPage;