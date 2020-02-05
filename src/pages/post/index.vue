<template>
	<view class="post-content">
		<view class="post">
			<view style="text-align:right;padding-top:80rpx;">
				<image v-if="isGene" src="/static/img/close.png" class="close" @click="close"></image>
			</view>
			<view class="wrapper" @longpress="longPress">
				<canvas style="height: 100%;width: 100%;backgroundColor: #FFFFFF" canvas-id="firstCanvas"></canvas>
			</view>
			<view class="bottom-block"><span class="bottom">长按保存图片至相册</span></view>
		</view>
	</view>
</template>
 
<script>
	import ENVIRONMENT_CONFIG from '../../config/envConfig.js'
	import {mapState} from 'vuex'
	import util from '@/utils/util.js'
	export default {
		name: 'canvas-drawer',
		computed: {
			...mapState(['EXPERIENCE','EDUCATION'])
		},
		data() {
			return {
				position: null,
				positionId: '',
				companyId:'',
				companyName: '',
				val: '',
				cover: ENVIRONMENT_CONFIG.imageUrl,
				jobList:[],
				isGene: false,
				reward: 6000,
				outWidth: 0
			};
		},
		onLoad(par) {
			this.positionId = par.positionId
			this.companyId = par.companyId
			if(par.reward){
				this.reward = par.reward
			}
			if(this.positionId){
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
							if(this.position.educationLevelId==12){
								this.position.educationLevelId = 5
							}
							this.genPqrcode()
						} else {
							util.show(realRes.message)
						}
					},
					fail: () =>{
						util.show('获取职位信息失败')
					}
				})
			}else{
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
							this.genCqrcode()
						} else {
							util.show(realRes.message)
						}
					},
					fail: () =>{
						util.show('获取公司信息失败')
					}
				})
				uni.request({
					url: ENVIRONMENT_CONFIG.host+'/tr/web/talentRecommend/positionList?'+ENVIRONMENT_CONFIG.code,
					method: 'POST',
					data: {
						companyId: this.companyId,
						page: 1,
						pageSize: 3
					},
					success: res => {
						let realRes = res.data
						if(realRes.code==0){
							this.jobList = realRes.data.list
						} else {
							util.show(realRes.message)
						}
					},
					fail: () =>{
						util.show('获取职位列表失败')
					}
				})
			}
		},
		methods: {
			qrRPosition(path) {
				let that = this;
				let system_info = uni.getSystemInfoSync();
				let ctx = uni.createCanvasContext('firstCanvas');
				uni.showLoading({
					title: '海报生成中',
					mask: true
				})
				uni.getImageInfo({
					src: that.cover,
					success(res) {
						let w = wx.getSystemInfoSync().windowWidth
						let h = w * 1.45 < 500 ? 500 : w * 1.45
						that.outerWidth = w
						// ctx.drawImage(path, w/2-uni.upx2px(200)/2, 0.55*h,uni.upx2px(200),uni.upx2px(200));
						// that.isGene = true
						// ctx.draw(false, () => {})
						ctx.drawImage(res.path, 0, 0, w, h)
						ctx.font = "25px SourceHanSansCN-Bold,SourceHanSansCN"
						ctx.setTextAlign('left')
						ctx.fillText('悬赏推荐',25,h*0.095)
						
						ctx.font = "20px SourceHanSansCN-Bold,SourceHanSansCN"
						ctx.setTextAlign('left')
						ctx.fillText('推荐入职奖励最高'+that.reward+'元',25,h*0.17)

						ctx.font = "25px SourceHanSansCN-Bold,SourceHanSansCN"
						ctx.setFillStyle('rgba(255, 255, 255, 1)')
						ctx.setTextAlign('center')
						ctx.fillText(that.position.positionName,w/2,h*0.34)
						
						ctx.font = "15px SourceHanSansCN-Bold,SourceHanSansCN"
						ctx.fillText(that.position.companyName,w/2,h*0.40)
						ctx.fillText(''+that.EXPERIENCE[that.position.workYearId]
							+' | '+that.EDUCATION[that.position.educationLevelId]
							+' | '+that.position.cityName,w/2,h*0.45)
						ctx.font = "18px SourceHanSansCN-Bold,SourceHanSansCN"
						ctx.fillText(that.position.salaryMin/1000+'-'+that.position.salaryMax/1000+'k',w/2,0.5*h)
						
						ctx.setFillStyle('rgba(42, 39, 31, 1))')
						ctx.fillText('长按识别，了解详情',w/2,h*0.86)
						ctx.arc(w/2, 0.67*h, uni.upx2px(125), 0, 2 * Math.PI)
						ctx.clip()
						ctx.drawImage(path, w/2-uni.upx2px(250)/2, 0.67*h-uni.upx2px(125),uni.upx2px(250),uni.upx2px(250));
						that.isGene = true
						ctx.draw(false, () => {})
						
					},
					fail(error) {
						console.log(error);
					},
                    complete: () => {
                        uni.hideLoading()
                    }
				})
			},
			qrRCompany(path) {
				let that = this;
				let system_info = uni.getSystemInfoSync();
				let ctx = uni.createCanvasContext('firstCanvas');
				uni.showLoading({
					title: '海报生成中',
					mask: true
				})
				uni.getImageInfo({
					src: that.cover,
					success(res) {
						let w = wx.getSystemInfoSync().windowWidth
						let h = w * 1.45 < 500 ? 500 : w * 1.45
						that.outerWidth = w
						ctx.drawImage(res.path, 0, 0, w, h)
						ctx.font = "25px SourceHanSansCN-Bold,SourceHanSansCN"
						ctx.setTextAlign('left')
						ctx.fillText('悬赏推荐',25,h*0.095)

						ctx.font = "20px SourceHanSansCN-Bold,SourceHanSansCN"
						ctx.setTextAlign('left')
						ctx.fillText('推荐入职，领取奖金',25,h*0.17)

						ctx.font = "25px SourceHanSansCN-Bold,SourceHanSansCN"
						ctx.setFillStyle('rgba(255, 255, 255, 1)')
						ctx.setTextAlign('center')
						ctx.fillText(that.companyName,w/2,h*0.36)
						
						ctx.font = "18px SourceHanSansCN-Bold,SourceHanSansCN"
						var job = ''
						for(let item of that.jobList){
							if(job){
								job += ' · '
							}
							job += item.positionName
						}
						ctx.fillText(job,w/2,h*0.44)
						ctx.setFillStyle('rgba(42, 39, 31, 1))')
						ctx.fillText('长按识别，了解详情',w/2,h*0.86)
						ctx.arc(w/2, 0.67*h, uni.upx2px(125), 0, 2 * Math.PI)
						ctx.clip()
						ctx.drawImage(path, w/2-uni.upx2px(250)/2, 0.67*h-uni.upx2px(125),uni.upx2px(250),uni.upx2px(250));
						//ctx.drawImage(path, w/2-uni.upx2px(200)/2, 0.55*h,uni.upx2px(200),uni.upx2px(200));
						that.isGene = true
						ctx.draw(false, () => {})
					},
					fail(error) {
						console.log(error);
					},
                    complete: () => {
                        uni.hideLoading()
                    }
				})
			},
			longPress(){
				let that = this
				wx.showModal({ 
					content:'保存图片至相册？',
					success:function(res){
						if(res.confirm){ //判断用户是否点击了确定
							that.saveImg()
						}
					}
			    })
			},
			saveImg(){
				uni.canvasToTempFilePath({
					x: 0,
					y: 0,
					width: this.outWidth,
					height: this.outWidth*1.45,
					destWidth: this.outWidth*4,
					destHeight: this.outWidth*1.45*4,
					canvasId: 'firstCanvas',
					success: function(res) {
						console.log(res)
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function() {
								uni.navigateBack()
							}
						});
					},
					fail(e) {
						console.log(e);
						uni.showToast({
							title: '生成海报失败',
							icon: 'none'
						});
					}
				})
			},
			close(){
				uni.navigateBack()
			},
			genPqrcode(){
				uni.request({
					url: ENVIRONMENT_CONFIG.host+'/tr/web/talentRecommend/positionShare?'+ENVIRONMENT_CONFIG.code,
					method: 'POST',
					data: {
						positionId: this.positionId
					},
					success: res => {
						console.log(res)
						let realRes = res.data
						if(realRes.code==0){
							//this.qrCode = 'data:image/jpg;base64, ' + realRes.data.wechatAppCode
							const filePath = `${wx.env.USER_DATA_PATH}/temp_image.jpeg`;
							/// 将base64转为二进制数据
							const buffer = wx.base64ToArrayBuffer(realRes.data.wechatAppCode);
							/// 绘制成图片
							let that = this
							wx.getFileSystemManager().writeFile({
								filePath,
								data: buffer,
								encoding: 'binary',
								success() {
									that.qrCode = filePath
									that.qrRPosition(that.qrCode)
								},
								fail() { 
									console.log('error base 64')
								}
							});
						} else {
							util.show(realRes.message)
						}
					},
					fail: () =>{
						util.show('获取二维码失败')
					}
				})
			},
			genCqrcode(){
				uni.request({
					url: ENVIRONMENT_CONFIG.host+'/tr/web/talentRecommend/companyShare?'+ENVIRONMENT_CONFIG.code,
					method: 'POST',
					data: {
						companyId: this.companyId
					},
					success: res => {
						console.log(res)
						let realRes = res.data
						if(realRes.code==0){
							//this.qrCode = 'data:image/jpg;base64, ' + realRes.data.wechatAppCode
							const filePath = `${wx.env.USER_DATA_PATH}/temp_image.jpeg`;
							/// 将base64转为二进制数据
							const buffer = wx.base64ToArrayBuffer(realRes.data.wechatAppCode);
							/// 绘制成图片
							let that = this
							wx.getFileSystemManager().writeFile({
								filePath,
								data: buffer,
								encoding: 'binary',
								success() {
									that.qrCode = filePath
									that.qrRCompany(that.qrCode)
								},
								fail() { 
									console.log('error base 64')
								}
							});
						}
					},
					fail: () =>{
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
	};
</script>
 
<style lang="scss">
.post-content{
	width: 100%;
	background:rgba(255, 255, 255, 1);
}
.post {
	height: 100%;
	background:rgba(42, 39, 31, 0.9);

	.wrapper {
		height: 1020rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
.bottom{
	width:306rpx;
	height:34rpx;
	font-size:34rpx;
	font-family:SourceHanSansCN-Regular,SourceHanSansCN;
	font-weight:400;
	color:white;
	line-height:51rpx;
}
.close{
	width:60rpx;
	height:60rpx;
	margin-bottom: 20rpx;
	margin-right: 10rpx;
}
.bottom-block{
	text-align: center;
	margin-top: 75rpx;
	margin-bottom: 125rpx;
}
</style>