import { getWerewre, getTakeSample } from '../services/api';
import { message } from 'antd';
const namespace = 'sampleWerewr';

export default {
    namespace,

    state: {
        data: {
            list: [],
            pagination: {},
        },
        defaultType: `${namespace}/fetch`,
        // Edit: { modal: false, data: {} },
        // Query: { modal: false, data: {} },
        // Audit: { modal: false, data: {} },
    },


    effects: {
        *fetch({ payload }, { call, put }) {
            if (!payload) {
                payload = {
                    start: 0,
                    length: 9,
                }
            }
            const response = yield call(getTakeSample, payload);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        // *audit({ payload }, { call, put }) {
        //     const response = yield call(getTakeSample, payload);

        //     if(response.code==1){
        //         message.success(response.errMsg)
        //         //关闭弹框
        //         yield put({
        //             type: 'fetch'
        //         });
        //     }else{
        //         message.warn(response.errMsg)
        //     }
        // },
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
