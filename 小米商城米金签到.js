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

const test_view_num = 10;

function open() {//启动
    app.launchApp('小米商城');
    sleep_second(5);
    if (id('skip').textContains('跳过').exists()) {//已经打开了
        var coordinate = id('skip').textContains('跳过').findOnce().bounds();//坐标
        click(coordinate.centerX(), coordinate.centerY());
        print('跳过');
        sleep_second(3);
        return 1;
    }

    if (className("android.widget.TextView").text("我的").exists())
        return 1;
    return 0;
}

function launch_app(str) {
    let i = 0;
    if (className("android.widget.TextView").text("我的").exists()) {
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

launch_app('小米商城');


//点击签到
var judge = 0, num = 0;
function click_sign() {
    if (judge) {
        return;
    }

    //确认是否在米金商城页面控件
    var mikin_store = className("android.widget.TextView").text("米金商城");
    if (mikin_store.exists()) {
        print('成功进入米金商城');
        judge = 1;
        return;
    }

    //从"主页"进入米金商城

    //主页签到按钮控件
    var sign = className('android.widget.ImageView').depth(12).drawingOrder(4).row(-1);
    if (sign.exists()) {
        print('进入米金商城');
        sign.findOnce().click();
        sleep_second(3);
    }


    //从"我的"进入米金商城

    // //点击我的
    // //我的 文字控件
    // var mine = className("android.widget.TextView").text("我的");
    // var coordinate = mine.findOnce().bounds();//坐标
    // click(coordinate.centerX(), coordinate.centerY());//点击
    // print('点击我的');
    // sleep_second(3);

    // //点击米金商城
    // //米金 文字控件 深绿色 点击需要父控件
    // var mikin = className("android.widget.TextView").text("米金").depth(23).drawingOrder(2).row(-1);
    // if (mikin.exists()) {
    //     var a = mikin.findOnce();//找到控件
    //     var b = a.parent();//找到父控件
    //     if (b != null) {
    //         b.click();//点击
    //         print('点击米金商城');
    //         sleep_second(3);
    //     }
    // }



    num++;
    if (num >= 5 && num <= 10) {//如果5次都没有进入米金商城
        print('进入米金商城失败,重新启动小米商城');

        //退出小米商城
        print('退出小米商城');
        for (let i = 0; i < 10; i++) {
            back();
            sleep_second(0.5);
        }

        launch_app('小米商城');
    }
    else if (num > 10) {//如果10次都没有进入米金商城
        print('进入米金商城失败,请检查权限是否启动并反馈原因');
        hamibot.exit();
    }
    click_sign();
}
click_sign();


//开始做米金任务

//进入任务
judge = 0;
function click_mikin_mission() {//需要在米金商城页面

    var get_all = text('全部领取');//购买物品米金
    if (get_all.exists()) {
        var coordinate = get_all.findOnce().bounds();//坐标
        click(coordinate.centerX(), coordinate.centerY());//点击
        print('领取米金');
        sleep_second(2);
    }

    //已经打开任务页面
    if (judge) {
        return;
    }

    if (className("android.widget.TextView").text("做任务赢福利").exists()) {
        print('成功进入米金任务页面');
        judge = 1;
        return;
    }

    var a = className('android.view.ViewGroup').depth('15').drawingOrder('2').findOnce();//米金任务按钮 紫色
    if (a == null) {
        return;
    }
    var b = a.child(0);//米金任务按钮的子控件 黄色
    if (b == null) {
        return;
    }
    var c = b.child(0);//米金任务按钮的子控件的子控件 绿色
    if (c == null) {
        return;
    }
    c.click();//点击米金任务按钮
    print('点击米金任务');
    sleep_second(2);

    click_mikin_mission();

    return;
}
click_mikin_mission();

//签到
judge = 0;
function do_sign() {
    if (judge) {
        return;
    }

    if (className("android.widget.TextView").text("已签到").exists()) {//已经签到过了
        print('已签到');
        judge = 1;
        return;
    }

    var sign_in = className("android.widget.TextView").text("立即签到");
    if (sign_in.exists()) {
        print('开始签到');
        var coordinate = className("android.widget.TextView").text("立即签到").findOnce().bounds();
        click(coordinate.centerX(), coordinate.centerY());
        sleep_second(2);

        //点击知道了
        var a = className("android.view.ViewGroup").clickable(true).depth(8);
        if (a.exists()) {
            print('点击知道了')
            a.findOnce().click();
            sleep_second(2);
        }
    }

    do_sign();

    return;
}
do_sign();


//开始做米金任务
judge = 0, num = 0;
function do_mikin_task() {
    if (judge || num >= test_view_num) {
        return;
    }

    var go_to_view = text("去浏览");
    if (!go_to_view.exists()) {//没有任务
        print('没有任务');
        judge = 1;
        return;
    }

    judge = 1;

    var a = go_to_view.find();//任务的集合
    for (let i = 0; i < a.size(); i++) {//查找可以点击的任务
        //任务本身控件深绿色

        var b = a[i].parent();//任务的父控件 绿色
        if (b == null) {
            continue;
        }

        var c = b.parent();//任务的父控件的父控件 黄色
        if (c == null) {
            continue;
        }

        var d = c.parent();//任务的父控件的父控件的父控件 紫色
        if (d == null) {
            continue;
        }

        var e = d.parent();//任务的父控件的父控件的父控件的父控件 橙色
        if (e == null) {
            continue;
        }

        var f = e.child(0);//任务的父控件的父控件的父控件的父控件的子控件1 紫色
        if (f == null) {
            continue;
        }
        if (f.text().includes("钱包")) {//如果包含钱包两个字
            continue;
        }

        c.click();//点击任务 需要用紫色控件点击
        print('开始浏览');
        judge = 0;
        break;
    }

    if (judge) {//没有找到可以点击的任务
        print('没有任务');
        return;
    }

    sleep_second(10);//浏览10秒

    //等待浏览完成(此时没有回到签到页面) judge = 0
    for (let i = 0; i < 10; i++) {
        if (className("android.widget.TextView").text("领取奖励").exists()) {//如果浏览完成
            print('浏览完成');
            judge = 1;

            //返回
            print('返回');
            for (let j = 0; j < 10; j++) {
                if (className("android.widget.TextView").text("米金商城").exists()) {//在米金商城内
                    break;
                }
                back();
                sleep_second(3);
            }

            break;
        }
        sleep_second(2);
    }

    if (!judge) {//如果没有浏览完成 说明不是软件内浏览
        print('退出')

        for (let i = 0; i < 10; i++) {
            if (className("android.widget.TextView").text("米金商城").exists())
                break;
            back();
            sleep_second(1);
        }

        print('返回小米商城');
        app.launchApp('小米商城');//返回到软件内
        sleep_second(3);

    }

    judge = 0;
    click_mikin_mission();//重新打开米金任务页面
    judge = 0;
    num++;
    do_mikin_task();//递归

    return;
}
do_mikin_task();

hamibot.exit();