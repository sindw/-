auto.waitFor();
console.show();
sleep_second(2);

function sleep_second(t) {//按秒数等待
    sleep(t * 1000);
}

//判断是否在小程序中
function in_it_or_not() {
    var a = text('签到成功!');
    var b = text('我');
    var c = id('vg_scroll_kit');

    for (let i = 0; i < 10; i++) {

        if (!if_sign_in) {
            if (a.exists()) {//弹出来签到界面
                print('签到');
                for (let i = 0; i < 10; i++) {
                    if (!a.exists()) {
                        print('签到成功');
                        if_sign_in = 1;
                        break;
                    }
                    text('确定').click();//签到
                    sleep_second(0.1);
                }
                return 1;
            }
        }

        if (c.exists()) {
            back();
            sleep_second(0.1);
        }

        if (b.exists()) {
            sleep_second(0.1);
            return 1;
        }

        sleep_second(0.1);
    }
    return 0;
}


function open() {//启动
    if (in_it_or_not()) {//已经打开了
        return 1;
    }

    app.launchApp('小黑盒');
    var a = text('我');
    if (a.exists()) {
        a.click();
        sleep_second(1);
        return 1;
    }

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
    while (!open()) {//如果启动失败
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

launch_app('小黑盒');

var if_sign_in = 0;//是否签到

//以下为脚本内功能代码

//点击我的
var judge = 0;
function open_mine() {
    if (judge) {
        judge = 0;
        return;
    }

    var a = text('我的任务');//我的任务 控件

    if (!if_sign_in) {
        in_it_or_not();//执行一次签到
    }

    if (a.exists()) {
        print('成功点击我的');
        judge = 1;
        return;
    }

    var b = text('我');
    b.click();
    sleep_second(1);

    open_mine();
}
print('点击我的');
open_mine();



//进入我的任务页面
var judge = 0;
function open_my_task() {
    if (judge) {
        return;
    }

    var b = text('每日任务');
    if (b.exists()) {
        print('成功进入任务页面');
        judge = 1;

        sleep_second(0.2);
        if (text('已连续签到').exists())//已经签到了
            if_sign_in = 1;

        return;
    }

    if (!if_sign_in)
        in_it_or_not();//执行一次签到

    var a = text('我的任务');//我的任务 控件

    //通过提前判断,避免报错
    if (!a.exists()) {
        open_my_task();
    }

    var b = a.findOnce();//我的任务 控件

    var c = b.parent();//我的任务的父控件
    if (!c)
        open_my_task();

    var d = c.parent();//我的任务的父控件的父控件
    if (!d)
        open_my_task();

    d.click();
    sleep_second(1);

    open_my_task();
}
print('进入任务页面');
open_my_task();


//做每日任务
let judge_1 = 1;
let if_evaluate = 0;
function do_daily_task() {
    print('正在查找是否有可完成任务');
    judge_1 = 1;

    //'去完成'  控件合集
    var a = text('去完成').find();

    for (let i = 0; i < a.size(); i++) {
        a = text('去完成').find();

        var test = a[i];//去完成控件    橙色
        if (text == null)
            continue;

        var test = a[i].parent();//去完成的父控件   紫色
        if (test == null)
            continue;

        var test = a[i].parent().parent();//去完成的父控件的父控件   褐色
        if (test == null)
            continue;

        var b = a[i].parent().parent();//去完成的父控件的父控件    褐色

        var c = b.child(0);//去完成的父控件的父控件的子控件1    紫色
        if (c == null)
            continue;

        var d = c.child(0);//去完成的父控件的父控件的子控件1的子控件1    黄色
        if (d == null)
            continue;

        var e = d.child(1);//去完成的父控件的父控件的子控件1的子控件1的子控件2    绿色

        var f = e.child(0);//去完成的父控件的父控件的子控件1的子控件1的子控件2的子控件1    深绿色
        if (f == null)
            continue;
        if (f == null || !f.text())
            continue;

        var num = return_text_mission(f.text());
        if (num == 0)
            continue;
        else if (num == 1) {
            judge_1 = 0;
            a[i].parent().click();
            sleep_second(1);
            share_any_post();
            break;
        }
        else if (num == 2) {
            judge_1 = 0;
            a[i].parent().click();
            sleep_second(1);
            share_game_details();
            break;
        }
        else if (num == 3) {
            judge_1 = 0;
            a[i].parent().click();
            sleep_second(1);
            share_game_evaluate();
            break;
        }
        else if (num == 4) {
            judge_1 = 0;

            a[i].parent().click();
            print('前往游戏榜单并停留10s');
            sleep_second(12);

            back_to_task_page();
            break;
        }
        else if (num == 5 && !if_evaluate) {
            judge_1 = 0;
            if_evaluate = 1;
            a[i].parent().click();
            sleep_second(1);
            publish_game_evaluate();
            break;
        }
        else if (num == 6) {
            judge_1 = 0;
            a[i].parent().click();
            sleep_second(1);
            publish_game_evaluate();
            break;
        }
    }

    if (judge_1)
        return;

    do_daily_task();
}
do_daily_task();

//根据文本内容返回数字
function return_text_mission(str) {
    if (!str)
        return 0;

    var a = '分享任意帖子到社交平台';
    if (str == a) {
        return 1;
    }

    var b = '分享游戏详情到社交平台';
    if (str == b) {
        return 2;
    }

    var c = '分享游戏评价到社交平台';
    if (str == c) {
        return 3;
    }

    var d = /^发表.*评价$/;
    if (d.test(str)) {
        return 5;
    }

    var f = /^发布.*内容$/;
    if (f.test(str)) {
        return 6;
    }

    var e = '前往游戏榜单并停留10s';
    if (str == e) {
        return 4;
    }

    return 0;
}

//分享任意帖子到社交平台
function share_any_post() {
    print('分享任意帖子到社交平台');

    //通过获取分享控件的父控件来点进帖子
    var e = className('android.widget.ImageView').id('iv_link_more');
    if (!e.exists()) {
        back_to_task_page();//返回任务页面
        return;
    }

    var f = e.findOnce().parent();
    if (f == null) {
        back_to_task_page();//返回任务页面
        return;
    }

    var e = f.parent();
    if (e == null) {
        back_to_task_page();//返回任务页面
        return;
    }

    e.click();
    sleep_second(1);

    //分享到社交平台
    var g = id('iv_appbar_action_button');//分享的控件
    if (g.exists()) {
        print('点击分享按钮');
        g.findOnce().click();
        sleep_second(1);
    }

    click_wechat();//点击微信

    back_to_task_page();//返回任务页面

    sleep_second(1);

    return;
}

//分享游戏详情到社交平台
function share_game_details() {
    print('分享游戏详情到社交平台');

    //获取随意一个游戏的控件
    var a = id("rl_img").className("android.widget.RelativeLayout");
    if (a.exists()) {
        print('随意进入一个游戏详情')
        var b = a.findOnce().parent();
        if (b != null)
            b.click();
        sleep_second(1);
    }

    //分享到社交平台
    var c = id("iv_appbar_action_button_more").className("android.widget.ImageView");//分享的控件
    if (c.exists()) {
        print('点击分享按钮');
        c.findOnce().click();
        sleep_second(1);
    }

    click_wechat();//点击微信

    back_to_task_page();//返回任务页面

    sleep_second(1);

    return;
}

//分享游戏评价到社交平台
function share_game_evaluate() {
    print('分享游戏评价到社交平台');

    //获取随意一个游戏的控件
    var a = id("rl_img").className("android.widget.RelativeLayout");
    if (a.exists()) {
        print('随意进入一个游戏详情')
        var b = a.findOnce().parent();
        if (b != null)
            b.click();
        sleep_second(1);
    }

    //获取发表评价的控件
    var b = id("tv_description");
    if (b.exists()) {
        print('进入一个评论');
        b.findOnce().click();
        sleep_second(1);
    }

    //分享
    var c = id('iv_appbar_action_button');//分享的控件
    if (c.exists()) {
        print('点击分享按钮');
        c.findOnce().click();
        sleep_second(1);
    }

    var d = depth(11).text('分享');
    if (d.exists()) {
        print('点击分享按钮');
        var e = d.findOnce().parent();
        if (e)
            e.click();
        else {
            var coordinate = d.findOnce().bounds();
            click(coordinate.centerX(), coordinate.centerY());
        }
        sleep_second(1);
    }

    click_wechat();//点击微信

    back_to_task_page();//返回任务页面

    sleep_second(1);

    return;
}

//发表游戏评价2
function publish_game_evaluate_2() {
    print('发表游戏评价2');

    //进入评论页面
    var a = text('点击发布评价');

    if (!a.exists()) {
        print('找不到评价控件');
        return;
    }

    var b = a.findOnce().parent();
    if (!b) {
        print('找不到评价控件1');
        return;
    }

    var c = b.parent();
    if (!c) {
        print('找不到评价控件2');
        return;
    }

    var d = c.child(1);
    if (!d) {
        print('找不到评价控件3');
        return;
    }

    var e = d.child(4);
    if (!e) {
        print('找不到评价控件4');
        return;
    }

    print('进入发表界面');
    e.click();
    sleep_second(1);

    //输入评论
    for (let i = 0; i < 3; i++) {//输入三次增加容错
        setText(0, '游戏很好玩');
        sleep_second(0.5);
    }

    //发表评论
    var f = text('发布');
    if (!f.exists()) {
        return;
    }

    print('发表评论');
    f.findOnce().click();
    sleep_second(3);

    //可能会出现的消息通知
    var a = text('打开消息通知，及时回复盒友消息');
    if (a.exists()) {
        print('关闭通知');
        a = text('取消');
        a.findOnce().click();
        sleep_second(1);
    }

    //关闭分享界面
    var g = text('分享');
    for (let i = 0; i < 3; i++) {
        if (!g.exists()) {
            break;
        }
        back();
        sleep_second(0.5);
    }

    var h = text('查看评价详情');
    if (!h.exists()) {
        print('删除评论失败');
        hamibot.exit();
    }
    h.click();
    sleep_second(1);

    //删除评论
    print('删除评论');
    var a = id('button_right');
    if (!a.exists()) {
        print('删除评论控件检索失败,需要自己删除评论');
        hamibot.exit();
    }

    var coordinate = a.findOnce().bounds();
    click(coordinate.centerX(), coordinate.centerY());
    sleep_second(1);

    var a = text('删除');
    if (!a.exists()) {
        print('删除控件检索失败,需要自己删除评论');
        hamibot.exit();
    }

    var b = a.findOnce().parent();
    b.click();
    sleep_second(1);

    var a = text('删除内容');
    if (!a.exists()) {
        print('删除内容控件检索失败,需要自己删除评论');
        hamibot.exit();
    }

    var b = a.findOnce().parent();
    b.click();
    sleep_second(1);

    back_to_task_page();//返回任务页面

    sleep_second(1);

    return;

}


//发表游戏评价
function publish_game_evaluate() {
    print('发表游戏评价');

    //进入评论页面
    var a = text('参与讨论');
    if (!a.exists()) {
        print('发表游戏评价1失败,可能是2类评价');
        publish_game_evaluate_2();
        return;
    }

    print('参与讨论');
    var coordinate = a.findOnce().bounds();
    click(coordinate.centerX(), coordinate.centerY());
    sleep_second(1);


    //输入评论
    setText(1, '游戏很好玩');


    //发表评论
    var a = text('发布');
    if (!a.exists()) {
        return;
    }

    print('发表评论');
    a.findOnce().click();
    sleep_second(1);

    //点击直接发布
    var a = text('直接发布');
    if (!a.exists()) {
        return;
    }

    print('直接发布');
    a.findOnce().click();
    sleep_second(1);

    //可能会出现的消息通知
    var a = text('打开消息通知，及时回复盒友消息');
    if (a.exists()) {
        print('关闭通知');
        a = text('取消');
        a.findOnce().click();
        sleep_second(1);
    }

    //删除评论
    print('删除评论');
    var a = id('button_right');
    if (!a.exists()) {
        print('删除评论控件检索失败,需要自己删除评论');
        hamibot.exit();
    }

    var coordinate = a.findOnce().bounds();
    click(coordinate.centerX(), coordinate.centerY());
    sleep_second(1);

    var a = text('删除');
    if (!a.exists()) {
        print('删除控件检索失败,需要自己删除评论');
        hamibot.exit();
    }

    var b = a.findOnce().parent();
    b.click();
    sleep_second(1);

    var a = text('删除内容');
    if (!a.exists()) {
        print('删除内容控件检索失败,需要自己删除评论');
        hamibot.exit();
    }

    var b = a.findOnce().parent();
    b.click();
    sleep_second(1);

    back_to_task_page();//返回任务页面

    sleep_second(1);

    return;
}



//点击微信
function click_wechat() {
    //点击微信
    var a = text('微信');
    for (let i = 0; i < 3; i++) {
        if (a.exists()) {
            var b = a.findOnce().parent();
            if (b != null) {
                print('点击微信');
                b.click();
            }
            sleep_second(1);
        }
        sleep_second(1);
    }

    return;
}

//返回任务页面
function back_to_task_page() {
    for (let i = 0; i < 10; i++) {
        if (!in_it_or_not()) {
            back();
        }
        else {
            print('返回任务页面');
            break;
        }
    }
    judge = 0;

    open_mine();

    judge = 0;

    open_my_task();

    return;

}


print('任务完成');
hamibot.exit();