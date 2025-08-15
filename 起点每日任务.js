auto.waitFor();
console.show();
sleep_second(2);

function sleep_second(t) {//按秒数等待
    sleep(t * 1000);
}

//判断是否在小程序中
function in_it_or_not() {
    var a = className("android.widget.FrameLayout").depth(1);
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