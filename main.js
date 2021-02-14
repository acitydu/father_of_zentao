/**
 * Created by A ciTy on 2020/11/21.
 * Description:入口
 */

window.onload = function () {
    init();
};

function init() {
    const strategy = getStrategy();

    strategy && strategy();
}

function getStrategy() {
    let result = null;

    if (location.href.indexOf('task-view') >= 0) {

        result = taskViewStrategy;

    }
    else if (location.href.indexOf('story-view') >= 0) {

        result = storyViewStrategy;

    }
    /*else if (location.href.indexOf('bug-view') >= 0) {

        result = bugViewStrategy;

    }*/
    else if (location.href.indexOf('bug-resolve') >= 0) {

        result = bugResolveStrategy;

    }

    return result;

}

async function taskViewStrategy() {
    // console.log('taskViewStrategy');

    const currentUrl = location.href;

    const taskUrl = currentUrl.replace(/.html/, ".json")

    // console.log(taskUrl)

    const taskInfo = await fetchInfo(taskUrl);

    console.log('taskInfo', taskInfo);

    const storyUrl = `http://ztpm.goldwind.com.cn:9898/pro/story-view-${taskInfo.task.storyID}.json`;

    const storyInfo = await fetchInfo(storyUrl);

    console.log('storyInfo', storyInfo);

    // render.js中的方法
    renderStoryRemark(storyInfo);
    renderTaskListOfStory(storyInfo, taskInfo);

}

async function storyViewStrategy(){

    const currentUrl = location.href;

    const storyUrl = currentUrl.replace(/.html/, ".json");

    const storyInfo = await fetchInfo(storyUrl);

    console.log('storyInfo', storyInfo);

    renderCreateTaskBtn(storyInfo.story);

}

/*async function bugViewStrategy(){

    const currentUrl = location.href;

    const bugUrl = currentUrl.replace(/.html/, ".json");

    const bugInfo = await fetchInfo(bugUrl);

    console.log('bugInfo', bugInfo);

    const btns = $('#titlebar .actions a.btn');

    // dom列表不是array
    const resolveBtn = [...new Set(btns)].find(btn => {
        console.log(btn.innerHTML)
        return btn.innerHTML && btn.innerHTML.indexOf('解决') >= 0
    });

    $(resolveBtn).click(function (e){
        bugResolveBtnClick(e, bugInfo);
    });

    console.log('bugInfo', bugInfo);

}*/

async function bugResolveStrategy(){
    const currentUrl = location.href;

    const bugUrl = currentUrl.replace(/.html/, ".json");

    const myTaskListUrl = 'http://ztpm.goldwind.com.cn:9898/pro/my-task-assignedTo.json';

    const bugInfo = await fetchInfo(bugUrl);

    const myTaskList = await fetchInfo(myTaskListUrl);

    console.log('bugInfo', bugInfo, 'myTaskList', myTaskList);

    const resolveBugTaskList = myTaskList.tasks.filter(task => task.status ==='doing' && task.subType === 'bug_rep_devel');

    renderBugResolveTime(bugInfo, resolveBugTaskList);
}

function fetchInfo(taskUrl) {
    return fetch(taskUrl, fetchOtion).then(function (response) {
        // console.log(response)
        return response.json();
    }).then(res => {
        const info = JSON.parse(res.data);
        return info;
    }).catch((error) => {
        // console.log(error)
    });
}

const fetchOtion = {
    headers: {
        'content-type': 'application/json'
    }
}
