<template>
    <view class="content" v-if="position">
        <!-- 职位头部 -->
        <view class="positionName">{{position.positionName}}</view>
        <view style="margin-top: 31rpx;margin-left: 40rpx;margin-bottom:35rpx;">
            <text class="info-label">{{EXPERIENCE[position.workYearId]}}</text>
            <text class="divider">|</text>
            <text class="info-label">{{EDUCATION[position.educationLevelId]}}</text>
            <text class="divider">|</text>
            <text class="info-label">{{position.cityName}}</text>
            <text class="salary">{{position.salaryMin}} - {{position.salaryMax}}k</text>
        </view>
        <view class="PhighLight" v-if="position.positionHighlight"><text selectable='true'>{{position.positionHighlight}}</text></view>
        <view class="blank" style="height:1px;"></view>
        <!-- 悬赏 -->
        <view v-if="!otherToken" style="margin-left:40rpx;margin-top:45rpx;margin-bottom:45rpx;margin-right:20rpx;">
            <text class="reward-tittle">悬赏金额：</text>
            <text class="reward">¥{{position.reward}}</text>
            <br v-if="position.rewardRule" style="height:20rpx;"/>
            <text class="reward-tittle" v-if="position.rewardRule">奖励规则：</text>
            <text class="reward-rule" v-if="position.rewardRule">{{position.rewardRule}}</text>
        </view>
        <view v-if="!otherToken" class="blank"></view>
        <!-- 公司信息 -->
        <view class="block" v-if="!otherToken" @click="jumpCompany" style="margin-bottom:10rpx;">
            <image src="/static/img/company.png" style="width:30rpx;height:27rpx;margin-right:20rpx;"></image>
            <text class="tittle" style="width: 311rpx;">{{position.companyName}}</text>
            <image src="/static/img/next.png" style="width:11rpx;height:18rpx;float:right;margin-top: 16rpx;"></image>
        </view>
        <view class="block" v-else style="margin-bottom:10rpx;">
            <image src="/static/img/company.png" style="width:30rpx;height:27rpx;margin-right:20rpx;"></image>
            <text class="tittle" style="width: 311rpx;">{{position.companyName}}</text>
        </view>
        <company-detail v-if="companyDetail" v-bind:companyDetail=companyDetail style="margin-top: 18rpx;padding-left:40rpx;padding-right:40rpx;margin-bottom:50rpx;"></company-detail>
        <view v-else style="margin-top: 40rpx;"></view>
        <view class="blank"></view>
        <!-- 职位详情 -->
        <view class="block">
            <image src="/static/img/jobExperience.png" style="width:30rpx;height:30rpx;margin-right:20rpx;"></image>
            <text class="tittle">职位详情</text>
            <view class="job-detail"><text selectable='true'>{{position.positionDescription}}</text></view>
            
        </view>
        <view class="blank"></view>
        <!-- 工作地点 -->
        <view class="block">
            <image src="/static/img/jobLoc.png" style="width:20rpx;height:29rpx;margin-right:20rpx;"></image>
            <text class="tittle">工作地点</text>
            <view class="job-detail" style="height:52rpx;"><text selectable='true'>{{position.workAddress}}</text></view>
        </view>
        <view class="blank"></view>
        <view class="blank-spe"></view>
        <!-- 底部button -->
        <view class="bottom-block" v-if="visitType==1">
            <button class="btn1" open-type='share'><text class="btn-word">转发该职位</text></button>
            <button class="btn2" @click="jumpPost">
                <text class="btn-word" style="color:rgba(42, 39, 31, 1)">生成海报</text>
            </button>
        </view>
        <view v-else>
            <!-- 候选人视角 -->
            <view v-if="otherToken">
                <view class="bottom-block" >
                    <button class="btn" @click="jumpUpload"><text class="btn-word" style="color:rgba(42, 39, 31, 1)">投递简历</text></button>
                </view>
            </view>
            <view v-else>
                <!-- 注册并登录 -->
                <view class="bottom-block" v-if="authorization && register && position.state==0">
                    <button class="btn1" @click="jumpShare"><text class="btn-word">转发该职位</text></button>
                    <button class="btn2" @click="jumpRecommend">
                        <image src="/static/img/myRecommend.png" class="img-spec"></image>
                        <text class="btn-word" style="color:rgba(42, 39, 31, 1)">推荐人才</text>
                    </button>
                </view>
                <!-- 登录未注册 -->
                <view class="bottom-block" v-else-if="authorization && !register && position.state==0">
                    <button class="btn1" open-type="getPhoneNumber" @getphonenumber="getphonenumber" @click="type=1"><text class="btn-word">转发该职位</text></button>
                    <button class="btn2" open-type="getPhoneNumber" @getphonenumber="getphonenumber" @click="type=2">
                        <image src="/static/img/myRecommend.png" class="img-spec"></image>
                        <text class="btn-word" style="color:rgba(42, 39, 31, 1)">推荐人才</text>
                    </button>
                </view>
                <!-- 未登录 -->
                <view class="bottom-block" v-else-if="!authorization && !register && position.state==0">
                    <button class="btn" open-type="getUserInfo" @getuserinfo="getuserinfo"><text class="btn-word" style="color:rgba(42, 39, 31, 1)">登录参与推荐</text></button>
                </view>
                <view class="bottom-block" v-else-if="position.state==1">
                    <button class="btn" style="background:rgba(233,233,232,1);" disabled="true"><text class="btn-word" style="color:rgba(127,125,121,1);">该职位已下架</text></button>
                </view>
            </view>
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
        // 职位信息
        this.positionId = par.positionId
        let scene = decodeURIComponent(par.scene)
        if(scene != 'undefined'){
            this.visitType = scene.split('-')[0]
            this.positionId = scene.split('-')[1]
        }
        this.otherToken = par.token
        this.recommendUserName = par.recommendUserName
        this.recommendUserPosition = par.recommendUserPosition
        this.recommendUserCompany = par.recommendUserCompany
        if(par.visitType){
            this.visitType = par.visitType
        }
        uni.request({
            url: ENVIRONMENT_CONFIG.host+'/tr/web/talentRecommend/positionInfo?'+ENVIRONMENT_CONFIG.code,
            method: 'POST',
            data: {
                positionId: this.positionId
            },
            success: res => {
                let realRes = res.data
                if(realRes.code==0){
                    this.position = realRes.data
                    this.position.reward = Math.round(this.position.reward)
                    this.position.salaryMin = Math.round(this.position.salaryMin/1000)
                    this.position.salaryMax = Math.round(this.position.salaryMax/1000)
                    this.salary = this.position.salaryMin + 'k - ' + this.position.salaryMax + 'k'
                    this.position.positionDescription = this.position.positionDescription.replace(/↵/g,"\n")
                    if(this.position.educationLevelId==12){
                        this.position.educationLevelId = 5
                    }
                    //公司信息
                    uni.request({
                        url: ENVIRONMENT_CONFIG.host+'/tr/web/talentRecommend/companyInfo?'+ENVIRONMENT_CONFIG.code,
                        method: 'POST',
                        data: {
                            companyId: this.position.companyId,
                        },
                        success: res => {
                            let realRes = res.data
                            if(realRes.code==0){
                                this.companyDetail = realRes.data.companyDescription.replace(/↵/g,"\n")
                            } else {
                                util.show(realRes.message)
                            }
                        },
                        fail: () =>{
                            util.show('获取公司信息失败')
                        }
                    })
                } else {
                    util.show(realRes.message)
                }
            },
            fail: () =>{
                util.show('获取职位信息失败')
            }
        })
        this.getCode()
    },
    computed: {
        ...mapState(['authorization','code','register','token','unionId','EXPERIENCE','EDUCATION'])
    },
    data(){
        return {
            positionId: 0,
            position: null,
            type: 0,
            otherToken:'',
            recommendUserName:'',
            recommendUserCompany:'',
            recommendUserPosition:'',
            visitType: 0,
            companyDetail: '',
            salary: ''
        }
    },
    methods: {
        getCode() {
            wx.login({
                success: loginRes => {
                    this.$store.commit('setCode', loginRes.code);
                }
            })
        },
        getuserinfo(e){
            if(e.detail.iv && e.detail.encryptedData){
                uni.showLoading({
                    title: '登录中',
                    mask: true
                })
                uni.request({
                    url: ENVIRONMENT_CONFIG.host+'/tr/web/talentRecommend/login?'+ENVIRONMENT_CONFIG.code,
                    method: 'POST',
                    data: {
                        code: this.code,
                        iv: e.detail.iv,
                        encryptedData: e.detail.encryptedData
                    },
                    success: res => {
                        console.log(res)
                        let realRes = res.data
                        if(realRes.code==0){
                            this.$store.commit('setUnionId', realRes.data.unionId)
                            uni.setStorage({
                                key: 'unionIdRelation',
                                data: {
                                    unionId: realRes.data.unionId,
                                }
                            })
                            this.$store.commit('setAuthorization', true)
                            if(realRes.data.token){
                                this.$store.commit('setToken', realRes.data.token)
                                //有电话才是真正注册
                                if(realRes.data.mobile){
                                    this.$store.commit('setRegister', true)
                                    uni.setStorage({
                                        key: 'userInfoRelation',
                                        data: {
                                            token: this.token,
                                        }
                                    })
                                }
                            }
                        } else {
                            util.show(realRes.message)
                        }
                        this.getCode()
                    },
                    fail: () => {
                        this.getCode()
                        console.log('error')
                    },
                    complete: () => {
                        uni.hideLoading()
                    }
                })
            }
        },
        getphonenumber(e){
            if(e.detail.encryptedData && e.detail.iv){
                if(this.token){ //绑定手机号
                    uni.request({
                        url: ENVIRONMENT_CONFIG.host+'/tr/web/talentRecommend/bindMobile?'+ENVIRONMENT_CONFIG.code,
                        method: 'POST',
                        header:{
                            'Authorization': 'Bearer '+this.token
                        },
                        data: {
                            code: this.code,
                            encryptedData: e.detail.encryptedData,
                            iv: e.detail.iv,
                        },
                        success: res => {
                            console.log(res)
                            var realRes = res.data
                            if(realRes.code==0){
                                this.$store.commit('setRegister', true)
                                this.$store.commit('setToken', realRes.data.token)
                                uni.setStorage({
                                    key: 'userInfoRelation',
                                    data: {
                                        token: this.token,
                                    }
                                })
                                if(this.type==1){
                                    this.jumpShare()
                                }else if(this.type==2){
                                    this.jumpRecommend()
                                }
                            } else {
                                util.show(realRes.message)
                            }
                            this.getCode()
                        },
                        fail: () => {
                            this.getCode()
                        }
                    })
                }else{
                    uni.request({
                        url: ENVIRONMENT_CONFIG.host+'/tr/web/talentRecommend/register?'+ENVIRONMENT_CONFIG.code,
                        method: 'POST',
                        data: {
                            code: this.code,
                            encryptedData: e.detail.encryptedData,
                            iv: e.detail.iv,
                            unionId: this.unionId
                        },
                        success: res => {
                            console.log(res)
                            var realRes = res.data
                            if(realRes.code == 0){
                                this.$store.commit('setRegister', true)
                                this.$store.commit('setToken', realRes.data.token)
                                uni.setStorage({
                                    key: 'userInfoRelation',
                                    data: {
                                        token: this.token,
                                    }
                                })
                                if(this.type==1){
                                    this.jumpShare()
                                }else if(this.type==2){
                                    this.jumpRecommend()
                                }
                            } else {
                                util.show(realRes.message)
                            }
                            this.getCode()
                        },
                        fail: () => {
                            this.getCode()
                        }
                    })
                } 
            }
        },
        jumpShare(){
            uni.navigateTo({
                url: '../share/index?positionId='+this.positionId+'&positionName='+this.position.positionName+'&token='+this.token
                        + '&salary='+this.salary
            })
        },
        jumpRecommend(){
            uni.navigateTo({
                url: '../uploadCv/recommender?positionId=' + this.positionId
            })
        },
        jumpCompany(){
            uni.navigateTo({
                url: '../company/index?companyId='+this.position.companyId+'&visitType='+this.visitType
            })
        },
        jumpUpload(){
            uni.navigateTo({
                url: '../uploadCv/candidate?positionId='+this.positionId+'&token='+this.otherToken+'&recommendUserName='+this.recommendUserName+'&recommendUserCompany='+this.recommendUserCompany+'&recommendUserPosition='+this.recommendUserPosition
            })
        },
        onShareAppMessage: function () {
            return{
                title: '【'+this.position.companyName+'】悬赏招聘'+ this.position.positionName +'，赏金'+this.position.reward+'元',
                path: '/pages/position/index?positionId='+this.positionId,
                //imageUrl: '/static/img/share.png'
            }
        },
        jumpPost(){
             uni.navigateTo({
                url: '../post/index?positionId='+this.positionId+'&reward='+this.position.reward
            })
        }
    }
}
</script>


