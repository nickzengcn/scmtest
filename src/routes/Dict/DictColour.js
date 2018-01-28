import { Table, Input, Row, Col, Select, Form, Button, Modal, Tree, Popconfirm, Divider } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { handleFormReset, handleSearch } from '../Wave/DemandSearchFilter';
import { getTreeByLevel, returnTreeNodes, formItemLayout } from '../../utils/ajust';
const FormItem = Form.Item;
import styles from './Dict.less'
import DemandClass from '../Wave/Demand.less'
// import { TreeChosen } from '../Wave/DemandForm'
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

@connect(({ dictColour, loading, sysparames }) => ({
    dictColour,
    sysparames,
    defaultType:dictColour.defaultType,
    loading: loading.models.dictColour,
}))
@Form.create()
export default class DictColour extends PureComponent {
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
            title: '颜色',
            dataIndex: 'colourname',
        }, {
            title: '款基准数量',
            dataIndex: 'baseqty',
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
    }
    editRow = (item) => {
        this.props.dispatch({
            type: 'dictColour/edit',
            payload: item,
        })
    }
    deleteRow = (key) => {
        this.props.dispatch({
            type: 'dictColour/deleteRow',
            payload: {
                id:key
            },
        })
    }
    handleSearch = handleSearch.bind(this);
    handleFormReset = handleFormReset.bind(this);
    handleAdd = () => {
        this.props.dispatch({
            type: 'dictColour/edit',
            payload: {},
        })
    }
    componentDidMount(){
        this.props.dispatch({
            type: 'dictColour/fetch',
        })
    }
    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        const {
          sysparames: {
            band,
            category,
            coloursum,
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
                        <FormItem label="颜色" style={{ width: '100%' }}>
                            {getFieldDecorator('fgid')(
                                <Select
                                    optionFilterProp="children"
                                    placeholder="请选择"
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    {coloursum.map(item => <Option key={item.ID} value={item.dtvalue}>{item.dtname}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <span>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button
                                style={{
                                    marginLeft: 8,
                                }}
                                onClick={this.handleFormReset}
                            >重置
                  </Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        let { dictColour: { data: { list } }, loading } = this.props;
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
                <DictColourForm />
            </Row>
        )
    }
}



@connect(({ dictColour, sysparames, loading }) => ({
    item: dictColour.item.data,
    modal: dictColour.item.modal,
    sysparames,
    submitting: loading.effects['dictColour/editRow'],
}))
@Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        let {
            ID, fgid, plid, colourid, colourname, baseqty
        } = props.item;
        return {
            ID: Form.createFormField({ value: ID }),
            fgid: Form.createFormField({ value: fgid }),
            plid: Form.createFormField({ value: plid }),
            colourid: Form.createFormField({ value: colourid }),
            colourname: Form.createFormField({ value: colourname }),
            baseqty: Form.createFormField({ value: baseqty }),
        };
    },
})
class DictColourForm extends PureComponent {
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
    colournameChange = ( datas ) => {
        const { sysparames: { category, coloursum } } = this.props;
        const color = coloursum.filter(item=>item.dtvalue==datas)
        const { setFieldsValue, getFieldValue } = this.props.form;
        setFieldsValue({ colourname: color[0].dtname });
    }
    render() {
        const { xlbtn, pl, fg, modal } = this.state;
        const { form, dispatch, submitting, item: { data }, sysparames: { category, coloursum } } = this.props;
        const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
        const validate = () => {
            validateFieldsAndScroll((error, values) => {
                if (!error) {
                    this.props.dispatch({
                        type: 'dictColour/editRow',
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
                onCancel={() => this.props.dispatch({ type: 'dictColour/closeEdit' })}
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
                        {getFieldDecorator('colourname', {
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
                    <Form.Item {...formItemLayout} label="颜色">
                        {getFieldDecorator('colourid', {
                            rules: [{ required: true, message: '请选择颜色' }],
                        })(
                            <Select
                                optionFilterProp="children"
                                placeholder="请选择"
                                onChange={this.colournameChange}
                                style={{
                                    width: '100%',
                                }}
                            >
                                {coloursum.map(item => <Option key={item.ID} value={item.dtvalue}>{item.dtname}</Option>)}
                            </Select>
                            )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="款基准数量">
                        {getFieldDecorator('baseqty', {
                            rules: [{ required: true, message: '请正确输入款基准数量' }],
                        })(
                            <Input type="number" placeholder="请输入款基准数量'" />
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



export class TreeChosen extends PureComponent {
    state = {
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
    }
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onCheck = (checkedKeys, { checked, checkedNodes }) => {
        this.setState({ checkedKeys });
    }
    onSelect = (selectedKeys, info) => {
        this.setState({ selectedKeys });
    }
    getKeyGroup = (category, key, sub = 2, arr = []) => {
        for (let index = 0; index < category.length; index++) {
            const element = category[index];
            const str = key.substr(0, sub);
            if (element.categoryid == str) {
                arr.push(element);
                sub += 2;
                return this.getKeyGroup(element.children, key, sub, arr);
            }
        }
    }
    handelSubmit = () => {
        const { selectedKeys } = this.state;
        if (selectedKeys.length == 0) {
            message.warning('你需要选择一个四级类别。');
        } else {
            const key = selectedKeys[0];
            const { category } = this.props;
            const arr = [];
            this.getKeyGroup(category, key, 2, arr);
            this.props.handleTreeData(arr);
            this.props.handelCancel();
        }
    }
    returnTreeNodes = returnTreeNodes.bind(this);

    render() {
        return (
            <Modal
                title="选择2级小类"
                footer={null}
                visible={this.props.modal}
                onCancel={() => this.props.handelCancel()}
            >
                <Row>
                    <Col xl={24} >
                        <Tree
                            className={styles.scmTree}
                            checkStrictly
                            onExpand={this.onExpand}
                            expandedKeys={this.state.expandedKeys}
                            autoExpandParent={this.state.autoExpandParent}
                            onCheck={this.onCheck}
                            checkedKeys={this.state.checkedKeys}
                            onSelect={this.onSelect}
                            selectedKeys={this.state.selectedKeys}
                        >
                            {this.returnTreeNodes(this.props.category, 4)}
                        </Tree>
                    </Col>
                    <Col className="xw-tx-center" xl={24} >
                        <Button type="primary" onClick={this.handelSubmit} >
                            确定
                        </Button>
                    </Col>
                </Row>
            </Modal>
        );
    }
}
