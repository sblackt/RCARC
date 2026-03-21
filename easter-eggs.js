(function () {
    'use strict';

    // Console greeting
    var greetings = [
        '73 de VE3NRR — Best regards from Renfrew County!',
        'QTH: Renfrew County, Ontario',
        'CQ CQ CQ — DE VE3NRR — K',
        'VE3NRR — The Renfrew County Amateur Radio Club',
        'PSE QSL de VE3NRR — rcarc.ca'
    ];
    var msg = greetings[Math.floor(Math.random() * greetings.length)];
    console.log('%c' + msg, 'color:#cb433f;font-size:14px;font-weight:bold;');
    console.log('%cRenfrew County Amateur Radio Club | rcarc.ca', 'color:#4b3e36;font-size:11px;');

    // "73" key sequence trigger
    var lastKey = '';
    var lastKeyTime = 0;

    document.addEventListener('keydown', function (e) {
        var now = Date.now();
        if (e.key === '7') {
            lastKey = '7';
            lastKeyTime = now;
        } else if (e.key === '3' && lastKey === '7' && (now - lastKeyTime) < 1500) {
            lastKey = '';
            show73();
        } else {
            lastKey = e.key;
        }
    });

    function show73() {
        if (document.getElementById('overlay-73')) return;
        var overlay = document.createElement('div');
        overlay.id = 'overlay-73';
        overlay.setAttribute('aria-live', 'polite');
        overlay.innerHTML =
            '<div class="overlay-73-inner">' +
                '<p class="overlay-73-call">73 de VE3NRR</p>' +
                '<p class="overlay-73-sub">Best regards from Renfrew County</p>' +
            '</div>';
        document.body.appendChild(overlay);
        playMorse73();
        setTimeout(function () {
            overlay.classList.add('fade-out');
            setTimeout(function () { overlay.remove(); }, 700);
        }, 2800);
    }

    function playMorse73() {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        try {
            var ctx = new AC();
            // 7 = --...  3 = ...--
            // pattern: array of [on|off, duration_in_units]
            var dit = 0.07;
            var dah = dit * 3;
            var gap = dit;
            var lg = dit * 3;   // letter gap
            var sequence = [
                // 7: -- ...
                [1, dah], [0, gap], [1, dah], [0, gap],
                [1, dit], [0, gap], [1, dit], [0, gap], [1, dit],
                [0, lg],
                // 3: ... --
                [1, dit], [0, gap], [1, dit], [0, gap], [1, dit], [0, gap],
                [1, dah], [0, gap], [1, dah]
            ];
            var t = ctx.currentTime + 0.1;
            sequence.forEach(function (s) {
                if (s[0] === 1) {
                    var osc = ctx.createOscillator();
                    var g = ctx.createGain();
                    osc.connect(g);
                    g.connect(ctx.destination);
                    osc.frequency.value = 700;
                    g.gain.setValueAtTime(0, t);
                    g.gain.linearRampToValueAtTime(0.25, t + 0.005);
                    g.gain.setValueAtTime(0.25, t + s[1] - 0.005);
                    g.gain.linearRampToValueAtTime(0, t + s[1]);
                    osc.start(t);
                    osc.stop(t + s[1]);
                }
                t += s[1];
            });
        } catch (e) { /* silently fail */ }
    }
})();
