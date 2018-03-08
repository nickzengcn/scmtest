import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Checkbox, Alert, DatePicker, Modal, Table } from 'antd';
import { handleFormReset, handleSearch, toggleForm, renderSimpleForm, shouhuoadvancedForm, renderShouhuoForm } from '../Wave/DemandSearchFilter';
import styles from '../Wave/Demand.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getColumns, getWidthSum, handleGetTime, getDateFromTime, getJudge, getRemarkRender } from '../../utils/ajust';


@connect(({ sampleWerewr, loading, user, sysparames }) => ({
    sampleWerewr,
    sysparames,
    // user,
    defaultType: sampleWerewr.defaultType,
    loading: loading.models.sampleWerewr,
}))
@Form.create()
export default class SampleWerewr extends PureComponent {
    state = {
        selectedRowKeys:[]
    };

    handleFormReset = handleFormReset.bind(this);
    handleSearch = handleSearch.bind(this);
    toggleForm = toggleForm.bind(this);
    renderSimpleForm = renderSimpleForm.bind(this);
    shouhuoadvancedForm = shouhuoadvancedForm.bind(this);
    renderForm = renderShouhuoForm.bind(this);

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'sampleWerewr/fetch',
            payload: {
                start: 0,
                length: 9,
            },
        });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            start: pagination.current - 1,
            length: pagination.pageSize,
            ...formValues,
            ...filters,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }

        dispatch({
            type: 'sampleWerewr/fetch',
            payload: params,
        });
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    render() {
        // const { sampleWerewr: { data: { list } }, user, loading } = this.props;
        const columns = getColumns([
            { dataIndex: 'ImageIdPath1', title: '图片' },
            { dataIndex: 'sampleId', title: '样衣编号' },
            { dataIndex: 'dlText', title: '大类' },
            { dataIndex: 'plText', title: '小小类' },
            { dataIndex: 'fgText', title: '发货数量' },
            { dataIndex: 'plText', title: '快递单号' },
            { dataIndex: 'xlText', title: '供应商名称' },
            { dataIndex: 'supplyqty', title: '状态' },
            { dataIndex: 'kindqty', title: '操作' },
        ]);
        const width = getWidthSum(columns);
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const { selectedRowKeys } = this.state;

        return (
            <PageHeaderLayout title="样衣初选收货">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                            <Button onClick={() => this.handleModalVisible(true)} type="primary" >
                                批量收货
                            </Button>
                        </div>
                    </div>
                    <Alert message={<span> 已选择 <span style={{ color: '#1890FF' }}>2</span> 项    总数量：<span>12</span>件</span>} type="info" showIcon />
                    <p />
                    <Table
                        className="xw-table"
                        rowKey="id"
                        // bordered
                        // loading={loading}
                        // rowKey={record => record.key}
                        // dataSource={list}
                        rowSelection={rowSelection}
                        columns={columns}
                        pagination={false}
                        // onChange={this.handleTableChange}
                        scroll={{ x: width }}
                    />
                </Card>
            </PageHeaderLayout>
        );
    }
}