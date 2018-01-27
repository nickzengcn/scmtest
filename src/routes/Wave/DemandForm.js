import React, { PureComponent } from 'react';
import { Modal, Card, Button, Form, Icon, Col, Row, DatePicker, TimePicker, Input, Select, Popover, Upload } from 'antd';
import styles from '../../routes/Forms/style.less';
import moment from 'moment';
import { getColumns, getWidthSum, handleGetTime, getDateFromTime, getJudge, getMomentFromStr } from '../../utils/ajust';
import { connect } from 'dva';
import { Tree } from 'antd';
import Demand from './Demand.less';

const TreeNode = Tree.TreeNode;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
import { message } from 'antd';


class AdvancedForm extends PureComponent {
    state = {
        width: '100%',
        modal: false,
        xlbtn: undefined,
        pl: undefined,
        fg: undefined,
        fileList: [],
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
        const { fgText, plText, xlText } = nextprops.item.data;
        if (nextprops.item.data != this.props.item.data) {
            // this.state.fgid = fgid;
            // this.state.plid = plid;
            // this.state.xlid = xlid;
            this.setState({
                xlbtn: xlText,
                pl: plText,
                fg: fgText,
            });
        }
    }
    handleTreeData = (datas) => {
        this.setState({
            xlbtn: datas[3].categoryname,
            pl: datas[2].categoryname,
            fg: datas[1].categoryname,
        });
        const { setFieldsValue, getFieldValue } = this.props.form;
        setFieldsValue({ fgid: datas[1].categoryid });
        setFieldsValue({ plid: datas[2].categoryid });
        setFieldsValue({ xlid: datas[3].categoryid });
    }
    render() {
        const { xlbtn, pl, fg } = this.state;
        const { form, dispatch, submitting, item: { data }, sysparames: { category } } = this.props;
        const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
        const validate = () => {
            validateFieldsAndScroll((error, values) => {
                let { fileList } = this.state;
                if( fileList.length >0 ){
                    values.guid = fileList[0].response.files[0].guid
                }
                // console.log(fileList[0].response.files[0].guid)
                // if (fileList.length > 0) {
                //     values.guid = fileList[0].guid
                // }
                if (!error) {
                    values.approvaldate = values.approvaldate.format('YYYY-MM-DD');
                    values.indate = values.indate.format('YYYY-MM-DD');
                    values.maildate = values.maildate.format('YYYY-MM-DD');
                    values.uploaddate = values.uploaddate.format('YYYY-MM-DD');
                    dispatch({
                        type: 'waveDemand/itemHandle',
                        payload: {
                            type: data.id ? 'Edit' : 'Create',
                            data: values,
                        },
                    });
                }
            });
        };

        const uploadProps = {
            name: 'file',
            action: '../FileUpload/Upload',
            // action: '//jsonplaceholder.typicode.com/posts/',
            headers: {
                authorization: 'authorization-text',
            },
            beforeUpload(file, fileList) {
                if (file.size / 1024 / 1024 > 5) {
                    message.error(`${file.name} 必须小于等于5M！`);
                    return false;
                }
            },
            onChange: (info,fileList,event) => {
                this.setState({
                    fileList: [info.file],
                });
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    // console.log(event)
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        const errors = getFieldsError();
        const getErrorInfo = () => {
            const errorCount = Object.keys(errors).filter(key => errors[key]).length;
            if (!errors || errorCount === 0) {
                return null;
            }
            const scrollToField = (fieldKey) => {
                const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
                if (labelNode) {
                    labelNode.scrollIntoView(true);
                }
            };
            const errorList = Object.keys(errors).map((key) => {
                if (!errors[key]) {
                    return null;
                }
                return (
                    <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
                        <Icon type="cross-circle-o" className={styles.errorIcon} />
                        <div className={styles.errorMessage}>{errors[key][0]}</div>
                    </li>
                );
            });
            return (
                <span className={styles.errorIcon}>
                    <Icon type="exclamation-circle" />
                    {errorCount}
                </span>
            );
        };
        const nowYear = new Date().getFullYear();
        const yearList = [
            {
                key: nowYear,
                value: nowYear,
            }, {
                key: nowYear + 1,
                value: nowYear + 1,
            },
        ];
        return (
            <Modal
                title="编辑波段数据"
                width="90%"
                footer={null}
                visible={this.props.modal}
                // onOk={this.props.dispatch({type:'closeEdit'})}
                onCancel={() => this.props.dispatch({ type: 'waveDemand/closeEdit' })}
            >
                <Form layout="vertical" hideRequiredMark>
                    <Row gutter={16}>
                        <Col lg={6} md={12} sm={24}>
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
                            <Form.Item style={{ display: 'none' }} label="小类id">
                                {getFieldDecorator('xlid', {
                                })(
                                    <Input disabled placeholder="" />
                                    )}
                            </Form.Item>
                            <Form.Item label="波段号">
                                {getFieldDecorator('id', {
                                    rules: [{}],
                                })(
                                    <Input disabled placeholder="波段号系统自动生成" />
                                    )}
                            </Form.Item>
                        </Col>
                        <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <Form.Item label="年份">
                                {getFieldDecorator('Year', {
                                    rules: [{ required: true, message: '请选择年份' }],
                                })(
                                    <Select placeholder="请选择年份" style={{ width: '100%' }}>
                                        {yearList.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>)}
                                    </Select>
                                    )}
                            </Form.Item>
                        </Col>
                        <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label="波段名称">
                                {getFieldDecorator('bandname', {
                                    rules: [{ required: true, max: 4, message: '请正确输入波段名称(4位)' }],
                                })(
                                    <Input placeholder="请输入波段名称" />
                                    )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col lg={6} md={12} sm={24}>
                            <Form.Item label="小类">
                                <Button style={{ width: '100%', textAlign: 'left' }} type="nomal" onClick={this.handleTree}>
                                    {!xlbtn ? '请点击选择树节点' : xlbtn}
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <Form.Item label="风格">
                                <Input disabled value={fg} placeholder="风格" />
                                {/* {getFieldDecorator('fgid', {
                                    rules: [{ required: true, message: '风格' }],
                                })(
                                    <Input disabled placeholder="风格" />
                                    )} */}
                            </Form.Item>
                        </Col>
                        <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label="品类">
                                <Input disabled value={pl} placeholder="品类" />

                                {/* {getFieldDecorator('plid', {
                                    rules: [{ required: true, message: '品类' }],
                                })(
                                    <Input disabled placeholder="品类" />
                                    )} */}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col lg={6} md={12} sm={24}>
                            <Form.Item label="上货款数">
                                {getFieldDecorator('supplyqty', {
                                    rules: [{ required: true, message: '请输入上货款数' }],
                                })(
                                    <Input placeholder="上货款数" />
                                    )}
                            </Form.Item>
                        </Col>
                        <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <Form.Item label="提供样板款数">
                                {getFieldDecorator('kindqty', {
                                    rules: [{ required: true, message: '请输入提供样板款数' }],
                                })(
                                    <Input placeholder="提供样板款数" />
                                    )}
                            </Form.Item>
                        </Col>
                        <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label="上传图片截止日期">
                                {getFieldDecorator('uploaddate', {
                                    rules: [{ required: true, message: '上传图片截止日期' }],
                                })(
                                    <DatePicker placeholder="上传图片截止日期" />
                                    )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col lg={6} md={12} sm={24}>
                            <Form.Item label="寄送样板截止日期">
                                {getFieldDecorator('maildate', {
                                    rules: [{ required: true, message: '寄送样板截止日期' }],
                                })(
                                    <DatePicker placeholder="寄送样板截止日期" />
                                    )}
                            </Form.Item>
                        </Col>
                        <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <Form.Item label="审版日期">
                                {getFieldDecorator('approvaldate', {
                                    rules: [{ required: true, message: '审版日期' }],
                                })(
                                    <DatePicker placeholder="审版日期" />
                                    )}
                            </Form.Item>
                        </Col>
                        <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label="上市日期">
                                {getFieldDecorator('indate', {
                                    rules: [{ required: true, message: '上市日期' }],
                                })(
                                    <DatePicker placeholder="上市日期" />
                                    )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xl={24} >
                            <Form.Item label="备注">
                                {getFieldDecorator('remarks', {
                                })(
                                    <TextArea style={{ minHeight: 32 }} placeholder="备注" rows={4} />
                                    )}
                            </Form.Item>
                        </Col>
                        <Col xl={24} >
                            <Form.Item label="款式参考资料">
                                {getFieldDecorator('approver', {
                                    rules: [],
                                })(
                                    <Upload {...uploadProps} fileList={this.state.fileList}>
                                        <Button>
                                            <Icon type="upload" /> 添加附件
                                    </Button>
                                    </Upload>
                                    )}
                            </Form.Item>
                        </Col>
                        <Col xl={24} />
                    </Row>
                    <Row className="xw-tx-center">
                        {getErrorInfo()}
                        <Button type="primary" onClick={validate} loading={submitting}>
                            提交
              </Button>
                    </Row>
                </Form>
                <TreeChosen category={category} modal={this.state.modal} handleTreeData={this.handleTreeData} handelCancel={this.handleTree} />
            </Modal>
        );
    }
}

export default connect(({ waveDemand, sysparames, loading }) => ({
    item: waveDemand.Edit,
    modal: waveDemand.Edit.modal,
    sysparames,
    submitting: loading.effects['waveDemand/itemHandle'],
}))(Form.create({
    onFieldsChange(props, changedFields) {
    },
    mapPropsToFields(props) {
        let {
      id, Year, bandid, bandname, fgid, plid, xlid, supplyqty, kindqty, uploaddate,
            maildate, approvaldate, indate, Enclosure, editor, editdate, checker, checkdate,
            operatorName, status, remarks,
    } = props.item.data;
        uploaddate = getMomentFromStr(uploaddate);
        maildate = getMomentFromStr(maildate);
        approvaldate = getMomentFromStr(approvaldate);
        indate = getMomentFromStr(indate);
        editdate = getMomentFromStr(editdate);
        checkdate = getMomentFromStr(checkdate);
        return {
            id: Form.createFormField({ value: id }),
            Year: Form.createFormField({ value: Year }),
            bandid: Form.createFormField({ value: bandid }),
            bandname: Form.createFormField({ value: bandname }),
            fgid: Form.createFormField({ value: fgid }),
            plid: Form.createFormField({ value: plid }),
            xlid: Form.createFormField({ value: xlid }),
            supplyqty: Form.createFormField({ value: supplyqty }),
            kindqty: Form.createFormField({ value: kindqty }),
            uploaddate: Form.createFormField({ value: uploaddate }),
            maildate: Form.createFormField({ value: maildate }),
            approvaldate: Form.createFormField({ value: approvaldate }),
            indate: Form.createFormField({ value: indate }),
            Enclosure: Form.createFormField({ value: Enclosure }),
            editor: Form.createFormField({ value: editor }),
            editdate: Form.createFormField({ value: editdate }),
            checker: Form.createFormField({ value: checker }),
            checkdate: Form.createFormField({ value: checkdate }),
            operatorName: Form.createFormField({ value: operatorName }),
            status: Form.createFormField({ value: status }),
            remarks: Form.createFormField({ value: remarks }),
        };
    },
})(AdvancedForm));


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
    renderTreeNodes = (data) => {
        if (data) {
            return data.map((item) => {
                if (item.children.length > 0) {
                    return (
                        <TreeNode title={item.categoryname} selectable={false} key={item.categoryid} dataRef={item}>
                            {this.renderTreeNodes(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode title={item.categoryname} isLeaf key={item.categoryid} dataRef={item} />;
            });
        }
    }
    render() {
        return (
            <Modal
                title="选择4级小类"
                // width="90%"
                footer={null}
                visible={this.props.modal}
                // onOk={this.props.dispatch({type:'closeEdit'})}
                onCancel={() => this.props.handelCancel()}
            >
                <Row>
                    <Col xl={24} >
                        <Tree
                            className={Demand.scmTree}
                            // checkable
                            checkStrictly
                            onExpand={this.onExpand}
                            expandedKeys={this.state.expandedKeys}
                            autoExpandParent={this.state.autoExpandParent}
                            onCheck={this.onCheck}
                            checkedKeys={this.state.checkedKeys}
                            onSelect={this.onSelect}
                            selectedKeys={this.state.selectedKeys}
                        >
                            {this.renderTreeNodes(this.props.category)}
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
