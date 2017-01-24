import $ from 'jbone';
import Exoskeleton from 'exoskeleton';

import Cursor from '../utils/Pointer';

const BackgroundModel = Exoskeleton.Model.extend({

    ctx:    null,
    width:  null,
    height: null,
    points: null,
    radius: null,

    el: $('<canvas></canvas>'),
    loaded: false,

    angle: 0,
    number: 0,
    progress: {
        circle: 0,
        indicatorOpacity: 0
    },
    flags: [],

    initialize (parent, num) {
        this.number = num;
        console.log(num)
        this.width =  this.el[0].width = window.innerWidth;
        this.height = this.el[0].height = window.innerHeight;
        this.radius = 200;
        this.ctx = this.el[0].getContext('2d');     
        
        this.ctx.imageSmoothingEnabled = false;

        parent.append(this.el);

        this.points = [
            { startX: this.width /  2 - 80, startY: this.height / 2 - 30, x: 0, y: 0 },
            { startX: this.width / 2 - 80, startY: this.height / 2 - 30, x: this.width, y: 0 },
            { startX: this.width / 2 - 80, startY: this.height / 2 + 30, x: this.width, y: this.height },
            { startX: this.width / 2 - 80, startY: this.height / 2 + 30, x: -this.width, y: this.height }
        ];

        for (let i = Math.PI, step = Math.floor(num / 18); i > -Math.PI; i -= (Math.PI * 2) / step) {
            
            this.flags.push({
                x: this.width / 2 + Math.sin(i) *  this.radius,
                y: this.height / 2 + Math.cos(i) * this.radius,
                opacity: 0
            });
        }
    },

    update (dist, max) {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.drawShape();

        this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.rotate(180 * Math.PI / 180)
        
        this.ctx.fillStyle = '#eee';
        this.ctx.beginPath();
        this.ctx.arc(
            0,
            0,
            this.radius - 12,
            0,
            this.progress.circle,
            true
        );
        this.ctx.fill();

        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(
            0,
            0,
            this.radius,
            0,
            this.progress.circle,
            true
        );
        this.ctx.stroke();

        const dv = Math.PI * 2 / max;
        this.angle = dist * dv;

        this.ctx.rotate(-180 * Math.PI / 180);
        this.ctx.translate(-this.width / 2, -this.height / 2);
        this.flags.forEach((v, i) => {
            this.ctx.globalAlpha = v.opacity;
            this.ctx.beginPath();
            this.ctx.fillStyle = 'whitesmoke';
            this.ctx.arc(v.x, v.y, 9, 0, Math.PI * 2, true);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.fillStyle = '#aaa';
            this.ctx.arc(v.x, v.y, 2.5, 0, Math.PI * 2, true);
            this.ctx.fill();
        });

        this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.rotate(-180 * Math.PI / 180)
        this.ctx.globalAlpha = this.indicatorOpacity;
        Cursor.update(
            this.ctx,
            this.angle,
            Math.sin(this.angle) * this.radius,
            Math.cos(this.angle) * this.radius
        );

        this.ctx.restore();
    },

    drawShape () {
        this.ctx.fillStyle = 'whitesmoke'
        this.ctx.beginPath();
        this.ctx.moveTo(this.points[0].startX, this.points[0].startY);
        this.ctx.lineTo(this.points[1].startX, this.points[1].startY);
        this.ctx.lineTo(this.points[2].startX, this.points[2].startY);
        this.ctx.lineTo(this.points[3].startX, this.points[3].startY);
        this.ctx.closePath();
        this.ctx.fill();
    },

    showLoading (tween) {
        if (!this.loaded) {
        tween.to(this.points[1], 2, { startX: this.width / 2 + 80 });
        tween.to(this.points[2], 2, { startX: this.width / 2 + 80 }, '-=2');
        
        tween.to(this.points[0], 0.25, { startX: this.points[0].x, startY: this.points[0].y, ease: Power3.easeIn }, '-=0.175');
        tween.to(this.points[1], 0.25, { startX: this.points[1].x, startY: this.points[1].y, ease: Power3.easeIn }, '-=0.175');
        tween.to(this.points[2], 0.25, { startX: this.points[2].x, startY: this.points[2].y, ease: Power3.easeIn }, '-=0.175');
        tween.to(this.points[3], 0.25, { startX: this.points[3].x, startY: this.points[3].y, ease: Power3.easeIn }, '-=0.175');
        }
        this.loaded = true;
        tween.to(this.progress, 0.7, { circle: -Math.PI * 2, ease: Power3.easeOut })
        tween.to(this.progress, 0.2, { indicatorOpacity: 1 })

        this.flags.forEach((v, i) => {
            tween.to(v, 0.1, { opacity: 1 });
        });
        
    },

    onresize (width, height) {
        this.width = this.el[0].width = width;
        this.height = this.el[0].height = height;
    }

});

export default BackgroundModel;