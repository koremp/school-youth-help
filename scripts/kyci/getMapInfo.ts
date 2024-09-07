import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { ClientRequest } from 'http';
import * as path from 'path';

const CooperationURL = "https://www.kyci.or.kr/userSite/cooperation/list.asp?basicNum=1";
const dreamLocalManagementURL = "https://www.kyci.or.kr/userSite/dreamLocalManagement/list.asp?basicNum=1";
const localShelterURL = "https://www.kyci.or.kr/userSite/Local_Shelter/list.asp?basicNum=1";
// 아래 2개 URL의 매개변수가 바뀜
const localIndependenciesURL = "https://www.kyci.or.kr/userSite/Local_recovery/list.asp?basicNum=1";
const localRecoveryURL = "https://www.kyci.or.kr/userSite/Local_independencies/list.asp?basicNum=1";

const URL_LIST: Array<{ name: string, url: string, param: string }> = [
  { name: '청소년상담복지센터', url: CooperationURL, param: 'cooperation' },
  { name: '학교밖청소년지원센터', url: dreamLocalManagementURL, param: 'dreamLocalManagement' },
  { name: '청소년쉼터', url: localShelterURL, param: 'Local_Shelter' },
  { name: '청소년자립지원관', url: localIndependenciesURL, param: 'Local_recovery' },
  { name: '청소년회복지원시설', url: localRecoveryURL, param: 'Local_independencies' },
];

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
}

// interface CooperationListResponse {
//   total: string;
//   page: string;
//   records: string;
//   rows: Array<Cooperation>;
// }

// interface Cooperation {
//   mid: number;
//   sid: number;
//   siteid: number;
//   siteurl: string;
//   sitename: string;
//   content: string;
// }

// interface CooperationStateInfo extends StateInfo {
//   centerList: Cooperation[];
// }

// interface dreamLocalManagementStateInfo extends StateInfo {
//   centerList: DreamLocalManagement[];
// }

// interface localShelterStateInfo extends StateInfo {
//   centerList: LocalShelter[];
// }

// interface localIndependenciesStateInfo extends StateInfo {
//   centerList: LocalIndependency[];
// }

// interface localRecoveryStateInfo extends StateInfo {
//   centerList: LocalRecovery[];
// }

// interface LocalShelterListResponse {
//   total: string;
//   page: string;
//   records: string;
//   rows: Array<localShelter>;
// }

// interface localShelter {
//   sitename: string;
//   siteurl: string;
//   content: string;
//   sid: string;
//   siteid: number;
// }

const getLocalShelterList = () => {

};


// 지역 센터 종류별 리스트 조회 URL
const getCenterListURL = ({ centerCategory, location }:{centerCategory: string, location: string}) => `https://www.kyci.or.kr/userSite/${centerCategory}/getList.asp?parmPage=&dcmIdx=&hcmIdx=&task=task&hcmHclcIdxi=${location}&_search=false&nd=1725723151519&rows=50&page=1&sidx=siteid&sord=desc`;

// get html
const getHTML = async (url: string) => {
  try {
    return await axios.get(url);
  } catch (e) {
    throw new Error(`failed to get html of ${url}`);
  }
};

// cheerio를 사용하여 htmlData를 파싱
const loadHTML = async (htmlData: string) => {
  return cheerio.load(htmlData);
};

// 지역 센터 종류별 리스트 조회 URL
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
      // centerList: [],
    });
  });

  return statesInfo;
};

const getCooperationCenterList = async ({ name, url, param }: {name: string, url: string, param: string}) => {
  const html = await getHTML(CooperationURL);
  const $ = await loadHTML(html.data);
  const statesInfo = getStatesInfo($);

  const response = await getHTML(getCenterListURL({ centerCategory: param, location: '1' }));
  console.log(response);
};

interface CenterData {
	[key: string]: {
		[key: string]: any[];
	};
}

const main = async () => {
  const centerData: CenterData = {};

  for (const { name, url, param } of URL_LIST) {
    const html = await getHTML(url);
    const $ = await loadHTML(html.data);
    const statesInfo = getStatesInfo($);

    centerData[name] = {};

    for (let idx = 0; idx < STATE_COUNT; idx++) {
      const response = await getHTML(getCenterListURL({ centerCategory: param, location: idx.toString() }));
      const data = response.data;

      if (data && data.rows) {
        const stateName = idx === 0 ? '전국' : statesInfo[idx - 1].stateName;
        centerData[name][stateName] = data.rows;
      }
    }
  }
  fs.writeFileSync('centerData.json', JSON.stringify(centerData, null, 2));
  console.log('데이터가 centerData.json 파일에 저장되었습니다.');
};

main().catch(console.error);

// const main = async () => {
// const statesInfoList = [...URL_LIST](({ name, url, param }): StateInfo[] => {
//   const html = await getHTML(url);
//   const $ = await loadHTML(html.data);
//   const statesInfo = getStatesInfo($);

//   statesInfoList.forEach((statesInfo) => {
//     Array.from({ length: STATE_COUNT }).forEach(async (_, idx) => {
//       const centerResponse = await getHTML(getCenterListURL({ centerCategory: param, location: idx.toString() }));
//       const centerResponse.data
//     });
//   });
// });
// };


// centerList :
// 1. 청소년상담복지센터
// 1.0 : 전국
// 1.1~ 1.17 : 시도
// statesInfoList[0].centerList;
// const cooperationCenterListResponse: AxiosResponse<CooperationListResponse> = await getHTML(getCenterListURL({ centerCategory: param, location: idx.toString() }));
// const cooperationCenterList = cooperationCenterListResponse;
// statesInfoList[0].centerList = cooperationCenterList;
// 2. 학교밖청소년지원센터
// 3. 청소년쉼터
// 4. 청소년자립지원관
// 5. 청소년회복지원시설


// Array.from({ length: STATE_COUNT }).forEach(async (_, idx) => {
//   const cooperationCenterListResponse: AxiosResponse<CooperationListResponse> = await getHTML(getCenterListURL({ centerCategory: param, location: idx.toString() }));
//   const dreamLocalManagementCenterListResponse: AxiosResponse<DreamLocalManagementListResponse> = await getHTML(getCenterListURL({ centerCategory: param, location: idx.toString() }));
//   const localShelterCenterListResponse: AxiosResponse<LocalShelterListResponse> = await getHTML(getCenterListURL({ centerCategory: param, location: idx.toString() }));
//   const localIndependenciesCenterListResponse: AxiosResponse<LocalIndependenciesListResponse> = await getHTML(getCenterListURL({ centerCategory: param, location: idx.toString() }));
//   const localRecoveryCenterListResponse: AxiosResponse<LocalRecoveryListResponse> = await getHTML(getCenterListURL({ centerCategory: param, location: idx.toString() }));
// });
// };

// main();

