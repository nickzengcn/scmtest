import fetch from 'dva/fetch';
import { notification } from 'antd';
import { ucs2 } from 'punycode';
import { fail } from 'assert';

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  // localStorage.removeItem('antd-pro-authority')
  // const error = new Error(errortext);
  // error.name = response.status;
  // error.response = response;
  // throw error;
}

function checkPostStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        notification.success({
            message: `请求成功`,
            // description: errortext,
          });
        return response;
    }
    const errortext = codeMessage[response.status] || response.statusText;
    notification.error({
      message: `请求错误 ${response.status}: ${response.url}`,
      description: errortext,
    });
}

function getMenuPid() {
  const userMenu = window.__tmpMenu;
  if (!userMenu) {
    return '';
  }
  const url = window.location.hash.substr(2);
  const sign = url.indexOf('?');
  let paths = [];
  if (sign > 0) {
    paths = url.substr(0, sign).split('/');
  } else {
    paths = url.substr(0).split('/');
  }
  return checkMenuUrl(userMenu, paths);
}

function checkMenuUrl(userMenu, paths, index = 0) {
  userMenu.forEach((element) => {
    if (element.path === paths[index]) {
      if (paths.length === index + 1) {
        window.__currentMenu = element.Id;
      } else if (element.children) {
        checkMenuUrl(element.children, paths, index + 1);
      }
    }
  });
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  getMenuPid();
  const realUrl = `../${url}`;
  const newOptions = { ...defaultOptions, ...options };
  newOptions.headers = {
    mode: 'no-cors',
    token: localStorage.getItem('token'),
    module: window.__currentMenu,
    ...newOptions.headers,
  };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    console.log(newOptions.body);
    newOptions.body = JSON.stringify(newOptions.body);
    return fetch(realUrl, newOptions)
        .then(checkPostStatus)
        .then((response) => {
        if (newOptions.method === 'DELETE' || response.status === 204) {
            return response.text();
        }
        return response.json();
        });
  }

  if (newOptions.method === 'file') {
    return fetch(realUrl, {
          method: 'POST',
          body: newOptions.data
        })
        .then(checkPostStatus)
        .then((response) => {
			newOptions.success()
        if (newOptions.method === 'DELETE' || response.status === 204) {
			return response.text();
        }
        	return response.json();
        });
  }

  return fetch(realUrl, newOptions)
        .then(checkStatus)
        .then((response) => {
        if (newOptions.method === 'DELETE' || response.status === 204) {
            return response.text();
        }
        return response.json();
        });
  
  
}
