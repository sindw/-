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


//支付宝
function open_by_url() {//通过url启动
    app.openUrl(start_url);
    if (text_exists('打开支付宝')) {
        uiselector_click('打开支付宝');
        sleep_second(2);
    }
    if (!in_it_or_not()) {//没有支付宝文字,也没有在小程序页面
        return 0;
    }
    return 1;
}

function open_by_alipay() {
    setClip(command);//把口令复制到剪切板
    app.launchApp('支付宝');//打开支付宝

    var go_to_look = className('android.widget.Button').text('去看看');
    if (uiselector_exists(go_to_look)) {//去看看
        for (let i = 0; i < 10; i++) {
            go_to_look.click();
            sleep_second(1);
            if (in_it_or_not())
                return 1;
        }
        sleep_second(2);
    }
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
            print(str + 'url启动5次还未成功,尝试支付宝启动');
            break;
        }
    }
    if (i == 4) {//url启动失败
        i = 0;
        while (!open_by_alipay()) {//如果启动失败
            print('重新通过支付宝启动启动' + str);
            i++;
            if (i >= 4) {//启动10次还没有成功
                print(str + '启动5次还未成功');
                hamibot.exit();
                break;
            }
        }
    }
    print('成功启动' + str);
}

function in_it_or_not() {//判断是否在小程序内
    for (let i = 0; i < 10; i++) {
        if (className("android.widget.Image").text("O1CN01FVcTxl1lw0STNcT4e_!!6000000004882-2-tps-160-160.png_").exists())
            return 1;
        sleep(200);
    }
    return 0;
}

var start_url = 'https://www.wmslz.com/s/3eEI3rD29jG';
var command = '# https://www.wmslz.com/s/1YxEkHL299o#复制此消息，打开支付宝搜索，体验薅羊毛赚话费小程序  U:/j MF9963 2024/01/13';

launch_app('薅羊毛 赚话费');
close_ads();

function close_ads() {//关闭广告
    var a = className("android.widget.Image").text("O1CN01H0i1Xa1HZA2IIDwsI_!!6000000000771-2-tps-72-72.png_");
    if (a.exists()) {
        print('关闭广告');
        a.click();
        sleep_second(1);
    }

    var a = className("android.widget.Image").text("O1CN01ELj2Sj1CoDC62K28S_!!6000000000127-2-tps-72-72.png_140x10000.jpg_");
    if (a.exists()) {
        print('关闭广告');
        a.click();
        sleep_second(1);
    }

}

//获取屏幕信息
const start_x = device.width * 0.456;
const start_y = device.height * 0.748;
const end_x = device.width * 0.667;
const end_y = device.height * 0.105;
const duration = 1000;

function swipe_down_for_duration(total_seconds) {//屏幕向下滑
    for (let i = 0; i < total_seconds; i++) {
        swipe(start_x, start_y, end_x, end_y, duration);
        sleep_second(1); // 等待1秒再进行下一次滑动
    }
}

function swipe_up_for_duration(total_seconds) {//屏幕向上滑
    // 计算需要滑动的次数
    const swipe_count = Math.ceil(total_seconds);

    for (let i = 0; i < swipe_count; i++) {
        swipe(end_x, end_y, start_x, start_y, duration);
        sleep_second(1); // 等待1秒再进行下一次滑动
    }
}


//签到
if (className("android.widget.TextView").text("领200g饲料").exists()) {
    print('签到1');
    var coordinate = className("android.widget.TextView").text("领200g饲料").findOnce().bounds();
    click(coordinate.centerX(), coordinate.centerY());
}

var a = className('android.view.View').depth(14);
var b = a.findOnce().child(0).child(5).child(3);
click(b.bounds().centerX(), b.bounds().centerY());

sleep_second(1);

if (className("android.widget.TextView").text("领200g饲料").exists()) {
    print('签到1');
    var coordinate = className("android.widget.TextView").text("领200g饲料").findOnce().bounds();
    click(coordinate.centerX(), coordinate.centerY());
}

if (textContains('刷新').exists()) {
    print('2已经签到过了');
}
else {
    print('签到2');
    className("android.widget.TextView").text("签到奖励").findOnce().click();
    sleep_second(1);
}

var judge = 0;
function scroll_down() {//下滑浏览
    if (className("android.widget.Image").text("O1CN01aUmH181CNeDwOyxjd_!!6000000000069-2-tps-204-128.png_170x10000.jpg_").exists()) {
        print('领取饲料')
        className("android.widget.Image").text("O1CN01aUmH181CNeDwOyxjd_!!6000000000069-2-tps-204-128.png_170x10000.jpg_").click();
    }

    if (judge)
        return;
    print('滑动浏览')

    if (className("android.widget.TextView").textContains("下滑浏览").exists())//要滑动
        swipe_down_for_duration(5);//向下滑动5次
    else {
        judge = 1;
        while (1) {

            //界面控件
            var a = className("android.widget.Image").text("O1CN01FVcTxl1lw0STNcT4e_!!6000000004882-2-tps-160-160.png_");
            if (a.exists()) {//首先控件要存在
                var coordinate = a.findOnce().bounds();
                if (coordinate.centerY() >= 0 && coordinate.centerY() <= device.height) {//在屏幕内
                    break;
                }
            }

            //滑动
            swipe_up_for_duration(1);//上滑
        }
        return;
    }

    var a = className("android.widget.TextView").text("--- 我是有底线的 ---");
    if (a.exists()) {//先判断控件是否加载了
        var coordinate = a.findOnce().bounds();
        if (coordinate.centerY() >= 0 && coordinate.centerY() <= device.height) {//到最底部了
            swipe_up_for_duration(2);//上滑
        }
    }

    while (className("android.widget.TextView").textContains("下滑浏览").exists()) {
        swipe_down_for_duration(1);
        swipe_up_for_duration(1);
        sleep_second(0.5);
    }

    scroll_down();//递归循环确保没有错漏
}
scroll_down();



