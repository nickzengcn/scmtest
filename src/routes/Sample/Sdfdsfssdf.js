import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Checkbox, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message } from 'antd';
import SamplyApply from '../../components/SCMTable/SamplyApply';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ApplyForm from './ApplyForm';
import ApplyDetail from './ApplyDetail';
import InfiniteScroller from './sdfdsfssdf/Infinite';
import { handleFormReset, handleSearch, toggleForm, renderSimpleForm, sampleAdvancedForm, renderSampleForm } from '../Wave/DemandSearchFilter';
const { TextArea } = Input;


import styles from '../Wave/Demand.less';

const confirm = Modal.confirm;

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ sampleApply, loading, user, sysparames }) => ({
    sampleApply,
    sysparames,
    user,
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
    sampleAdvancedForm = sampleAdvancedForm.bind(this);
    renderForm = renderSampleForm.bind(this);

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
    handleGroupSubmit = () => {
        const { sampleApply: { data: { list } }, loading } = this.props;
        const { mask } = this.state
        let ids = [];
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.checked) {
                ids.push(element.Id);
            }
        }
        ids = ids.join(',')
    
        this.props.dispatch({
            type: 'sampleApply/publish',
            payload: {
                ids
            },
        });
        
        this.handleModalVisible(false)
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
        this.handleModalVisible(false)
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
    handleAudit = item => {
        this.props.dispatch({
            type: 'sampleApply/setAudit',
            payload: item,
        });
    }
    handleChange = (e)=>{
        const Check = e.target.checked;
        this.props.dispatch({
            type: 'sampleApply/allCheck',
            payload: Check,
        });
    }
    itemCheck = item => {
        this.props.dispatch({
            type: 'sampleApply/setItemCheck',
            payload: item,
        });
    }
    render() {
        const { sampleApply: { data: { list } }, user, loading } = this.props;
        const { selectedRows, modalVisible, addInputValue, queryVisible, editItem } = this.state;
        const funs = {
            Create: this.handleAdd,
            Delete: this.hanldeDeleteData,
            Edit: this.hanldeEditData,
            Query: this.queryData,
            Check:this.itemCheck,
            Audit: this.handleAudit,
        };

        return (
            <PageHeaderLayout title="样衣海选决策">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                            <Checkbox onChange={this.handleChange} >全选</Checkbox>
                            <Button onClick={() => this.handleModalVisible(true)} type="primary" >
                                海选发布
                            </Button>
                        </div>
                        <InfiniteScroller user={user} funs={funs} data={list} loading={loading} />
                    </div>
                </Card>
                <Modal
                    title="请确认提交"
                    footer={null}
                    visible={modalVisible}
                    onCancel={() => this.handleModalVisible(false)}
                >
                    <Row className="xw-tx-center" style={{ marginTop: 24 }}>
                        <Button onClick={this.handleGroupSubmit} type="primary" >
                            提交
                        </Button>
                    </Row>
                </Modal>
          
            </PageHeaderLayout>
        );
    }
}










