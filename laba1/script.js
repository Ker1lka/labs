(function () {
    // 1. Створюємо canvas та додаємо його на сторінку
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '999999';
    canvas.style.pointerEvents = 'none'; // Щоб сніг не заважав клікати по сайту
    
    document.body.appendChild(canvas);

    // 2. Налаштування розмірів
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3. Параметри сніжинок
    const snowflakeCount = 70; // Кількість сніжинок на екрані
    const snowflakes = [];

    // Функція малювання окремої сніжинки (векторний візерунок)
    function drawSnowflakePattern(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        ctx.stroke();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
    }

    // 4. Ініціалізація масиву сніжинок
    for (let i = 0; i < snowflakeCount; i++) {
        // Визначаємо колір: 30% блакитних відтінків, 70% білих
        const isBlue = Math.random() < 0.30;
        const opacity = (Math.random() * 0.5 + 0.3).toFixed(2); // прозорість від 0.3 до 0.8
        const color = isBlue 
            ? `rgba(174, 219, 240, ${opacity})`  // Ніжно-блакитний
            : `rgba(255, 255, 255, ${opacity})`; // Білий

        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            radius: Math.random() * 5 + 4,             // Розмір сніжинки
            density: Math.random() * 1 + 0.5,          // Швидкість падіння
            opacity: opacity,
            color: color,
            spikes: 6,                                 // 6-променева структура
            rotation: Math.random() * Math.PI,         // Початковий кут повороту
            rotationSpeed: Math.random() * 0.02 - 0.01 // Швидкість обертання
        });
    }

    // 5. Головний цикл анімації
    function moveSnowflakes() {
        // Очищаємо canvas на кожному кадрі
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snowflakeCount; i++) {
            const f = snowflakes[i];

            ctx.save();
            ctx.beginPath();
            
            // Зміщуємо центр координат до сніжинки та повертаємо її
            ctx.translate(f.x, f.y);
            ctx.rotate(f.rotation);
            
            // Налаштування стилю ліній для візерунка
            ctx.strokeStyle = f.color;
            ctx.lineWidth = 1.5;
            ctx.fillStyle = f.color;

            // Малюємо візерунок сніжинки (промені)
            drawSnowflakePattern(ctx, 0, 0, f.spikes, f.radius, f.radius * 0.4);
            
            ctx.closePath();
            ctx.stroke();
            ctx.restore();

            // Оновлюємо координати та кут для наступного кадру
            f.y += f.density; // рух вниз
            f.x += Math.sin(f.y / 30) * 0.5; // легке коливання вліво/вправо
            f.rotation += f.rotationSpeed; // обертання навколо своєї осі

            // Якщо сніжинка вилетіла за межі екрану — повертаємо її нагору
            if (f.y > canvas.height) {
                snowflakes[i] = {
                    ...f,
                    x: Math.random() * canvas.width,
                    y: -10,
                    rotation: Math.random() * Math.PI
                };
            }
        }
        
        requestAnimationFrame(moveSnowflakes);
    }

    // Запуск анімації
    moveSnowflakes();
    console.log("❄️ Снігопад успішно запущено поверх сторінки!");
})();