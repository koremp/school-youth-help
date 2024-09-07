import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

const CooperationURL = "https://www.kyci.or.kr/userSite/cooperation/list.asp?basicNum=1";
const dreamLocalManagementURL = "https://www.kyci.or.kr/userSite/dreamLocalManagement/list.asp?basicNum=1";
const localShelterURL = "https://www.kyci.or.kr/userSite/Local_Shelter/list.asp?basicNum=1";
// 아래 2개 URL의 매개변수가 바뀜
const localIndependenciesURL = "https://www.kyci.or.kr/userSite/Local_recovery/list.asp?basicNum=1";
const localRecoveryURL = "https://www.kyci.or.kr/userSite/Local_independencies/list.asp?basicNum=1";

const URL_LIST = [CooperationURL, dreamLocalManagementURL, localShelterURL, localIndependenciesURL, localRecoveryURL];

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

const getStateInfo = async ($: cheerio.CheerioAPI) => {
  const state = {
    name: undefined,
    count: undefined,
    centerList: [],
  };

  const states = Array.from({ length: 17 }, (_, i) => i + 1);

  const stateName = $('#btnLocal_1 > strong').text();

  const centers = $('#content > div > div.subContmap_listNew_wrap > ul');

  // centers.find(`li[id=clsId_${}]`);
};

const main = async () => {
  console.log('wstart');
  try {
    for (const url of URL_LIST) {
      const html = await getHTML(url);
      const $ = await loadHTML(html.data);

      $('tr[id]').each((_, tr) => {
        const states = Array.from({ length: 17 }, (_, i) => i + 1);
        console.log(states);
        console.log(tr);
      });
    }
  } catch (e) {
    console.error(e);
  }
};

console.log('start');
main();
