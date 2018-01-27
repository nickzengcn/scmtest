import React from 'react';
import filter from 'lodash/filter';
import moment from 'moment';
import { Select, Tree } from 'antd';
import defaultImage from '../assets/defaultimg.jpg';
import LazyLoad from 'react-lazyload';
import Ellipsis from '../components/Ellipsis';
const TreeNode = Tree.TreeNode;

const { Option } = Select;

/**
 * 
 * @param {*} tree 数据 
 * @param {*} level 层级
 * @param {*} now 当前位置
 */
export const getTreeByLevel = (tree, level, now = 1) => {
  if (tree.length !== 0) {
    if (level == now) {
      return tree;
    } else {
      const returnArr = [];
      for (let index = 0; index < tree.length; index++) {
        const element = tree[index];
        if (element.children) {
          for (let ind = 0; ind < element.children.length; ind++) {
            const ele = element.children[ind];
            returnArr.push(ele);
          }
        }
      }
      return getTreeByLevel(returnArr, level, ++now);
    }
  } else {
    return [];
  }
};

/**
 * get correct table title
 */
export const TableBrTitle = props => (props.sort
  ? (
    <span className="table-title-block sort">
      <div className="table-title-br">
        <span>{props.name}</span>
      </div>
    </span>
  )
  : (
    <div className="table-title-br">
      <span>{props.name}</span>
    </div>
  ));

/**
 * 处理table组件更改请求
 */
export function handleTableChange(pagination, filters, sorter) {
  const pager = {
    ...this.state.pagination,
  };
  pager.current = pagination.current;
  pager.pageSize = pagination.pageSize;
  this.state.pagination = pager;
  this.state.sortField = sorter.field;
  this.state.sortOrder = sorter.order;
  this.fetchData();
}

/**
 * 处理多种请求
 */
// export function operationHandle ()

/**
 * 一般筛选条件请求 + 请求
 */
export function normalFilterChange(item, fn = null) {
  return (value) => {
    const { pagination } = this.state;
    if (fn) {
      fn();
    }
    if (pagination) {
      pagination.current = 1;
      this.setState({
        [item]: value,
        pagination,
      }, this.fetchData);
    } else {
      this.setState({
        [item]: value,
      }, this.fetchData);
    }
  };
}

/**
 * 一般筛选条件值更改
 */
export function normalDataChange(item) {
  return (e) => {
    this.setState({ [item]: e.target.value });
  };
}

/**
 * 一般值更改
 */
export function normalValueChange(item) {
  return (e) => {
    this.setState({ [item]: e });
  };
}

/**
 * 一般时间段条件筛选
 */
export function normalDateRangeChange(start, end) {
  return (moments, stringAr) => {
    const { pagination } = this.state;
    if (moments.length > 0) {
      pagination.current = 1;
      this.setState({
        [start]: moments[0].format('YYYY-MM-DD HH:mm'),
        [end]: moments[1].format('YYYY-MM-DD HH:mm'),
        pagination,
      }, this.fetchData);
    } else {
      this.setState({
        [start]: undefined,
        [end]: undefined,
        pagination,
      }, this.fetchData);
    }
  };
}

/**
 * 处理一般table数据返回配置
 */
export function HandleTableDataSet(json, item = 'data') {
  const { pagination } = this.state;
  if (json.data) {
    if (pagination) {
      pagination.total = json.data.total;
    }
    this.setState({ pagination, loading: false, [item]: json.data.rows });
  } else {
    this.setState({
      pagination: {
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        total: 0,
        showSizeChanger: true,
        showTotal: total => `共 ${total} 行`,
      },
      loading: false,
      [item]: [],
    });
  }
}
/**
 * handle Table setData
 * @TableParam:{dataName:String}
 */
export const TableSetData = (TableParam = {
  dataName: 'data',
}) => (target) => {
  target.prototype.setData = json => HandleTableDataSet.bind(this)(json, TableParam);
  // console.log(setData) Object.assign(target.prototype, ...{setData})
  // target.=true
};

/**
 * 自动增加居中、自动给默认长度,自动给渲染
 */
