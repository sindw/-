auto.waitFor();
console.show();
sleep_second(2);

function sleep_second(t) {//按秒数等待
    sleep(t * 1000);
}

//判断是否在小程序中
function in_it_or_not() {
    var skip = textContains('跳过');
    for (let i = 0; i < 10; i++) {
        if (skip.exists()) {
            skip.findOnce().click();//点击跳过
            sleep_second(1);
            return 1;
        }

        if (me.exists()) {
            sleep_second(1);
            return 1;
        }

        sleep_second(0.1);
    }
    return 0;
}


function open(str) {//启动
    if (in_it_or_not()) {//已经打开了
        return 1;
    }

    app.launchApp(str);
    sleep_second(3);

    if (in_it_or_not())
        return 1;
    return 0;
}

function launch_app(str) {
    let i = 0;
    if (in_it_or_not()) {
        print('已启动');
        return;
    }
    print('启动' + str);
    while (!open(str)) {//如果启动失败
        print('尝试返回');
        for (let i = 0; i < 10; i++) {
            back();
            sleep_second(0.1);
        }

        print('重新启动' + str);
        i++;
        if (i >= 4) {//启动10次还没有成功
            print(str + '启动5次还未成功');
            hamibot.exit();
        }
        sleep_second(1);
    }
    print('成功启动' + str);
}

function stop() {
    print('脚本进入未知界面，停止运行');
    hamibot.exit();
}


//起点主页"我"文字控件
var me = className('android.widget.TextView').text('我');
//"福利中心"文字控件
var welfare_center = className('android.widget.TextView').text('福利中心');
//福利中心内"积分商城"文字控件
var integral_mall = className('android.widget.TextView').text('积分商城');
//是否尝试过退出
var if_try = 0;
//进入福利中心
function get_into_welfare_center() {
    if (integral_mall.exists()) {//在福利中心
        print('已经在福利中心');
        return;
    }
    else if (!me.exists() && if_try) {//不在福利中心也不在主界面,退出也尝试过了
        stop();
    }
    else if (!me.exists() && !if_try) {//不在福利中心也不在主界面 尝试退出
        for (let i = 0; i < 10; i++) {//尝试退出
            back();
            sleep_second(0.1);
        }
        launch_app('起点读书');//重新启动
        if_try = 1;
    }

    //点击"我" 需要等待1秒
    var coordinate = me.findOnce().bounds();//坐标
    click(coordinate.centerX(), coordinate.centerY());//点击
    print('点击"我"');
    sleep_second(1);

    //点击"福利中心" 需要等待5秒
    var coordinate = welfare_center.findOnce().bounds();//坐标
    click(coordinate.centerX(), coordinate.centerY());//点击
    print('点击"福利中心"');
    sleep_second(5);


    get_into_welfare_center();
}


//验证码控件
var yan_zheng_ma = className('android.widget.TextView').text('常规验证');//验证码
//"看视频"文字控件
var watch_video = className('android.widget.TextView').text('看视频');

//点击看视频
function click_video() {
    if (!integral_mall.exists()) {//不在福利中心
        print('不在福利中心');
        return;
    }

    var coordinate = watch_video.findOnce().bounds();//坐标
    click(coordinate.centerX(), coordinate.centerY());//点击
    print('点击"看视频"');
    sleep_second(5);

    click_video();
}


//看视频并关闭广告
function close_ad() {
    //先判定是否有验证码
    if (yan_zheng_ma.exists()) {//有验证码
        print('有验证码,建议先手动看视频直至验证码不再弹出');
        hamibot.exit();//退出
    }

    if (integral_mall.exists()) {//在福利中心
        print('在福利中心');
        return;
    }

    //看广告
    watch_ad();

    //点击知道了
    if (know_it.exists()) {
        var coordinate = know_it.findOnce().bounds();//坐标
        click(coordinate.centerX(), coordinate.centerY());//点击
        print('点击"知道了"');
        sleep_second(1);
    }


}


//继续观看控件
var continue_watch = text('继续观看');

//第一种广告  有文字,观看15/30秒
//广告还在播放的控件
var ad_1_playing = className('android.widget.TextView').textContains('可');
//广告播放完的控件
var ad_1_finished = className('android.widget.TextView').textContains('已');

//第二种广告  观看15/30秒
//广告还在播放的控件
var ad_2_playing = className('android.view.View').depth(12).row(-1).indexInParent(1);
//广告播放完的控件
var ad_2_finished = className('android.view.View').depth(11).row(-1).indexInParent(1);

//第三种广告
//广告还在播放的控件
var ad_3_playing = className('android.widget.TextView').textContains('秒后');
//广告播放完的控件 正常情况
var ad_3_finished_1 = className('android.widget.TextView').text('奖励已领取');
//广告播放完的控件 等待过久
var ad_3_finished_2 = className('android.widget.TextView').text('反馈');

