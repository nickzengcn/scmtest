import { queryNotices } from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    message: {
      modal: false,
      item: {}
    },
  },

  effects: {
    *fetchNotices({ payload }, { call, put }) {
      if(!payload){
        payload =  {
            start: 0,
            length: 9,
        }
    }
      const data = yield call(queryNotices, payload);
      const { list } = data;
      yield put({
        type: 'saveNotices',
        payload: list,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: list.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
  },

  reducers: {
    openMessage(state, { payload }) {
      return {
        ...state,
        message: {
          modal:true,
          item:payload
        },
      };
    },
    closeMessage(state, { payload }) {
      return {
        ...state,
        message: {
          modal:false,
          item:{}
        },
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
