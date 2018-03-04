import { getSampleData, removeRule, addRule, reqSample, reqSampleAudit, reqSamplePublish } from '../services/api';

const namespace = 'sampleApply';

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
    *audit({ payload }, { call, put}) {        
        const response = yield call(reqSampleAudit, payload);
        //关闭弹框
        yield put({
            type: 'setAudit',
            payload: { modal: false, data: {} }
        });
    },
    *itemHandle({ payload }, { call, put }) {
      const response = yield call(reqSample, payload);
      switch (payload.type) {
        case 'Edit':
          yield put({
            type: 'closeEdit',
          });
          break;
        case 'Create':
          // yield put({
          //     type: 'closeEdit',
          // });
          break;
        case 'Query':
          yield put({
            type: 'closeQuery',
          });
          break;
        case 'Delete':
          yield put({
            type: 'fetch',
          });
          break;
        default:
          break;
      }
    },
    *publish({ payload }, { call, put}) {
        const response = yield call(reqSamplePublish, payload);
        if(response.code==1){
            yield put({
                type: 'fetch',
            });
        }
    },
    *judge({ payload }, { call, put}) {
        const response = yield call(reqSamplePublish, payload);
        if(response.code==1){
            yield put({
                type: 'fetch',
            });
        }
    },
  },

  
  reducers: {
    closeEdit(state, action) {
      return {
        ...state,
        Edit: { modal: false, data: {} },
      };
    },
    closeQuery(state, action) {
      return {
        ...state,
        Query: { modal: false, data: {} },
      };
    },
    setEditData(state, action) {
      return {
        ...state,
        Edit: { modal: true, data: action.payload },
      };
    },
    setQueryData(state, action) {
      return {
        ...state,
        Query: { modal: true, data: action.payload },
      };
    },
    allCheck(state, action) {
        let { data } = state
        let { list } = data
        list.forEach(element => {
            element.checked = action.payload
        });
        console.log(list)
        return {
          ...state,
          data,
        };
    },
    setItemCheck(state, action) {
        let { data } = state
        let { list } = data
        list[action.payload.index].checked = !list[action.payload.index].checked
        return {
          ...state,
          data,
        };
    },
    setAudit(state, action) {
        return {
          ...state,
          Audit: { modal: action.payload.modal, data: action.payload.data },
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
