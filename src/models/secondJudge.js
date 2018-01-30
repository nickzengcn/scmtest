import { getSampleData, removeRule, addRule, reqSample, reqSampleAudit, reqSamplePublish } from '../services/api';

const namespace = 'secondJudge';

export default {
  namespace,

  state: {
    data: {
      list: [],
      pagination: {},
    },
    defaultType: `${namespace}/fetch`,
    Edit: { modal: false, data: {} },
    Query: { modal: false, data: {} },
    Audit: { modal: false, data: {} },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
        if(!payload){
            payload =  {
                start: 0,
                length: 9,
            }
        }
      const response = yield call(getSampleData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  
  reducers: {
    
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
