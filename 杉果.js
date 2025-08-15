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
    var a = id("purchase_img_layout");
    for (let i = 0; i < 10; i++) {
        if (a.exists()) {
            return 1;
        }
        sleep_second(0.5);
    }
    return 0;
}


//杉果
function open() {//启动
    if (in_it_or_not()) {//已经打开了
        return 1;
    }

    app.launchApp('杉果');
    var a = id("jump_to_main");
    if (!a.exists()) {
        a = textContains('跳过');
    }
    if (a.exists()) {
        var coordinate = a.bounds();
        click(coordinate.centerX(), coordinate.centerY());
        sleep_second(2);
        return 1;
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
    while (!open()) {//如果启动失败
        print('重新通过url启动启动' + str);
        i++;
        if (i >= 4) {//启动10次还没有成功
            print(str + 'url启动5次还未成功');
            hamibot.exit();
        }
    }
    print('成功启动' + str);
}

launch_app('杉果');

function open_mine() {//打开我的
    var text_my = className("android.widget.TextView").text("我的");
    var my = text_my;
    if (text_my.exists()) {//选定“我的”控件
        my = text_my.findOnce().parent();
        if (!my.exists())
            my = text_my;
    }

    my.click();
    sleep_second(2);

    if (text_my.exists()) {//选定“我的”控件
        my = text_my.findOnce().parent();
        if (!my.exists())
            my = text_my;
    }

    if (my.selected() == true)
        return 1;
    return 0;
}
open_mine();


function open_mission() {//打开积分界面
    var text_mission = className("android.widget.TextView").text("任务中心");
    var mission = text_mission;
    if (text_mission.exists()) {//选定“我的”控件
        mission = text_mission.findOnce().parent();
        if (!mission.exists())
            mission = text_mission;
    }

    mission.click();
    sleep_second(2);

    if (text_mission.exists()) {//选定“我的”控件
        mission = text_mission.findOnce().parent();
        if (!mission.exists())
            mission = text_mission;
    }

    if (className("android.widget.TextView").text("积分明细").exists())
        return 1;
    return 0;

}
open_mission();

