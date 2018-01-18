import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => namespace === model)
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login', 'sysparames'], () => import('../layouts/BasicLayout')),
    },
    '/user': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/wave/demand': {
      component: dynamicWrapper(app, ['waveDemand', 'sampleApply', 'sysparames'], () => import('../routes/Wave/Demand')),
    },
    '/sample/apply': {
      component: dynamicWrapper(app, ['sampleApply'], () => import('../routes/Sample/Apply')),
    },
    // 样衣照片审核
    '/sample/werwer': {
      component: dynamicWrapper(app, ['sampleApply'], () => import('../routes/Sample/Werwer')),
    },
    // 样衣海选发布
    '/sample/fsfewe': {
        component: dynamicWrapper(app, ['sampleApply'], () => import('../routes/Sample/Werwer')),
    },
    // 样衣海选
    '/sample/werewre': {
        component: dynamicWrapper(app, ['sampleApply'], () => import('../routes/Sample/Werwer')),
    },
    // 样衣海选决策
    '/sample/sdfdsfssdf': {
        component: dynamicWrapper(app, ['sampleApply'], () => import('../routes/Sample/Werwer')),
    },
    //样衣一审打分
    '/sample/erwerwe': {
        component: dynamicWrapper(app, ['sampleApply'], () => import('../routes/Sample/Werwer')),
    },
    // '/daysgoods/wave-plan-manager': {
    //   component: dynamicWrapper(app, ['rule'], () => import('../routes/DaysGoods/WavePlanManager')),
    // },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerData = {};
  Object.keys(routerConfig).forEach((item) => {
    const menuItem = menuData[item.replace(/^\//, '')] || {};
    routerData[item] = {
      ...routerConfig[item],
      name: routerConfig[item].name || menuItem.name,
      authority: routerConfig[item].authority || menuItem.authority,
    };
  });
  return routerData;
};
