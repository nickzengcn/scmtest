import { getDictListByParames, deleteDictById, editDictByParames } from '../services/api';

const namespace = 'dictSeason';

export default {
    namespace,
    state: {
        data: {
            list: [],
            pagination: {},
        },
        item: {
            data: {},
            modal: false,
        }
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            if (!payload) {
                payload = {
                    start: 0,
                    length: 9,
                }
            }
            const requestData = { type: 'QueryReplenSeasonList', data: payload }
            const response = yield call(getDictListByParames, requestData);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        // *editRow({ payload }, { call, put }) {
        //     //请求保存
        //     const requestData = { type:'EditReplenColour', data:payload.data };
        //     const response = yield call(editDictByParames, requestData);
        //     //根据序号保存数据
        //     yield put({
        //         type: 'setData',
        //         payload: {
        //             rowNum: payload.rowNum,
        //             rowData: response,
        //         },
        //     })
        // },
        *editRow({ payload }, { call, put }) {
            const type = payload.data.ID?'EditReplenSeason':'CreateReplenSeason';
            //请求保存
            const requestData = { type, data: payload.data };
            const response = yield call(editDictByParames, requestData);
            //根据序号保存数据
            yield put({
                type: 'fetch',
            });
        },
        *deleteRow({ payload }, { call, put }) {
            const requestData = { type: 'DeleteReplenSeason', data: payload };
            const response = yield call(editDictByParames, requestData);
            //重新请求数据
            yield put({
                type: 'fetch',
            });
        }
    },


    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
        edit(state, action) {
            let { payload } = action
            return {
                ...state,
                item: {
                    data: payload,
                    modal: true,
                }
            };
        },
        closeEdit(state, action) {
            let { payload } = action
            return {
                ...state,
                item: {
                    data: {},
                    modal: false,
                }
            };
        },
        setData(state, action) {
            let { data: { list } } = state;
            const { rowNum, rowData } = action.payload;
            list.splice(rowNum, 1, rowData);
            return {
                ...state,
            }
        }
    },
};