import { query as queryUsers, queryCurrent } from '../services/user';
import { getUserMenu } from '../services/api';
import { access } from 'fs';
import { formatter } from '../common/menu';
import { notification } from 'antd';

/**
 * 根据菜单取得重定向地址.
 */
// const redirectData = [];
const getRedirect = (item, redirectData) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `/${item.path}`,
        to: `/${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children, redirectData);
      });
    }
  }
};

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    userMenu: [],
    redirectData: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *registerUser(_, { put }) {
      const accountInfo = JSON.parse(localStorage.getItem('accountInfo'));

      yield put({
        type: 'saveCurrentUser',
        payload: {
          name: accountInfo.TrueName,
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
          userid: accountInfo.Id,
          notifyCount: 12,
        },
      });
    },
    *checkUser(_, { put }) {
      if (localStorage.getItem('antd-pro-authority') === 'user') {
        yield put({
          type: 'registerUser',
        });
        yield put({
          type: 'getUserMenu',
        });
      }
    },
    *getUserMenu(_, { call, put }) {
      const response = yield call(getUserMenu);
      if (response === '0') {
        notification.warn({ message: '请注意', description: '会话超时，请重新登录，谢谢。' });
        yield put({
          type: 'login/logout',
        });
      } else {
        yield put({
          type: 'sysparames/getAllParames',
        });
        yield put({
          type: 'global/fetchNotices',
        });
        yield put({
          type: 'updateUserMenu',
          payload: response,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    updateUserMenu(state, action) {
      window.__tmpMenu = action.payload;
      const userMenu = formatter(action.payload);
      const redirectData = [];
      for (let index = 0; index < userMenu.length; index++) {
        const element = userMenu[index];
        getRedirect(element, redirectData);
      }
      return {
        ...state,
        userMenu,
        redirectData,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