<style scoped>
.content{
    width: 100%;
    height: auto;
    background:rgba(255,255,255,1);
    padding: 0rpx;
}
.positionName{
    width:auto;
    height:40rpx;
    font-size:40rpx;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:500;
    color:rgba(42,39,31,1);
    line-height:60rpx;
    letter-spacing:1rpx;
    margin-left: 40rpx;
    margin-top: 45rpx;
}
.info-label{
    width:72rpx;
    height:28rpx;
    font-size:28rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(42,39,31,1);
    line-height:42rpx;
}
.divider{
    width:1rpx;
    height:19rpx;
    margin-right: 20rpx;
    margin-left: 20rpx;
    color: rgba(212, 212, 210, 1);
}
.blank{
    width:100%;
    height:10rpx;
    background:rgba(244,244,244,1);
}
.blank-spe{
    width:100%;
    height:120rpx;
    background:rgba(255,255,255,1);
}
.reward-tittle{
    font-size:28rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(105,103,98,1);
    line-height:42rpx;
}
.reward-rule{
    font-size:28rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(105,103,98,1);
    line-height:42rpx;
    word-wrap: break-word;
    word-break: break-all;
    text-align: justify;
}
.reward{
    width:112rpx;
    height:28rpx;
    font-size:28rpx;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:500;
    color:rgba(255,44,23,1);
    line-height:42rpx;
    letter-spacing:1rpx;
}
.tittle{
    font-size:34rpx;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:500;
    color:rgba(42,39,31,1);
    line-height:48rpx;
    letter-spacing:1rpx;
}
.job-detail{
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
.block{
    margin-left:40rpx;
    margin-top:50rpx;
    margin-right: 40rpx; 
    margin-bottom: 50rpx;
    height: auto;
}
.bottom-block{
    width:100%;
    height:120rpx;
    background:rgba(255,255,255,1);
    box-shadow:0rpx -1rpx 0rpx 0rpx rgba(0,0,0,0.1);
    position: fixed;
    bottom: 0px;
}
.btn{
    width:auto;
    height:80rpx;
    background:rgba(255,204,54,1);
    box-shadow:0rpx 1rpx 0rpx 0rpx rgba(0,0,0,0.1);
    border-radius:4rpx;
    margin-left: 20rpx;
    margin-top: 20rpx;
    margin-right: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
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
.img-spec{
    width:50rpx;
    height:50rpx;
    margin-right:2rpx;
}
.salary{
    height:34rpx;
    font-size:34rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(43,49,58,1);
    line-height:51rpx;
    float: right;
    text-align: right;
    margin-right: 40rpx;
}
.PhighLight{
    font-size:32rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(105,103,98,1);
    line-height:48rpx;
    margin-right: 40rpx;
    margin-left: 40rpx;
    margin-top: 15rpx;
    margin-bottom: 50rpx;
    text-align: justify;
}
</style>

