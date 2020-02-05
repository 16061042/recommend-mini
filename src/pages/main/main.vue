<template>
    <view class="all">
        <image src="/static/img/bgMain.png" class="header-bg" v-bind:style="{ height: imgHeight+ 'px' }"></image>
        <!-- <scroll-view scroll-y="true" v-bind:style="{ height: scrollHeight+ 'px' }"> -->
        <view class="content">
                <view v-for="(item,index) in jobList" :key="index">
                    <view @click="jumpItem(item.positionId,item.companyId)">
                        <view class="top">
                            <text class="tittle">{{item.positionName.length>10?item.positionName.slice(0,10)+'...':item.positionName}}</text>
                            <text class="reward">¥{{Math.round(item.reward)}}</text>
                            <text class="reward-title">悬赏金额：</text>
                        </view>
                        <view class="bottom">
                            <text class="bottom-label">{{EXPERIENCE[item.workYearId]}}</text>
                            <text class="divider">|</text>
                            <text class="bottom-label">{{item.educationLevelId==12?EDUCATION[5]:EDUCATION[item.educationLevelId]}}</text>
                            <text v-if="item.cityName" class="divider">|</text>
                            <text v-if="item.cityName" class="bottom-label">{{item.cityName}}</text>
                            <text class="salary">{{Math.round(item.salaryMin/1000)}}k-{{Math.round(item.salaryMax/1000)}}k</text>
                        </view>
                        <view class="other">{{item.companyName}}</view>
                        <view class="blank"></view>
                    </view>
                </view>
        </view>
         <!-- </scroll-view> -->
    </view>
</template>

<script>
import { mapState } from 'vuex'
import ENVIRONMENT_CONFIG from '../../config/envConfig.js'
import util from '@/utils/util.js'
export default {
    onLoad: function (par) {
        this.imgHeight = wx.getSystemInfoSync().windowWidth * 0.544
        this.scrollHeight = wx.getSystemInfoSync().windowHeight - this.imgHeight
        this.getJobList()
    },
    onReachBottom(){
        this.page += 1
        this.getJobList()
    },
    computed: {
        ...mapState(['EXPERIENCE','EDUCATION'])
    },
    data(){
        return {
            imgHeight: 0,
            scrollHeight: 0,
            jobList: [],
            page: 1,
            total: 1
        }
    },
    methods: {
        jumpItem(positionId, companyId){
            uni.navigateTo({
                url: '../position/index?positionId=' + positionId
            })
        },
        onShareAppMessage: function () {
            return{
                title: '推荐简历，兼职赚钱',
                path: '/pages/main/main',
                //imageUrl: '/static/img/share.png'
            }
        },
        getJobList(){
            if(this.page>this.total){
                uni.showLoading({
                    title: '已经到底了哦～',
                    mask: true
                })
                setTimeout(() => {uni.hideLoading()}, 400)
            }else{
                uni.showLoading({
                    title: '加载中',
                    mask: true
                })
                setTimeout(() => this.delay(), 500)
            }
        },
        delay(page){
            uni.request({
                url: ENVIRONMENT_CONFIG.host+'/tr/web/talentRecommend/positionList?'+ENVIRONMENT_CONFIG.code,
                method: 'POST',
                data: {
                    page: this.page,
                    pageSize: 10
                },
                success: res => {
                    let realRes = res.data
                    this.total = Math.ceil(realRes.data.count/10)
                    if(realRes.code==0){
                        this.jobList = this.page==1? realRes.data.list : this.jobList.concat(realRes.data.list)
                    }else{
                        util.show(realRes.message)
                    }
                },
                fail: (err) =>{
                    util.show('获取职位列表失败')
                }
            })
            uni.hideLoading()
        }
    }
}
</script>


<style scoped>
.all{
    width: 100%;
}
.header-bg{
    width: 100%;
    vertical-align: top;
}
.content{
    width: 100%;
    background: rgba(255,255,255,1);
    padding: 0rpx;
}
.top{
    margin-top: 43rpx;
    margin-left: 40rpx;
    margin-right: 40rpx;
}
.bottom{
    margin-top: 32rpx;
    margin-left: 40rpx;
    margin-right: 40rpx;
}
.tittle{
    width:auto;
    height:34rpx;
    font-size:34rpx;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:500;
    color:rgba(42,39,31,1);
    line-height:51rpx;
    letter-spacing:1rpx;
}

.reward{
    width:auto;
    height:28rpx;
    font-size:28rpx;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:500;
    color:rgba(255,44,23,1);
    line-height:42rpx;
    letter-spacing:1rpx;
    float: right;
    text-align: right;
}
.reward-title{
    width:auto;
    height:28rpx;
    font-size:28rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(127,125,121,1);
    line-height:42rpx;
    float: right;
    text-align: right;
}
.bottom-label{
    width:auto;
    height:28rpx;
    font-size:28rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(105,103,98,1);
    line-height:42rpx;
}
.divider{
    width:1px;
    height:19px;
    color: rgba(212, 212, 210, 1);
    margin-left: 20rpx;
    margin-right: 20rpx;
}
.salary{
    width:auto;
    height:28rpx;
    font-size:28rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(105,103,98,1);
    line-height:42rpx;
    float: right;
    text-align: right;
}
.other{
    width:auto;
    height:28rpx;
    font-size:28rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(127,125,121,1);
    line-height:42rpx;
    margin-top: 22rpx;
    margin-left: 40rpx;
    margin-bottom: 38rpx;
}
.blank{
    width:100%;
    height:10rpx;
    background:rgba(244,244,244,1);
}
</style>

