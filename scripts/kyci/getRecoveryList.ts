import fs from 'fs';
import path from 'path';
import { load } from 'cheerio';

interface CenterInfo {
  name: string;
  address: string;
}

interface CenterData {
  [region: string]: CenterInfo[];
}

const getRecoveryData = (html: string): CenterData => {
  const $ = load(html);
  const centerData: CenterData = {};

  $('.ui-jqgrid-btable tr.jqgrow').each((_, elem) => {
    const name = $(elem).find('td[aria-describedby="jqDataList_sitename"]').text().trim();
    const addressInfo = $(elem).find('td[aria-describedby="jqDataList_content"]').text().trim();
    const address = addressInfo.replace('주소 : ', '').trim();

    // 지역 추출 (첫 번째 공백 이전의 텍스트)
    const region = address.split(' ')[0];

    if (!centerData[region]) {
      centerData[region] = [];
    }

    centerData[region].push({ name, address });
  });

  return centerData;
};

const main = () => {
  // HTML 파일 읽기 (실제 환경에서는 이 부분을 API 호출 등으로 대체할 수 있습니다)
  const htmlPath = path.join(process.cwd(), 'recovery_centers.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  const recoveryData = getRecoveryData(html);

  const fileName = 'localRecoveryList.json';
  const filePath = path.join(process.cwd(), 'public', 'locations', fileName);
  fs.writeFileSync(filePath, JSON.stringify(recoveryData, null, 2));
  console.log(`청소년회복지원시설 데이터가 ${fileName} 파일에 저장되었습니다.`);
};

main();