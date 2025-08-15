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

app.launchApp('虎牙直播');

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