import { getSampleJudgeData, reqGenBill, reqCheckNo, getSingleSample } from '../services/api';

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
            if (!payload) {
                payload = {
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
        *publish({ payload }, { call, put }) {
            const response = yield call(reqGenBill, payload);
            yield put({
                type: 'closeItem',
            });
            yield put({
                type: 'fetch',
            });
        },
        *taotai({ payload }, { call, put }) {
            const response = yield call(reqCheckNo, payload);
            yield put({
                type: 'closeItem',
            });
            yield put({
                type: 'fetch',
            });
        },
        *setItem({ payload }, { call, put }) {
            let parame = {
                id : payload.Code
            }
            const response = yield call(getSingleSample, parame);
            payload = {...response,...payload}
            yield put({
                type: 'setFullItem',
                payload: payload,
            });
        },
    },


    reducers: {
        setFullItem(state, action) {
            return {
                ...state,
                item: action.payload,
                modal: true
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
