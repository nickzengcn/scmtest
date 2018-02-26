import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import styles from './index.less';
import { getColumns, getWidthSum, handleGetTime, getDateFromTime, getJudge, getRemarkRender } from '../../utils/ajust';
import { AForm } from '../../routes/Sample/ApplyForm';

const statusMap = ['default', 'processing', 'success', 'error'];
class StandardTable extends PureComponent {
    state = {
      totalCallNo: 0,
      modal: false,
      item: {},
    };

    componentWillReceiveProps(nextProps) {
      // clean state
      // if (nextProps.selectedRows.length === 0) {
      // 	this.setState({
      // 		totalCallNo: 0,
      // 	});
      // }
    }

    handleTableChange = (pagination, filters, sorter) => {
      this.props.onChange(pagination, filters, sorter);
    }

    checkData = item => () => {
      this.props.checkData(item);
    }
    openAFrom = item => () => {
      this.setState({
        modal: true,
        item,
      });
    }
    closeAFrom = () => {
      this.setState({
        modal: false,
      });
    }
    AFromCommit = (values) => {
      this.props.funs.Dispatch({
        type: 'sampleApply/itemHandle',
        payload: {
          type: 'Create',
          data: values,
        },
      });
      this.setState({
        modal: false,
      });
    }
    render() {
      const { totalCallNo } = this.state;
      const { data: { list, recordsTotal, pagination }, loading, user: { currentUser } } = this.props;
      const { modal, item } = this.state;

      const columns = getColumns([
        // { dataIndex: 'id', title: '系统ID' },
        { dataIndex: 'Year', title: '年份' },
        { dataIndex: 'bandid', title: '波段号' },
        { dataIndex: 'bandname', title: '波段名称' },
        { dataIndex: 'fgText', title: '风格' },
        { dataIndex: 'plText', title: '品类' },
        { dataIndex: 'xlText', title: '小类' },
        { dataIndex: 'supplyqty', title: '上货款数' },
        { dataIndex: 'kindqty', title: '提供样版数' },
        { dataIndex: 'uploaddate', title: '上传图片截止时间', render: getDateFromTime },
        // { dataIndex: 'maildate', title: '邮寄样衣时间', render: getDateFromTime },
        // { dataIndex: 'approvaldate', title: '审版时间', render: getDateFromTime },
        // { dataIndex: 'indate', title: '上市日期', render: getDateFromTime },
        // { dataIndex: 'Enclosure', title: '附件' },
        // { dataIndex: 'editor', title: '编辑人' },
        // { dataIndex: 'editdate', width: 200, title: '编辑时间', render: handleGetTime },
        // { dataIndex: 'checker', title: '审核人' },
        // { dataIndex: 'checkdate', width: 200, title: '审核时间', render: handleGetTime },
        // { dataIndex: 'operatorName', title: '业务员' },
        // { dataIndex: 'status', title: '状态', render: getJudge },
        { dataIndex: 'remarks', title: '备注', render:getRemarkRender },
        {
          title: '操作',
          dataIndex: 'operation',
          width: 250,
          // fixed: 'right',
          render: (value, row, index) => {
            if (row.status == 1) {
              return (
                <a onClick={this.props.funs.Query(row)}>
                                查看
                </a>
              );
            } else {
              return getOperationHandle(value, row, this.props.funs, this.openAFrom, this.props.type);
              // return (
              // 	<span>
              // 		{value.map((element, index) => {
              // 			return (
              // 				<Fragment>
              // 					<a>
              // 						{element.title}
              // 					</a>
              // 					{value.length > index + 1 ? <Divider type="vertical" /> : ''}
              // 				</Fragment>
              // 			)
              // 		})}
              // 	</span>
              // )
            }
          },
        },
      ]);
      const width = getWidthSum(columns);
      const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        ...pagination,
        total: recordsTotal + 1,
      };

      return (
        <div className={styles.standardTable}>
          <Table
            className="xw-table"
            rowKey="id"
            bordered
            loading={loading}
                    // rowKey={record => record.key}
            dataSource={list}
            columns={columns}
            pagination={paginationProps}
            onChange={this.handleTableChange}
            scroll={{ x: width }}
          />
          <AForm submit={this.AFromCommit} modal={modal} item={item} cancel={this.closeAFrom} currentUser={currentUser} />
        </div>
      );
    }
}

export default StandardTable;


const getOperationHandle = (value, row, fns, openform, type) => {
  const sum = value.filter(element => element.action != 'Save' && element.action != 'Create' && fns[element.action]).length;
  if(type === 'demand'){
    let divi = 0;
    return (
      <Fragment>
        {value.map((element, index) => {
                  if (element.action != 'Save' && element.action != 'Create' && fns[element.action]) {
                      divi++;
                      return (
                        <Fragment key={index}>
                          <a onClick={fns[element.action](row)}>
                            {element.title}
                          </a>
                          {divi < sum ? <Divider type="vertical" /> : ''}
                        </Fragment>
                      );
                  }
              })}
      </Fragment>
    );
  }else {
    return (
      <Fragment>
        {value.map((element, index) => {
                  if (element.action != 'Save' && element.action != 'Create' && fns[element.action]) {
                      // divi++;
                      return (
                        <Fragment key={index}>
                          <a onClick={fns[element.action](row)}>
                            {element.title}
                          </a>
                          {/* {divi < sum ? : ''} */}
                          <Divider type="vertical" />
                        </Fragment>
                      );
                  }
              })}
        <a onClick={openform(row)}>
                  样衣上传
        </a>
      </Fragment>
    );
  }
  
};
