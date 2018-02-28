import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Upload } from 'antd';
import WavePlanTable from '../../components/SCMTable/WavePlanTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DemandForm from './DemandForm';
import DemandDetail from './DemandDetail';
import { handleFormReset, handleSearch, toggleForm, renderSimpleForm, renderAdvancedForm, renderForm } from './DemandSearchFilter';
import request from '../../utils/request';


import styles from './Demand.less';

const confirm = Modal.confirm;

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ waveDemand, sampleApply, loading, sysparames, user }) => ({
    waveDemand,
    sampleApply,
    sysparames,
    user,
    defaultType: waveDemand.defaultType,
    loading: loading.models.waveDemand,
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
        editItem: {},
        uploadProps: {
            name: 'file',
            action: 'scm/Band/Upload',
            onChange: this.onChange,
            fileList: fileList,
            // disabled: fileList.length == 3,
            beforeUpload: this.beforeUpload,
            onRemove: this.onRemove,
            headers: {
                authorization: 'authorization-text',
            },

        }
    };

    handleFormReset = handleFormReset.bind(this);
    handleSearch = handleSearch.bind(this);
    toggleForm = toggleForm.bind(this);
    renderSimpleForm = renderSimpleForm.bind(this);
    renderAdvancedForm = renderAdvancedForm.bind(this);
    renderForm = renderForm.bind(this);

    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files[]', file);
        });

        this.setState({
            uploading: true,
        });

        // You can use any AJAX library you like
        reqwest({
            url: '//jsonplaceholder.typicode.com/posts/',
            method: 'post',
            processData: false,
            data: formData,
            success: () => {
                this.setState({
                    fileList: [],
                    uploading: false,
                });
                message.success('upload successfully.');
            },
            error: () => {
                this.setState({
                    uploading: false,
                });
                message.error('upload failed.');
            },
        });
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'waveDemand/fetch',
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
            type: 'waveDemand/fetch',
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

    handleAdd = () => {
        this.props.dispatch({
            type: 'waveDemand/add',
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
                    type: 'waveDemand/itemHandle',
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
    hanldeCheckData = item => () => {
        confirm({
            title: '请确认',
            content: `波段号为${item.bandid}, 波段名称为${item.bandname}会审核通过！`,
            onOk: () => {
                this.props.dispatch({
                    type: 'waveDemand/itemHandle',
                    payload: {
                        type: 'Check',
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
            type: 'waveDemand/setEditData',
            payload: item,
        });
    }
    queryData = item => () => {
        this.props.dispatch({
            type: 'waveDemand/setQueryData',
            payload: item,
        });
    }
    downloadTemple = () => {
        window.open('http://www.baidu.com');
    }

    render() {
        const { waveDemand: { data }, loading, user } = this.props;
        const { selectedRows, modalVisible, addInputValue, queryVisible, editItem } = this.state;
        const funs = {
            Create: this.handleAdd,
            Delete: this.hanldeDeleteData,
            Edit: this.hanldeEditData,
            Query: this.queryData,
            Check: this.hanldeCheckData,
            Dispatch: this.props.dispatch,
        };

        // const menu = (
        //     <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        //         <Menu.Item key="remove">删除</Menu.Item>
        //         <Menu.Item key="approval">批量审批</Menu.Item>
        //     </Menu>
        // );

        return (
            <PageHeaderLayout title="波段计划管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.props.dispatch({ type: 'waveDemand/setEditData', payload: {} })}>
                                新建
                </Button>
                            <Button icon="export" type="nomal" onClick={() => this.handleModalVisible(true)}>
                                导出
                </Button>
                            <Button icon="upload" type="nomal" onClick={() => this.handleModalVisible(true)}>
                                导入
                </Button>
                            {/* {
                                selectedRows.length > 0 && (
                                    <span>
                                        <Button>批量操作</Button>
                                        <Dropdown overlay={menu}>
                                            <Button>
                                                更多操作 <Icon type="down" />
                                            </Button>
                                        </Dropdown>
                                    </span>
                                )
                            } */}
                        </div>
                        <WavePlanTable
                            funs={funs}
                            // selectedRows={selectedRows}
                            type='demand'
                            loading={loading}
                            data={data}
                            user={user}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
                <DemandForm />
                <DemandDetail />
                <Modal
                    title="导入波段数据"
                    footer={null}
                    visible={modalVisible}
                    onOk={this.handleAdd}
                    onCancel={() => this.handleModalVisible()}
                >
                    <div>
                        <p>
                            <Upload>
                                <a>
                                    选择文件...
                            </a>
                            </Upload>
                        </p>
                        <p>
                            请下载"<a onClick={this.downloadTemple}>波段数据导入模板</a>"，单次导入波段最多40行。
                    </p>
                    </div>
                </Modal>
                {/* <Modal
                    title={null}
                    width="90%"
                    footer={null}
                    visible={queryVisible}
                    onCancel={() => this.handleQueryVisible()}
                >
                    <DemandDetail item={this.state.item} queryVisible={queryVisible} />
                </Modal> */}
            </PageHeaderLayout>
        );
    }
}


// @connect(({ sysparames, loading }) => ({
//     band: sysparames.band
//   }))
// export class BandChosen extends PureComponent{
//     render(){
//         const { band } = this.props
//         return (
//             <Select placeholder="请选择" style={{ width: '100%' }}>
//                 {band.map(item=><Option value={item.Key}>{item.Value}</Option>
//                 )}
//                 {/* <Option value="0">关闭</Option>
//                 <Option value="1">运行中</Option> */}
//             </Select>
//         )
//     }
// }

