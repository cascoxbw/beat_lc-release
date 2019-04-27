import Player     from './player/index'
import Enemy      from './npc/enemy'
import Friend     from './npc/friend'
import BackGround from './runtime/background'
import GameInfo   from './runtime/gameinfo'
import Music      from './runtime/music'
import DataBus    from './databus'

let ctx   = canvas.getContext('2d')
let databus = new DataBus()

const ENEMYINTERVAL = 50
const FRIENDINTERVAL = 40

const SPEEDRISEINTEVAL  = 2
const SPEEDINIT  = 6

const SCORERISEINTEVAL  = 20
const SCOREINIT  = 0

const version = '1.0.0'

//wx.cloud.init()
//const db = wx.cloud.database()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId    = 0
    this.personalHighScore = 0
		this.scoreList = []
		this.openid = ''
		this.name = 'xbw'
		this.gameStart = true
	  this.gameStartBtnArea = []
		this.restart()
    this.login()
		this.share()
  }

	share() {

			wx.showShareMenu()
			wx.onShareAppMessage(function () {
				return {
					title: '让别人也来找点乐子',
					imageUrl: canvas.toTempFilePathSync({
						destWidth: 500,
						destHeight: 400
					})
				}
			})
  }
  
  login() {
    let that = this
    wx.login({
      success: function (res) {
        //console.log(res.code)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://godaibuy.xyz/onlogin',
            data: {
              code: res.code
            },
            method: 'POST',
            header: {'content-type': 'application/x-www-form-urlencoded'},

            success: function (res) {
              wx.setStorageSync('login', res.data)
							that.openid = res.data.openid
            
            } 
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "提示",
          content: "登陆失败",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        })
      },
    })
	
  }

  
  prefetchHighScore() {
  /*
    let i
	//console.log(this.scoreList[0]['score'])
    for (this.personalHighScore = this.scoreList[0]['score'],i =0;
					i < this.scoreList.length;
					i++){
    	if (this.scoreList[i]['score'] > this.personalHighScore){
				this.personalHighScore = this.scoreList[i]['score']
			}
		}*/
		this.personalHighScore = this.scoreList[0]['highest']
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.bg       = new BackGround(ctx)
    this.player   = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music    = new Music()

    this.bindLoop     = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
				
				
    )

  }

  /**调节下落速度*/
  speedCtrl() {
    /*
		if (SCORERISEINTEVAL > this.personalHighScore)
		{
		databus.enemyspeed = SPEEDINIT
		databus.friendspeed = SPEEDINIT + 2
		}
		else  if (SCORELEVEL1 <=  this.personalHighScore < SCORELEVEL2)
		{
		
		databus.enemyspeed = SPEEDLEVEL2
		databus.friendspeed = SPEEDLEVEL2 + 2
		}
		else  if (SCORELEVEL2 <= this.personalHighScore < SCORELEVEL3)
		{
		databus.enemyspeed = SPEEDLEVEL3
		databus.friendspeed = SPEEDLEVEL3 + 2
		}
*/
    let lv = Math.floor(databus.score / SCORERISEINTEVAL)
	  if (lv * SCORERISEINTEVAL >= databus.score){
    	databus.enemyspeed = lv * SPEEDRISEINTEVAL + SPEEDINIT
			databus.friendspeed = lv * SPEEDRISEINTEVAL + SPEEDINIT + 2
			//console.log('boos-speed',databus.enemyspeed,'friend',databus.friendspeed)
		}
		//console.log('boos-speed',databus.enemyspeed,'friend',databus.friendspeed)
	
	}
	
  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
   	this.speedCtrl()
	
    if ( databus.frame % ENEMYINTERVAL === 0 ) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(databus.enemyspeed)
      databus.enemys.push(enemy)
    
    }

    if ( databus.frame % FRIENDINTERVAL === 0 ) {
        let friend = databus.pool.getItemByClass('friend', Friend)
        friend.init(databus.friendspeed)
        databus.friends.push(friend)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this

    for ( let i = 0, il = databus.enemys.length; i < il;i++ ) {
      let enemy = databus.enemys[i]

      if ( this.player.isCollideWith(enemy) ) {
          enemy.playAnimation()
					that.music.playShoot()
          databus.score  += 1

        break
      }
    }

    for ( let i = 0, il = databus.friends.length; i < il;i++ ) {
      let friend = databus.friends[i]

      if ( this.player.isCollideWith(friend) ) {
          databus.gameOver = true
					
					
			    if (databus.score > this.personalHighScore) {
            this.personalHighScore = databus.score
					}
					
					this.setScorelist()
					this.getScorelist()
			
          break
      }
    }
  }
  
	getScorelist(){
    let that = this;
    let url = 'https://godaibuy.xyz/getscorelist';
    wx.request({
					url: url,
					data: { },
					method: 'POST',
					header: { 'content-type': 'application/x-www-form-urlencoded' },

					success: function (res) {
						console.log(res.data)
						that.scoreList = res.data
						that.prefetchHighScore()
					
						console.log('getscorelist',that.scoreList,'highscore',that.personalHighScore)
					},
					fail: function (res) {
						// fail
						wx.showModal({
							title: "提示",
							content: "获取排行榜失败",
							showCancel: false,
							success: function (res) {
								if (res.confirm) {
								} else if (res.cancel) {
								}
							}
						})
					},
				})
    
  }
  
  setScorelist() {
    let that = this;
    let url = 'https://godaibuy.xyz/setscorelist'
	console.log('setscorelist',databus.score,'highscore',that.personalHighScore)
    wx.request({
      url: url,
      data: {
        openid:that.openid,
        name: that.name,
				score:databus.score,
				highest:that.personalHighScore
			},
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },

      success: function (res) {
				
      },
      fail: function (res) {
        wx.showModal({
          title: "提示",
          content: "上传分数失败",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        })
      },
    })

  }
  
  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
     e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea

    if (   x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY  )
			this.gameStart = false
      this.restart()

  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)

    databus.enemys.forEach((item) => {
              item.drawToCanvas(ctx)
            })

    databus.friends.forEach((item) => {
            item.drawToCanvas(ctx)
        })

    this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
      if ( ani.isPlaying ) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.score)
	
	  if (this.gameStart ){
		 
			this.gameinfo.renderGameStart(
				ctx,
				version
			)
		
		  if ( !this.hasEventBind ) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
		}

		
    // 游戏结束停止帧循环
    if ( databus.gameOver ) {
      this.gameinfo.renderGameOver(
        ctx, 
        databus.score,
        this.personalHighScore,
					SCORERISEINTEVAL,
					this.scoreList
      )

		
      if ( !this.hasEventBind ) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  update() {
  	if (this.gameStart){
  		return
		}
    if ( databus.gameOver )
      return;

    //this.bg.update()

		databus.enemys.forEach((item) => {
              item.update()
            })

		databus.friends.forEach((item) => {
            item.update()
        })
    this.enemyGenerate()

    this.collisionDetection()

  }

  // 实现游戏帧循环
  loop() {
    databus.frame++
	
    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
