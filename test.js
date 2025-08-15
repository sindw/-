auto.waitFor();
console.show();
//权限获取
// if (!requestScreenCapture()) {
//     print('没有授予 Hamibot 屏幕截图权限');
//     hamibot.exit();
// }
sleep_second(2);

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
        var isExist = the_text.includes(text);
        if (isExist)
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

// function qd_ding_yue() {//起点订阅
//     if (judge) {
//         return;
//     }
//     judge_1 = 0;
//     for (let i = 0; i < 10; i++) {
//         if (id("chapter_Price").className("android.widget.TextView").text('10 点').exists()) {
//             judge_1 = 1;
//             break;
//         }
//         swipe(200, 1400, 100, 200, 1000);
//         sleep_second(1);
//     }
//     if (!judge_1) {
//         judge = 1;
//         return;
//     }
//     print(1);
//     var coordinate = id("chapter_Price").className("android.widget.TextView").text('10 点').findOnce().bounds();
//     click(coordinate.centerX(), coordinate.centerY());
//     sleep_second(1);
//     if (!textContains("已使用订阅券").exists()) {
//         judge = 1;
//         return;
//     }
//     click(980, 2580);
//     sleep_second(4);
//     qd_ding_yue();
// }
// // qd_ding_yue();

//小米商城疑似更新提示时没有控件
//var test = className("android.widget.RelativeLayout").depth(4).drawingOrder(2).row(-1);

var way_a = className('android.view.View').depth(12).row(-1).indexInParent(1);
var way_a_over = className('android.view.View').depth(11).row(-1).indexInParent(1);
var way_a_x = className('android.view.ViewGroup').depth(10).row(-1).indexInParent(1);
var way_a_x_parent = className('android.view.ViewGroup').depth(9).row(-1).indexInParent(3);

var way_b = className('android.widget.TextView').textContains('秒后');
var way_b_over = className('android.widget.TextView').text('已');
var way_b_x = className('android.widget.TextView').text('跳过广告');
var way_b_x_another = className('android.view.ViewGroup').depth(5).row(-1).indexInParent(1);

var way_c = 1;
var way_c_x = className('android.widget.LinearLayout').depth(11).row(-1).indexInParent(0);


while (1) {
    var a = className("android.view.View").desc("任务中心");
    if (a.exists()) {
        // var b = a.findOnce().child(0);
        // var c = b.child(0);
        // c.click();

        //父控件 点击
        // var b = a.findOnce().parent();
        // b.click();

        //父控件 * 2 点击
        // var c = a.findOnce().parent().parent();
        // c.click();

        //子控件 点击
        // var b = a.child(4);
        // b.click();

        //查询控件
        // for (let i = 0; i < a.find().size(); i++) {
        //     print(a.find()[i]);
        // }

        //自己 click点击
        // a.findOnce().click();

        //自己 坐标点击
        // var coordinate = a.findOnce().bounds();
        // click(coordinate.centerX(), coordinate.centerY());

        //屏幕内的自己 坐标点击
        // for (let i = 0; i < a.find().size(); i++) {
        //     var a_y = a.find()[i].bounds().centerY();
        //     if (a_y >= 0 && a_y <= device.height) {
        //         var coordinate = a.find()[i].bounds();
        //         click(coordinate.centerX(), coordinate.centerY());
        //         sleep_second(1);
        //         break;
        //     }
        //     sleep_second(1);
        // }

        // back();

        print(a.find().size());

        print(1111);
    }
    else {
        print(2222);
    }

    sleep_second(0.5);
}




hamibot.exit();