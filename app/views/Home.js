import _ from 'underscore';
import $ from 'jbone';
import Exoskeleton from 'exoskeleton';

import CameraModel from '../models/CameraModel';
import BackgroundModel from '../models/BackgroundModel';

const Home = Exoskeleton.View.extend({
    
    collection:      null,
    cameraModel:     null,
    backgroundModel: null,
    
    startScrollX: 0,
    velocity:     0,
    speed:        0.075,
    friction:     0.95,

    el:       $('.homepage'),
    template: _.template($('#homepage-template').html()),

    initialize (collection) {

        this.collection = collection;
        this.render();

        this.cameraModel = new CameraModel(collection.length, this.$el.find('.sketches-list li'));
        this.backgroundModel = new BackgroundModel($('.background-canvas'), collection.length);

        this.touchStart = this.touchStart.bind(this);
        this.touchMove  = this.touchMove.bind(this);
        this.touchEnd   = this.touchEnd.bind(this);

        this.mouseDown  = this.mouseDown.bind(this);
        this.mouseMove  = this.mouseMove.bind(this);
        this.mouseUp    = this.mouseUp.bind(this);

        this.setHandlers();

    },

    setHandlers () {
        this.$el.on('mousedown', this.mouseDown);
        this.$el.on('touchstart', this.touchStart);
    },

    touchStart (e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        if (e.target.nodeName !== 'IMG') {
            e.preventDefault();
        }
        this.$el.on('touchmove', this.touchMove);
        this.$el.on('touchend', this.touchEnd);
        this.startScrollX = e.touches[0].pageX;
    },

    touchMove (e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        e.stopImmediatePropagation()
        if (e.touches[0].pageX !== undefined) {
            this.velocity = -(e.touches[0].pageX - this.startScrollX) / 7;
        }
        if (this.velocity < 0) this.speed = -0.075;
        if (this.velocity > 0) this.speed = 0.075; 
    },

    touchEnd () {
        this.$el.off('touchmove', this.touchMove);
        this.$el.off('touchend', this.touchEnd);
    },

    mouseDown (e) {
        this.$el.on('mousemove', this.mouseMove);
        this.$el.on('mouseup', this.mouseUp);
        this.startScrollX = e.pageX;
        this.$el.css('cursor', '-webkit-grabbing');
    },

    mouseMove (e) {
        if (e.pageX !== undefined) {
            this.velocity = -(e.pageX - this.startScrollX) / 10;
        }
        if (this.velocity < 0) this.speed = -0.075;
        if (this.velocity > 0) this.speed = 0.075;
        this.$el.css('cursor', '-webkit-grabbing');
    },

    mouseUp () {
        this.$el.off('mousemove', this.mouseMove);
        this.$el.off('mouseup', this.mouseUp);
        this.$el.css('cursor', '-webkit-grab');
    },

    updateAnimationFrame () {
        this.velocity *= this.friction;
        this.velocity += this.speed;
        this.cameraModel.update(this.velocity);
        this.backgroundModel.update(this.cameraModel.getDistance(), this.cameraModel.totalWidth);
    },

    render () {
        this.$el.find('.sketches-list').html(this.template({ works: this.collection.models }));
        return this;
    },

    showLoading (tween) {
        this.backgroundModel.showLoading(tween);
        const cursor = $('#cursor');
        tween.fromTo(cursor, 0.35, {
            x: '-300px', 
            y: `${window.innerHeight + 24}` 
        }, { 
            x: '0px',
            y: `${window.innerHeight / 2}px` 
        });
        tween.add(() => cursor.addClass('active'));
        tween.to(cursor, 0.3, { x: '-800px', opacity: 0 }, '+=0.4');
        tween.add(() => cursor.remove() );
        tween.fromTo(this.$el, 0.6, { x: '200%' }, { x: '0%' });
        tween.to($('.app-header'), 0.2, { opacity: 1, ease: Power3.easeOut }, '+=0.15');
    },

    showLoadingQuick(tween) {        
        this.backgroundModel.showLoading(tween);
        tween.to($('.app-header'), 0.2, { opacity: 1, ease: Power3.easeOut });
    },

    onresize (width, height) {
        this.cameraModel.onresize(width, height);
        this.backgroundModel.onresize(width, height);
    }

});

export default Home;