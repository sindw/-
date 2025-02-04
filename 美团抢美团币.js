auto.waitFor();
console.show();
//权限获取
if (!requestScreenCapture()) {
    putout('没有授予 Hamibot 屏幕截图权限');
    hamibot.exit();
}
sleep_second(2);

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
        if (the_text == text)
            return 1;
    }
    return 0;
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

function wait_for_text(str) {//等待十秒是否某个文字出现
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
        if (click_success.exists()) {//点击成功
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
        if (click_success.exists()) {//点击成功
            return 1;
        }
        click(coordinate.centerX(), coordinate.centerY());//通过坐标点击
        sleep_second(1);
    }

    return 0;//点击失败
}

function open_it(str) {
    app.launchApp(str);
    sleep_second(1);
    if (id("skip").exists()) {//如果有跳过按钮
        id("skip").click();
    }
    sleep_second(2);
    if (id("shortcut_iv").exists())//打开成功
        return 1;
    else
        return 0;
}

function launch_app(str) {
    let i = 0;
    putout('正在启动' + str);
    while (!open_it(str)) {//如果启动失败
        putout('重新启动' + str);
        i++;
        if (i >= 9) {//启动10次还没有成功
            putout(str + '启动10次还未成功,请检查权限是否启动并反馈原因')
            hamibot.exit();
        }
    }
    putout('成功启动' + str);
}

function sleep_second(t) {//按秒数等待
    sleep(t * 1000);
}

var go_award_base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAcCAYAAAC+lOV/AAAAAXNSR0IArs4c6QAAALVJREFUOE/FVUEShDAII/7/sH7Jx/gMcYAyW53RAj3oxbGaJkRSsO0rA6D+YmaSNb/7u/s6vgVfNIcfmFR2+PurM1+DK79KKpioGQbOMxMBS5UZebArlDZN11wGW1CO1iYWpJBhItKkMi26iRgWcJskri2xfDjYIjtkHoLfgnFPTX9sDJn7BupPEql/oj0bON+eQcOeZIfcHoJrx9BUnhX8k2YrkSvY6vpvkJwYTmwjRhMTGDcn5w8SciJACGQAAAAASUVORK5CYII='//去领取
let judge = 0;


//启动美团
putout('打开美团');
launch_app('美团');
sleep_second(2);



//点击我的
putout('点击我的');
var a = className("android.view.View").desc("我的");
var b = id("fa5").className("android.widget.TextView").text("红包卡券");
if (uiselector_click(a, b)) {
    putout('成功点击我的');
}
else {
    putout('点击失败');
    hamibot.exit();
}
sleep_second(2);



//点击美团币
putout('点击美团币');
var a = id("fa5").className("android.widget.TextView").text("美团币");
var b = className("android.widget.TextView").text("免费兑换");
if (uiselector_click(a, b)) {
    putout('成功点击美团币');
}
else {
    putout('点击失败,关闭脚本');
    hamibot.exit();
}
sleep_second(2);

function back_to_meituan() {//返回美团页面
    for (let i = 0; i < 10; i++) {
        if (className("android.widget.TextView").text('免费兑换').exists()) {//已经回到美团币界面
            if (className("android.widget.TextView").text('今日已领取').exists()) {
                click(1124, 1124);
            }
            break;
        }
        back();
        sleep_second(2);
    }
    return;
}

//立即领
for (let i = 0; i < 10; i++) {
    if (text('立即领取').exists()) {
        putout('立即领取');
        text('立即领取').click();
        sleep_second(2);
    }
    if (className("android.widget.TextView").text("立即签到").exists()) {
        putout('签到');
        className("android.widget.TextView").text("立即签到").findOnce().click();
        sleep_second(2);
    }
    if (!text('立即领').exists() && !textContains('后可领').exists()) {
        putout('没有立即领了');
        break;
    }
    while (textContains('后可领').exists()) {//等待立即领
        sleep_second(1);//间隔一秒，避免循环过快卡死
    }
    putout('点击立即领');
    text('立即领').click();
    if (className("android.widget.TextView").text('今日已领取').exists()) {
        click(1124, 1124);
    }
    sleep_second(2);
}



