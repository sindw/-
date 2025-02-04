auto.waitFor();
console.show();
//权限获取
if (!requestScreenCapture()) {
    putout('没有授予 Hamibot 屏幕截图权限');
    hamibot.exit();
}
sleep_second(2);

const test_view_num = 6;

function putout(str) {
    console.log(str);
}

function exists_or_not(str) {//判断str是否出现
    for (let i = 0; i <= 10; i++) {
        sleep(500);
        if (str) {
            return 1;
        }
    }
    return 0;//如果没有找到就说明没进去
}

function judge_by_ocr(x, y, x_x, y_y, text) {//截图坐标并判断是否有文字str
    x_x -= x;
    y_y -= y;
    var src = captureScreen();
    var clip = images.clip(src, x, y, x_x, y_y);
    for (let i = 0; i < 30; i++) {
        var the_text = ocr.recognizeText(clip);
        var isExist = the_text.includes(text);
        if (isExist)
            return 1;
    }
    return 0;
}

function find_color(x, y, x_x, y_y, color) {//找颜色
    x_x -= x;
    y_y -= y;
    var src = captureScreen();
    var clip = images.clip(src, x, y, x_x, y_y);
    var judge = images.findColor(clip, color);
    if (judge) {
        return 1;
    }
    else {
        return 0;
    }
}

function wait_for_text(str) {//等待十秒是否某个文字出现
    for (let i = 0; i < 20; i++) {
        if (textContains(str).exists())
            return 1;
        sleep(500);
    }
    return 0;
}


function open_it() {
    app.launchApp('小米商城');
    sleep_second(3);
    if (id('skip').textContains('跳过').exists()) {//如果有跳过按钮
        var coordinate = id('skip').textContains('跳过').findOnce().bounds();//坐标
        click(coordinate.centerX(), coordinate.centerY());
    }
    sleep_second(5);
    if (className("android.widget.TextView").text("我的").exists())
        return 1;//如果右下角是出现'我的',说明打开成功
    else
        return 0;
}

function launch_app() {
    let i = 0;
    putout('正在启动小米商城');
    while (!open_it()) {//如果启动失败
        putout('重新启动小米商城');
        i++;
        if (i >= 9) {//启动10次还没有成功
            putout('小米商城启动10次还未成功,请检查权限是否启动并反馈原因')
            hamibot.exit();
        }
    }
    putout('成功启动小米商城');
}

function sleep_second(t) {//按秒数等待
    sleep(t * 1000);
}

launch_app();

if (className("android.widget.FrameLayout").depth(1).exists()) {//广告
    putout('关闭广告');
    back();
    sleep_second(1);
}

//点击我的
let judge_mine_open = 0;
putout('点击我的');
var coordinate = className("android.widget.TextView").text("我的").findOnce().bounds();
click(coordinate.centerX(), coordinate.centerY());//点击我的
sleep_second(5);

//点击下次再说
if (judge_by_ocr(device.width * 0.2, device.height * 0.6, device.width * 0.5, device.height * 0.68, '次再')) {//出现下次再说
    putout('点击下次再说');
    var x = device.width * 0.2, x_x = device.width * 0.5;
    var y = device.height * 0.6, y_y = device.height * 0.68;
    while (judge_by_ocr(device.width * 0.2, device.height * 0.6, device.width * 0.5, device.height * 0.68, '次再')) {
        click(x, y);
        sleep_second(1);
        if (x <= x_x) {
            x += 100;
        }
        else {
            x = device.width * 0.2;
            y += 50;
        }
        if (y > y_y) {//越界了还没点到，就退出
            putout('越界了还没点到');
            hamibot.exit();
            break;
        }
    }
    judge_mine_open = 1;
}
else {
    if (className("android.widget.TextView").text("待付款").exists())
        judge_mine_open = 1;
    else
        judge_mine_open = 0;

    if (!exists_or_not(className("android.widget.TextView").text("待付款").exists())) {//如果没有成功点击我的
        putout('重新点击我的');
        var coordinate = className("android.widget.TextView").text("我的").findOnce().bounds();
        click(coordinate.centerX(), coordinate.centerY());//点击我的
        if (className("android.widget.TextView").text("待付款").exists())
            judge_mine_open = 1;
        else
            judge_mine_open = 0;
    }
}
putout('成功点击我的');
sleep_second(5);


//点击米金
putout('点击米金');
console.hide();//先隐藏控制台
sleep_second(1);
var mikin_coordinate = className("android.widget.TextView").text("米金").findOnce().bounds();//坐标
click(mikin_coordinate.centerX(), mikin_coordinate.centerY());//点击米金
console.show();//再显示控制台
sleep_second(5);//等两秒
if (className("android.widget.TextView").text("米金商城").exists()) {
    putout('成功进入米金商城');
}
else {
    putout('重新进入米金商城');

    console.hide();//先隐藏控制台
    sleep_second(1);
    var mikin_coordinate = className("android.widget.TextView").text("米金").findOnce().bounds();//坐标
    click(mikin_coordinate.centerX(), mikin_coordinate.centerY());//点击米金
    console.show();//再显示控制台

    sleep_second(5);
}


//开始做米金任务

//进入米金任务
function click_mikin_mission() {//需要在米金商城页面
    var coordinate = className('android.view.ViewGroup').depth('14').drawingOrder('2').findOnce().bounds();
    longClick(coordinate.left + (coordinate.right - coordinate.left) * 0.85, coordinate.centerY());
}


//点击米金任务
putout('点击米金任务');
//点击米金任务页面
click_mikin_mission();
sleep_second(5);

if (!exists_or_not(className("android.widget.TextView").text("做任务赢福利").exists())) {//如果没有进入米金任务页面
    putout('重新进入米金任务页面');
    click_mikin_mission();
    sleep_second(5);
}
putout('成功进入米金任务页面');

//签到
if (className("android.widget.TextView").text("已签到").exists()) {//已经签到过了
    putout('已经签到过了');
}
else {//还没有签到
    putout('签到');
    var coordinate = className("android.widget.TextView").text("立即签到").findOnce().bounds();
    click(coordinate.centerX(), coordinate.centerY());
    sleep_second(5);
    if (className("android.widget.TextView").text("签到得米金").exists()) {
        click(604, 1863);//点击“知道了”
        sleep_second(5);
    }
}

//开始做米金任务
for (let j = 0; j < test_view_num; j++) {
    if (!text("去浏览").exists()) {//如果没有任务
        putout('没有任务');
        break;
    }
    putout('开始浏览');
    var coordinate = text("去浏览").findOnce().bounds();//坐标
    click(coordinate.centerX(), coordinate.centerY());//浏览

    sleep_second(10);//浏览10秒
    let judge = 0;//判断是否为软件内浏览
    //等待浏览完成(此时没有回到签到页面)
    for (let i = 0; i < 10; i++) {
        if (className("android.widget.TextView").text("领取奖励").exists()) {//如果浏览完成
            putout('浏览完成');
            back();
            sleep_second(5);
            judge = 1;
            break;
        }
        sleep_second(1);
    }
    if (!judge) {//如果不是软件内浏览
        putout('返回小米商城');
        app.launchApp('小米商城');//返回到软件内
        sleep_second(5);
    }

    while (className("android.widget.TextView").text("领取奖励").exists()) {
        back();
        sleep_second(5);
    }

    if (className("android.widget.TextView").text("米金商城").exists()) {//重新打开米金任务页面
        putout('重新打开米金任务页面');
        click_mikin_mission();
        sleep_second(5);
    }
}

device.vibrate(2000);


hamibot.exit();