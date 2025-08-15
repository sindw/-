auto.waitFor();
console.show();
//权限获取
// if (!requestScreenCapture()) {
//     print('没有授予 Hamibot 屏幕截图权限');
//     hamibot.exit();
// }
sleep_second(2);

function sleep_second(t) {//按秒数等待
    sleep(t * 1000);
}


//---------------------------------------------------------------------------------------------------------------------
//启动
function open() {
    app.launchApp('虎牙直播');
    sleep_second(5);
    if (id('skip').textContains('跳过').exists()) {//已经打开了
        var coordinate = id('skip').textContains('跳过').findOnce().bounds();//坐标
        click(coordinate.centerX(), coordinate.centerY());
        print('跳过');
        sleep_second(3);
        return 1;
    }

    if (mine.exists())
        return 1;
    return 0;
}

function launch_app(str) {
    let i = 0;
    if (mine.exists()) {
        print('已启动');
        return;
    }
    print('启动' + str);
    while (!open()) {//如果启动失败
        print('尝试返回');
        for (let i = 0; i < 10; i++) {
            back();
            sleep_second(0.1);
        }

        print('重新启动' + str);
        i++;
        if (i >= 4) {//启动5次还没有成功
            print(str + '启动5次还未成功');
            hamibot.exit();
        }
        sleep_second(1);
    }
    print('成功启动' + str);
}

//打开虎牙
var mine = className("android.widget.TextView").text("我的");//“我的”控件
launch_app('虎牙直播');

//---------------------------------------------------------------------------------------------------------------------

//点击我的
var mission_center = className("android.view.View").desc("任务中心");//任务中心控件
function click_mine() {
    for(let i = 0; i < 10; i++){
        if(mission_center.exists()){
            return 1;//点击成功
        }
        
        //点击需要 “我的” 父控件
        var mine_parent = mine.findOnce().parent();
        mine_parent.click();

        sleep_second(1);
    }

    hamibot.exit();//点击失败直接退出
}

//点击任务中心
var coin = className("android.widget.TextView").text("金币").depth(15);//金币控件
function click_mission_center() {
    for(let i = 0; i < 10; i++){
        if(coin.exists()){
            return 1;//点击成功
        }

        //坐标点击
        var coordinate = mission_center.findOnce().bounds();//坐标
        click(coordinate.centerX(), coordinate.centerY());

        sleep_second(1);
    }

    hamibot.exit();//点击失败直接退出
}


//---------------------------------------------------------------------------------------------------------------------
//开始做任务

//做任务
var go_to_finish = className("android.widget.Button").text("去完成").clickable(true).depth(15);//去完成控件
function do_task(){

}

//




//领取奖励
var ling_qu = className('android.widget.Button').text('领取');
var qian_dao = className('android.widget.Button').text('签到');
var judge = 0;
function get_reward() {
    if (judge)
        return;

    if (!ling_qu.exists() && !qian_dao.exists()) {//没有领奖了
        judge = 1;
        return;
    }

    if (ling_qu.exists()) {//领取
        ling_qu.findOnce().click();//点击领取奖励
        print('领取奖励');
        sleep_second(1);

        if (text('我知道了').exists()) {//点击我知道了
            text('我知道了').click();//点击我知道了
            print('点击我知道了');
            sleep_second(1);
        }
    }

    if (qian_dao.exists()) {//签到
        qian_dao.click();//点击签到
        print('签到');
        sleep_second(1);
        if (text('7日内不再提醒').exists()) {//点击7日内不再提醒
            text('7日内不再提醒').click();//点击7日内不再提醒
            print('点击7日内不再提醒');
            sleep_second(1);
        }
    }

    get_reward();//递归

    return;
}

//做任务
var qu_wan_cheng = className('android.widget.Button').text('去完成');
var if_click = 0;//是否有过点击
function do_task() {
    var a = qu_wan_cheng.find();
    for (let i = 0; i < a.size(); i++) {
        //自己是紫色

        var b = a[i].parent();//父控件  橙色
        if (b == null)
            continue;

        var c = b.child(0);//子控件  紫色
        if (c == null)
            continue;

        if (judge_by_text(c.text())) {//判断是否有固定文字
            a[i].click();//点击
            print('做任务');
            if_click = 1;
            sleep_second(7);

            for (let i = 0; i < 10; i++) {//最多返回10次
                if (text('任务中心').exists()) {//判断是否返回了
                    sleep_second(2);
                    break;
                }
                back();//返回
                sleep_second(0.5);
            }

            app.launchApp('虎牙直播');//返回虎牙
            print('返回虎牙');
            sleep_second(2);

            //返回任务界面
            for (let i = 0; i < 10; i++) {//最多返回10次
                if (text('任务中心').exists()) {//判断是否返回了
                    print('已在任务中心');
                    sleep_second(2);
                    break;
                }
                back();//返回
                sleep_second(0.5);
            }

            break;
        }
    }

    if (if_click == 0)//没有点击过
        return;

    if_click = 0;
    do_task();//递归

}

//判断是否含有指定文字
function judge_by_text(str) {
    if (str.includes('快手'))
        return 1;

    if (str.includes('酷狗'))
        return 1;

    if (str.includes('喜马拉雅'))
        return 1;

    if (str.includes('全民短剧'))
        return 1;

    if (str.includes('顺丰速运'))
        return 1;

    if (str.includes('携程'))
        return 1;

    return 0;
}

do_task();//做任务
sleep_second(1);
get_reward();//领取奖励


hamibot.exit();