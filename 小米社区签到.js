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
    app.launchApp('小米社区');
    sleep_second(3);
    if (textContains('跳过').exists()) {//如果有跳过按钮
        var coordinate = textContains('跳过').findOnce().bounds();//坐标
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
    putout('正在启动小米社区');
    while (!open_it()) {//如果启动失败
        putout('重新启动小米社区');
        i++;
        if (i >= 9) {//启动10次还没有成功
            putout('小米社区启动10次还未成功,请检查权限是否启动并反馈原因')
            hamibot.exit();
        }
    }
    putout('成功启动小米社区');
}

function sleep_second(t) {//按秒数等待
    sleep(t * 1000);
}

launch_app();
desc('签到').click();//点击签到
sleep_second(3);


//拔萝卜
if (text("每日任务").exists()) {//成功进入签到页面
    console.log('成功进入签到页面');
}
else {
    console.log('重新进入签到页面');
    desc('签到').click();//点击签到
    sleep_second(3);
}
sleep_second(1);
className("android.widget.Button").text("去看看").findOne().click()//拔萝卜
sleep_second(1);

console.log('返回签到页面');
for (let i = 0; i < 10; i++) {//返回签到页面
    if (text("每日任务").exists()) {
        console.log('成功返回签到页面');
        break;
    }
    back();
    sleep_second(2);
}


//去浏览
if (text("去浏览").exists()) {

    console.log('点击去浏览');
    text("去浏览").click();
    sleep_second(2);

    console.log('随便点击一个帖子');
    //获取点赞坐标,然后往上移一点就是帖子
    var coordinate = className("android.widget.ImageView").depth(18).desc('赞').findOnce().bounds();
    click(coordinate.centerX(), coordinate.centerY() - 100);

    sleep_second(1);
    swipe(600, 2000, 600, 500, 500);//滑动
    console.log('等待浏览完成');
    sleep_second(12);
    console.log('浏览完成,正在返回签到页面');
    back();
    sleep_second(2);
    desc('签到').click();//点击签到
    console.log('成功返回签到页面')
    sleep_second(2);
}
else {//签到页面没有去浏览
    console.log('浏览完成');
}


//抽奖
textContains("去参与").click();
sleep_second(2);
var unlockable;
while (textContains("当前可解锁").exists()) {
    console.log('当前存在可解锁');
    unlockable = findColor(captureScreen(), "#fde1f6");//解锁的颜色
    while (unlockable == null) {//找不到这个颜色
        console.log('滑动');
        swipe(548, 1997, 800, 280, 500);//滑动至下一个可解锁区块
        unlockable = findColor(captureScreen(), "#fde1f6");//重置颜色
        sleep(500);
    }
    click(unlockable.x, unlockable.y);
    sleep(1000);
    back();
    textContains("去参与").click();
    sleep(1000);
}
back();


//签到
if (className("android.widget.TextView").text("已签到").exists()) {
    console.log('已签到');
    hamibot.exit();
}
else {
    console.log('点击立即签到');
    textContains("立即签到").click();
    console.log('请进行滑块验证');
    device.vibrate(2000);
}


hamibot.exit();