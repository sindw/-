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
            skip.click();//点击跳过
            sleep_second(1);
            return 1;
        }

        if (get_into_sign_center.exists()) {
            sleep_second(0.1);
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

launch_app('顺丰速运');

function stop() {
    print('脚本进入未知界面，停止运行');
    hamibot.exit();
}


//进入签到页面
var get_into_sign_center = desc('会员中心');
function get_into_sign_in() {
    if (get_into_sign_center.exists()) {//在主界面
        print('进入会员中心')
        get_into_sign_center.findOnce().click();//点击会员中心
        sleep_second(1);
    }
    else if (!sign_center.exists()) {//不在会员中心也不在主界面
        stop();
    }

    click_ok();//点击好的
    return 0;
}
get_into_sign_in();

//点击好的
var ok = text('好的');
var sign_center = text('寄件优惠');
function click_ok() {
    if (ok.exists()) {//好的存在，说明刚刚签到
        print('点击好的');
        ok.click();
        sleep_second(1);
    }
    else if (!sign_center.exists()) {//不在会员中心
        print('重新进入会员中心');
        get_into_sign_in();
        return 0;
    }

    get_into_task();//进入任务界面
    return 0;
}

//进入任务界面
var center = textContains('做任务赚积分');
var if_in_task = text('签到提醒');
function get_into_task() {
    if (center.exists() && !if_in_task.exists()) {//在会员中心但是没有点开任务界面
        print('进入任务界面');

        var coordinate = center.findOnce().bounds();//任务界面坐标
        var x = (coordinate.centerX() + coordinate.right) / 2;
        var y = coordinate.centerY();
        click(x, y);//点击任务界面

        sleep_second(1);
    }
    else if (!center.exists()) {//不在会员中心
        print('重新进入会员中心');
        get_into_sign_in();
        return 0;
    }

    if (if_in_task.exists()) {//在任务界面
        print('成功进入任务界面');
        task_cooperation();//合作任务
    }
    else {//不在任务界面
        print('重新进入任务界面');
        get_into_task();
    }

    return 0;
}


//开始做任务
//合作任务
function task_cooperation() {


    task_daily();//日常任务

    return 0;
}

//日常任务
function task_daily() {

    return 0;
}

//浏览
var reading = className("android.view.ViewGroup").clickable(true);
var read_complete1 = text('已完成');
var read_complete2 = text('领积分');
function read() {
    print('浏览');
    for (let i = 0; i < 20; i++) {
        if (reading.exists()) {//正在浏览
            if (read_complete1.exists() && read_complete2.exists()) {//浏览完成
                print('浏览完成');
                back_to_task();//返回任务界面
                return 0;
            }

        }

        sleep_second(1);
    }

    return 0;
}

//返回任务界面
function back_to_task() {
    print('返回');
    for (let i = 0; i < 20; i++) {//返回20次
        if (center.exists()) {//在会员中心
            print('成功返回任务界面');
            break;
        }
        back();//返回
        sleep_second(0.5);
    }

    get_into_task();//重新进入任务界面
    return 0;
}

hamibot.exit();