//领更多币
putout('领更多币');
judge = 0;
let second_45 = 0;//判断是否有45秒浏览
function get_more_coin() {

    for (let i = 0; i < 10; i++) {//领币
        if (!text('去领奖').exists()) {
            if (i == 0)
                second_45 = 1;//这次浏览没有得币
            break;
        }
        putout('领奖');
        text('去领奖').findOnce().click();
        sleep_second(2);
    }

    if (judge) {//该结束循环了
        putout('领更多币结束');
        if (className("android.widget.TextView").text('今日已领取').exists()) {//还在页面中
            click(1124, 1124);//关闭页面
        }
        return;
    }

    if (!className("android.widget.TextView").text('今日已领取').exists()) {//打开页面
        putout('点击领更多币');
        className("android.widget.TextView").text('领更多币').findOnce().click();
        sleep_second(2);
    }

    if (text('去浏览').exists() || text('去看看').exists()) {
        putout('浏览');
        if (text('去看看').exists())
            text('去看看').findOnce().click();
        else
            text('去浏览').findOnce().click();
        if (second_45)
            sleep_second(50);
        else
            sleep_second(25);
    }
    else {//都没有了
        putout('没有领更多币了');
        judge = 1;
        return;
    }
    second_45 = 0;//重置

    putout('返回浏览领币');
    for (let i = 0; i < 10; i++) {//返回
        if (id("s0f").exists()) {
            textContains('重启').click();
        }
        if (className("android.widget.TextView").text('今日已领取').exists()) {
            break;
        }
        back();
        sleep_second(1);
    }

    get_more_coin();//递归循环
}

get_more_coin();//领更多币


//抽美团币
if (textContains('抽美团币').exists()) {
    putout('开始抽美团币');
    textContains("抽美团币").click();
    sleep_second(5);
}

judge = 0;//判断是否还有抽奖
function draw_prize() {//抽奖
    while (textContains('点击抽奖').exists()) {
        putout('点击抽奖');
        textContains("点击抽奖").click();
        sleep_second(5);
        click(1040, 753);
    }
    if (judge) {//退出循环
        back_to_meituan();//返回美团币界面
        return;
    }
    //获得更多机会
    textContains('获得更多机会').click();
    while (!textContains("5/5").exists()) {//浏览
        putout('浏览一次');
        text("去完成").findOnce().click();
        putout('等待25秒');
        sleep_second(5);
        gesture(2000, [551, 2219], [865, 1394], [576, 785]);//滑动2秒
        sleep_second(20);
        putout('返回浏览页面');
        while (!textContains('做任务得抽奖机会').exists()) {//返回浏览页面
            back();
            sleep_second(2);
        }
        sleep_second(5);
        while (className("android.widget.TextView").text('领 奖').exists()) {//领奖
            putout('领奖');
            className("android.widget.TextView").text('领 奖').findOnce().click();
            sleep_second(2);
        }
    }
    if (textContains('5/5').exists()) {
        judge = 1;
        draw_prize();//最后循环一次抽奖
        putout('抽奖结束');
        return;
    }
    draw_prize();//递归循环
}
draw_prize();//抽奖



//浏览领币
putout('浏览领币');
while (className("android.widget.TextView").text('+').exists()) {
    putout('浏览领币一次');
    click(637, 1417);
    sleep_second(13);
    putout('返回');
    for (let i = 0; i < 10; i++) {
        if (className("android.widget.TextView").text('免费兑换').exists())
            break;
        back();
        sleep_second(2);
    }
}