export const getColumns = (columns, userInfo, cb) => {
  return columns.map((item, index) => {
    const key = item.operationType;
    // let render switch (key) {     case 'postData':         render =
    // getRenderPostData(item.operation)         break;     case 'editCell':
    // render = getRenderEditModule(item.operation,userInfo,cb)         break;
    // case 'valueChange':         render = getValueChange(item.operation)
    // break;     case 'visibleByKey':         render =
    // getVisibleByKey(item.operation)         break;     case 'openParent' :
    //  render = getReorderGo(item.operation,cb)         break;     default:
    // break; }
    return {
      key: index,
      width: 100,
      className: 'xw-tx-center',
      //  render:render,
      ...item,
    };
  });
};
/**
 * 处理tableScrollwdith的格式
 */
export const getWidthSum = (columns) => {
  let Sum = 0;
  columns.map((item, index) => {
    Sum += item.width;
  });
  return Sum;
};

/**
 * 参考旧系统逻辑。。迟早会被废弃
 */
export const getVisibleByKey = (operation) => {
  return (text, record, index) => {
    let str;
    for (var index = 0; index < operation.length; index++) {
      const element = operation[index];
      if (record[element.dataIndex]) {
        str = record[element.dataIndex];
        break;
      }
    }
    str = str === undefined
      ? '-'
      : str;
    return (
      <span>
        {str}
      </span>
    );
  };
};

/**
 * 按格式返回字符串
 */
export const getValueChange = (operation) => {
  return (text, record, index) => {
    return (
      <span>
        {operation.map((item) => {
                    if (item.value == text) {
                        return item.name;
                    }
                })}
      </span>
    );
  };
};

/**
 * 返回可操作的a功能按钮
 */
export class PostDataInA extends React.Component {
  constructor() {
    super();
  }
    HandelClick = () => {
      console.log(this.props);
      const { url, data } = this.props.item;
      httpFetch({ url, data });
    }
    render() {
      const { item } = this.props;
      return (
        <a
          className="tabelCell-action"
          href="javascript:void(0)"
          onClick={this.HandelClick}
        >{item.name}
        </a>
      );
    }
}

/**
 * 返回url
 * @param {*} item
 */
export const getRenderOpenDetail = (operation) => {
  return (text, record, index) => {
    return (
      <a href={record[operation.dataIndex]} target="_blank">{text}</a>
    );
  };
};

/**
 * 时间处理函数
 */
export function handleGetTime(time) {
  if (typeof time === 'string') {
    return time.replace(/T/g, ' ');
  }
  return '';
}

/**
 * 时间截取日期部分
 */
export function getDateFromTime(time) {
  if (typeof time === 'string') {
    return time.substr(0, 10);
  }
  return '';
}

/**
 * 备注长度控制
 */
export function getRemarkRender(value) {
   return <Ellipsis length={10} tooltip>{value}</Ellipsis>
}

export function getMomentFromStr(time) {
  if (typeof time === 'string') {
    return moment(handleGetTime(time));
  }
  return moment();
}

/**
 * 审核
 */
export const getJudge = (value, row, index) => (value == 1
  ? '已审核'
  : '未审核');

/**
 * 获取默认图片
 */
export const LazyLoadImg = props =>
  (
    <LazyLoad throttle={200} height={200}>
      <img {...props} src={props.src ? props.src : defaultImage} />
    </LazyLoad>
  );

/**
 * 是否
 */
export const ifNotJudge = (item) => (item == 1 ? '是' : '否');


export const renderImage = (url) => <LazyLoadImg style={{width:40,height:40}} src={url} />

/**
 * 根据层次返回树数据
 */
export const retrunLevelTreeData = (data, level=0, now=0) => {
    if(level==0){
        return data
    }else{
        level--;
        data
    }
}

/**
 * scm 根据category返回界点
 * @param {*} data 
 */
export const returnTreeNodes = (data,level=100) => {
    if (data) {
        return data.map((item) => {
            if ( item.children.length > 0 && item.categoryid.toString().length<=level) {
                return (
                    <TreeNode title={item.categoryname} selectable={false} key={item.categoryid} dataRef={item}>
                        {returnTreeNodes(item.children,level)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.categoryname} isLeaf key={item.categoryid} dataRef={item} />;
        });
    }
}

export const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };