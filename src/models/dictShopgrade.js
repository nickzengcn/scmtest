import { getDictListByParames, deleteDictById, editDictByParames } from '../services/api';

const namespace = 'dictShopgrade';

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
        },
        defaultType:'dictShopgrade/fetch',
    },
    
    effects: {
        *fetch({ payload }, { call, put }) {
            if (!payload) {
                payload = {
                    start: 0,
                    length: 9,
                }
            }
            const requestData = { type: 'QueryReplenShopgradeList', data: payload }
            const response = yield call(getDictListByParames, requestData);
            yield put({
                type: 'save',
                payload: response,
            });
        },

        *editRow({ payload }, { call, put }) {
            const type = payload.ID?'EditReplenShopgrade':'CreateReplenShopgrade';
            //请求保存
            const requestData = { type, data: payload };
            const response = yield call(editDictByParames, requestData);
            if(response.code == 1){
                yield put({
                    type: 'closeEdit',
                });
            }
            //根据序号保存数据
            yield put({
                type: 'fetch',
            });
        },
        *deleteRow({ payload }, { call, put }) {
            const requestData = { type: 'DeleteReplenShopgrade', data: payload };
            const response = yield call(getDictListByParames, requestData);
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