//推美团币
putout('推美团币');
judge = 0;
function push_coin() {
    //领奖励
    while (judge_by_ocr(924, 1280, 1069, 1354, '领取')) {
        putout('领取');
        click(1004, 1307);//领取
        sleep_second(2);
    }

    if (judge) {//结束
        putout('推美团币签到');
        click(1071, 814);//今日领
        back_to_meituan();//返回美团币界面
        return;
    }

    //打开每日任务
    if (!judge_by_ocr(345, 977, 816, 1111, '每日任务')) {
        putout('打开每日任务');
        click(168, 2461);//打开任务页面
        sleep_second(2);
    }

    //开始做任务

    //浏览
    if (judge_by_ocr(911, 1528, 1080, 1604, '去完成')) {
        putout('做浏览任务');
        if (judge_by_ocr(368, 1465, 429, 1539, '10')) {//10秒
            putout('浏览10秒');
            click(989, 1560);
            sleep_second(15);
        }
        else {
            putout('浏览5秒');
            click(989, 1560);
            sleep_second(8);
        }

        putout('返回任务页面');
        for (let i = 0; i < 10; i++) {
            if (judge_by_ocr(345, 977, 816, 1111, '每日任务')) {
                putout('返回任务页面成功');
                break;
            }
            back();
            sleep_second(2);
        }
    }
    else {
        putout('浏览任务已完成');
        judge = 1;
        return;
    }

    push_coin();//递归循环
}

push_coin();//领更多币


//单单抽免单
putout('单单抽免单');
judge = 0;
function draw_free() {
    if (className("android.widget.TextView").text("免费兑换").exists()) {//在美团币页面
        className("android.widget.Image").text("下单抽免单").click();//点击单单抽免单
        sleep_second(2);
    }

    if (judge) {
        putout('单单抽免单结束');
        back_to_meituan();//返回美团币界面
        return;
    }

    if (judge_by_ocr(486, 1741, 713, 1829, '去下单')) {
        putout('没有抽奖机会了');
        judge = 1;
        return;
    }

    //抽免单
    click(608, 1798);//抽一次免单
    sleep_second(5);
    if (className("android.widget.TextView").text("额外再抽一次").exists()) {//有额外再抽一次
        putout('浏览10秒,额外再抽一次');
        var coordinate = className("android.widget.TextView").text("额外再抽一次").findOnce().bounds();
        click(coordinate.centerX(), coordinate.centerY());
        sleep_second(13);

        putout('返回');
        for (let i = 0; i < 10; i++) {
            if (className("android.view.View").clickable(true).depth(15).exists())//已经回到单单抽免单界面
                break;
            back();
            sleep_second(2);
        }
        sleep_second(2);
    }
    else {
        click(602, 2158);
        sleep_second(2);
    }

}



//笔笔返
putout('笔笔返');
function pen_pen_return() {
    if (className("android.widget.TextView").text("免费兑换").exists()) {//在美团币页面
        className("android.widget.Image").text("笔笔返").findOnce().parent().click();//点击笔笔返
        sleep_second(2);
    }

    //支付反币领取
    if (text("微信支付").exists() || text("支付宝支付").exists() || text("美团月付").exists()) {
        putout('支付反币领取');
        console.hide();
        sleep_second(1);
        while (text("微信支付").exists()) {//点击微信支付
            text("微信支付").findOnce().click();
            sleep_second(2);
        }
        while (text("支付宝支付").exists()) {//点击支付宝支付
            text("支付宝支付").findOnce().click();
            sleep_second(2);
        }
        while (text("美团月付").exists()) {//点击美团月付
            text("美团月付").findOnce().click();
            sleep_second(2);
        }
        console.show();
    }

    //浏览
    if (className("android.widget.TextView").text("去看看").exists()) {//有去看看
        putout('去看看');
        className("android.widget.TextView").text("去看看").findOnce().click();

        putout('浏览10秒');
        sleep_second(13);

        putout('返回');
        for (let i = 0; i < 10; i++) {
            if (className("android.widget.TextView").text("笔笔返").exists())//已经回到笔笔返界面
                break;
            back();
            sleep_second(2);
        }
    }

    //打卡瓜分
    putout('打卡瓜分');
    click(1086, 313);
    sleep_second(2);

    //报名
    if (className("android.widget.TextView").text("我要报名").exists()) {
        putout('报名');
        className("android.widget.TextView").text("我要报名").findOnce().click();
        sleep_second(2);

        if (judge_by_ocr(473, 1665, 722, 1741, '我要报名')) {
            click(595, 1674);
            sleep_second(2);
        }
    }
    else if (className("android.widget.TextView").text("明15:59前来访").exists()) {
        putout('未到报名时间');
    }
    else {//领奖
        click(968, 572);
    }

    back_to_meituan();//返回美团币界面
}
pen_pen_return();



hamibot.exit();