//等待广告
function watch_ad() {
    var judge = 0;//判断是第几种广告
    if (ad_1_playing.exists() || ad_1_finished.exists()) {//第一种广告
        judge = 1;
    }
    else if (ad_2_playing.exists() || ad_2_finished.exists()) {//第二种广告
        judge = 2;
    }

    if (judge == 1) {//第一种广告
        print('等待15s');
        sleep_second(15);
        for (let i = 0; i < 20; i++) {//等待20秒
            if (continue_watch.exists()) {//点击继续观看
                var coordinate = continue_watch.findOnce().bounds();//坐标
                click(coordinate.centerX(), coordinate.centerY());//点击
                print('点击"继续观看"');
                i = 0;
            }

            if (ad_1_finished.exists() || ad_1_close_2.exists()) {//广告播放完了
                break;
            }
            sleep_second(1);
        }
    }
    else if (judge == 2) {//第二种广告
        print('等待15s');
        sleep_second(15);
        for (let i = 0; i < 20; i++) {//等待20秒
            if (continue_watch.exists()) {//点击继续观看
                var coordinate = continue_watch.findOnce().bounds();//坐标
                click(coordinate.centerX(), coordinate.centerY());//点击
                print('点击"继续观看"');
                i = 0;
            }

            if (ad_2_finished.exists() || ad_1_close_2.exists()) {//广告播放完了
                break;
            }
            sleep_second(1);
        }
    }


    if (judge == 0) {
        stop();
    }
    else {
        close_ad(judge);//关闭广告
    }
}


//广告结束后"知道了"文字控件
var know_it = className('android.widget.TextView').text('知道了');

//第一种广告
//关闭广告控件
var ad_1_close = className('android.widget.TextView').text('跳过广告');
//当广告等待时间过长,关闭广告控件 此时界面只有此控件,因此也是判定控件
var ad_1_close_2 = className('android.view.ViewGroup').depth(5).row(-1).indexInParent(1);

//第二种广告
//关闭广告控件
var ad_2_close = className('android.view.ViewGroup').depth(10).row(-1).indexInParent(1);
//当广告等待时间过长,关闭广告控件 此时界面只有此控件,因此也是判定控件
var ad_2_close_2 = className('android.view.ViewGroup').depth(9).row(-1).indexInParent(3);

//点击关闭广告
function close_ad(str) {
    print('str = ' + str);
    print('尝试关闭广告');

    if (integral_mall.exists() || know_it.exists()) {//在福利中心
        print('回到福利中心');
        return;
    }

    if (str == 1) {//第一种广告
        if (ad_1_close.exists()) {//有关闭广告控件
            var coordinate = ad_1_close.findOnce().bounds();//坐标
            click(coordinate.centerX(), coordinate.centerY());//点击
            print('点击"跳过广告"');
            sleep_second(1);
        }
        else if (ad_1_close_2.exists()) {//有等待过久的关闭广告控件
            var coordinate = ad_1_close_2.findOnce().bounds();//坐标
            click(coordinate.centerX(), coordinate.centerY());//点击
            print('退出看视频');
            sleep_second(1);
        }
        else {
            for (let i = 0; i < 10; i++) {//等待10秒
                if (integral_mall.exists() || know_it.exists()) {//在福利中心
                    break;
                }
                back();//返回
                sleep_second(0.3);
            }
        }
    }

    else if (str == 2) {//第二种广告
        if (ad_2_close.exists()) {//有关闭广告控件
            var coordinate = ad_2_close.findOnce().bounds();//坐标
            click(coordinate.centerX(), coordinate.centerY());//点击
            print('点击"跳过广告"');
            sleep_second(1);
        }
        else if (ad_2_close_2.exists()) {//有等待过久的关闭广告控件
            var coordinate = ad_2_close_2.findOnce().bounds();//坐标
            click(coordinate.centerX(), coordinate.centerY());//点击
            print('退出看视频');
            sleep_second(1);
        }
        else {
            for (let i = 0; i < 10; i++) {//等待10秒
                if (integral_mall.exists() || know_it.exists()) {//在福利中心
                    break;
                }
                back();//返回
                sleep_second(0.3);
            }
        }
    }


    //点击知道了
    if (know_it.exists()) {//知道了
        var coordinate = know_it.findOnce().bounds();//坐标
        click(coordinate.centerX(), coordinate.centerY());//点击
        print('点击"知道了"');
        sleep_second(1);
    }

    sleep_second(1);
    close_ad(str);//关闭广告

}


function main() {
    launch_app('起点读书');
    sleep_second(1);
    get_into_welfare_center();//进入福利中心
    sleep_second(1);
    while (watch_video.exists()) {//看视频
        click_video();//点击看视频
        sleep_second(1);
        close_ad();//关闭广告
        sleep_second(1);
    }
    hamibot.exit();//退出
}
main();