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