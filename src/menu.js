var MN;
function Menu() {
    MN = this;
    this.y = 0;
    this.font = '50px Impact';
    this.fireColor = 'rgb(255, 56, 8)';

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, G.can.width, G.can.height);

    this.heat = MN.getHeatMap();
    this.noise = null;
    this.noise = MN.getNoise(G.can.width, G.can.height*8);
    ctx.drawImage(this.heat, 0, 0);
    this.update();
}
Menu.prototype = {
    getNoise: function () {
        var canvas = document.createElement('canvas');
        canvas.width = G.can.width;
        canvas.height = G.can.height;
        var ctx = canvas.getContext('2d');

        var w = canvas.width, h = canvas.height,
            img = ctx.createImageData(w, h),
            n = w * h * 4;

        for(var i = 0; i < n; i+=4) {
            img.data[i] = 15;
            img.data[i+1] = 3;
            img.data[i+2] = 1;
            img.data[i+3] = Math.floor(Math.random() * 128);
        }
        sv();
        ctx.putImageData(img, 0, 0);
        ctx.drawImage(canvas, 0, 0, w * 64, h * 64);
        ctx.globalAlpha = 0.5;
        ctx.drawImage(canvas, 0, 0, w * 16, h * 16);
        var img = ctx.getImageData(0, 0, w, h);
        // increase contrast a bit by clamping values
        for (var i = 3; i < w * h * 4; i += 4){
            if (img.data[i] > 220){
                img.data[i] = 255;
            }
            if (img.data[i] < 40){
                img.data[i] = 0;
            }
        }
        ctx.putImageData(img, 0, 0);
        rs();
        return canvas;
    },
    getHeatMap: function () {
        var canvas = document.createElement('canvas');
        canvas.width = G.can.width;
        canvas.height = G.can.height;

        var ctx = canvas.getContext('2d');
        sv();
        var w = G.can.width,
            h = G.can.height,
            color = MN.fireColor,
            firstText = G.isGameOver ? 'GAME' : 'SAVE',
            secondText = G.isGameOver ? 'OVER' : 'FOREST';

        firstText = firstText.split('').join('   ');
        secondText = secondText.split('').join('   ');

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.font = MN.font;

        var m1 = ctx.measureText(firstText);
        var m2 = ctx.measureText(secondText);
        ctx.fillText(firstText, (w - m1.width) / 2, h / 5);
        ctx.fillText(secondText, (w - m2.width) / 2, h / 3.5);
        ctx.lineWidth = 10;

        var highestScoreText = 'BEST:' + G.highscore;
        highestScoreText = highestScoreText.split('').join('   ');
        ctx.fillStyle = '#fff';
        ctx.font = '35px Impact';
        ctx.fillText(highestScoreText, (w - ctx.measureText(highestScoreText).width) / 2, h / 2.1);

        if (G.isGameOver) {
            ctx.fillStyle = '#fff';
            ctx.font = '35px Impact';
            var karmaText = 'KARMA:' + G.karma;
            karmaText = karmaText.split('').join('   ');

            ctx.fillText(karmaText, (w - ctx.measureText(karmaText).width) / 2, h / 2.5);
            ctx.lineWidth = 10;

            ctx.beginPath();
            ctx.arc(w*(2/3), h/1.2, 30, 0, 2 * Math.PI, false);
            ctx.fillStyle = '#555';
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.arc(w*(1/3), h/1.2, 30, 0, 2 * Math.PI, false);
            ctx.fillStyle = '#555';
            ctx.closePath();
            ctx.fill();

            // sound icon
            ctx.beginPath();
            ctx.moveTo(w*(1/3) - 20, h/1.2 - 10);
            ctx.lineTo(w*(1/3) - 20, h/1.2 + 5);
            ctx.lineTo(w*(1/3) - 10, h/1.2 + 5);
            ctx.lineTo(w*(1/3) + 5, h/1.2 + 15);
            ctx.lineTo(w*(1/3) + 5, h/1.2 - 20);
            ctx.lineTo(w*(1/3) - 10, h/1.2 - 10);
            ctx.fillStyle = '#222';
            ctx.closePath();

            if (G.isSound) {
                ctx.fillRect(w*(1/3) + 10, h/1.2 - 5, 3, 10);
                ctx.fillRect(w*(1/3) + 15, h/1.2 - 7, 3, 15);
                ctx.fillRect(w*(1/3) + 20, h/1.2 - 10, 3, 20);
            }
            ctx.fill();

            // if no sound
            if (!G.isSound) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(w*(1/3) + 10, h/1.2 - 22);
                ctx.lineTo(w*(1/3) - 10, h/1.2 + 22);
                ctx.closePath();
                ctx.fill();
                ctx.lineWidth = 5;
                ctx.strokeStyle = '#000';
                ctx.stroke();
                ctx.restore();
            }

            // download icon
            ctx.beginPath();
            ctx.moveTo(w*(2/3) - 10, h/1.2 - 15);
            ctx.lineTo(w*(2/3) - 10, h/1.2 - 15 + 15);
            ctx.lineTo(w*(2/3) - 20, h/1.2 - 15 + 15);

            ctx.lineTo(w*(2/3), h/1.2 - 15 + 30);
            ctx.lineTo(w*(2/3) + 20, h/1.2 - 15 + 15);

            ctx.lineTo(w*(2/3) + 10, h/1.2 - 15 + 15);
            ctx.lineTo(w*(2/3) + 10, h/1.2 - 15);

            ctx.fillStyle = '#222';
            ctx.closePath();
            ctx.fill();
        }

        // Play button
        ctx.beginPath();
        ctx.arc(w/2, h/1.6, 50, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#793f02';
        ctx.closePath();
        ctx.fill();

        var tw = 20, th = h/1.6 - tw;
        ctx.beginPath();
        ctx.moveTo(w/2 - tw/2, th);
        ctx.lineTo(w/2 + tw, th + 20);
        ctx.lineTo(w/2 - tw/2, th + 40);
        ctx.fillStyle = '#fff';
        ctx.closePath();
        ctx.fill();
        rs();
        return canvas;
    },
     process: function () {
        sv();
        // cooldown factor
        ctx.globalAlpha = 0.35;
        ctx.globalCompositeOperation = 'source-over';
        // movement speed of cooldown map
        MN.y = (MN.y + 3) % MN.noise.height;
        // flickering of cooldown map
        x = Math.round(Math.random() * 5) * 0;
        ctx.drawImage(MN.noise, x, MN.y);
        ctx.drawImage(MN.noise, x, MN.y - MN.noise.height);

        // spread of the flame
        ctx.globalAlpha = 1.0;
        // whind
        x = 1 - Math.random() * 2;
        // move flame up
        ctx.drawImage(G.can, x, -1);
        ctx.globalAlpha = 0.13;
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(G.can, x, -1);

        // heat it up
        ctx.globalAlpha = 0.22;
        ctx.drawImage(MN.heat, 0, 0);
        fs(MN.fireColor);
        bp();
        ctx.globalAlpha = 0.52;
        cp();
        fl();
        rs();
    },
    mouseDown: function (e, x, y) {
        var w = G.can.width,
            h = G.can.height,
            ctx = MN.heat.getContext('2d');

        if (x >= w/2 - 50 && x <= w/2 + 50 &&
            y >= h/1.6 - 50 && y <= h/1.6 + 50) {
            // play btn clicked
            G.menu = null;
            G.restart();
        } else if (x >= w*(2/3) - 30 && x <= w*(2/3) + 30 &&
            y >= h/1.2 - 30 && y <= h/1.2 + 30) {
            // download clicked
            downloadCanvas();
        } else if (x >= w*(1/3) - 30 && x <= w*(1/3) + 30 &&
            y >= h/1.2 - 30 && y <= h/1.2 + 30) {
            // sound clicked
            G.isSound = +(!G.isSound);
            utils.setLocalStorageData(G.isSound, true);
            MN.heat = MN.getHeatMap();
        }
    },
    update: function () {
        // this.noise = MN.getNoise(G.can.width, G.can.height * 8);
        MN.process();
    }
};
