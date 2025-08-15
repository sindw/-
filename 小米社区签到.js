auto.waitFor();
console.show();
// //权限获取
// if (!requestScreenCapture()) {
//     putout('没有授予 Hamibot 屏幕截图权限');
//     hamibot.exit();
// }
sleep_second(2);

const test_view_num = 6;

function putout(str) {
    print(str);
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
        print('尝试返回');
        for (let i = 0; i < 10; i++) {
            back();
            sleep_second(0.1);
        }

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


//进入签到页面
var sign = className('android.widget.ImageView').desc('签到');
var sign_page = className('android.widget.TextView').text('每日任务');
function enter_sign_page(){
    if(sign.exists()){
        sign.click();//点击签到
    }
    else{
        back();//可能是卡住了,返回重新进
    }
    sleep_second(5);

    if(sign_page.exists()){
        return 1;
    }
    return 0;
}

//拔萝卜
var radish = className("android.widget.Button").desc("去看看");
function get_radish() {
    if(radish.exists()){
        radish.findOnce().click();
        sleep_second(2);
        return 1;
    }
    return 0;
}


//返回签到页面
function return_sign_page(){
    for(let i = 0; i < 10; i++){
        if(text("每日任务").exists()){
            return 1;
        }
        back();
        sleep_second(2);
    }
    return 0;
}


var judge = 0;
//完成任务
function do_task(){
    if(judge){
        return;
    }


    //进入签到页面
    judge = 0;
    for(let i = 0; i < 10; i++){
        if(enter_sign_page()){
            judge = 1;//成功进入签到页面
            break;
        }
        sleep_second(2);
    }

    if(judge == 0){
        print('进入签到页面失败');
        hamibot.exit();//退出
    }

    //开始拔萝卜
    for(let i = 0; i < 10; i++){
        if(get_radish()){
            print('成功拔萝卜');
            break;
        }
        sleep_second(2);
    }

    if(judge == 0){
        print('拔萝卜失败');
        hamibot.exit();//退出
    }
    else{//成功拔萝卜
        print('返回签到页面');
        return_sign_page();
    }

    //去浏览
    if (view.exists()) {
        judge = 0;
        go_to_view();
    }
    else {//签到页面没有去浏览
        print('已浏览');
    }

    do_task();

}

//去浏览
var view = view;//浏览控件
function go_to_view() {
    if (judge) {
        return;
    }

    //此时在签到页面
    if (!view.exists()) {
        judge = 1;
        return;
    }
    print('点击去浏览');
    view.click();
    sleep_second(2);

    print('随便点击一个帖子');
    //选一个帖子的控件,然后点击
    var a = className("android.widget.LinearLayout").depth(16).row(-1).drawingOrder(1);
    if (a.exists()) {
        a.findOnce().click();//点击
        sleep_second(2);
        if (a.exists()) {//如果还存在
            a.findOnce().click();//点击
            sleep_second(2);
        }
    }

    let appear_in_view = 0;//控件是否出现在手机内
    for (let i = 0; i < 15; i++) {
        var a = desc('热门');//评论控件
        if (!a.exists()) {//如果没有热门控件
            swipe(600, 2000, 600, 500, 500);//滑动
            sleep_second(1);
            continue;
        }
        var coordinate = a.findOnce().bounds();//控件坐标
        if (coordinate.centerY() >= 0 && coordinate.centerY() <= device.height) {//控件在屏幕内
            appear_in_view = 1;
            break;
        }
    }

    if (appear_in_view == 1) {
        judge = 1;
        print('等待12S');
        sleep_second(12);
        print('浏览完成,正在返回签到页面');
    }

    for(let i = 0; i < 10; i++){//返回主页
        if(sign.exists()){
            break;
        }
        back();
        sleep_second(2);
    }
    enter_sign_page();
    print('成功返回签到页面');

    if (judge)
        return;
    go_to_view();
}


//活动

//微信签到
const { radio1 } = hamibot.env;//yes代表是 no代表否
const { radio2 } = hamibot.env;//yes代表是 no代表否
var go_to_wechat = desc("去微信");
if (radio1 == 'yes' && go_to_wechat.exists()) {
    print('微信签到');
    wechat_sign_in();
}
function wechat_sign_in() {
    if (!go_to_wechat.exists()) {//没有去微信控件
        return;
    }
    print('点击去微信');
    go_to_wechat.findOnce().click();
    sleep_second(5);

    var b = text('去签到');
    var num_judge = 0;
    for (let i = 0; i < 100; i++) {
        if (b.exists()) {
            b.click();
            print('微信签到');
            num_judge = 1;
            sleep_second(2);
            break;
        }
        else if (text('已签到').exists()) {
            print('已经签到');
            num_judge = 1;
            break;
        }

        sleep_second(0.1);
    }

    if (num_judge == 0) {//微信签到失败
        print('微信签到失败');
        if (radio2 == 'yes') {//胡点一通
            print('尝试点击屏幕');
            var x = device.width / 2;
            var y = device.height / 4;
            while (y < device.height / 4 * 3) {
                if (x > device.width) {
                    x = device.width / 2;
                    y += 100;
                }
                else {
                    click(x, y);
                    x += 100;
                }
                sleep_second(0.1);
            }
            sleep_second(2);
        }
    }

    num_judge = 0;
    for (let i = 0; i < 10; i++) {
        if (text("查看成长值规则").exists()) {
            print('成功返回签到页面');
            num_judge = 1;
            break;
        }
        back();
        sleep_second(1);
    }

    if (num_judge == 0) {
        print('返回签到页面失败');
        launch_app();
        desc('签到').click();//点击签到
        sleep_second(3);
    }

    return;
}

//去参加控件
var go_to_lottery_ui = className("android.widget.Button").desc("去参加");
var unlockable = className("android.widget.TextView").depth(14).text("可解锁");
var judge = 0;
function go_to_lottery() {
    go_to_lottery_ui.click();//进入抽奖页面
    sleep_second(2);

    if (judge) {
        return;
    }

    if (!unlockable.exists()) {
        print('抽奖次数已用完');
        back();//返回签到页面
        judge = 1;
        return;
    }

    if (unlockable.exists()) {
        print('抽奖一次');
        unlockable.findOnce().click();
        sleep_second(1);
        back();//返回签到页面
    }

    go_to_lottery();//递归
}

if (go_to_lottery_ui.exists()) {
    print('参加活动');
    go_to_lottery();
    sleep_second(2);
}

//签到
if (className("android.widget.TextView").text("已签到").exists()) {
    print('已签到');
    hamibot.exit();
}
else if (textContains("立即签到").exists()) {
    print('点击立即签到');
    textContains("立即签到").click();
    print('请进行滑块验证');
}


hamibot.exit();