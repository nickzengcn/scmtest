import { getSampleJudgeData } from '../services/api';

const namespace = 'sampleJudge';

export default {
  namespace,
  state: {
    data: {
      list: [],
      pagination: {},
    },
    defaultType: `${namespace}/fetch`,
    modal: false,
    item: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
        if(!payload){
            payload =  {
                start: 0,
                length: 9,
            }
        }
      const response = yield call(getSampleJudgeData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  
  reducers: {
    setItem(state, action) {
        return {
          ...state,
          item: action.payload,
          modal: true
        };
      },
    closeItem(state, action) {
        return {
          ...state,
          item: {},
          modal: false
        };
      },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
