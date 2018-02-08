
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Modal, Row, Col, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { handleFormReset, handleSearch, toggleForm, renderSimpleForm, renderAdvancedForm, renderForm } from '../Wave/DemandSearchFilter';
import InfiniteScroller from './InfiniteScroller';
import styles from '../Wave/Demand.less';
import DescriptionList from '../../components/DescriptionList';
import { LazyLoadImg, getJudge } from '../../utils/ajust';


const { Description } = DescriptionList;

@connect(({ secondJudge, loading, sysparames, user }) => ({
    secondJudge,
    sysparames,
    user,
    defaultType: secondJudge.defaultType,
    loading: loading.models.secondJudge,
  }))
@Form.create()
export default class Judge extends PureComponent {
    state = {
        expandForm: false,
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
            type: 'secondJudge/fetch'
        });
    }

    render(){
        const { loading, secondJudge:{data:{ list }}, user } = this.props;
        return(
        <PageHeaderLayout title="样衣二审审批">
            <Card bordered={false}>
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>
                        {this.renderForm()}
                    </div>
                    <InfiniteScroller user={user} data={list} loading={loading} />
                </div>
            </Card>
            <JudgeForm />
        </PageHeaderLayout>
        )
    }
}

@connect(({ secondJudge, sampleApply, loading, sysparames, user }) => ({
    secondJudge,
    sysparames,
    user,
    defaultType: secondJudge.defaultType,
    loading: loading.models.secondJudge,
  }))
class JudgeForm extends PureComponent {
    render(){
        const { secondJudge: { item, modal } } = this.props;
        return(
            <Modal
                title="样衣资料"
                width={980}
                footer={null}
                visible={modal}
                // onOk={this.props.dispatch({type:'closeEdit'})}
                onCancel={() => this.props.dispatch({type:'secondJudge/closeItem'})}
            >
                <DescriptionList size="large" title="基础数据" style={{ marginBottom: 32 }}>
                    <Col xs={24} sm={12} md={8}>
                        <Col className={styles.textline} xs={6}>
                            样衣图片：
                        </Col>
                        <Col className={styles.textline} xs={18}>
                            <LazyLoadImg style={{width:'100%',paddingTop:5}}/>
                        </Col>
                    </Col>
                    <Col className={styles.textblock} xs={24} sm={12} md={16}>
                        <Col className={styles.textline} xs={12}>
                            ID号：256
                        </Col>
                        <Col className={styles.textline} xs={12}>
                            波段号：7C
                        </Col>
                        <Col className={styles.textline} xs={24}>
                            供应商编码：256
                        </Col>
                        <Col className={styles.textline} xs={24}>
                            供应商名称：福建省石狮市雪上鞋城工业区5号楼四套
                        </Col>
                        <Col className={styles.textline} xs={24}>
                            供应商货号：234556
                        </Col>
                        <Col className={styles.textline} xs={24}>
                            款号：123455
                        </Col>
                        <Col className={styles.textline} xs={24}>
                            品类：T恤
                        </Col>
                        <Col className={styles.textline} xs={24}>
                            大类：时尚休闲风格
                        </Col>
                        <Col className={styles.textline} xs={24}>
                            主荐款：是
                        </Col>
                        <Col className={styles.textline} xs={24}>
                            合作方式：试销
                        </Col>
                    </Col>
                </DescriptionList>
                <DescriptionList size="large" title="库存数量管控分析（富基取数）" style={{ marginBottom: 32 }}>
                    <Description term="系统ID">{'id'}</Description>
                    <Description term="年份">{'Year'}</Description>
                    <Description term="波段号">{'bandid'}</Description>
                    <Description term="波段名称">{'bandname'}</Description>
                    <Description term="风格">{'fgText'}</Description>
                    <Description term="品类">{'plText'}</Description>
                    <Description term="小类">{'xlText'}</Description>
                    <Description term="系统ID">{'id'}</Description>
                    <Description term="年份">{'Year'}</Description>
                    <Description term="波段号">{'bandid'}</Description>
                    <Description term="波段名称">{'bandname'}</Description>
                    <Description term="风格">{'fgText'}</Description>
                    <Description term="品类">{'plText'}</Description>
                    <Description term="小类">{'xlText'}</Description>
                    <Description term="系统ID">{'id'}</Description>
                    <Description term="年份">{'Year'}</Description>
                    <Description term="波段号">{'bandid'}</Description>
                    <Description term="波段名称">{'bandname'}</Description>
                    <Description term="风格">{'fgText'}</Description>
                    <Description term="品类">{'plText'}</Description>
                </DescriptionList>
                <DescriptionList size="large" title="评分项" style={{ marginBottom: 32 }}>
                    <DetailForm />
                </DescriptionList>
            </Modal>
        )
    }
}

@Form.create()
class DetailForm extends PureComponent {
    render(){
        const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = this.props.form;
        return (
            <Form layout="vertical" hideRequiredMark>
                <Row gutter={16}>
                    <Col xs={24} style={{marginBottom:12}}>
                        <Col className={styles.textline} xs={12}>
                            风格：时尚休闲
                        </Col>
                        <Col className={styles.textline} xs={12}>
                            大类：时尚休闲风格
                        </Col>
                    </Col>
                    <Col lg={6} md={12} sm={24}>
                        <Form.Item  label="系列">
                            {getFieldDecorator('plid', {
                            })(
                                <Input disabled placeholder="" />
                                )}
                        </Form.Item>
                    </Col>
                    <Col lg={6} md={12} sm={24}>
                        <Form.Item label="版型">
                            {getFieldDecorator('fgid', {
                            })(
                                <Input disabled placeholder="" />
                                )}
                        </Form.Item>
                    </Col>
                    <Col lg={6} md={12} sm={24}>
                        <Form.Item label="波段款数匹配度">
                            {getFieldDecorator('xlid', {
                            })(
                                <Input disabled placeholder="" />
                                )}
                        </Form.Item>
                    </Col>
                    <Col lg={6} md={12} sm={24}>
                        <Form.Item label="商品类型">
                            {getFieldDecorator('id', {
                                rules: [{}],
                            })(
                                <Input disabled placeholder="波段号系统自动生成" />
                                )}
                        </Form.Item>
                    </Col>
                    <Col lg={6} md={12} sm={24}>
                        <Form.Item label="波段款式需求匹配度">
                            {getFieldDecorator('id', {
                                rules: [{}],
                            })(
                                <Input disabled placeholder="波段号系统自动生成" />
                                )}
                        </Form.Item>
                    </Col>
                    <Col lg={6} md={12} sm={24}>
                        <Form.Item label="可选色">
                            {getFieldDecorator('id', {
                                rules: [{}],
                            })(
                                <Input disabled placeholder="波段号系统自动生成" />
                                )}
                        </Form.Item>
                    </Col>
                    <Col lg={6} md={12} sm={24}>
                        <Form.Item label="尺码">
                            {getFieldDecorator('id', {
                                rules: [{}],
                            })(
                                <Input disabled placeholder="波段号系统自动生成" />
                                )}
                        </Form.Item>
                    </Col>
                    <Col lg={6} md={12} sm={24}>
                        <Form.Item label="确定色">
                            {getFieldDecorator('id', {
                                rules: [{}],
                            })(
                                <Input disabled placeholder="波段号系统自动生成" />
                                )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        )
    }
}