import $ from 'jbone';
import Exoskeleton from 'exoskeleton';

const CameraModel = Exoskeleton.Model.extend({

    domCollection: null,

    points: [],
    totalWidth: 0,
    spacing: 0,

    width: 0,
    height: 0,

    initialize (num, domCollection) {

        this.spacing = domCollection[0].getBoundingClientRect().width;

        this.makePoints(num);
        this.domCollection = domCollection;

        this.width = window.innerWidth;
        this.height = window.innerHeight;

    },

    makePoints (num) {
        for (let i = 0; i < num; i += 1) {
            this.points.push({
                x: i * this.spacing,
                y: window.innerHeight / 2 + Math.sin(i * this.spacing) * 100 - 80,
                scale: 0.5 + Math.random() * 0.5
            });
            this.totalWidth += this.spacing;
        }
    },

    update (speed) {
        this.points.forEach((p, i) => {
            let li = this.domCollection[i];

            if (p.x > -this.spacing && p.x < this.width) {
                $(li).css({
                    transform: `
                        translate3d(${p.x}px, ${p.y}px, 0) 
                        scale(${p.scale}, ${p.scale})
                    `,
                    display: 'block'
                });
            } else {
                $(li).css({
                    display: 'none'
                })
            }

            p.x += -speed;
 
            if (p.x <= -this.width) {
                p.x += this.totalWidth;
            } else if (p.x >= this.totalWidth - this.width) {
                p.x -= this.totalWidth;
            }
            
        });
    },
    
    onresize (width, height) {
        this.width = width;
        this.height = height;
    },

    getDistance () {
        return this.points[0].x;
    }

});

export default CameraModel;