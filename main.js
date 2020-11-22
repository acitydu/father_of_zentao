/**
 * Created by A ciTy on 2020/11/21.
 * Description:入口
 */

window.onload = function () {
    init();
};

function init() {
    const strategy = getStrategy();

    strategy();
}

function getStrategy() {
    let result;

    switch (location.href) {
        case location.href.indexOf('task-view') >= 0 :

            result = taskViewStrategy;

            break;

        default :
            result = taskViewStrategy;
    }

    return result;

}

async function taskViewStrategy() {
    console.log('taskViewStrategy');

    const currentUrl = location.href;

    const taskUrl = currentUrl.replace(/.html/, ".json")

    console.log(taskUrl)

    const taskInfo = await fetchInfo(taskUrl);

    console.log('taskInfo', taskInfo);

    const storyUrl = `http://ztpm.goldwind.com.cn:9898/pro/story-view-${taskInfo.task.storyID}.json`;

    const storyInfo = await fetchInfo(storyUrl);

    console.log('storyInfo', storyInfo);

    // render.js中的方法
    renderStoryRemark(storyInfo);

}

function fetchInfo(taskUrl) {
    return fetch(taskUrl, fetchOtion).then(function (response) {
        console.log(response)
        return response.json();
    }).then(res => {
        const info = JSON.parse(res.data);
        return info;
    }).catch((error) => {
        console.log(error)
    });
}

const fetchOtion = {
    headers: {
        'content-type': 'application/json'
    }
}
