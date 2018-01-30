
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
@connect(({ secondJudge, sampleApply, loading, sysparames, user }) => ({
    secondJudge,
    sysparames,
    user,
    defaultType: secondJudge.defaultType,
    loading: loading.models.secondJudge,
  }))
export default class Judge extends PureComponent {

    renderForm(){
        
    }

    render(){
        return(
        <PageHeaderLayout title="样衣二审审批">
            <Card bordered={false}>
                {/* <div className={styles.tableList}>
                    <div className={styles.tableListForm}>
                        {this.renderForm()}
                    </div>
                    <div className={styles.tableListOperator}>
                        <Checkbox onChange={this.handleChange} >全选</Checkbox>
                        <Button onClick={() => this.handleModalVisible(true)} type="primary" >
                            批量合格
                        </Button>
                        <Button onClick={() => this.handleQueryVisible(true)} type="nomal" >
                            批量不合格
                        </Button>
                    </div>
                    <InfiniteScroller user={user} funs={funs} data={list} loading={loading} />
                </div> */}
            </Card>
        </PageHeaderLayout>
        )
    }
}