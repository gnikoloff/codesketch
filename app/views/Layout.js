import _ from 'underscore';
import $ from 'jbone';
import Exoskeleton from 'exoskeleton';
import GSAP from 'gsap';

import Home from './Home';
import Single from './Single';
import Styles from '../../styles/imports.scss';

const Layout = Exoskeleton.View.extend({
    
    collection: null,
    home:       null,
    single:     null,
    ref_id:     null,

    el: $('#app'),
    tween: new TimelineMax(),

    initialize (collection) {

        console.log('%c ໒(•න꒶̭න•)७ https://www.youtube.com/watch?v=5pMCmu6Ov1k', 'background: #17293a; color: #fff; padding: 12px;');

        $('#app').css('display', 'block');
        this.collection = collection;
        this.home = new Home(collection);
        this.single = new Single();

        this.updateAnimationFrame();

        window.onresize = this.onresize.bind(this);

    },

    openSingle (key) {
        this.stopAnimationFrame();
        this.single.open(key, this.tween);
        this.tween.add(() => {
            $('.homepage').css('pointer-events', 'none');
        });
    },

    closeSingle () {
        this.single.close(this.tween);
        this.updateAnimationFrame();
        this.tween.add(() => {
            $('.homepage').css('pointer-events', 'initial');
        });
    },

    updateAnimationFrame () {
        this.ref_id = window.requestAnimationFrame(this.updateAnimationFrame.bind(this));
        this.home.updateAnimationFrame();
    },

    stopAnimationFrame () {
        window.cancelAnimationFrame(this.ref_id);
    },

    showLoading () {
        this.home.showLoading(this.tween);
    },

    showQuickLoad () {
        this.home.showLoadingQuick(this.tween);
    },

    onresize () {
        const { innerWidth: width, innerHeight: height } = window;
        this.home.onresize(width, height);
        this.single.onresize(width, height);
    }

});

export default Layout;