document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initNavbar();
    initScrollReveal();
    initParticles();
    initFAQ();
});

function initLoader() {
    var loader = document.getElementById('loader');
    var bar = document.querySelector('.loader-progress-fill');
    var statusEl = document.querySelector('.loader-status');
    var progress = 0;
    var messages = ['Initializing', 'Loading assets', 'Preparing interface', 'Almost ready'];
    var messageIndex = 0;

    var interval = setInterval(function () {
        progress += Math.random() * 12 + 4;
        if (progress > 100) progress = 100;
        bar.style.width = progress + '%';

        var newIndex = Math.min(Math.floor(progress / 28), messages.length - 1);
        if (newIndex !== messageIndex) {
            messageIndex = newIndex;
            statusEl.style.opacity = '0';
            setTimeout(function () {
                statusEl.textContent = messages[messageIndex];
                statusEl.style.opacity = '1';
            }, 150);
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(function () {
                loader.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 500);
        }
    }, 220);

    statusEl.style.transition = 'opacity 0.15s ease';
    document.body.style.overflow = 'hidden';
}

function initNavbar() {
    var navbar = document.querySelector('.navbar');
    var hamburger = document.querySelector('.hamburger');
    var navRight = document.querySelector('.nav-right');
    var links = document.querySelectorAll('.nav-right a');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navRight.classList.toggle('open');
    });

    links.forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navRight.classList.remove('open');
        });
    });
}

function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) {
        observer.observe(el);
    });
}

function initParticles() {
    var canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    var mouseX = -1000;
    var mouseY = -1000;
    var mouseRadius = 150;
    var lineCount = 45;
    var segmentCount = 80;
    var easing = 0.08;
    var lines = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        buildLines();
    }

    function buildLines() {
        lines = [];
        var spacing = canvas.width / (lineCount - 1);
        for (var i = 0; i < lineCount; i++) {
            var line = [];
            var baseX = i * spacing;
            for (var j = 0; j <= segmentCount; j++) {
                var baseY = (canvas.height / segmentCount) * j;
                line.push({
                    baseX: baseX,
                    baseY: baseY,
                    x: baseX,
                    y: baseY
                });
            }
            lines.push(line);
        }
    }

    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', function(e) {
        var rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', function() {
        mouseX = -1000;
        mouseY = -1000;
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            for (var j = 0; j < line.length; j++) {
                var p = line[j];
                var dx = mouseX - p.baseX;
                var dy = mouseY - p.baseY;
                var dist = Math.sqrt(dx * dx + dy * dy);

                var targetX = p.baseX;
                var targetY = p.baseY;

                if (dist < mouseRadius && dist > 0) {
                    var force = (1 - dist / mouseRadius);
                    force = force * force;
                    var pushX = (dx / dist) * force * mouseRadius * 0.6;
                    var pushY = (dy / dist) * force * mouseRadius * 0.15;
                    targetX = p.baseX - pushX;
                    targetY = p.baseY - pushY;
                }

                p.x += (targetX - p.x) * easing;
                p.y += (targetY - p.y) * easing;
            }

            ctx.beginPath();
            ctx.moveTo(line[0].x, line[0].y);

            for (var j = 1; j < line.length - 1; j++) {
                var cpx = (line[j].x + line[j + 1].x) / 2;
                var cpy = (line[j].y + line[j + 1].y) / 2;
                ctx.quadraticCurveTo(line[j].x, line[j].y, cpx, cpy);
            }
            ctx.lineTo(line[line.length - 1].x, line[line.length - 1].y);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

function initFAQ() {
    var questions = document.querySelectorAll('.faq-question');

    questions.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item = btn.parentElement;
            var answer = item.querySelector('.faq-answer');
            var isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item.active').forEach(function (openItem) {
                openItem.classList.remove('active');
                openItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}