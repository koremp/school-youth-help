import fs from 'fs';
import path from 'path';

// centerData.json 파일 읽기
const centerDataPath = path.join(process.cwd(), 'public/locations', 'centerData.json');
const centerData = JSON.parse(fs.readFileSync(centerDataPath, 'utf-8'));

// 시설 유형 목록
const facilityTypes = [
  '청소년상담복지센터',
  '학교밖청소년지원센터',
  '청소년자립지원관',
  '청소년회복지원시설',
  '청소년쉼터',
];

// 각 시설 유형별로 데이터 분리 및 저장
facilityTypes.forEach(facilityType => {
  const facilityData = centerData[facilityType];

  if (facilityData) {
    const fileName = `${facilityType}.json`;
    const filePath = path.join(process.cwd(), 'public', 'locations', fileName);
    fs.writeFileSync(filePath, JSON.stringify(facilityData, null, 2));
    console.log(`${facilityType} 데이터가 ${fileName} 파일에 저장되었습니다.`);
  } else {
    console.log(`${facilityType}에 대한 데이터가 없습니다.`);
  }
});

console.log('모든 시설 데이터 분리 및 저장이 완료되었습니다.');
