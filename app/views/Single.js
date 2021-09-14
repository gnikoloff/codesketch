import _ from 'underscore';
import $ from 'jbone';
import Exoskeleton from 'exoskeleton';

const Single = Exoskeleton.View.extend({

    iframeContainer: null,
    iframe:          null,
    visibleLis:      null,
    activeLi:        null,
    backBtn:         null,

    width:  0,
    height: 0,

    el: $('.singlepage'),
    loading: $('.page-switcher'),

    initialize () {
        this.width  = window.innerWidth;
        this.height = window.innerHeight;
        this.iframeContainer = this.$el.find('.iframe-container');
        this.backBtn = this.$el.find('.back-link');
    },

    open (key, tween) {

        this.visibleLis = $('.sketches li[style*="display: block"]');
        if (this.visibleLis) {
            this.visibleLis.forEach((li, index) => {
                li = $(li);
                if (li.attr('id') === key) {
                    this.activeLi = li;
                    tween.to(li, 0.2, {
                        x: `${this.width / 2 - parseInt(li.css('width')) / 2}px`,
                        y: `${this.height / 2 - 80}px`,
                        scaleX: 1,
                        scaleY: 1
                    })
                } else {
                    tween.to(li, 0.1, { opacity: 0 })
                }
            });
        }
        tween.add(() => this.appendIframe(key, tween));
        if (this.activeLi) tween.to(this.activeLi.find('.sketch-title-panel'), 0.2, { x: '0%' });
        tween.to(this.loading, 0.2, { scaleX: 1, transformOrigin: '0 0 0', ease: Power3.easeOut })
    },

    close (tween) {
        tween.to(this.loading, 0.3, { opacity: 1 });
        tween.add(() => this.iframe.remove() );
        tween.to(this.loading, 0.4, { scaleX: 0, transformOrigin: '100% 0 0', ease: Power3.easeIn });
        if (this.visibleLis) {
            this.visibleLis.forEach((li, index) => {
                tween.to(li, 0.1, { opacity: 1 })
            });
        }
        if (this.activeLi) tween.to(this.activeLi.find('.sketch-title-panel'), 0.2, { x: '-100%' });
        
    },

    iframeLoaded (tween) {
        if (this.activeLi) tween.to(this.activeLi, .4, { x: `-300px`, opacity: 0 })
        tween.to(this.loading, 0.25, { opacity: 0 });
        tween.fromTo(this.backBtn, 0.2, { y: '-120px', ease: Power3.easeOut }, { y: '0px' });
    },

    appendIframe (key, tween) {
        this.iframe = $('<iframe></iframe');
        this.iframe.attr('width', this.width);
        this.iframe.attr('height', this.height);
        this.iframeContainer.append(this.iframe);
        this.iframe.on('load', this.iframeLoaded.bind(this, tween));
        this.iframe.attr('src', `https://codepen.io/gbnikolov/full/${key}`);
    },

    onresize (width, height) {
        this.width = width;
        this.height = height;
    }

});

export default Single;