import Link from "next/link";

const HomePage = () => {
  return (
    <section className="flex flex-col items-center gap-4">
      <h1 className="text-5xl font-bold mt-20">Korean Youth Support</h1>
      {/* 시간 되면 슬라이더 만들기 */}
      <div className="flex flex-col items-center gap-4">
        <Link href="/help-center-location" className="text-2xl">
            지역 센터 알아보기
        </Link>
        <Link href="/card-news" className="text-2xl">
          카드 뉴스 보기
        </Link>
      </div>
    </section>
  );
};

export default HomePage;