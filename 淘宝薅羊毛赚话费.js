auto.waitFor();
console.show();
sleep_second(2);
console.setSize(device.width / 1.5, device.height / 6);

threads.start(function () {
    events.observeKey();
    events.onKeyDown(
        "volume_up", function (event) {
            toastLog("\n音量+被按下，结束脚本！");
            sleep(1000);
            console.hide();
            exit();
        }
    );
});

function exists_or_not(str) {//判断str是否出现
    for (let i = 0; i <= 10; i++) {
        sleep(500);
        if (str) {
            return 1;
        }
    }
    return 0;//如果没有找到就说明没进去
}

function judge_by_color(x, y, x_x, y_y, color) {//截图坐标并判断是否有颜色
    x_x -= x;
    y_y -= y;
    var src = captureScreen();
    var clip = images.clip(src, x, y, x_x, y_y);
    for (let i = 0; i < 30; i++) {
        var the_color = findColor(clip, color);
        if (the_color != null)
            return the_color;
    }
    return 0;
}

function find_color(x, y, x_x, y_y, color) {//找颜色
    x_x -= x;
    y_y -= y;
    var src = captureScreen();
    var clip = images.clip(src, x, y, x_x, y_y);
    var image_contain_color = images.findColor(clip, color);
    if (image_contain_color) {
        return 1;
    }
    else {
        return 0;
    }
}

function judge_by_base64(x, y, x_x, y_y, base64) {
    x_x -= x;
    y_y -= y;
    var src = captureScreen();
    var images_a = images.clip(src, x, y, x_x, y_y);
    var images_b = images.fromBytes(base64);
    for (let i = 0; i < 30; i++) {
        var the_result = images.findImage(images_a, images_b, {
            threshold: 0.8,
        });
        if (the_result)
            return the_result;
    }
    return 0;
}

function text_exists(str) {//等待十秒是否某个文字出现
    for (let i = 0; i < 20; i++) {
        if (text(str).exists())
            return 1;
        sleep(500);
    }
    return 0;
}

function textContains_exists(str) {//等待十秒是否包含某个文字出现
    for (let i = 0; i < 20; i++) {
        if (textContains(str).exists())
            return 1;
        sleep(500);
    }
    return 0;
}

function uiselector_exists(str) {//判断控件是否存在
    for (let i = 0; i < 10; i++) {
        if (str.exists())
            return 1;
        sleep(500);
    }
    return 0;
}

function uiselector_click(str, click_success) {//点击控件
    for (let i = 0; i < 10; i++) {
        if (click_success) {//点击成功
            return 1;
        }
        if (str.findOnce().click()) {//控件点击
        }
        else {//不能通过控件点击
            break;
        }
        sleep_second(1);
    }

    var coordinate = str.findOnce().bounds();
    for (let i = 0; i < 10; i++) {//控件点击失败,通过坐标点击
        if (click_success) {//点击成功
            return 1;
        }
        click(coordinate.centerX(), coordinate.centerY());//通过坐标点击
        sleep_second(1);
    }

    return 0;//点击失败
}

function sleep_second(t) {//按秒数等待
    sleep(t * 1000);
}

//判断是否在小程序中
function in_it_or_not() {
    var a = className("android.widget.Image").text("O1CN013rIlFe23mXM5s4cUT_!!6000000007298-2-tps-270-82.png_Q75.jpg_");
    for (let i = 0; i < 10; i++) {
        if (a.exists()) {
            return 1;
        }
        sleep_second(0.5);
    }
    return 0;
}


//支付宝
var start_url = 'https://m.tb.cn/h.Tp34SQI';
function open_by_url() {//通过url启动
    if (in_it_or_not()) {//已经打开了
        return 1;
    }

    setClip('000');//避免复制
    app.openUrl(start_url);
    var a = className("android.widget.TextView").text("打开淘宝").clickable(true);
    if (a.exists()) {
        a.click();
        sleep_second(2);
    }

    //口令没有触发,直接点击
    var a = className("android.widget.Button").text("薅羊毛 赚充值金");
    if (!a.exists()) {
        back();
        sleep_second(1);
    }
    if (a.exists()) {
        a.click();
        sleep_second(2);
    }

    if (!in_it_or_not()) //在小程序页面
        return 1;
    return 0;
}

function launch_app(str) {
    let i = 0;
    if (in_it_or_not()) {
        print('已启动');
        return;
    }
    print('通过url启动' + str);
    while (!open_by_url()) {//如果启动失败
        print('重新通过url启动启动' + str);
        i++;
        if (i >= 4) {//启动10次还没有成功
            print(str + 'url启动5次还未成功');
            hamibot.exit();
        }
    }
    print('成功启动' + str);
}



