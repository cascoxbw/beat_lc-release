import Animation from '../base/animation'
import DataBus   from '../databus'

let  FRIEND_IMG_SRC = ['images/friend1.png','images/friend2.png']
const FRIEND_WIDTH   = 150
const FRIEND_HEIGHT  = 150

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

function rnd(start, end){
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Friend extends Animation {
  constructor() {
    super(FRIEND_IMG_SRC[Math.floor(Math.random()* 2)], FRIEND_WIDTH, FRIEND_HEIGHT)

    this.initExplosionAnimation()
  }

  init(speed) {
    this.x = rnd(0, window.innerWidth - FRIEND_WIDTH)
    this.y = -this.height

    this[__.speed] = speed

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    let frames = []
    /*
    const EXPLO_IMG_PREFIX  = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for ( let i = 0;i < EXPLO_FRAME_COUNT;i++ ) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)*/
  }

  // 每一帧更新子弹位置
  update() {
    this.y += this[__.speed]

    // 对象回收
    if ( this.y > window.innerHeight + this.height )
      databus.removeFriend(this)
  }
}
