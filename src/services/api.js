import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
    return request('/api/project/notice');
}

export async function queryActivities() {
    return request('/api/activities');
}

export async function queryRule(params) {
    return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
    return request('/api/rule', {
        method: 'POST',
        body: {
            ...params,
            method: 'delete',
        },
    });
}

export async function addRule(params) {
    return request('/api/rule', {
        method: 'POST',
        body: {
            ...params,
            method: 'post',
        },
    });
}

export async function fakeSubmitForm(params) {
    return request('/api/forms', {
        method: 'POST',
        body: params,
    });
}

export async function fakeChartData() {
    return request('/api/fake_chart_data');
}

export async function queryTags() {
    return request('/api/tags');
}

export async function queryBasicProfile() {
    return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
    return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
    return request(`/api/fake_list?${stringify(params)}`);
}

// export async function accountLogin(params) {
//   return request('http://120.78.136.225:20001/Scm/Account/AntLogin', {
//     method: 'POST',
//     body: params,
//   });
// }

export async function fakeRegister(params) {
    return request('/api/register', {
        method: 'POST',
        body: params,
    });
}

export async function queryNotices(params) {
    const str = getQueryStr(params);
    return request(`scm/Home/QueryMessageList${str}`, {
        method: 'GET',
    });
}

export async function readNotice(params) {
    const str = getQueryStr(params);
    return request(`scm/Home/ReadMessage${str}`, {
        method: 'GET',
    });
}


// ///////////////////////////new api/////////////////////////////
/**
 * 登录接口
 * @param {*} params
 */
export async function accountLogin(params) {
    return request(`Scm/Account/AntLogin?username=${params.userName}&password=${params.password}`, {
        method: 'GET',
        // body: params,
    });
}
/**
 * 菜单接口
 */
export async function getUserMenu() {
    return request(`${'Home/GetTreeByAnt' + '?token='}${localStorage.getItem('token')}`, {
        method: 'GET',
    });
}

/**
 * 获取字典接口
 */
export async function paramesGetBand() {
    return request('scm/Dict/GetBand', {
        method: 'GET',
    });
}

/**
 * 获取年份接口
 */
export async function paramesGetBandYear() {
    return request('scm/Dict/GetBandYear', {
        method: 'GET',
    });
}

/**
 * 获取类别接口
 */
export async function paramesGetCategory() {
    return request('scm/Dict/GetCategory', {
        method: 'GET',
    });
}

/**
 * 获取店铺接口
 */
export async function paramesGetShop() {
    return request('scm/Dict/GetShop', {
        method: 'GET',
    });
}

/**
 * 获取打分项接口
 */
export async function paramesGetScoreItem() {
    return request('scm/Dict/GetScoreItem', {
        method: 'GET',
    });
}

/**
 * 获取供应商接口
 */
export async function paramesGetVender() {
    return request('scm/Dict/GetVender', {
        method: 'GET',
    });
}

/**
 * 根据参数返回baseList
 */
export async function paramesGetBaseInfo(parames) {
    const str = getQueryStr(parames);
    return request(`Scm/Dict/QueryBaseInfoList${str}`, {
        method: 'GET',
    });
}

/**
 * 获取尺码
 */
export async function getDictSize() {
    return request('scm/Dict/GetSize', {
        method: 'GET',
    });
}

/**
 * 获取波段需求列表
 */
export async function getWaveBandData(parames) {
    const str = getQueryStr(parames);
    return request(`scm/Band/QueryList${str}`, {
        method: 'GET',
    });
}

/**
 * 获取波段需求列表
 */
export async function reqWaveBand(parames) {
    const method = parames.type === 'Edit' || parames.type === 'Create' ? 'POST' : 'GET';
    const query = parames.type === 'Edit' || parames.type === 'Create' ? '' : getQueryStr(parames.data);
    return request(`scm/Band/${parames.type}${query}`, {
        method,
        body: parames.data,
    });
}

/**
 * 获取样衣海选列表
 */
export async function getWerewre(parames) {
    const str = getQueryStr(parames);
    return request(`scm/FristAudition/ImageList${str}`, {
        method: 'GET',
    });
}

/**
 * like or dislike
 */
export async function reqWerewre(parames) {
    const str = getQueryStr(parames.data);
    return request(`Scm/FristAudition/${parames.type}${str}`, {
        method: 'GET',
        // body: parames.data,
    });
}

/**
 * 样衣申请操作
 */
export async function getSampleData(parames) {
    const str = getQueryStr(parames);
    return request(`scm/Sample/QueryList${str}`, {
        method: 'GET',
    });
}

/**
 * 样衣审批
 */
export async function reqSampleAudit(parames) {
    return request(`Scm/Sample/CheckPhoto`, {
        method: 'POST',
        body: parames.data,
    });
}

/**
 * 审核信息字典
 */
export async function reqPhotoCheckList(parames) {
    const str = getQueryStr(parames);
    return request(`Scm/Dict/QueryPhotoCheckList${str}`, {
        method: 'GET',
    });
}

/**
 * 新增审核信息
 */
export async function photocheckModel(parames) {
    return request(`Scm/Sample/CheckPhoto`, {
        method: 'POST',
        body: parames.data,
    });
}

/**
 * 样衣总分操作
 */
export async function getSampleScore(parames) {
    const str = getQueryStr(parames);
    return request(`scm/Sample/ScoreImageList${str}`, {
        method: 'GET',
    });
}

/**
 * 海选发布
 */
export async function reqSamplePublish(parames) {
    return request(`scm/Sample/Publish`, {
        method: 'POST',
        body: parames,
    });
}

/**
 * 字典列表
 */
export async function getDictListByParames(parames) {
    const str = getQueryStr(parames.data);
    return request(`Scm/Dict/${parames.type}${str}`, {
        method: 'GET',
    });
}

/**
 * 根据类型创建数据
 */
export async function editDictByParames(parames) {
    return request(`Scm/Dict/${parames.type}`, {
        method: 'POST',
        body: parames.data,
    });
}

/**
 * 根据类型删除数据
 */
export async function deleteDictById(parames) {
    const str = getQueryStr(parames.data);
    return request(`Scm/Dict/${parames.type}${str}`, {
        method: 'GET',
    });
}


/**
 * 样衣需求操作
 */
export async function reqSample(parames) {
    const method = parames.type === 'Edit' || parames.type === 'Create' ? 'POST' : 'GET';
    const query = parames.type === 'Edit' || parames.type === 'Create' ? '' : getQueryStr(parames.data);
    return request(`scm/Sample/${parames.type}${query}`, {
        method,
        body: parames.data,
    });
}

function getQueryStr(obj) {
    if (!obj) {
        return '';
    }
    let str = '?';
    Object.keys(obj).forEach((item) => {
        str = `${str + item}=${obj[item]}&`;
    });
    return str;
}

