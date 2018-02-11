const GifEncoder = require('gifencoder')
const Canvas = require('canvas')
const fs = require('fs')
const w_scale = 4
const h_scale = 2.5
class SineWaveGif {
    constructor(a,color,fileName) {
        this.canvas = new Canvas()
        this.initCanvas(a,color || '#FF5722')
        this.initEncoder(a,(fileName||'demo.gif'))
        this.a = a
        this.renderer = new Renderer()
    }
    initCanvas(a,color) {
        this.canvas.width = w_scale*a
        this.canvas.height = h_scale*a
        this.context = this.canvas.getContext('2d')
        this.context.strokeStyle = color
        this.context.lineWidth = a/15
        this.context.lineCap = 'round'
    }
    initEncoder(a,fileName) {
        this.encoder = new GifEncoder(w_scale*a, h_scale*a)
        this.encoder.setQuality(100)
        this.encoder.setDelay(100)
        this.encoder.setRepeat(0)
        this.encoder.createReadStream().pipe(fs.createWriteStream(fileName))
    }
    create() {
        this.encoder.start()
        this.renderer.render(this.context,this.canvas.width,this.canvas.height,this.a,() => {
            this.encoder.addFrame(this.context)
        }, () => {
            this.stop()
        })
    }
    stop() {
        this.encoder.end()
    }
}
class SineWave {
    constructor() {
        this.state = new SineWaveState()
    }
    draw(context,x,y,a,stopcb) {
        const gap = (2*a)/360
        const start = 360*this.state.scales[1]
        const end  = 360*this.state.scales[0]
        context.save()
        context.translate(x+this.state.x,y)
        context.beginPath()
        for(var i = start;i<=end;i++) {
            const px = (2*a*i)/360, py = a*Math.sin(i*Math.PI/180)
            if(i == start) {
                context.moveTo(px,py)
            }
            else {
                context.lineTo(px,py)
            }
        }
        context.stroke()
        context.restore()
        this.state.update(a,stopcb)
        // console.log(start)
        // console.log(end)
    }
}
class SineWaveState {
    constructor() {
        this.scales = [0,0]
        this.x = 0
        this.j = 0
    }
    update(a,stopcb) {
        //console.log(this.scales)
        this.scales[this.j] +=  0.1
        if(Math.abs(this.scales[this.j])   > 1) {
            this.scales[this.j] = 1
            this.j++
            // console.log(this.scales)
            // console.log(this.j)
            if(this.j == 2) {
                this.j = 0
                this.scales = [0,0]
                this.x += 2*a
                if(this.x > 2*a) {
                    stopcb()
                }
            }
        }
    }
}
class Renderer {
    constructor() {
        this.running = true
        this.sineWave = new SineWave()
    }
    render(context,w,h,a,updatecb,stopcb) {
        while(this.running) {
            //console.log(this.running)
            context.clearRect(0,0,w,h)
            this.sineWave.draw(context,0,h/2,a,() => {
                this.running = false
                stopcb()
            })
            updatecb()
        }
    }
}
const createSineWaveGif = (a,color,fileName) => {
    const sineWaveGif = new SineWaveGif(a, color, fileName)
    sineWaveGif.create()
}
module.exports = createSineWaveGif
