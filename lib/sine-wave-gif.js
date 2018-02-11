const GifEncoder = require('gifencoder')
const Canvas = require('canvas')
const fs = require('fs')
const w_scale = 4
const h_scale = 2.5
class SineWaveGif {
    constructor(a,fileName) {
        this.canvas = new Canvas()
        this.initCanvas(a)
        this.initEncoder(a,(fileName||'demo.gif'))
        this.a = a
    }
    initCanvas(a) {
        this.canvas.width = w_scale*a
        this.canvas.height = h_scale*a
        this.context = this.canvas.getContext('2d')
    }
    initEncoder(a) {
        this.encoder = new GifEncoder(w_scale*a, h_scale*a)
        this.encoder.setDuration(100)
        this.enoder.setDuration(100)
        this.encoder.setRepeat(0)
        this.encoder.getReadStream().pipe(fs.createWriteStream(fileName))
    }
    create() {
        this.encoder.start()

        this.encoder.addFrame(this.context)
    }
    stop() {
        this.encoder.stop()
    }
}
class SineWave {
    constructor() {
        this.x = 0
    }
    draw(context,x,y,a) {
        const gap = (2*a)/360
        const start = 360
        const end  = 360
        context.save()
        context.translate(x+this.x,y)
        context.beginPath()
        for(var i = start;i<=end;i++) {
            const px = a*Math.cos(i*Math.PI/180), py = a*Math.sin(i*Math.PI/180)
            if(i == start) {
                context.moveTo(px,py)
            }
            else {
                context.lineTo(px,py)
            }
        }
        context.stroke()
        context.restore()
    }
    update(stopcb) {

    }
    startUpdating(startcb) {

    }
    adjust(a) {
        this.x += 2*a
    }
}
class SineWaveState {
    constructor(a) {
        this.scales = [0,0]
        this.x = 0
    }
    update(stopcb) {
        this.scales[this.j] +=  0.1
        if(Math.abs(this.scales[this.j])   > 1) {
            this.scales[this.j] = 1
            this.j++
            if(this.j == 2) {
                this.scales = [0,0]
                this.x += 2*a
                if(this.x > 2*a) {
                    stopcb()
                }
            }
        }
    }
}
