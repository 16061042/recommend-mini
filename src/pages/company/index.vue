<template>
    <view class="content">
        <view class="block">
            <text class="company">{{companyName}}</text>
        </view>
        <view class="block" style="margin-top:0;" v-if="companyHighlight">
            <text class="highLight" selectable='true'>{{companyHighlight}}</text>
        </view>
        <view class="blank"></view>
        <view class="block" v-if="companyDetail">
            <image src="/static/img/company.png" style="width:30rpx;height:27rpx;margin-right:10rpx;"></image>
            <text class="tittle-b">公司简介</text>
            <company-detail v-if="companyDetail" v-bind:companyDetail=companyDetail style="margin-top: 20rpx;"></company-detail>
        </view>
        <view class="blank"></view>
        <view class="block">
            <image src="/static/img/Group.png" style="width:28rpx;height:29rpx;margin-right:10rpx;"></image>
            <text class="tittle-b">热招职位</text>
            <view v-for="(item,index) in jobList" :key="index">
                <view class="blank" style="height:1px;margin-top:44rpx;margin-bottom:44rpx;"></view>
                <view @click="jumpPosition(item.positionId)">
                    <view style="margin-bottom: 31rpx;">
                        <text class="tittle">{{item.positionName}}</text>
                        <text class="reward">¥{{item.reward}}</text>
                        <text class="reward-title">入职悬赏</text>
                    </view>
                    <view >
                        <!-- v-if="item.workYearId||item.educationLevelId||item.cityName||item.salaryMin||item.salaryMax" -->
                        <!-- v-if="item.educationLevelId" -->
                        <!-- v-if="item.cityName" -->
                        <text class="bottom-label">{{EXPERIENCE[item.workYearId]}}</text>
                        <text class="divider">|</text>
                        <text class="bottom-label">{{item.educationLevelId==12?EDUCATION[5]:EDUCATION[item.educationLevelId]}}</text>
                        <text class="divider" v-if="item.cityName">|</text>
                        <text class="bottom-label">{{item.cityName}}</text>
                        <text class="salary">{{item.salaryMin/1000}}k-{{item.salaryMax/1000}}k</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="blank-spe"></view>
        <view v-if="visitType==1" class="bottom-block">
            <button class="btn1" open-type='share'><text class="btn-word">转发该公司</text></button>
            <button class="btn2" @click="jumpPost">
                <text class="btn-word" style="color:rgba(42, 39, 31, 1)">生成海报</text>
            </button>
        </view>
    </view>
</template>

