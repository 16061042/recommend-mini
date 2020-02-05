<template>
    <view style="width:100%">
        <view class="content">
            <form class="block">
                <text class="title">姓名</text><input class="input" v-model="name" placeholder="请输入" placeholder-style="color:rgba(197,199,201,1);text-align:right;" placeholder-class="placeholderStyle"/>
                <view class="blank"></view>
                <text class="title">手机号</text><input class="input" disabled="true" v-model="mobile" placeholder="请输入" placeholder-style="color:rgba(197,199,201,1);text-align:right;" placeholder-class="placeholderStyle"/>
                <view class="blank"></view>
                <text class="title">公司</text><input class="input" v-model="company" placeholder="请输入" placeholder-style="color:rgba(197,199,201,1);text-align:right;" placeholder-class="placeholderStyle"/>
                <view class="blank"></view>
                <text class="title">职位</text><input class="input" v-model="position" placeholder="请输入" placeholder-style="color:rgba(197,199,201,1);text-align:right;" placeholder-class="placeholderStyle"/>
                <view class="blank"></view>
            </form>
        </view>
        <view class="bottom-block" @click="formSubmit">
            <button class="btn"><text class="btn-word">保存</text></button>
        </view>
    </view>
</template>

<script>
import ENVIRONMENT_CONFIG from '../../config/envConfig.js'
import {mapState} from 'vuex'
import util from '@/utils/util.js'
export default {
    onLoad(){
        uni.request({
            url: ENVIRONMENT_CONFIG.host+'/tr/api/talentRecommend/recommendUserInfo?'+ENVIRONMENT_CONFIG.code,
            method: 'POST',
            header:{
                'Authorization': 'Bearer '+this.token
            },
            success: res => {
                let realRes = res.data
                if(realRes.code!=0){
                    util.show(realRes.message)
                }else{
                    this.name = realRes.data.recommendUserName
                    this.mobile = realRes.data.recommendUserMobile
                    this.company = realRes.data.recommendUserCompany
                    this.position = realRes.data.recommendUserPosition
                }
            },
            fail: () => {
                console.log('error')
            }
        })
    },
    computed:{
        ...mapState(['token'])
    },
    data() {
        return {
            name: '',
            mobile: '',
            company: '',
            position: ''
        }
    },
    methods: {
        formSubmit(){
            uni.request({
                url: ENVIRONMENT_CONFIG.host+'/tr/api/talentRecommend/updateRecommendUserInfo?'+ENVIRONMENT_CONFIG.code,
                method: 'POST',
                header:{
                    'Authorization': 'Bearer '+this.token
                },
                data: {
                    recommendUserName: this.name,
                    recommendUserCompany: this.company,
                    recommendUserPosition: this.position
                },
                success: res => {
                    let realRes = res.data
                    if(realRes.code!=0){
                        util.show(realRes.message)
                    }else{
                        uni.redirectTo({
                            url: 'success'
                        })
                    }
                },
                fail: () => {
                    console.log('error')
                }
            })
        },
        onShareAppMessage: function () {
            return{
                title: '推荐简历，兼职赚钱',
                path: '/pages/main/main',
                //imageUrl: '/static/img/share.png'
            }
        }
    }
}
</script>


<style scoped>
.content{
    width: 100%;
    background: rgba(255,255,255,1);
    padding: 0rpx;
}
.block{
    margin-left:40rpx;
    margin-top:50rpx;
    margin-right: 40rpx; 
    height: auto;
}
.title{
    width:auto;
    height:32rpx;
    font-size:32rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    color:rgba(63,60,53,1);
    line-height:48rpx;
}
.input{
    float: right;
    text-align: right;
}
.placeholderStyle{
    width:auto;
    height:32rpx;
    font-size:32rpx;
    font-family:SourceHanSansCN-Regular,SourceHanSansCN;
    font-weight:400;
    line-height:48rpx;
}
.blank{
    width:100%;
    height:1rpx;
    background:rgba(244,244,244,1);
    margin-top: 40rpx;
    margin-bottom: 40rpx;
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
.btn-word{
    width:auto;
    font-size:30rpx;
    font-family:SourceHanSansCN-Medium,SourceHanSansCN;
    font-weight:500;
    color:rgba(42,39,31,1);
    line-height:45rpx;
    letter-spacing:1rpx;
}
</style>

