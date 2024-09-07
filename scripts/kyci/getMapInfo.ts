import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { W } from 'vitest/dist/chunks/reporters.C_zwCd4j';

const CooperationURL = "https://www.kyci.or.kr/userSite/cooperation/list.asp?basicNum=1";
const dreamLocalManagementURL = "https://www.kyci.or.kr/userSite/dreamLocalManagement/list.asp?basicNum=1";
const localShelterURL = "https://www.kyci.or.kr/userSite/Local_Shelter/list.asp?basicNum=1";
// 아래 2개 URL의 매개변수가 바뀜
const localIndependenciesURL = "https://www.kyci.or.kr/userSite/Local_recovery/list.asp?basicNum=1";
const localRecoveryURL = "https://www.kyci.or.kr/userSite/Local_independencies/list.asp?basicNum=1";

// 17(시도) + 1(전국)
const STATE_COUNT = 18;

interface TotalInfo {
  name: string;
  totalCount: number;
  stateInfoList: StateInfo[];
}

interface StateInfo {
  stateName: string,
  centerCount: number;
  centerList: LocationInfo[];
}

interface LocationInfo {
  name: string;
  address: string;
  postNumber: string;
  phone: string;
  pax?: string;
  url: string;
}

const URL_LIST: Array<{ name: string, url: string, param: string }> = [
  { name: '청소년상담복지센터', url: CooperationURL, param: 'cooperation' },
  { name: '학교밖청소년지원센터', url: dreamLocalManagementURL, param: 'dreamLocalManagement' },
  { name: '청소년쉼터', url: localShelterURL, param: 'Local_Shelter' },
  { name: '청소년자립지원관', url: localIndependenciesURL, param: 'Local_recovery' },
  { name: '청소년회복지원시설', url: localRecoveryURL, param: 'Local_independencies' },
];

const getCenterListURL = ({ centerCategory, location }:{centerCategory: string, location: string}) => `https://www.kyci.or.kr/userSite/${centerCategory}/getList.asp?parmPage=&dcmIdx=&hcmIdx=&task=task&hcmHclcIdxi=${location}&_search=false&nd=1725723151519&rows=50&page=1&sidx=siteid&sord=desc`;

const getHTML = async (url: string) => {
  try {
    return await axios.get(url);
  } catch (e) {
    throw new Error(`failed to get html of ${url}`);
  }
};

const loadHTML = async (htmlData: string) => {
  return cheerio.load(htmlData);
};

const getImgStream = async (url: string) => {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  return response;
};

const saveInfoToJson = async (data: any, jsonPath: string) => {
  if (data) {
    fs.writeFileSync(jsonPath, JSON.stringify(data));
    console.log('saved album details to json', jsonPath);
  }
};

const getStatesInfo = ($: cheerio.CheerioAPI): Array<StateInfo> => {
  const statesInfo: Array<StateInfo> = [];

  const lists = $('li.clsId');

  lists.each((_, el) => {
    const stateString = $(el).text();
    const stateName = stateString.match(/(^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+)/g);
    const centerCount = stateString.match(/(\d+)/g);

    if (!stateName || !centerCount) {
      return;
    }

    statesInfo.push({
      stateName: stateName[0],
      centerCount: parseInt(centerCount[0]),
      centerList: [],
    });
  });

  return statesInfo;
};

const getCenterList = ($: cheerio.CheerioAPI): Array<LocationInfo> => {
  const centerList: Array<LocationInfo> = [];

  const lists = $('tr');
  console.log(lists.html());

  lists.each((_, el) => {
    // const centerInfo = $(el).text();
  });

  return [];
};

const main = async () => {
  [...URL_LIST].map(async ({ name, url, param }: { name: string, url: string, param: string }) => {
    const html = await getHTML(url);
    const $ = await loadHTML(html.data);
    const statesInfo = getStatesInfo($);

    statesInfo.forEach(async (stateInfo, idx) => {
      const { stateName, centerCount } = stateInfo;
      const centerListHTML = await getHTML(getCenterListURL({ centerCategory: param, location: '2'/*idx.toString()*/ }));
      const centerListText = centerListHTML.data.toString();
      JSON.parse(centerListText.replace(/^\}/g, '},'));
      // console.log(centerListText.text());
      // JSON.parse(centerListText.replace(/^\//g, ','));
      // console.log(JSON.parse(centerListHTML.data));

    });
  });
};

main();
