import { Table, Input, Row, Col, Select, Form, Button, Modal, Tree, Popconfirm, Divider, Icon, Checkbox } from 'antd';
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

@connect(({ dictShopgrade, loading, sysparames }) => ({
    dictShopgrade,
    sysparames,
    defaultType:dictShopgrade.defaultType,
    loading: loading.models.dictShopgrade,
}))
@Form.create()
export default class DictShopgrade extends PureComponent {
    constructor(props) {
        super(props);
        this.columns = [
        {
            title: '门店编码',
            dataIndex: 'shopid',
        },
        {
            title: '门店名称',
            dataIndex: 'shopname',
        }, 
        {
            title: '一级分类',
            dataIndex: 'dlText',
        }, {
            title: '级别',
            dataIndex: 'gradename',
        }, {
            title: '系数',
            dataIndex: 'rate',
        }, {
            title: '试销标识',
            dataIndex: 'tryflag',
        }, {
            title: '门店类型',
            dataIndex: 'shoptype',
        }, {
            title: '操作',
            dataIndex: 'ID',
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
            type: 'dictShopgrade/edit',
            payload: item,
        })
    }
    deleteRow = (key) => {
        this.props.dispatch({
            type: 'dictShopgrade/deleteRow',
            payload: {
                id:key
            },
        })
    }
    handleSearch = handleSearch.bind(this);
    handleFormReset = handleFormReset.bind(this);
    handleAdd = () => {
        this.props.dispatch({
            type: 'dictShopgrade/edit',
            payload: {},
        })
    }
    componentDidMount(){
        this.props.dispatch({
            type: 'dictShopgrade/fetch',
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
            shop,
            clothse,
          },
        } = this.props;
        const realCategory = getTreeByLevel(category, 1);

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
                        <FormItem label="大类" style={{ width: '100%' }}>
                            {getFieldDecorator('dlid')(
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
                        <FormItem label="门店号" style={{ width: '100%' }}>
                            {getFieldDecorator('shopid')(
                                <Select
                                    optionFilterProp="children"
                                    placeholder="请选择"
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    {shop.map(item => <Option key={item.sampleId} value={item.sampleId}>{item.shopName}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    {/* {moreFilter?
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
                    } */}
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
                            {/* <a
                            style={{
                                            marginLeft: 8,
                                        }}
                            onClick={this.toggleForm}
                            >
                                            {moreFilter?"收回":"展开"}
                            <Icon type={moreFilter?"up":"down"} />
                            </a> */}
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        let { dictShopgrade: { data: { list } }, loading } = this.props;
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
                <DictShopgradeForm />
            </Row>
        )
    }
}



@connect(({ dictShopgrade, sysparames, loading }) => ({
    item: dictShopgrade.item.data,
    modal: dictShopgrade.item.modal,
    sysparames,
    submitting: loading.effects['dictShopgrade/editRow'],
}))
@Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        let {
            ID, dlid, shopname, gradename, rate, tryflag, shoptype, gradeid
        } = props.item;
        return {
            ID: Form.createFormField({ value: ID }),
            dlid: Form.createFormField({ value: dlid }),
            shopname: Form.createFormField({ value: shopname }),
            gradename: Form.createFormField({ value: gradename }),
            rate: Form.createFormField({ value: rate }),
            tryflag: Form.createFormField({ value: tryflag }),
            shoptype: Form.createFormField({ value: shoptype }),
            gradeid: Form.createFormField({ value: gradeid }),
        };
    },
})
class DictShopgradeForm extends PureComponent {
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
        // if (nextprops.item != this.props.item) {
        //     const { fgText, plText } = nextprops.item;
        //     // this.state.fgid = fgid;
        //     // this.state.plid = plid;
        //     // this.state.xlid = xlid;
        //     this.setState({
        //         xlbtn: fgText,
        //         pl: plText,
        //     });
        // }
    }
    shopChange = ( datas ) => {
        const { sysparames: { shop } } = this.props;
        const color = shop.filter(item=>item.sampleId==datas)
        const { setFieldsValue, getFieldValue } = this.props.form;
        setFieldsValue({ shopname: color[0].shopName });
    }
    render() {
        const { xlbtn, pl, fg, modal } = this.state;
        const { form, dispatch, submitting, item: { data }, sysparames: { category, shop, shoptype, shoplevel  } } = this.props;
        const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
        const realCategory = getTreeByLevel(category, 1);

        const validate = () => {
            validateFieldsAndScroll((error, values) => {
                if (!error) {
                    this.props.dispatch({
                        type: 'dictShopgrade/editRow',
                        payload: values,
                    });
                }
            });
        };
        return (
            <Modal
                title="编辑门店参数数据"
                width={768}
                footer={null}
                visible={this.props.modal}
                // onOk={this.props.dispatch({type:'closeEdit'})}
                onCancel={() => this.props.dispatch({ type: 'dictShopgrade/closeEdit' })}
            >
                <Form hideRequiredMark>
                    <Form.Item style={{ display: 'none' }} label="品类id">
                        {getFieldDecorator('ID', {
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
                    <Form.Item label="门店" {...formItemLayout} style={{ width: '100%' }}>
                            {getFieldDecorator('shopid')(
                                <Select
                                    optionFilterProp="children"
                                    placeholder="请选择"
                                    onChange = {this.shopChange}
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    {shop.map(item => <Option key={item.sampleId} value={item.sampleId}>{item.shopName}</Option>)}
                                </Select>
                            )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="大类">
                        {getFieldDecorator('dlid', {
                            rules: [{ required: true, message: '请选择大类' }],
                        })(
                            <Select
                                optionFilterProp="children"
                                placeholder="请选择"
                                style={{
                                    width: '100%',
                                }}
                            >
                                {realCategory.map(item => <Option key={item.categoryid} value={item.categoryid}>{item.categoryname}</Option>)}
                                </Select>
                            )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="级别">
                        {getFieldDecorator('gradeid', {
                            rules: [{ required: true, message: '请选择级别' }],
                        })(
                            <Select
                                optionFilterProp="children"
                                placeholder="请选择"
                                // onChange={this.clothsenameChange}
                                style={{
                                    width: '100%',
                                }}
                            >
                                {shoplevel.map(item =>  <Option key={item.ID} value={item.dtvalue}>{item.dtname}</Option>)}
                            </Select>
                            )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="门店类型">
                        {getFieldDecorator('shoptype', {
                            rules: [{ required: true, message: '请选择尺码' }],
                        })(
                            <Select
                                optionFilterProp="children"
                                placeholder="请选择"
                                onChange={this.ShopgradenameChange}
                                style={{
                                    width: '100%',
                                }}
                            >
                                {shoptype.map(item => <Option key={item.ID} value={item.dtvalue}>{item.dsname}</Option>)}
                            </Select>
                            )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="试销标识">
                        {getFieldDecorator('tryflag', {
                            rules: [{ required: true, message: '请选择尺码' }],
                        })(
                            <Checkbox >是否试销</Checkbox>
                            )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="系数">
                        {getFieldDecorator('rate', {
                            rules: [{ required: true, message: '请正确输入系数' }],
                        })(
                            <Input type="number" placeholder="请输入系数'" />
                            )}
                    </Form.Item>
                    <Row className="xw-tx-center">
                        <Button type="primary" onClick={validate} loading={submitting}>
                            保存
                        </Button>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

