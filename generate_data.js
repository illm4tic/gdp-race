
import fs from 'fs';
import https from 'https';

const countryMapping = {
  "USA": { "iso2": "us", "name_cn": "美国", "color": "#B22234" },
  "CHN": { "iso2": "cn", "name_cn": "中国", "color": "#EE1C25" },
  "JPN": { "iso2": "jp", "name_cn": "日本", "color": "#BC002D" },
  "DEU": { "iso2": "de", "name_cn": "德国", "color": "#FFCE00" },
  "IND": { "iso2": "in", "name_cn": "印度", "color": "#FF9933" },
  "GBR": { "iso2": "gb", "name_cn": "英国", "color": "#012169" },
  "FRA": { "iso2": "fr", "name_cn": "法国", "color": "#00209F" },
  "ITA": { "iso2": "it", "name_cn": "意大利", "color": "#008C45" },
  "BRA": { "iso2": "br", "name_cn": "巴西", "color": "#009739" },
  "CAN": { "iso2": "ca", "name_cn": "加拿大", "color": "#FF0000" },
  "RUS": { "iso2": "ru", "name_cn": "俄罗斯", "color": "#0039A6" },
  "KOR": { "iso2": "kr", "name_cn": "韩国", "color": "#000000" },
  "AUS": { "iso2": "au", "name_cn": "澳大利亚", "color": "#00008B" },
  "ESP": { "iso2": "es", "name_cn": "西班牙", "color": "#FABD00" },
  "MEX": { "iso2": "mx", "name_cn": "墨西哥", "color": "#006847" },
  "IDN": { "iso2": "id", "name_cn": "印尼", "color": "#FF0000" },
  "NLD": { "iso2": "nl", "name_cn": "荷兰", "color": "#AE1C28" },
  "SAU": { "iso2": "sa", "name_cn": "沙特", "color": "#006C35" },
  "TUR": { "iso2": "tr", "name_cn": "土耳其", "color": "#E30A17" },
  "CHE": { "iso2": "ch", "name_cn": "瑞士", "color": "#FF0000" },
  "POL": { "iso2": "pl", "name_cn": "波兰", "color": "#DC143C" },
  "ARG": { "iso2": "ar", "name_cn": "阿根廷", "color": "#74ACDF" },
  "SWE": { "iso2": "se", "name_cn": "瑞典", "color": "#006AA7" },
  "BEL": { "iso2": "be", "name_cn": "比利时", "color": "#000000" },
  "THA": { "iso2": "th", "name_cn": "泰国", "color": "#2D2A4A" },
  "AUT": { "iso2": "at", "name_cn": "奥地利", "color": "#ED2939" },
  "IRN": { "iso2": "ir", "name_cn": "伊朗", "color": "#239f40" },
  "NOR": { "iso2": "no", "name_cn": "挪威", "color": "#BA0C2F" },
  "ARE": { "iso2": "ae", "name_cn": "阿联酋", "color": "#FF0000" },
  "NGA": { "iso2": "ng", "name_cn": "尼日利亚", "color": "#008751" },
  "EGY": { "iso2": "eg", "name_cn": "埃及", "color": "#C8102E" },
  "ZAF": { "iso2": "za", "name_cn": "南非", "color": "#007A4D" },
  "PHL": { "iso2": "ph", "name_cn": "菲律宾", "color": "#0038A8" },
  "SGP": { "iso2": "sg", "name_cn": "新加坡", "color": "#ED2939" },
  "MYS": { "iso2": "my", "name_cn": "马来西亚", "color": "#010066" },
  "DNK": { "iso2": "dk", "name_cn": "丹麦", "color": "#C60C30" },
  "COL": { "iso2": "co", "name_cn": "哥伦比亚", "color": "#FCD116" },
  "CHL": { "iso2": "cl", "name_cn": "智利", "color": "#0039A6" },
  "FIN": { "iso2": "fi", "name_cn": "芬兰", "color": "#003580" },
  "GRC": { "iso2": "gr", "name_cn": "希腊", "color": "#005BAE" },
  "PRT": { "iso2": "pt", "name_cn": "葡萄牙", "color": "#FF0000" },
  "CZE": { "iso2": "cz", "name_cn": "捷克", "color": "#11457E" },
  "ROU": { "iso2": "ro", "name_cn": "罗马尼亚", "color": "#002B7F" },
  "NZL": { "iso2": "nz", "name_cn": "新西兰", "color": "#00247D" },
  "VEN": { "iso2": "ve", "name_cn": "委内瑞拉", "color": "#FFCC00" },
  "IRQ": { "iso2": "iq", "name_cn": "伊拉克", "color": "#FF0000" },
  "KAZ": { "iso2": "kz", "name_cn": "哈萨克斯坦", "color": "#00AFCA" },
  "DZA": { "iso2": "dz", "name_cn": "阿尔及利亚", "color": "#006233" },
  "QAT": { "iso2": "qa", "name_cn": "卡塔尔", "color": "#8D1B3D" },
  "ISR": { "iso2": "il", "name_cn": "以色列", "color": "#0038B8" },
  "KWT": { "iso2": "kw", "name_cn": "科威特", "color": "#000000" },
  "HUN": { "iso2": "hu", "name_cn": "匈牙利", "color": "#436F4D" },
  "UKR": { "iso2": "ua", "name_cn": "乌克兰", "color": "#FFD700" },
  "MAR": { "iso2": "ma", "name_cn": "摩洛哥", "color": "#C1272D" },
  "ECU": { "iso2": "ec", "name_cn": "厄瓜多尔", "color": "#FFDD00" },
  "LUX": { "iso2": "lu", "name_cn": "卢森堡", "color": "#EA1423" },
  "OMN": { "iso2": "om", "name_cn": "阿曼", "color": "#EB192E" },
  "LBY": { "iso2": "ly", "name_cn": "利比亚", "color": "#239E46" },
  "PER": { "iso2": "pe", "name_cn": "秘鲁", "color": "#D91023" },
  "MMR": { "iso2": "mm", "name_cn": "缅甸", "color": "#FECB00" },
  "ETH": { "iso2": "et", "name_cn": "埃塞俄比亚", "color": "#078930" },
  "GHA": { "iso2": "gh", "name_cn": "加纳", "color": "#CF0921" },
  "KEN": { "iso2": "ke", "name_cn": "肯尼亚", "color": "#000000" },
  "CUB": { "iso2": "cu", "name_cn": "古巴", "color": "#CB1515" },
  "GTM": { "iso2": "gt", "name_cn": "危地马拉", "color": "#4997D0" },
  "PAN": { "iso2": "pa", "name_cn": "巴拿马", "color": "#005293" },
  "URY": { "iso2": "uy", "name_cn": "乌拉圭", "color": "#0038A8" },
  "DOM": { "iso2": "do", "name_cn": "多米尼加", "color": "#002D62" },
  "CRI": { "iso2": "cr", "name_cn": "哥斯达黎加", "color": "#EF3340" },
  "BGR": { "iso2": "bg", "name_cn": "保加利亚", "color": "#00966E" },
  "HRV": { "iso2": "hr", "name_cn": "克罗地亚", "color": "#FF0000" },
  "SVK": { "iso2": "sk", "name_cn": "斯洛伐克", "color": "#0B4EA2" },
  "SRB": { "iso2": "rs", "name_cn": "塞尔维亚", "color": "#C6363C" },
  "BLR": { "iso2": "by", "name_cn": "白俄罗斯", "color": "#C83728" },
  "AZE": { "iso2": "az", "name_cn": "阿塞拜疆", "color": "#00B5E2" },
  "LKA": { "iso2": "lk", "name_cn": "斯里兰卡", "color": "#FFBE29" },
  "CIV": { "iso2": "ci", "name_cn": "科特迪瓦", "color": "#FF8200" },
  "TZA": { "iso2": "tz", "name_cn": "坦桑尼亚", "color": "#1EB53A" },
  "JOR": { "iso2": "jo", "name_cn": "约旦", "color": "#CE1126" },
  "TUN": { "iso2": "tn", "name_cn": "突尼斯", "color": "#E70013" },
  "COD": { "iso2": "cd", "name_cn": "刚果(金)", "color": "#007FFF" },
  "CMR": { "iso2": "cm", "name_cn": "喀麦隆", "color": "#007A5E" },
  "BOL": { "iso2": "bo", "name_cn": "玻利维亚", "color": "#007A33" },
  "PRY": { "iso2": "py", "name_cn": "巴拉圭", "color": "#0038A8" },
  "SDN": { "iso2": "sd", "name_cn": "苏丹", "color": "#D21034" },
  "NPL": { "iso2": "np", "name_cn": "尼泊尔", "color": "#DC143C" },
  "HND": { "iso2": "hn", "name_cn": "洪都拉斯", "color": "#0073CF" },
  "NIC": { "iso2": "ni", "name_cn": "尼加拉瓜", "color": "#0067C6" },
  "SLV": { "iso2": "sv", "name_cn": "萨尔瓦多", "color": "#0047AB" },
  "AFG": { "iso2": "af", "name_cn": "阿富汗", "color": "#BF0000" },
  "BGD": { "iso2": "bd", "name_cn": "孟加拉国", "color": "#006A4E" },
  "VNM": { "iso2": "vn", "name_cn": "越南", "color": "#DA251D" },
  "PAK": { "iso2": "pk", "name_cn": "巴基斯坦", "color": "#00401A" },
  "IRL": { "iso2": "ie", "name_cn": "爱尔兰", "color": "#169B62" },
  "ISL": { "iso2": "is", "name_cn": "冰岛", "color": "#003897" },
  "EST": { "iso2": "ee", "name_cn": "爱沙尼亚", "color": "#0072CE" },
  "LVA": { "iso2": "lv", "name_cn": "拉脱维亚", "color": "#9E3039" },
  "LTU": { "iso2": "lt", "name_cn": "立陶宛", "color": "#FDB913" },
  "SVN": { "iso2": "si", "name_cn": "斯洛文尼亚", "color": "#005BAE" }
};

function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', (err) => reject(err));
  });
}

async function generate() {
  console.log("正在从世界银行获取真实 GDP 数据...");
  try {
    // 获取所有国家 1960-2023 年的 GDP (现价美元)
    const url = "https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json&per_page=20000&date=1960:2023";
    const [metadata, rawData] = await fetchData(url);

    const processedData = rawData
      .filter(d => countryMapping[d.countryiso3code] && d.value !== null)
      .map(d => {
        const iso3 = d.countryiso3code;
        const mapping = countryMapping[iso3];
        return {
          year: parseInt(d.date),
          name: d.country.value,
          name_cn: mapping.name_cn,
          code: mapping.iso2,
          iso3: iso3,
          value: d.value / 1e9, // 转换为 10 亿美元
          color: mapping.color,
          flag: `https://flagcdn.com/w80/${mapping.iso2}.png`
        };
      })
      .sort((a, b) => a.year - b.year || b.value - a.value);

    fs.writeFileSync('./public/gdp_data.json', JSON.stringify(processedData, null, 2));
    console.log(`数据生成成功！共处理 ${processedData.length} 条记录。`);
  } catch (error) {
    console.error("获取数据时出错:", error);
  }
}

generate();
