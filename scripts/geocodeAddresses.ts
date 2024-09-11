import fs from 'fs';
import path from 'path';
import axios from 'axios';

interface CenterInfo {
  siteid: number;
  sitename: string;
  siteurl: string;
  content: string;
  address?: string;
  lat?: number;
  lng?: number;
}

interface CenterData {
  [centerCategory: string]: {
    [state: string]: CenterInfo[];
  };
}

const placeSearchCB = (data: any, status: any, pagination: any) => {
  if (status === kakao.maps.services.Status.OK) {

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    const bounds = new kakao.maps.LatLngBounds();

    for (let i = 0; i < data.length; i++) {
      displayMarker(data[i]);
      bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
    }

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
  }
};

const places = new kakao.maps.services.Places();
const keywordSearch = (address: string) => places.keywordSearch(address);

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    places.keywordSearch(address);

    if (response.data.documents.length > 0) {
      const { x, y } = response.data.documents[0];
      return { lat: parseFloat(y), lng: parseFloat(x) };
    }
  } catch (error) {
    console.error(`Error geocoding address: ${address}`);
  }
  return null;
}

async function geocodeAllAddresses() {
  const filePath = path.join(process.cwd(), 'public', 'locations', 'centerData.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const centerData: CenterData = JSON.parse(fileContent);
  const { "청소년상담복지센터": { "전국": centerList } } = centerData;

  for (const center of centerList) {
    if (!center.lat || !center.lng) {
      // '주소 : ' 텍스트로 시작하고 BR 태그로 끝나는 주소를 추출하는 정규식
      const addressRegex = /주소\s*:\s*([^<]+)<br/i;
      const addressMatch = center.content.match(addressRegex);
      if (addressMatch === null) {
        continue;
      }

      const address = addressMatch[1].trim();
      setTimeout(() => {

      }, 1000);
      center.address = address;

      const coords = await geocodeAddress(address);
      console.log(address);
      if (coords) {
        center.lat = coords.lat;
        center.lng = coords.lng;
        console.log(`Geocoded: ${center.sitename} - ${center.content}`);
      } else {
        console.log(`Failed to geocode: ${center.sitename} - ${center.content}`);
      }
    }
  }

  // fs.writeFileSync(path.join(process.cwd(), 'public', 'locations', 'geoCenterData.json'), JSON.stringify(centerData, null, 2));
  // console.log(`Updated ${filePath} with geocoded coordinates`);
}

geocodeAllAddresses().then(() => console.log('Geocoding completed'));