import { paramesGetBand, paramesGetBandYear, paramesGetCategory, getDictSize, 
    paramesGetShop, paramesGetScoreItem, paramesGetVender, paramesGetBaseInfo } from '../services/api';
// import { setAuthority } from '../utils/authority';
// import { routerRedux } from 'dva/router';

export default {
    namespace: 'sysparames',

    state: {
        band: [],
        bandYear: [],
        category: [],
        shop: [],
        scoreItem: [],
        vender: [],
        coloursum: [],
        sptype: [],
        season: [],
        size:[],
        clothse:[],
        shoplevel:[],
        shoptype:[],
        // currentAuthority: 'guest'
    },

    effects: {
        *getBand(_, { call, put }) {
            const response = yield call(paramesGetBand);
            yield put({ type: 'updateBand', payload: response });
        },
        *getBandYear(_, { call, put }) {
            const response = yield call(paramesGetBandYear);
            yield put({ type: 'updateBandYear', payload: response });
        },
        *getCategory(_, { call, put }) {
            const response = yield call(paramesGetCategory);
            yield put({ type: 'updateGetCategory', payload: response });
        },
        *getShop(_, { call, put }) {
            const response = yield call(paramesGetShop);
            yield put({ type: 'updateShop', payload: response });
        },
        *getScoreItem(_, { call, put }) {
            const response = yield call(paramesGetScoreItem);
            yield put({ type: 'updateScoreItem', payload: response });
        },
        *getVender(_, { call, put }) {
            const response = yield call(paramesGetVender);
            yield put({ type: 'updateVender', payload: response });
        },
        *getColoursum(_, { call, put }) {
            const response = yield call(paramesGetBaseInfo,{ type: 'coloursum'});
            yield put({ type: 'updateColoursum', payload: response });
        },
        *getSptype(_, { call, put }) {
            const response = yield call(paramesGetBaseInfo,{ type: 'sptype'});
            yield put({ type: 'updateSptype', payload: response });
        },
        *getSeason(_, { call, put }) {
            const response = yield call(paramesGetBaseInfo,{ type: 'season'});
            yield put({ type: 'updateSeason', payload: response });
        },
        *getClothse(_, { call, put }) {
            const response = yield call(paramesGetBaseInfo,{ type: 'clothse'});
            yield put({ type: 'updateClothse', payload: response });
        },
        *getShoplevel(_, { call, put }) {
            const response = yield call(paramesGetBaseInfo,{ type: 'shoplevel'});
            yield put({ type: 'updateShoplevel', payload: response });
        },
        *getShoptype(_, { call, put }) {
            const response = yield call(paramesGetBaseInfo,{ type: 'shoptype'});
            yield put({ type: 'updateShoptype', payload: response });
        },
        *getSize(_, { call, put }) {
            const response = yield call(getDictSize);
            yield put({ type: 'updateSize', payload: response });
        },
        *getAllParames(_, { call, put }) {
            const band = yield call(paramesGetBand);
            const bandYear = yield call(paramesGetBandYear);
            const category = yield call(paramesGetCategory);
            // const shop = yield call(paramesGetShop);
            // const season = yield call(paramesGetBaseInfo,{ type: 'season'});
            // const sptype = yield call(paramesGetBaseInfo,{ type: 'sptype'});
            // const coloursum = yield call(paramesGetBaseInfo,{ type: 'coloursum'});
            // const clothse = yield call(paramesGetBaseInfo,{ type: 'clothse'});
            // const shoptype = yield call(paramesGetBaseInfo,{ type: 'shoptype'});
            // const shoplevel = yield call(paramesGetBaseInfo,{ type: 'shoplevel'});
            // const size = yield call(getDictSize);
            // const scoreItem = yield call(paramesGetScoreItem);
            const vender = yield call(paramesGetVender);
            yield put({ type: 'updateAllParames', payload: {band, bandYear, category, vender} });
            // yield put({ type: 'updateAllParames', payload: {band, bandYear, category, shop, scoreItem, vender} });
            // yield put({ type: 'updateAllParames', payload: { band, bandYear, category, shop, season, sptype, coloursum, size, clothse, shoplevel, shoptype } });
        },
    },

    reducers: {
        updateBand(state, { payload }) {
            return {
                ...state,
                band: payload,
            };
        },
        updateBandYear(state, { payload }) {
            return {
                ...state,
                bandYear: payload,
            };
        },
        updateGetCategory(state, { payload }) {
            return {
                ...state,
                category: payload,
            };
        },
        updateShop(state, { payload }) {
            return {
                ...state,
                shop: payload,
            };
        },
        updateScoreItem(state, { payload }) {
            return {
                ...state,
                scoreItem: payload,
            };
        },
        updateVender(state, { payload }) {
            return {
                ...state,
                vender: payload,
            };
        },

        updateColoursum(state, { payload }) {
            return {
                ...state,
                coloursum: payload,
            };
        },
        updateSptype(state, { payload }) {
            return {
                ...state,
                sptype: payload,
            };
        },
        updateSeason(state, { payload }) {
            return {
                ...state,
                season: payload,
            };
        },
        updateClothse(state, { payload }) {
            return {
                ...state,
                clothse: payload,
            };
        },
        updateShoplevel(state, { payload }) {
            return {
                ...state,
                shoplevel: payload,
            };
        },
        updateShoptype(state, { payload }) {
            return {
                ...state,
                shoptype: payload,
            };
        },
        updateSize(state, { payload }) {
            return {
                ...state,
                size: payload,
            };
        },
        updateAllParames(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