var judge = 0;
var coordinate = className("android.widget.TextView").text("").findOnce().bounds();//关闭位置
function do_mission() {//做任务领饲料
    if (judge)
        return;

    while (!text("去完成").exists() && !text('已完成').exists() && !text("领取奖励").exists()) {//打开任务页面
        print('打开任务页面');
        className("android.widget.TextView").text("领饲料领饲料").findOnce().click();
        sleep_second(1);
    }

    for (let i = 0; i < 10; i++) {//领奖
        if (!text("领取奖励").exists())
            break;
        print('领奖');
        text("领取奖励").findOnce().click();
        sleep_second(1);
    }


    if (text("去完成").exists()) {//点击去完成
        print('做任务');
        for (let i = 0; i < 3; i++) {//以防万一点击三次
            text("去完成").findOnce().click();
            sleep_second(1);
        }
    }

    if (!text("去完成").exists()) {//已经没有任务了
        if (className("android.widget.Button").text("关闭").exists()) {//关闭任务页面
            className("android.widget.Button").text("关闭").findOnce().click();
            sleep_second(1);
        }
        judge = 1;
        return;
    }

    print('看广告');
    if (in_it_or_not()) {//页面内广告
        sleep_second(17);//浏览15秒 以防万一多等2秒

        /*

        等待关闭广告的方法





        */
        sleep_second(1);
    }
    else {
        for (let i = 0; i < 10; i++) {
            back();
            sleep_second(2);
        }
        if (!in_it_or_not()) {
            print('程序错误');
            hamibot.exit();
        }
    }


    do_mission();
}
// do_mission();


function extractNumberFromString(str) {
    const match = str.match(/(\d+)/);
    if (match && match[1]) {
        return parseInt(match[1], 10);
    }
    return null; // 如果没有匹配到数字，返回 null
}

var judge1 = 0, judge2 = 0, judge3 = 1, judge4 = 0, judge = 0;
function feed_sheep() {//喂羊
    if (judge)
        return;

    //时间饲料  judge4
    if (className("android.widget.Image").text("O1CN01aUmH181CNeDwOyxjd_!!6000000000069-2-tps-204-128.png_170x10000.jpg_").exists()) {
        print('领取饲料');
        className("android.widget.Image").text("O1CN01aUmH181CNeDwOyxjd_!!6000000000069-2-tps-204-128.png_170x10000.jpg_").click();
        judge1 = 1;
    }
    else {
        judge4 = 0;
    }

    //立即领取  judge2
    if (className("android.widget.TextView").text("立即领取").exists()) {
        judge1 = 1;//重置一下喂羊次数
        print('立即领取')
        className("android.widget.TextView").text("立即领取").findOnce().click();
        sleep_second(1);
    }
    else {
        judge2 = 0;//没有立即领取了
    }

    //喂羊  judge1
    var a = className("android.widget.TextView").depth(20).find();
    if (a[0].text() != '0') {
        judge2 = 1, judge3 = 1;//喂了羊可能有立即领取和扭蛋
        print('喂1次')
        a[1].click();
        sleep_second(1);

        //升级了
        if (className("android.widget.Image").text("O1CN01H0i1Xa1HZA2IIDwsI_!!6000000000771-2-tps-72-72.png_").exists()) {
            className("android.widget.Image").text("O1CN01H0i1Xa1HZA2IIDwsI_!!6000000000771-2-tps-72-72.png_").findOnce().click();
        }
    }
    else {//没有喂羊次数了
        judge1 = 0;
    }

    //扭蛋
    if (judge3) {//有扭蛋机会
        if (text('扭蛋机').exists()) {//在主页面
            print('进入扭蛋机');
            text('扭蛋机').findOnce().click();
            sleep_second(1);
        }

        var num = className("android.widget.TextView").textContains('剩余扭蛋次数');
        if (num.exists()) {
            var a = num.findOnce();
            if (extractNumberFromString(a.text()) >= 10)//扭蛋次数超过10次
                print('扭蛋机次数超过10次');
            className('android.widget.Image').text('O1CN01fKfDSR26UcpB7oS5M_!!6000000007665-2-tps-374-148.png_q75.jpg_').click();
            sleep_second(1);
            //确认
            className("android.widget.TextView").text("开心收下").click();
            sleep_second(1);

            judge1 = 1;//重置一下喂羊次数
        }
        else {
            judge3 = 0;
            print('扭蛋机次数不足10次');
        }

        for (let i = 0; i < 10; i++) {//返回主界面
            if (!in_it_or_not())
                back();
            sleep_second(1);
        }
    }

    if (!judge1 && !judge2 && !judge3 && !judge4) {
        judge = 1;
        return;
    }

    feed_sheep();
}
feed_sheep();

hamibot.exit();