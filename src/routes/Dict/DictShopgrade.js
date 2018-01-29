import { Table, Input, Row, Col, Select, Form, Button, Modal, Tree, Popconfirm, Divider, Icon } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { handleFormReset, handleSearch } from '../Wave/DemandSearchFilter';
import { getTreeByLevel, returnTreeNodes, formItemLayout } from '../../utils/ajust';
const FormItem = Form.Item;
import styles from './Dict.less'
import DemandClass from '../Wave/Demand.less'
import { TreeChosen } from './DictColour'
const TreeNode = Tree.TreeNode;
const { Option } = Select
const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);

@connect(({ dictSize, loading, sysparames }) => ({
    dictSize,
    sysparames,
    defaultType:dictSize.defaultType,
    loading: loading.models.dictSize,
}))
@Form.create()
export default class dictSize extends PureComponent {
    constructor(props) {
        super(props);
        this.columns = [
        //     {
        //     title: '序号',
        //     dataIndex: 'ID',
        // }, 
        {
            title: '风格',
            dataIndex: 'fgText',
        }, {
            title: '品类',
            dataIndex: 'plText',
        }, {
            title: '版型',
            dataIndex: 'layoutName',
        }, {
            title: '尺码',
            dataIndex: 'sizeName',
        }, {
            title: '占比',
            dataIndex: 'percent',
        }, {
            title: '操作',
            dataIndex: 'fgid',
            render: (text, record) => {
                return (
                    <div className="editable-row-operations">
                        <Popconfirm  title="你确定要删除么？" onConfirm={() => this.deleteRow(record.ID)} okText="是的" cancelText="不是">
                            <a href="#">删除</a>
                        </Popconfirm>
                        <Divider type="vertical" />
                        <a onClick={() => this.editRow(record)} >编辑</a>
                    </div>
                );
            },
        }];
        this.state = {
            moreFilter : false,
        };
    }
    editRow = (item) => {
        this.props.dispatch({
            type: 'dictSize/edit',
            payload: item,
        })
    }
    deleteRow = (key) => {
        this.props.dispatch({
            type: 'dictSize/deleteRow',
            payload: {
                id:key
            },
        })
    }
    handleSearch = handleSearch.bind(this);
    handleFormReset = handleFormReset.bind(this);
    handleAdd = () => {
        this.props.dispatch({
            type: 'dictSize/edit',
            payload: {},
        })
    }
    componentDidMount(){
        this.props.dispatch({
            type: 'dictSize/fetch',
        })
    }
    toggleForm = ()=>{
        let { moreFilter } = this.state;
        this.setState({
            moreFilter:!moreFilter,
        });
    }
    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        const { moreFilter } = this.state;
        const {
          sysparames: {
            band,
            category,
            size,
            clothse,
          },
        } = this.props;
        const realCategory = getTreeByLevel(category, 3);

        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row
                    gutter={{
                        md: 8,
                        lg: 24,
                        xl: 48,
                    }}
                >
                    <Col md={8} sm={24}>
                        <FormItem label="品类" style={{ width: '100%' }}>
                            {getFieldDecorator('pl')(
                                <Select
                                    optionFilterProp="children"
                                    mode="multiple"
                                    placeholder="请选择"
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    {realCategory.map(item => <Option key={item.categoryid} value={item.categoryid}>{item.categoryname}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="版型" style={{ width: '100%' }}>
                            {getFieldDecorator('layoutid')(
                                <Select
                                    optionFilterProp="children"
                                    placeholder="请选择"
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    {clothse.map(item => <Option key={item.ID} value={item.dtvalue}>{item.dtname}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    {moreFilter?
                        <Col md={8} sm={24}>
                            <FormItem label="尺码" style={{ width: '100%' }}>
                                {getFieldDecorator('sizeid')(
                                    <Select
                                        optionFilterProp="children"
                                        placeholder="请选择"
                                        style={{
                                            width: '100%',
                                        }}
                                    >
                                        {size.map(item => <Option key={item.id} value={item.dsid}>{item.dsname}</Option>)}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>:
                        null
                    }
                    <Col md={8} sm={24}>
                        <span>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button
                                style={{
                                    marginLeft: 8,marginBottom: 24,
                                }}
                                onClick={this.handleFormReset}
                                >重置
                            </Button>
                            <a
                            style={{
                                            marginLeft: 8,
                                        }}
                            onClick={this.toggleForm}
                            >
                                            {moreFilter?"收回":"展开"}
                            <Icon type={moreFilter?"up":"down"} />
                            </a>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        let { dictSize: { data: { list } }, loading } = this.props;
        return (
            <Row>
                <Col xs={24} className={styles.cols}>
                    <div className={DemandClass.tableListForm}>
                        {this.renderSimpleForm()}
                    </div>
                    <Col xs={24} className={styles.cols}>
                        <Button icon="plus" type="primary" onClick={this.handleAdd} style={{ marginRight: 8 }}>
                            新增
                        </Button>
                        <Button icon="export" type="nomal">
                            导入
                        </Button>
                    </Col>
                </Col>
                <Col xs={24} className={styles.cols}>
                    <Table loading={loading} bordered dataSource={list} columns={this.columns} />
                </Col>
                <DictSizeForm />
            </Row>
        )
    }
}



@connect(({ dictSize, sysparames, loading }) => ({
    item: dictSize.item.data,
    modal: dictSize.item.modal,
    sysparames,
    submitting: loading.effects['dictSize/editRow'],
}))
@Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        let {
            ID, fgid, plid, sizeid, sizename, layoutid, clothsename, percent
        } = props.item;
        return {
            ID: Form.createFormField({ value: ID }),
            fgid: Form.createFormField({ value: fgid }),
            plid: Form.createFormField({ value: plid }),
            sizeid: Form.createFormField({ value: sizeid }),
            sizename: Form.createFormField({ value: sizename }),
            layoutid: Form.createFormField({ value: layoutid }),
            clothsename: Form.createFormField({ value: clothsename }),
            percent: Form.createFormField({ value: percent }),
        };
    },
})
class DictSizeForm extends PureComponent {
    state = {

    };
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    handleTree = (flag) => {
        this.setState({
            modal: !!flag,
        });
    }
    componentWillReceiveProps(nextprops) {
        if (nextprops.item != this.props.item) {
            const { fgText, plText } = nextprops.item;
            // this.state.fgid = fgid;
            // this.state.plid = plid;
            // this.state.xlid = xlid;
            this.setState({
                xlbtn: fgText,
                pl: plText,
            });
        }
    }
    handleTreeData = (datas) => {
        this.setState({
            xlbtn: datas[2].categoryname,
            pl: datas[1].categoryname,
        });
        const { setFieldsValue, getFieldValue } = this.props.form;
        setFieldsValue({ fgid: datas[1].categoryid });
        setFieldsValue({ plid: datas[2].categoryid });
    }
    SizenameChange = ( datas ) => {
        const { sysparames: { category, size, clothse } } = this.props;
        const color = size.filter(item=>item.dsid==datas)
        const { setFieldsValue, getFieldValue } = this.props.form;
        setFieldsValue({ sizename: color[0].dsname });
    }
    clothsenameChange = ( datas ) => {
        const { sysparames: { category, size, clothse } } = this.props;
        const color = clothse.filter(item=>item.dtvalue==datas)
        const { setFieldsValue, getFieldValue } = this.props.form;
        setFieldsValue({ clothsename: color[0].dtname });
    }
    render() {
        const { xlbtn, pl, fg, modal } = this.state;
        const { form, dispatch, submitting, item: { data }, sysparames: { category, size, clothse } } = this.props;
        const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
        const validate = () => {
            validateFieldsAndScroll((error, values) => {
                if (!error) {
                    this.props.dispatch({
                        type: 'dictSize/editRow',
                        payload: values,
                    });
                }
            });
        };
        return (
            <Modal
                title="编辑颜色参数数据"
                width={768}
                footer={null}
                visible={this.props.modal}
                // onOk={this.props.dispatch({type:'closeEdit'})}
                onCancel={() => this.props.dispatch({ type: 'dictSize/closeEdit' })}
            >
                <Form hideRequiredMark>
                    <Form.Item style={{ display: 'none' }} label="品类id">
                        {getFieldDecorator('ID', {
                        })(
                            <Input disabled placeholder="" />
                            )}
                    </Form.Item>
                    <Form.Item style={{ display: 'none' }} label="品类id">
                        {getFieldDecorator('plid', {
                        })(
                            <Input disabled placeholder="" />
                            )}
                    </Form.Item>
                    <Form.Item style={{ display: 'none' }} label="风格id">
                        {getFieldDecorator('fgid', {
                        })(
                            <Input disabled placeholder="" />
                            )}
                    </Form.Item>
                    <Form.Item style={{ display: 'none' }} label="风格id">
                        {getFieldDecorator('sizename', {
                        })(
                            <Input disabled placeholder="" />
                            )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="风格">
                        <Button style={{ width: '100%', textAlign: 'left' }} type="nomal" onClick={this.handleTree}>
                            {!xlbtn ? '请点击选择树节点' : xlbtn}
                        </Button>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="品类">
                        <Input disabled value={pl} placeholder="风格" />
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="版型">
                        {getFieldDecorator('layoutid', {
                            rules: [{ required: true, message: '请选择版型' }],
                        })(
                            <Select
                                optionFilterProp="children"
                                placeholder="请选择"
                                onChange={this.clothsenameChange}
                                style={{
                                    width: '100%',
                                }}
                            >
                                {clothse.map(item =>  <Option key={item.ID} value={item.dtvalue}>{item.dtname}</Option>)}
                            </Select>
                            )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="尺码">
                        {getFieldDecorator('sizeid', {
                            rules: [{ required: true, message: '请选择尺码' }],
                        })(
                            <Select
                                optionFilterProp="children"
                                placeholder="请选择"
                                onChange={this.SizenameChange}
                                style={{
                                    width: '100%',
                                }}
                            >
                                {size.map(item => <Option key={item.id} value={item.dsid}>{item.dsname}</Option>)}
                            </Select>
                            )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="占比">
                        {getFieldDecorator('percent', {
                            rules: [{ required: true, message: '请正确输入占比' }],
                        })(
                            <Input type="number" placeholder="请输入占比'" />
                            )}
                    </Form.Item>
                    <Row className="xw-tx-center">
                        <Button type="primary" onClick={validate} loading={submitting}>
                            保存
                        </Button>
                    </Row>
                    <TreeChosen category={category} modal={this.state.modal} handleTreeData={this.handleTreeData} handelCancel={this.handleTree} />
                </Form>
            </Modal>
        );
    }
}

