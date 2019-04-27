
const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

let restart = new Image()
let index = new Image()
let title = new Image()
let title2 = new Image()
let logo = new Image()
restart.src = 'images/friend3.png'
index.src = 'images/bg11181848.jpeg'
title.src = 'images/title.png'
title2.src = 'images/title2.png'
logo.src = 'images/enemy2.png'

export default class GameInfo {
  renderGameScore(ctx, score) {
    ctx.fillStyle = "#ffffff"
    ctx.font      = "20px Arial"

    ctx.fillText(
      score,
      10,
      30
    )
  }
  
  renderGameStart(ctx, version) {
  ctx.fillStyle = "#ffffff"
	ctx.font    = "15px Arial"
	/** 绘制背景 */
	ctx.drawImage(
				index,
				0,
				0,
				780,
				1386,
				0,
				0,
				screenWidth,
				screenHeight
		)

  /** 绘制START*/
	ctx.drawImage(title, screenWidth / 2 - 100, screenHeight / 2 + 190, 200, 70)
	/** 绘制BEAT-LC */
	ctx.drawImage(title2, screenWidth / 2 - 150, screenHeight / 2 - 260, 300, 150)
	/** 绘制LOGO */
	ctx.drawImage(logo, screenWidth / 2 - 150, screenHeight / 2 - 150, 300, 300)

  ctx.fillText(
      'By xbw&lc',
      screenWidth / 2 - 25,
      screenHeight - 10
    )

	ctx.fillText(
			'version ' + version,
			10,
			20
	)
    /** START按钮区域 */
    this.btnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 + 200,
      endX  : screenWidth / 2 + 40,
      endY  : screenHeight / 2 + 230
    }
  }
  renderGameOver(ctx, score, personalHighScore, sorceRiseInterval, scorelist) {
		/** 清屏 */
		ctx.drawImage(
			index,
			0,
			0,
			780,
			1386,
			0,
			0,
			screenWidth,
			screenHeight
		)

		/** 绘制结束图片 */
    ctx.drawImage(restart, screenWidth / 2 - 160, screenHeight / 2 - 250 , 300, 300)

    ctx.fillStyle = "#ffffff"
    ctx.font    = "20px Arial"

    let endword = ""
    
    if (0 === Math.floor(score / sorceRiseInterval)) {
       endword = '还需努力'
    }else if(1 === Math.floor(score / sorceRiseInterval)){
       endword = '干的不错'
    }else if(2 === Math.floor(score / sorceRiseInterval)){
		   endword = '厉害'
		}else if(3 === Math.floor(score / sorceRiseInterval)){
		   endword = '惊艳'
		}

		/** 绘制结束语 */
    ctx.fillText(
        endword,
      screenWidth / 2 - 40,
      screenHeight / 2 + 100
    )

    ctx.fillText(
      '得分: ' + score,
      screenWidth / 2 - 40 ,
      screenHeight / 2 + 100 + 40
    )

    if (personalHighScore) {
      ctx.fillText(
        '最高分: ' + personalHighScore,
        screenWidth / 2 - 40,
        screenHeight / 2 + 100 + 80
      )
    }

    ctx.fillText(
      '重新开始',
      screenWidth / 2 - 40,
      screenHeight / 2 + 100 + 140
    )

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 + 100 + 130,
      endX  : screenWidth / 2  + 60,
      endY  : screenHeight / 2 + 100 + 190
    }
  }
}