<script>
import ENVIRONMENT_CONFIG from '../../config/envConfig.js'
import {mapState} from 'vuex'
import companydetail from '@/components/company-detail/company-detail'
import util from '@/utils/util.js'
export default {
    components :{
        'company-detail': companydetail
    },
    onShow(){
        wx.hideHomeButton()
    },
    onLoad(par) {
        this.companyId = par.companyId
        let scene = decodeURIComponent(par.scene)
        if(scene != 'undefined'){
            this.companyId = scene.split('-')[1]
            this.visitType = scene.split('-')[0]
        }
        if(par.visitType){
            this.visitType = par.visitType
        }
        //公司信息
        uni.request({
            url: ENVIRONMENT_CONFIG.host+'/tr/web/talentRecommend/companyInfo?'+ENVIRONMENT_CONFIG.code,
            method: 'POST',
            data: {
                companyId: this.companyId,
            },
            success: res => {
                let realRes = res.data
                if(realRes.code==0){
                    this.companyName = realRes.data.companyName
                    this.companyDetail = realRes.data.companyDescription.replace(/↵/g,"\n")
                    this.companyHighlight = realRes.data.companyHighlight
                } else {
                    util.show(realRes.message)
                }
            },
            fail: () =>{
               util.show('获取公司信息失败')
            }
        })
        //公司职位列表
        uni.request({
            url: ENVIRONMENT_CONFIG.host+'/tr/web/talentRecommend/positionList?'+ENVIRONMENT_CONFIG.code,
            method: 'POST',
            data: {
                companyId: this.companyId,
                page: 1,
                pageSize: 20
            },
            success: res => {
                let realRes = res.data
                if(realRes.code==0){
                    this.jobList = realRes.data.list
                    for(let job of realRes.data.list){
                        this.sharePosition += job.positionName+'、'
                    }
                    this.sharePosition = this.sharePosition.slice(0,this.sharePosition.length-1)
                } else {
                    util.show(realRes.message)
                }
            },
            fail: () =>{
                util.show('获取职位列表失败')
            }
        })
    },
    computed: {
        ...mapState(['EXPERIENCE','EDUCATION'])
    },
    data(){
        return {
            companyId: 0,
            companyName: '',
            companyDetail: '',
            jobList: [],
            visitType: 0,
            sharePosition: '',
            companyHighlight:''
        }
    },
    methods: {
        jumpPosition(positionId){
            uni.navigateTo({
                url: '../position/index?positionId='+positionId
            })
        },
        onShareAppMessage: function () {
            return{
                title: '【'+this.companyName+'】悬赏招聘' + this.sharePosition,
                path: '/pages/company/index?companyId='+this.companyId,
                //imageUrl: '/static/img/share.png'
            }
        },
        jumpPost(){
            uni.navigateTo({
                url: '../post/index?companyId='+this.companyId
            })
        }
    }
}
</script>


<style scoped>
.blank-spe{
    width:100%;
    height:120rpx;
    background:rgba(255,255,255,1);
}
.content{
    width: 100%;
    height: auto;
    background:rgba(255,255,255,1);
    padding: 0rpx;
}
.block{
    margin-left: 40rpx;
    margin-top: 45rpx;
    margin-bottom: 45rpx;
    margin-right: 40rpx; 
}
.company{
    width:335rpx;
    height:40rpx;
    font-size:40rpx;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:500;
    color:rgba(42,39,31,1);
    line-height:60rpx;
    letter-spacing:1rpx;
}
.blank{
    width:100%;
    height:10rpx;
    background:rgba(244,244,244,1);
}
.tittle-b{
    font-size:34rpx;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:500;
    color:rgba(42,39,31,1);
    line-height:48rpx;
    letter-spacing:1rpx;
}
.company-detail{
    margin-top: 18rpx;
    width:100%;
    height:auto;
    font-size:32rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(105,103,98,1);
    line-height:52rpx;
    text-align: justify;
}
.tittle{
    width:auto;
    height:32rpx;
    font-size:32rpx;
    font-family:SourceHanSansCN-Normal,SourceHanSansCN;
    font-weight:400;
    color:rgba(42,39,31,1);
    line-height:48rpx;
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
    margin-right: 20rpx;
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
.btn1{
    width:46%;
    height:80rpx;
    background:rgba(63,60,53,1);
    border-radius:4rpx;
    margin-bottom: 20rpx;
    margin-top: 20rpx;
    margin-left: 20rpx;
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
}
.btn2{
    width:46%;
    height:80rpx;
    background:rgba(255,204,54,1);
    box-shadow:0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.1);
    border-radius:4rpx;
    margin-bottom: 20rpx;
    margin-top: 20rpx;
    margin-right: 20rpx;
    float: right;
    display: flex;
    align-items: center;
    justify-content: center;

}
.btn-word{
    width: auto;
    font-size:30rpx;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:500;
    color:rgba(255,204,54,1);
    line-height:45rpx;
    letter-spacing:1rpx;
}
.bottom-block{
    width:100%;
    height:120rpx;
    background:rgba(255,255,255,1);
    box-shadow:0rpx -1rpx 0rpx 0rpx rgba(0,0,0,0.1);
    position: fixed;
    bottom: 0px;
}
.highLight{
    font-size:32rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(105,103,98,1);
    line-height:52rpx;
}
</style>

