const Cursor = (function() {
    
    const radius = 5;

    const update = (ctx, dv, x, y) => {
        ctx.fillStyle = '#00f';
        ctx.beginPath();
        ctx.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2,
            true    
        )
        ctx.closePath();
        ctx.fill();
    }

    return {
        update
    }

}());

export default Cursor;