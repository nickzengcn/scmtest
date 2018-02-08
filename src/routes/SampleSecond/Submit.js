import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Checkbox, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message } from 'antd';
import SamplyApply from '../../components/SCMTable/SamplyApply';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import InfiniteScroller from '../Sample/InfiniteScroller';
import { handleFormReset, handleSearch, toggleForm, renderSimpleForm, renderAdvancedForm, renderForm } from '../Wave/DemandSearchFilter';
const { TextArea } = Input;


import styles from '../Wave/Demand.less';

const confirm = Modal.confirm;

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ sampleApply, loading, sysparames }) => ({
    sampleApply,
    sysparames,
    defaultType: sampleApply.defaultType,
    loading: loading.models.sampleApply,
}))
@Form.create()
export default class Demand extends PureComponent {
    state = {
        addInputValue: '',
        modalVisible: false,
        queryVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        item: {},
        mask: '',
        editItem: {},
    };

    handleFormReset = handleFormReset.bind(this);
    handleSearch = handleSearch.bind(this);
    toggleForm = toggleForm.bind(this);
    renderSimpleForm = renderSimpleForm.bind(this);
    renderAdvancedForm = renderAdvancedForm.bind(this);
    renderForm = renderForm.bind(this);

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'sampleApply/fetch',
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
            type: 'sampleApply/fetch',
            payload: params,
        });
    }

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    }

    handleQueryVisible = (flag) => {
        this.setState({
            queryVisible: !!flag,
        });
    }

    handleAddInput = (e) => {
        this.setState({
            addInputValue: e.target.value,
        });
    }
    handleTxt = (e) => {
        this.setState({
            mask: e.target.value,
        });
    }
    handleGroupSubmit = (flag) => () => {
        const { sampleApply: { data: { list } }, loading } = this.props;
        const { mask } = this.state
        let ids = [];
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.isCheck) {
                ids.push(element.Id);
            }
        }
        ids = ids.join(',')
        const payload = {
            data: {
                ids,
                mask
            },
            type: flag
        };
        this.props.dispatch({
            type: 'sampleApply/audit',
            payload: payload,
        });
    }
    handleAdd = () => {
        this.props.dispatch({
            type: 'sampleApply/add',
            payload: {
                description: this.state.addInputValue,
            },
        });

        message.success('添加成功');
        this.setState({
            modalVisible: false,
        });
    }
    hanldeDeleteData = item => () => {
        confirm({
            title: '你确定要这么操作',
            content: `波段号为${item.bandid}, 波段名称为${item.bandname}会在数据库中删除，请注意！`,
            onOk: () => {
                this.props.dispatch({
                    type: 'sampleApply/itemHandle',
                    payload: {
                        type: 'Delete',
                        data: { id: item.id },
                    },
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    hanldeEditData = item => () => {
        this.props.dispatch({
            type: 'sampleApply/setEditData',
            payload: item,
        });
    }
    queryData = item => () => {
        this.props.dispatch({
            type: 'sampleApply/setQueryData',
            payload: item,
        });
    }
    AuditYes = item => () => {
        this.props.dispatch({
            type: 'sampleApply/AuditYes',
            payload: item,
        });
    }
    AuditNo = item => () => {
        this.props.dispatch({
            type: 'sampleApply/AuditNo',
            payload: item,
        });
    }

    render() {
        const { sampleApply: { data: { list } }, loading } = this.props;
        const { selectedRows, modalVisible, addInputValue, queryVisible, editItem } = this.state;
        const funs = {
            Create: this.handleAdd,
            Delete: this.hanldeDeleteData,
            Edit: this.hanldeEditData,
            Query: this.queryData,
            AuditYes: this.AuditYes,
            AuditNo: this.AuditNo,
        };

        return (
            <PageHeaderLayout title="样衣二审提交">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                            <Checkbox >全选</Checkbox>
                            <Button onClick={() => this.handleModalVisible(true)} type="primary" >
                                批量合格
                            </Button>
                            <Button onClick={() => this.handleQueryVisible(true)} type="nomal" >
                                批量不合格
                            </Button>
                        </div>
                        <InfiniteScroller funs={funs} data={list} loading={loading} />
                    </div>
                </Card>
                <Modal
                    title="批量及格"
                    footer={null}
                    visible={modalVisible}
                    onCancel={() => this.handleModalVisible(false)}
                >
                    <Row>
                        <TextArea placeholder="备注原因" onChange={this.handleTxt} />
                    </Row>
                    <Row className="xw-tx-center" style={{ marginTop: 24 }}>
                        <Button onClick={this.handleGroupSubmit('Yes')} type="primary" >
                            提交
                        </Button>
                    </Row>
                </Modal>
                <Modal
                    title="批量不及格"
                    footer={null}
                    visible={queryVisible}
                    onCancel={() => this.handleQueryVisible(false)}
                >
                    <Row>
                        <TextArea placeholder="备注原因" onChange={this.handleTxt} />
                    </Row>
                    <Row className="xw-tx-center" style={{ marginTop: 24 }}>
                        <Button onClick={this.handleGroupSubmit('No')} type="primary" >
                            提交
                        </Button>
                    </Row>
                </Modal>
            </PageHeaderLayout>
        );
    }
}

