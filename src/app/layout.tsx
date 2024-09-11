import Script from "next/script";
import "./globals.css";

export const API_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAOMAP_API_KEY}&libraries=services,clusterer&autoload=false`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <Script
        src={API_URL}
        strategy="beforeInteractive"
      />
      <body className="max-w-screen-md min-w-[320px] mx-auto">
        {children}
      </body>
    </html>
  );
}
